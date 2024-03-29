const SERVER_URL = 'http://127.0.0.1:5000';

/**
 * Returns the validity status of `field` in the given error list; this is either the string `'valid'` or one of the
 * validation errors listed at {@link https://docs.pydantic.dev/2.6/errors/validation_errors/}.
 *
 * @param {string} field The JSON field whose validity is to be determined.
 * @param {object} errorList The list of errors returned by Pydantic (same as `e.errors()` in Python)
 */
const fieldValidityStatus = (field, errorList) => {
  for (const err of errorList) {
    if (err.loc.includes(field)) return err.type;
  }
  return 'valid';
};

const validUsers = [
  {
    Email: 'applicant@website.com',
    Password: 'applicantpass',
    Usertype: 'Grantee',
    token: '',
  },
  {
    Email: 'other@website.com',
    Password: 'otherpass',
    Usertype: 'Grantee',
    token: '',
  },
];

const validQuestionData = [
  [
    {
      question: 'What is your name?',
      type: 'textbox',
      isRequired: true,
      options: {
        answerType: 'short',
        minCharsNum: 1,
        maxCharsNum: 16,
        isMultipleLines: false,
      },
    },
  ],
  [
    {
      question: 'What is your name?',
      type: 'textbox',
      isRequired: true,
      options: {
        answerType: 'short',
        minCharsNum: 1,
        maxCharsNum: 25,
        isMultipleLines: true,
      },
    },
    {
      question: "How old are you?",
      type: "number",
      isRequired: true,
      options: {
        isIntegerOnly: true,
        minNum: 10,
        maxNum: 15
      },
    },
    {
      question: "Select all that apply.",
      type: "checkbox",
      isRequired: false,
      options: {
        answers: ["opt1", "opt2", "opt3"],
        isNoneAnOption: true,
      },
    },
  ],
];

const validAnswerData = [
  [
    { text: "Bob" },
  ],
  [
    { text: "Hi" },
    { value: 12 },
    { answers: ["opt2"] },
  ],
];

// Status values must match those in dataModels.py
const VeteranStatus = {
  veteran: 0,
  nonVeteran: 1,
};

const ApplicationStatus = {
  draft: 0,
  inReview: 1,
  rejected: 2,
  approved: 3,
};

const validProfileReqs = [
  {
    minAge: 18,
    maxAge: 24,
    race: ['Asian', 'African American', 'White'],
    gender: ['Man', 'Woman', 'Non-binary'],
    nationality: ['Canadian', 'American'],
    // nationality: 'Canadian',
    veteran: VeteranStatus.nonVeteran,
  },
];

const validProfileData = [
  {
    age: 21,
    race: 'White',
    gender: 'Man',
    nationality: 'Canadian',
    veteran: VeteranStatus.nonVeteran,
  },
];

const validGrantFilterData = {
  Title_keyword: 'generous',
  Gender: 'Non-binary',
  Race: 'Asian',
  Nationality: 'Canadian',
  'Date Posted Before': '2024-04-05',
  'Date Posted After': '2024-03-21',
  Deadline: '2024-04-06',
  Status: true,
  'Min Age': 18,
  'Max Age': 25,
  'Min Payable Amount': 1499,
  'Max Payable Amount': 1500,
  'Vet Status': VeteranStatus.nonVeteran,
  'Num Grants Available': 9,
};

const validApplicationFilterData = {
  Title_keyword: 'generous',
  'Date Submitted': '2024-03-14',
  Deadline: '2024-04-05',
  Status: 0,
  'Max Payable Amount': 1500,
};

const getValidGrantFormData = () => {
  const jsonData = {
    grantorEmail: 'grantor@website.com',
    Title: 'A Generous Grant',
    Description: 'Do apply to this grant',
    NumWinners: 0,
    MaxWinners: 10,
    Deadline: '2024-04-05',
    PostedDate: '2024-04-01',
    Active: true,
    AmountPerApp: 1499.99,
    profileReqs: validProfileReqs[0],
    WinnerIDs: [],
    AppliedIDs: [],
    QuestionData: validQuestionData[0],
  };
  const grantFormData = new FormData();
  grantFormData.append('jsonData', JSON.stringify(jsonData));

  return grantFormData;
};

