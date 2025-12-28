import client from './client.js';
import { unwrap } from '../utils/helpers.js';

/*
  These functions hit the corresponding endpoints of the backend API
  to perform CRUD operations on Requests.
*/

// GET /requests
export async function listRequests(filters = {}) {
  const resp = await client.get('/requests', { params: filters });
  return unwrap(resp);
}

// POST /requests
export async function createRequest(data) {
  const resp = await client.post('/requests', data);
  return unwrap(resp);
}

// GET /requests/:requestID
export async function getRequest(requestID) {
  const resp = await client.get(`/requests/${requestID}`);
  return unwrap(resp);
}

// PUT /requests/:requestID
export async function updateRequest(requestID, data) {
  const resp = await client.put(`/requests/${requestID}`, data);
  return unwrap(resp);
}

// DELETE /requests/:requestID
export async function deleteRequest(requestID) {
  const resp = await client.delete(`/requests/${requestID}`);
  return unwrap(resp);
}

