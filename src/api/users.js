import client from './client.js';
import { unwrap } from '../utils/helpers.js';

/*
  These functions hit the corresponding endpoints of the backend API
  to perform CRUD operations on Users.
*/

// GET /users
export async function listUsers(name) {
  const params = name ? { Name: name } : {};
  const resp = await client.get('/users', { params });
  return unwrap(resp);
}

// POST /users
export async function createUser(data) {
  const resp = await client.post('/users', data);
  return unwrap(resp);
}

// GET /users/:userID
export async function getUser(userID) {
  const resp = await client.get(`/users/${userID}`);
  return unwrap(resp);
}

// PUT /users/:userID
export async function updateUser(userID, data) {
  const resp = await client.put(`/users/${userID}`, data);
  return unwrap(resp);
}

// DELETE /users/:userID
export async function deleteUser(userID) {
  const resp = await client.delete(`/users/${userID}`);
  return unwrap(resp);
}