const getValidApplicationData = (grantID, email = validUsers[0].Email) => {
  const applicationData = {
    grantID: grantID,
    email: email,
    dateSubmitted: '2024-03-14',
    status: 0,
    profileData: validProfileData[0],
    answers: validAnswerData[0],
  };
  const formData = new FormData();
  formData.append('jsonData', JSON.stringify(applicationData));

  return formData;
};

const getNestedJSONField = (data, field) => {
  const jsonData = JSON.parse(data.get('jsonData'));
  return jsonData[field];
};

const updateNestedJSONField = (data, field, newValue) => {
  const jsonData = JSON.parse(data.get('jsonData'));
  jsonData[field] = newValue;
  data.set('jsonData', JSON.stringify(jsonData));
};

const deleteNestedJSONField = (data, field) => {
  const jsonData = JSON.parse(data.get('jsonData'));
  delete jsonData[field];
  data.set('jsonData', JSON.stringify(jsonData));
};

// Keeps track of the MongoDB documents to delete after all tests are completed
const insertedData = {
  userEmails: [],
  grantIDs: [],
  applicationIDs: [],
};

beforeAll(async () => {
  for (const user of validUsers) {
    const signupRes = await fetch(`${SERVER_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    expect([200, 409]).toContain(signupRes.status); // 409 means the user exists already
    if (signupRes.status === 200) {
      insertedData.userEmails.push(user.Email);
    }

    const loginRes = await fetch(`${SERVER_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email: user.Email,
        Password: user.Password,
      }),
    });
    const loginBody = await loginRes.json();
    expect(loginRes.status).toBe(200); // Check that the password matches for when the user already exists
    expect(loginBody.token).toBeTruthy();
    user.token = loginBody.token;

    console.log('User logged in:', user);
  }
});

// Do not explicitly set the Content-Type header to multipart/form-data (see the warning at
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects)
// Setting it to application/json works fine
describe('/createGrant tests', () => {
  test('/createGrant - invalid content type', async () => {
    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
      },
    });

    expect(res.status).toBe(400);
  });

  test('/createGrant - empty data', async () => {
    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
      },
      body: new FormData(),
    });

    expect(res.status).toBe(400);
  });

  test('/createGrant - missing grantor name', async () => {
    const grantData = getValidGrantFormData();
    deleteNestedJSONField(grantData, 'grantorEmail');

    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
      },
      body: grantData,
    });
    const resBody = await res.json();

    expect(res.status).toBe(403);
    expect(fieldValidityStatus('grantorEmail', resBody.message)).toBe(
      'missing'
    );
  });

  test('/createGrant - missing array of questions', async () => {
    const grantData = getValidGrantFormData();

    deleteNestedJSONField(grantData, 'QuestionData');

    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
      },
      body: grantData,
    });
    const resBody = await res.json();

    expect(res.status).toBe(403);
    expect(fieldValidityStatus('QuestionData', resBody.message)).toBe(
      'missing'
    );
  });

  test('/createGrant - valid data', async () => {
    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
      },
      body: getValidGrantFormData(),
    });
    const resBody = await res.json();
    const grantID = resBody._id;

    expect(res.status).toBe(200);
    expect(grantID).toBeTruthy();
    insertedData.grantIDs.push(grantID);
  });
});

describe('/createApplication tests', () => {
  let grantID;

  // Create a grant and store its ID
  beforeAll(async () => {
    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
      },
      body: getValidGrantFormData(),
    });
    const resBody = await res.json();
    grantID = resBody._id;

    expect(res.status).toBe(200);
    expect(grantID).toBeTruthy();
    insertedData.grantIDs.push(grantID);
  });

  test('/createApplication - valid data', async () => {
    // Create an application for the new grant
    const res = await fetch(`${SERVER_URL}/createApplication`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
        'Content-Type': 'application/json',
      },
      body: getValidApplicationData(grantID).get('jsonData'),
    });
    const resBody = await res.json();
    console.log(resBody);
    const applicationID = resBody._id;

    expect(res.status).toBe(200);
    expect(applicationID).toBeTruthy();
    insertedData.applicationIDs.push(applicationID);
  });
});

