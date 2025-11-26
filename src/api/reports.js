import client from './client.js';
import { unwrap } from '../utils/helpers.js';

export async function listReports(filters = {}) {
  const resp = await client.get('/reports', { params: filters });
  return unwrap(resp);
}

export async function createReport(data) {
  const resp = await client.post('/reports', data);
  return unwrap(resp);
}

export async function getReport(reportID) {
  const resp = await client.get(`/reports/${reportID}`);
  return unwrap(resp);
}