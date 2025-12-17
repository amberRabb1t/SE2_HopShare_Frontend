import client from './client.js';
import { unwrap } from '../utils/helpers.js';

export async function listRoutes(filters = {}) {
  const resp = await client.get('/routes', { params: filters });
  return unwrap(resp);
}

export async function createRoute(data) {
  const resp = await client.post('/routes', data);
  return unwrap(resp);
}

export async function getRoute(id) {
  const resp = await client.get(`/routes/${id}`);
  return unwrap(resp);
}

export async function updateRoute(id, data) {
  const resp = await client.put(`/routes/${id}`, data);
  return unwrap(resp);
}

export async function deleteRoute(id) {
  const resp = await client.delete(`/routes/${id}`);
  return unwrap(resp);
}