describe('/getGranteeApplications tests', () => {
  let grantID;
  let applicationID;

  beforeAll(async () => {
    // Applicant with two grants
    const createGrantRes = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
      },
      body: getValidGrantFormData(),
    });
    const createGrantResBody = await createGrantRes.json();
    grantID = createGrantResBody._id;

    expect(createGrantRes.status).toBe(200);
    expect(grantID).toBeTruthy();
    insertedData.grantIDs.push(grantID);

    const createApplicationRes = await fetch(
      `${SERVER_URL}/createApplication`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${validUsers[0].token}`,
          'Content-Type': 'application/json',
        },
        body: getValidApplicationData(grantID).get('jsonData'),
      }
    );
    const createApplicationResBody = await createApplicationRes.json();
    applicationID = createApplicationResBody._id;

    expect(createApplicationRes.status).toBe(200);
    expect(applicationID).toBeTruthy();
    insertedData.applicationIDs.push(applicationID);
  });

  test('/getGranteeApplications - valid data', async () => {
    const res = await fetch(`${SERVER_URL}/getGranteeApplications`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: validUsers[0].Email,
      }),
    });
    const resBody = await res.json();
    expect(res.status).toBe(200);

    const applicationsWithGrants = resBody.applicationsWithGrants;
    expect(applicationsWithGrants.length).toBeGreaterThan(0);

    for (const applicationWithGrant of applicationsWithGrants) {
      const applicationData = applicationWithGrant.ApplicationData;
      const grantData = applicationWithGrant.GrantData;

      expect(grantData).toBeTruthy();
      expect(applicationData).toBeTruthy();
      expect(applicationData.email).toBe(validUsers[0].Email);
    }
  });
});

describe('/updateGrantWinners tests', () => {
  let grantID;
  let applicationID;
  let oldWinners;

  // Create a grant and application, storing their IDs
  beforeAll(async () => {
    const grantData = getValidGrantFormData();
    const createGrantRes = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
      },
      body: grantData,
    });
    const createGrantResBody = await createGrantRes.json();
    grantID = createGrantResBody._id;
    oldWinners = getNestedJSONField(grantData, 'WinnerIDs');

    expect(createGrantRes.status).toBe(200);
    expect(grantID).toBeTruthy();
    insertedData.grantIDs.push(grantID);

    const applicationData = getValidApplicationData(grantID);
    const createApplicationRes = await fetch(
      `${SERVER_URL}/createApplication`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${validUsers[0].token}`,
          'Content-Type': 'application/json',
        },
        body: applicationData.get('jsonData'),
      }
    );
    const createApplicationResBody = await createApplicationRes.json();
    applicationID = createApplicationResBody._id;

    expect(createApplicationRes.status).toBe(200);
    expect(applicationID).toBeTruthy();
    insertedData.applicationIDs.push(applicationID);
  });

  test('/updateGrantWinners - valid data', async () => {
    const updateWinnerRes = await fetch(`${SERVER_URL}/updateGrantWinners`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validUsers[0].token}`,
      },
      body: JSON.stringify({
        applicationID,
        grantID,
        email: validUsers[0].Email,
      }),
    });
    expect(updateWinnerRes.status).toBe(200);

    // Check that the winners have been updated correctly
    const grantRes = await fetch(`${SERVER_URL}/getGrant/${grantID}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
      },
    });
    expect(grantRes.status).toBe(200);
    const grantResBody = await grantRes.json();
    const newWinners = grantResBody.WinnerIDs;

    expect(newWinners.length).toBe(oldWinners.length + 1);
    for (const winnerID of oldWinners) {
      expect(newWinners).toContain(winnerID);
    }
    expect(newWinners).toContain(applicationID);

    const applicationRes = await fetch(
      `${SERVER_URL}/getApplication/${applicationID}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${validUsers[0].token}`,
        },
      }
    );
    expect(applicationRes.status).toBe(200);
    const applicationResBody = await applicationRes.json();
    const applicationStatus = applicationResBody.status;

    expect(applicationStatus).toBe(ApplicationStatus.approved);
  });
});

