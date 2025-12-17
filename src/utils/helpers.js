/**
 * Safely unwrap backend response shape { success, data, message, error }
 */
export function unwrap(resp) {
  if (!resp) return null;
  return resp.data?.data ?? resp.data;
}

/**
 * Compose Basic Auth header value.
 * @param {string} email
 * @param {string} password
 */
export function basicAuthHeader(email, password) {
  const token = btoa(`${email}:${password}`);
  return `Basic ${token}`;
}

/**
 * Sleep helper (ms)
 */
export const sleep = (ms) => new Promise(r => setTimeout(r, ms));

