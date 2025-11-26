import client from './client.js';
import { unwrap } from '../utils/helpers.js';

export async function listCars(userID) {
  const resp = await client.get(`/users/${userID}/cars`);
  return unwrap(resp);
}

export async function createCar(userID, data) {
  const resp = await client.post(`/users/${userID}/cars`, data);
  return unwrap(resp);
}

export async function getCar(userID, carID) {
  const resp = await client.get(`/users/${userID}/cars/${carID}`);
  return unwrap(resp);
}

export async function updateCar(userID, carID, data) {
  const resp = await client.put(`/users/${userID}/cars/${carID}`, data);
  return unwrap(resp);
}

export async function deleteCar(userID, carID) {
  const resp = await client.delete(`/users/${userID}/cars/${carID}`);
  return unwrap(resp);
}