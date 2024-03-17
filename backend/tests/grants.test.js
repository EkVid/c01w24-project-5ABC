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
    if (err.loc.includes(field))
      return err.type;
  }
  return 'valid';
}

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
        isMultipleLines: false
      }
    }
  ]
]

const getValidGrantFormData = () => {
  const jsonData = {
    grantorName: 'A Grantor',
    title: 'A Generous Grant',
    description: 'Do apply to this grant',
    numWinners: 0,
    maxWinners: 10,
    deadline: '2024-04-05',
    isActive: 'true',
    amountPerApp: 1499.99,
    winnerIDs: [],
    appliedIDs: [],
    questionData: validQuestionData[0]
  };
  const grantFormData = new FormData()
  grantFormData.append('jsonData', JSON.stringify(jsonData));

  return grantFormData;
}

const deleteFromNestedJSONGrantData = (grantData, field) => {
  const jsonData = JSON.parse(grantData.get('jsonData'));
  delete jsonData[field];
  grantData.set('jsonData', JSON.stringify(jsonData));
}

// Keeps track of the MongoDB documents to delete after all tests are completed
const insertedData = {
  grantIDs: [],
  applicationIDs: []
}

// Do not explicitly set the Content-Type header to multipart/form-data (see the warning at
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects)
describe('/createGrant tests', () => {
  test('/createGrant - invalid content type', async () => {
    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST'
    });

    expect(res.status).toBe(400);
  });

  test('/createGrant - empty data', async () => {
    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      body: new FormData()
    });

    expect(res.status).toBe(400);
  });

  test('/createGrant - missing grantor name', async () => {
    const grantData = getValidGrantFormData();
    deleteFromNestedJSONGrantData(grantData, 'grantorName');

    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      body: grantData
    });
    const resBody = await res.json();

    expect(res.status).toBe(400);
    expect(fieldValidityStatus('grantorName', resBody.message)).toBe('missing');
  });

  test('/createGrant - missing array of questions', async () => {
    const grantData = getValidGrantFormData();

    deleteFromNestedJSONGrantData(grantData, 'questionData');

    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      body: grantData
    });
    const resBody = await res.json();

    expect(res.status).toBe(400);
    expect(fieldValidityStatus('questionData', resBody.message)).toBe('missing');
  });

  test('/createGrant - valid data', async () => {
    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      body: getValidGrantFormData()
    });
    const resBody = await res.json();
    const grantID = resBody._id;

    expect(res.status).toBe(200);
    expect(grantID).toBeTruthy();
    insertedData.grantIDs.push(grantID);
  })
});

const getValidApplicationData = (grantID) => {
  const applicationData = {
    grantID: grantID,
    email: "foo@bar.com",
    dateSubmitted: "2024-03-14",
    status: 0,
    answerData: [
        {
            text: "Bob"
        }
    ]
  };
  const formData = new FormData();
  formData.append('jsonData', JSON.stringify(applicationData));

  return formData;
}

describe('/createApplication tests', () => {
  let grantID;

  // Create a grant and store its ID
  beforeAll(async () => {
    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      body: getValidGrantFormData()
    });
    const resBody = await res.json();
    grantID = resBody._id;

    expect(res.status).toBe(200);
    expect(grantID).toBeTruthy();
    insertedData.grantIDs.push(grantID);
  })

  test('/createApplication - valid data', async () => {
    // Create an application for the new grant
    const res = await fetch(`${SERVER_URL}/createApplication`, {
      method: 'POST',
      body: getValidApplicationData(grantID)
    });
    const resBody = await res.json();
    const applicationID = resBody._id;

    expect(res.status).toBe(200);
    expect(applicationID).toBeTruthy();
    insertedData.applicationIDs.push(applicationID);
  })
});


const updateNestedJSONDataField = (data, field, newValue) => {
  const jsonData = JSON.parse(data.get('jsonData'));
  jsonData[field] = newValue;
  data.set('jsonData', JSON.stringify(jsonData));
}

describe('/updateApplication tests', () => {
  let grantID;
  let applicationID;

  // Create a grant and store its ID
  beforeAll(async () => {
    const createGrantRes = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      body: getValidGrantFormData()
    });
    const createGrantResBody = await createGrantRes.json();
    grantID = createGrantResBody._id;

    expect(createGrantRes.status).toBe(200);
    expect(grantID).toBeTruthy();
    insertedData.grantIDs.push(grantID);

    const createApplicationRes = await fetch(`${SERVER_URL}/createApplication`, {
      method: 'POST',
      body: getValidApplicationData(grantID)
    });
    const createApplicationResBody = await createApplicationRes.json();
    applicationID = createApplicationResBody._id;

    expect(createApplicationRes.status).toBe(200);
    expect(applicationID).toBeTruthy();
    insertedData.applicationIDs.push(applicationID);
  })

  test('/updateApplication - valid data', async () => {
    const applicationData = getValidApplicationData(grantID);
    updateNestedJSONDataField(applicationData, 'dateSubmitted', '2024-04-01');
    const res = await fetch(`${SERVER_URL}/updateApplication/${applicationID}`, {
      method: 'PUT',
      body: applicationData
    });

    expect(res.status).toBe(200);
  });
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
