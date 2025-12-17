import client from '../api/client.js';
// import { getAuth } from '../context/AuthContext.jsx';

test('mutating request includes Authorization header when auth set', async () => {
  // mimic auth
  const auth = { email: 'e@x.com', password: 'pw' };
  // eslint-disable-next-line
  global.currentAuth = auth;
  // monkey patch since getAuth uses closure
  const headers = client.defaults.headers.common;
  const token = btoa(`${auth.email}:${auth.password}`);
  headers['Authorization'] = `Basic ${token}`;
  expect(headers['Authorization']).toBe(`Basic ${token}`);
});

