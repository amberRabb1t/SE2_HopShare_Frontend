import client from './client.js';
import { unwrap } from '../utils/helpers.js';

/*
  These functions hit the corresponding endpoints of the backend API
  to perform CRUD operations on Routes.
*/

// GET /routes
export async function listRoutes(filters = {}) {
  const resp = await client.get('/routes', { params: filters });
  return unwrap(resp);
}

// POST /routes
export async function createRoute(data) {
  const resp = await client.post('/routes', data);
  return unwrap(resp);
}

// GET /routes/:routeID
export async function getRoute(routeID) {
  const resp = await client.get(`/routes/${routeID}`);
  return unwrap(resp);
}

// PUT /routes/:routeID
export async function updateRoute(routeID, data) {
  const resp = await client.put(`/routes/${routeID}`, data);
  return unwrap(resp);
}

// DELETE /routes/:routeID
export async function deleteRoute(routeID) {
  const resp = await client.delete(`/routes/${routeID}`);
  return unwrap(resp);
}

