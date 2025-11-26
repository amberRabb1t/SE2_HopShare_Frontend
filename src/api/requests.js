import client from './client.js';
import { unwrap } from '../utils/helpers.js';

export async function listRequests(filters = {}) {
  const resp = await client.get('/requests', { params: filters });
  return unwrap(resp);
}

export async function createRequest(data) {
  const resp = await client.post('/requests', data);
  return unwrap(resp);
}

export async function getRequest(id) {
  const resp = await client.get(`/requests/${id}`);
  return unwrap(resp);
}

export async function updateRequest(id, data) {
  const resp = await client.put(`/requests/${id}`, data);
  return unwrap(resp);
}

export async function deleteRequest(id) {
  const resp = await client.delete(`/requests/${id}`);
  return unwrap(resp);
}