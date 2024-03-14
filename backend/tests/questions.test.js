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

// TODO: update unit tests (figure out how Postman translates to Jest with form data)

const getValidQuestionData = () => {
  return [
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
  ];
}

const getValidGrantFormData = () => {
  const grantFormData = new FormData()
  const jsonData = {
    grantorName: 'A Grantor',
    title: 'A Generous Grant',
    description: 'Do apply to this grant',
    // numWinners: 2,
    maxWinners: 10,
    deadline: '2024-04-05',
    isActive: 'true',
    amountPerApp: 1499.99,
    // winnerIDs': [],
    // appliedIDs': [],
    questionData: getValidQuestionData()
  }
  grantFormData.append('jsonData', JSON.stringify(jsonData));

  return grantFormData;
}

const deleteFromNestedJSON = (grantData, field) => {
  const jsonData = JSON.parse(grantData.get('jsonData'));
  delete jsonData[field];
  grantData.set('jsonData', JSON.stringify(jsonData));
}

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
      headers: {
        'Content-Type': 'multipart/form-data',
        method: 'POST'
      },
      body: new FormData()
    });

    expect(res.status).toBe(400);
  });

  // test('/createGrant - missing grant ID', async () => {
  //   const res = await fetch(`${SERVER_URL}/createGrant`, {
  //     method: 'POST',
  //     headers: {
  //     'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       grantorID: 1,
  //       grantName: 'A grant',
  //       questionData: []
  //     })
  //   });

  //   expect(res.status).toBe(400);
  //   const resBody = await res.json();
  //   expect(fieldValidityStatus('grantID', resBody.message)).toBe('missing');
  // });

  // test('/createGrant - missing grantor ID', async () => {
  //   const res = await fetch(`${SERVER_URL}/createGrant`, {
  //     method: 'POST',
  //     headers: {
  //     'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       grantID: 1,
  //       grantName: 'A grant',
  //       questionData: []
  //     })
  //   });

  //   expect(res.status).toBe(400);
  //   const resBody = await res.json();
  //   expect(fieldValidityStatus('grantorID', resBody.message)).toBe('missing');
  // });

  test('/createGrant - missing grantor name', async () => {
    const grantData = getValidGrantFormData();
    deleteFromNestedJSON(grantData, 'grantorName');

    console.log('\n\n\n\n');
    console.log(grantData);

    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: grantData
    });

    expect(res.status).toBe(400);
    const resBody = await res.json();

    console.log(resBody);
    expect(fieldValidityStatus('grantorName', resBody.message)).toBe('missing');
  });

  test('/createGrant - missing array of questions', async () => {
    const grantData = getValidGrantFormData();

    deleteFromNestedJSON(grantData, 'questionData');

    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: grantData
    });

    expect(res.status).toBe(400);
    const resBody = await res.json();
    expect(fieldValidityStatus('questionData', resBody.message)).toBe('missing');
  });

  test('/createGrant - valid data', async () => {
    const grantData = getValidGrantFormData();

    const res = await fetch(`${SERVER_URL}/createGrant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: grantData
    });

    expect(res.status).toBe(200);
  })
});
