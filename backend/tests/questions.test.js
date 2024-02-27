const SERVER_URL = 'http://127.0.0.1:5000';

/**
 * Returns the validity status of `field` in the given error list; this is either the string `'valid'` or one of the
 * validation errors listed at {@link https://docs.pydantic.dev/2.6/errors/validation_errors/}.
 *
 * @param {string} field The JSON field whose validity is to be determined.
 * @param {*} errorList The list of errors returned by Pydantic (same as `e.errors()` in Python)
 */
const fieldValidityStatus = (field, errorList) => {
  for (const err of errorList) {
    if (err.loc.includes(field))
      return err.type;
  }
  return 'valid';
}

test('/createGrantForm - non-JSON data', async () => {
  const res = await fetch(`${SERVER_URL}/createGrantForm`, {
    method: 'POST'
  });

  expect(res.status).toBe(400);
});

test('/createGrantForm - no JSON data', async () => {
  const res = await fetch(`${SERVER_URL}/createGrantForm`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    }
  });

  expect(res.status).toBe(400);
});

test('/createGrantForm - missing grant ID', async () => {
  const res = await fetch(`${SERVER_URL}/createGrantForm`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grantorID: 1,
      grantName: 'A grant',
      questionData: []
    })
  });

  expect(res.status).toBe(400);
  const resBody = await res.json();
  expect(fieldValidityStatus('grantID', resBody.message)).toBe('missing');
});

test('/createGrantForm - missing grantor ID', async () => {
  const res = await fetch(`${SERVER_URL}/createGrantForm`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grantID: 1,
      grantName: 'A grant',
      questionData: []
    })
  });

  expect(res.status).toBe(400);
  const resBody = await res.json();
  expect(fieldValidityStatus('grantorID', resBody.message)).toBe('missing');
});

test('/createGrantForm - missing grantor name', async () => {
  const res = await fetch(`${SERVER_URL}/createGrantForm`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grantID: 1,
      grantorID: 2,
      questionData: []
    })
  });

  expect(res.status).toBe(400);
  const resBody = await res.json();
  expect(fieldValidityStatus('grantName', resBody.message)).toBe('missing');
});

test('/createGrantForm - missing array of questions', async () => {
  const res = await fetch(`${SERVER_URL}/createGrantForm`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grantID: 1,
      grantorID: 2,
      grantName: 'A grant'
    })
  });

  expect(res.status).toBe(400);
  const resBody = await res.json();
  expect(fieldValidityStatus('questionData', resBody.message)).toBe('missing');
});

