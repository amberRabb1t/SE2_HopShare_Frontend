import client from './client.js';
import { unwrap } from '../utils/helpers.js';

/*
  These functions hit the corresponding endpoints of the backend API
  to perform CRUD operations on Reports.
*/

// GET /reports
export async function listReports(filters = {}) {
  const resp = await client.get('/reports', { params: filters });
  return unwrap(resp);
}

// POST /reports
export async function createReport(data) {
  const resp = await client.post('/reports', data);
  return unwrap(resp);
}

// GET /reports/:reportID
export async function getReport(reportID) {
  const resp = await client.get(`/reports/${reportID}`);
  return unwrap(resp);
}

