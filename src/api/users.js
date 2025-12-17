import client from './client.js';
import { unwrap } from '../utils/helpers.js';

export async function listUsers(name) {
  const params = name ? { Name: name } : {};
  const resp = await client.get('/users', { params });
  return unwrap(resp);
}

export async function createUser(data) {
  const resp = await client.post('/users', data);
  return unwrap(resp);
}

export async function getUser(userID) {
  const resp = await client.get(`/users/${userID}`);
  return unwrap(resp);
}

export async function updateUser(userID, data) {
  const resp = await client.put(`/users/${userID}`, data);
  return unwrap(resp);
}

export async function deleteUser(userID) {
  const resp = await client.delete(`/users/${userID}`);
  return unwrap(resp);
}

