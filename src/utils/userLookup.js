import * as usersApi from '../api/users.js';

/**
 * Classify username input against user list.
 * Returns an object with status:
 *  - 'notfound'
 *  - 'exact' (single exact match) { match }
 *  - 'duplicates' (multiple exact matches) { matches: [...] }
 *  - 'partial-ambiguous' (no exact, multiple partial matches) { matches: [...] }
 *  - 'partial-single' (no exact, exactly one partial) { match }
 *
 * Exact match rule: case-insensitive equality of Name.
 * Partial match rule: Name contains input substring (case-insensitive).
 *
 * @param {string} username
 * @returns {Promise<{status:string, match?:object, matches?:object[]}>}
 */
export async function classifyUsername(username) {
  const term = (username || '').trim();
  if (!term) return { status: 'notfound' };

  // Fetch possible matches (server performs substring filter)
  const results = await usersApi.listUsers(term) || [];

  if (results.length === 0) {
    return { status: 'notfound' };
  }

  // Check for exact matches
  const exact = results.filter(u => u.Name?.toLowerCase() === term.toLowerCase());
  // Exact match found
  if (exact.length === 1) {
    return { status: 'exact', match: exact[0] };
  }
  // Multiple exact matches found
  if (exact.length > 1) {
    return { status: 'duplicates', matches: exact };
  }

  // No exact matches; identify partial matches (defensive, though results already partial)
  const partial = results.filter(u => u.Name?.toLowerCase().includes(term.toLowerCase()));
  // Single partial match
  if (partial.length === 1) {
    return { status: 'partial-single', match: partial[0] };
  }
  // Multiple partial matches
  if (partial.length > 1) {
    return { status: 'partial-ambiguous', matches: partial };
  }

  return { status: 'notfound' };
}

/**
 * Convenience function to resolve a username to an ID or produce a disambiguation result.
 * Returns:
 *  - { resolvedUserID } when unambiguous
 *  - { disambiguate: true, candidates: [...] } when user must choose
 *  - { error: 'message' } on failure
 * @param {string} username
 */
export async function resolveUsernameForReview(username) {
  const classification = await classifyUsername(username);

  switch (classification.status) {
    case 'exact':
      return { resolvedUserID: classification.match.UserID };
    case 'duplicates':
      return { disambiguate: true, candidates: classification.matches };
    case 'partial-ambiguous':
      return { disambiguate: true, candidates: classification.matches };
    case 'partial-single':
      // Force user to type exact to reduce misattribution risk
      return {
        error: `Found one partial match ("${classification.match.Name}") but no exact match. Please enter the exact username.`
      };
    case 'notfound':
    default:
      return { error: 'No user found with that username.' };
  }
}

