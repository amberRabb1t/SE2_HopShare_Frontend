import client from './client.js';
import { unwrap } from '../utils/helpers.js';

export async function listReviews(userID, myReviews) {
  const params = {};
  if (typeof myReviews === 'boolean') params.myReviews = myReviews;
  const resp = await client.get(`/users/${userID}/reviews`, { params });
  return unwrap(resp);
}

export async function createReview(userID, data) {
  const resp = await client.post(`/users/${userID}/reviews`, data);
  return unwrap(resp);
}

export async function getReview(userID, reviewID) {
  const resp = await client.get(`/users/${userID}/reviews/${reviewID}`);
  return unwrap(resp);
}

export async function updateReview(userID, reviewID, data) {
  const resp = await client.put(`/users/${userID}/reviews/${reviewID}`, data);
  return unwrap(resp);
}

export async function deleteReview(userID, reviewID) {
  const resp = await client.delete(`/users/${userID}/reviews/${reviewID}`);
  return unwrap(resp);
}