describe('/getFilteredGrants tests', () => {
  // Create a grant and application, storing their IDs to be deleted at end
  beforeAll(async () => {
    const grantData = getValidGrantFormData();
    const createGrantRes = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
      },
      body: grantData,
    });
    const createGrantResBody = await createGrantRes.json();
    grantID = createGrantResBody._id;

    expect(createGrantRes.status).toBe(200);
    expect(grantID).toBeTruthy();
    insertedData.grantIDs.push(grantID);

    const applicationData = getValidApplicationData(grantID);
    const createApplicationRes = await fetch(
      `${SERVER_URL}/createApplication`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${validUsers[0].token}`,
          'Content-Type': 'application/json',
        },
        body: applicationData.get('jsonData'),
      }
    );
    const createApplicationResBody = await createApplicationRes.json();
    applicationID = createApplicationResBody._id;

    expect(createApplicationRes.status).toBe(200);
    expect(applicationID).toBeTruthy();
    insertedData.applicationIDs.push(applicationID);
  });

  test('/getFilteredGrants - valid data', async () => {
    const res = await fetch(`${SERVER_URL}/getFilteredGrants`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validGrantFilterData),
    });
    const filteredGrants = await res.json();

    expect(res.status).toBe(200);
    expect(filteredGrants.length).toBeGreaterThan(0);
  });
});

describe('/getFilteredGranteeApplications tests', () => {
  // Create a grant and application, storing their IDs to be deleted at end
  beforeAll(async () => {
    const grantData = getValidGrantFormData();
    const createGrantRes = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
      },
      body: grantData,
    });
    const createGrantResBody = await createGrantRes.json();
    grantID = createGrantResBody._id;

    expect(createGrantRes.status).toBe(200);
    expect(grantID).toBeTruthy();
    insertedData.grantIDs.push(grantID);

    const applicationData = getValidApplicationData(grantID);
    const createApplicationRes = await fetch(
      `${SERVER_URL}/createApplication`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${validUsers[0].token}`,
          'Content-Type': 'application/json',
        },
        body: applicationData.get('jsonData'),
      }
    );
    const createApplicationResBody = await createApplicationRes.json();
    applicationID = createApplicationResBody._id;

    expect(createApplicationRes.status).toBe(200);
    expect(applicationID).toBeTruthy();
    insertedData.applicationIDs.push(applicationID);
  });

  test('/getFilteredGranteeApplications - valid data', async () => {
    const res = await fetch(`${SERVER_URL}/getFilteredGranteeApplications`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email: validUsers[0].Email,
        Filters: validApplicationFilterData,
      }),
    });
    const filteredApplications = await res.json();

    expect(res.status).toBe(200);
    expect(filteredApplications.length).toBeGreaterThan(0);
  });
});

// Delete all inserted data; this implicitly tests the delete routes
afterAll(async () => {
  console.log('Deleting all data inserted during tests');
  console.log(insertedData);

  for (const applicationID of insertedData.applicationIDs) {
    console.log(`${SERVER_URL}/deleteApplication/${applicationID}`);
    const res = await fetch(
      `${SERVER_URL}/deleteApplication/${applicationID}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${validUsers[0].token}`,
        },
      }
    );
    expect(res.status).toBe(200);
  }

  for (const grantID of insertedData.grantIDs) {
    console.log(`${SERVER_URL}/deleteGrant/${grantID}`);
    const res = await fetch(`${SERVER_URL}/deleteGrant/${grantID}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${validUsers[0].token}`,
      },
    });
    expect(res.status).toBe(200);
  }

  for (const email of insertedData.userEmails) {
    console.log(`${SERVER_URL}/deleteUser with Email = ${email}`);
    const res = await fetch(`${SERVER_URL}/deleteUser`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email: email,
      }),
    });
    expect(res.status).toBe(200);
  }
});
