import client from './client.js';
import { unwrap } from '../utils/helpers.js';

/*
  These functions hit the corresponding endpoints of the backend API
  to perform CRUD operations on Reviews.
*/

// GET /users/:userID/reviews
export async function listReviews(userID, myReviews) {
  const params = {};
  if (typeof myReviews === 'boolean') params.myReviews = myReviews;
  const resp = await client.get(`/users/${userID}/reviews`, { params });
  return unwrap(resp);
}

// POST /users/:userID/reviews
export async function createReview(userID, data) {
  const resp = await client.post(`/users/${userID}/reviews`, data);
  return unwrap(resp);
}

// GET /users/:userID/reviews/:reviewID
export async function getReview(userID, reviewID) {
  const resp = await client.get(`/users/${userID}/reviews/${reviewID}`);
  return unwrap(resp);
}

// PUT /users/:userID/reviews/:reviewID
export async function updateReview(userID, reviewID, data) {
  const resp = await client.put(`/users/${userID}/reviews/${reviewID}`, data);
  return unwrap(resp);
}

// DELETE /users/:userID/reviews/:reviewID
export async function deleteReview(userID, reviewID) {
  const resp = await client.delete(`/users/${userID}/reviews/${reviewID}`);
  return unwrap(resp);
}

