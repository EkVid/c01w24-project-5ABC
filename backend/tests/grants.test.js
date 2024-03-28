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
    // nationality: ['Canadian', 'American'],
    nationality: 'Canadian',
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

const getValidGrantFormData = () => {
  const jsonData = {
    grantorEmail: 'grantor@website.com',
    title: 'A Generous Grant',
    description: 'Do apply to this grant',
    numWinners: 0,
    maxWinners: 10,
    deadline: '2024-04-05',
    isActive: 'true',
    amountPerApp: 1499.99,
    profileReqs: validProfileReqs[0],
    winnerIDs: [],
    appliedIDs: [],
    questionData: validQuestionData[0],
  };
  const grantFormData = new FormData();
  grantFormData.append('jsonData', JSON.stringify(jsonData));

  return grantFormData;
};

const getValidApplicationData = (grantID) => {
  const applicationData = {
    grantID: grantID,
    email: validUsers[0].Email,
    dateSubmitted: '2024-03-14',
    status: 0,
    profileData: validProfileData[0],
    answerData: [
      {
        text: 'Bob',
      },
    ],
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
  const registerRes = await fetch(`${SERVER_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validUsers[0]),
  });
  expect([200, 409]).toContain(registerRes.status); // 409 means the user exists already
  if (registerRes.status === 200) {
    insertedData.userEmails.push(validUsers[0].Email);
  }

  const loginRes = await fetch(`${SERVER_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Email: validUsers[0].Email,
      Password: validUsers[0].Password,
    }),
  });
  expect(loginRes.status).toBe(200); // Check that the password matches for when the user already exists
});

// Do not explicitly set the Content-Type header to multipart/form-data (see the warning at
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects)
describe('/createGrant tests', () => {
  test('/createGrant - invalid content type', async () => {
    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
    });

    expect(res.status).toBe(400);
  });

  test('/createGrant - empty data', async () => {
    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      body: new FormData(),
    });

    expect(res.status).toBe(400);
  });

  test('/createGrant - missing grantor name', async () => {
    const grantData = getValidGrantFormData();
    deleteNestedJSONField(grantData, 'grantorEmail');

    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      body: grantData,
    });
    const resBody = await res.json();

    expect(res.status).toBe(400);
    expect(fieldValidityStatus('grantorEmail', resBody.message)).toBe(
      'missing'
    );
  });

  test('/createGrant - missing array of questions', async () => {
    const grantData = getValidGrantFormData();

    deleteNestedJSONField(grantData, 'questionData');

    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      body: grantData,
    });
    const resBody = await res.json();

    expect(res.status).toBe(400);
    expect(fieldValidityStatus('questionData', resBody.message)).toBe(
      'missing'
    );
  });

  test('/createGrant - valid data', async () => {
    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
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
      body: getValidApplicationData(grantID),
    });
    const resBody = await res.json();
    const applicationID = resBody._id;

    expect(res.status).toBe(200);
    expect(applicationID).toBeTruthy();
    insertedData.applicationIDs.push(applicationID);
  });
});

describe('/updateApplication tests', () => {
  let grantID;
  let applicationID;

  // Create a grant and applications, storing their IDs
  beforeAll(async () => {
    const createGrantRes = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
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
        body: getValidApplicationData(grantID),
      }
    );
    const createApplicationResBody = await createApplicationRes.json();
    applicationID = createApplicationResBody._id;

    expect(createApplicationRes.status).toBe(200);
    expect(applicationID).toBeTruthy();
    insertedData.applicationIDs.push(applicationID);
  });

  test('/updateApplication - valid data', async () => {
    const applicationData = getValidApplicationData(grantID);
    updateNestedJSONField(applicationData, 'dateSubmitted', '2024-04-01');
    const res = await fetch(
      `${SERVER_URL}/updateApplication/${applicationID}`,
      {
        method: 'PUT',
        body: applicationData,
      }
    );

    expect(res.status).toBe(200);
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
      body: grantData,
    });
    const createGrantResBody = await createGrantRes.json();
    grantID = createGrantResBody._id;
    oldWinners = getNestedJSONField(grantData, 'winnerIDs');

    expect(createGrantRes.status).toBe(200);
    expect(grantID).toBeTruthy();
    insertedData.grantIDs.push(grantID);

    const applicationData = getValidApplicationData(grantID);
    const createApplicationRes = await fetch(
      `${SERVER_URL}/createApplication`,
      {
        method: 'POST',
        body: applicationData,
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
    });
    expect(grantRes.status).toBe(200);
    const grantResBody = await grantRes.json();
    const newWinners = grantResBody.winnerIDs;

    expect(newWinners.length).toBe(oldWinners.length + 1);
    for (const winnerID of oldWinners) {
      expect(newWinners).toContain(winnerID);
    }
    expect(newWinners).toContain(applicationID);

    const applicationRes = await fetch(
      `${SERVER_URL}/getApplication/${applicationID}`,
      {
        method: 'GET',
      }
    );
    expect(applicationRes.status).toBe(200);
    const applicationResBody = await applicationRes.json();
    const applicationStatus = applicationResBody.status;

    expect(applicationStatus).toBe(ApplicationStatus.approved);
  });
});

// Delete all inserted data; this implicitly tests the delete routes
afterAll(async () => {
  console.log('Deleting all data inserted during tests');
  console.log(insertedData);

  for (const email of insertedData.userEmails) {
    console.log(`${SERVER_URL}/deleteUser`);
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

  for (const applicationID of insertedData.applicationIDs) {
    console.log(`${SERVER_URL}/deleteApplication/${applicationID}`);
    const res = await fetch(
      `${SERVER_URL}/deleteApplication/${applicationID}`,
      {
        method: 'DELETE',
      }
    );
    expect(res.status).toBe(200);
  }

  for (const grantID of insertedData.grantIDs) {
    console.log(`${SERVER_URL}/deleteGrant/${grantID}`);
    const res = await fetch(`${SERVER_URL}/deleteGrant/${grantID}`, {
      method: 'DELETE',
    });
    expect(res.status).toBe(200);
  }
});

// Delete all inserted data
afterAll(async () => {
  console.log('Deleting all data inserted during tests');
  console.log(insertedData);

  for (const applicationID of insertedData.applicationIDs) {
    console.log(`${SERVER_URL}/deleteApplication/${applicationID}`);
    const res = await fetch(`${SERVER_URL}/deleteApplication/${applicationID}`, {
      method: 'DELETE'
    });
    expect(res.status).toBe(200);
  }

  for (const grantID of insertedData.grantIDs) {
    console.log(`${SERVER_URL}/deleteGrant/${grantID}`);
    const res = await fetch(`${SERVER_URL}/deleteGrant/${grantID}`, {
      method: 'DELETE'
    });
    expect(res.status).toBe(200);
  }
})
