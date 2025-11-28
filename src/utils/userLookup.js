import * as usersApi from '../api/users.js';

/**
 * Resolve a username to a numeric UserID using /users?Name=
 * Rules:
 *  - Case-insensitive exact match preferred.
 *  - If multiple exact matches (rare) uses first.
 *  - If no exact matches but partial matches exist, throws telling user to be more specific.
 * @param {string} username
 * @returns {Promise<number>}
 * @throws Error if not found or ambiguous
 */
export async function resolveUsernameToId(username) {
  const trimmed = (username || '').trim();
  if (!trimmed) throw new Error('Username is empty');
  const results = await usersApi.listUsers(trimmed);
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error(`No user found with username "${trimmed}"`);
  }
  // Try exact match (case-insensitive)
  const exact = results.filter(u => u.Name?.toLowerCase() === trimmed.toLowerCase());
  if (exact.length === 1) return exact[0].UserID;
  if (exact.length > 1) return exact[0].UserID; // choose first; could refine if needed
  // No exact match, but partial matches present -> ask user to be more specific
  throw new Error(`Ambiguous username. Found ${results.length} partial match(es); please enter exact username.`);
}