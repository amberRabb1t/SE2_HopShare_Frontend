import client from './client.js';
import { unwrap } from '../utils/helpers.js';

/*
  These functions hit the corresponding endpoints of the backend API
  to perform CRUD operations on Cars.
*/

// GET /users/:userID/cars
export async function listCars(userID) {
  const resp = await client.get(`/users/${userID}/cars`);
  return unwrap(resp);
}

// POST /users/:userID/cars
export async function createCar(userID, data) {
  const resp = await client.post(`/users/${userID}/cars`, data);
  return unwrap(resp);
}

// GET /users/:userID/cars/:carID
export async function getCar(userID, carID) {
  const resp = await client.get(`/users/${userID}/cars/${carID}`);
  return unwrap(resp);
}

// PUT /users/:userID/cars/:carID
export async function updateCar(userID, carID, data) {
  const resp = await client.put(`/users/${userID}/cars/${carID}`, data);
  return unwrap(resp);
}

// DELETE /users/:userID/cars/:carID
export async function deleteCar(userID, carID) {
  const resp = await client.delete(`/users/${userID}/cars/${carID}`);
  return unwrap(resp);
}

