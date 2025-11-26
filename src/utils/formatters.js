import { format } from 'date-fns';

/**
 * Format a unix timestamp (seconds) safely.
 * Returns an em dash when value is invalid.
 * @param {number|string|undefined|null} ts
 * @returns {string}
 */
export function formatUnix(ts) {
  if (ts === undefined || ts === null || ts === '' ) return '—';
  const n = Number(ts);
  if (!Number.isFinite(n) || n <= 0) return '—';
  try {
    return format(new Date(n * 1000), 'yyyy-MM-dd HH:mm');
  } catch {
    return '—';
  }
}

/**
 * Convert milliseconds or seconds-like input to seconds integer.
 * Blank / invalid returns undefined.
 * @param {number|string} input
 */
export function toUnixSeconds(input) {
  if (input === undefined || input === null || input === '') return undefined;
  const n = Number(input);
  if (!Number.isFinite(n)) return undefined;
  // If already seconds (1.7e9 range) keep; if ms (>= 10_000_000_000) divide.
  return n > 10_000_000_000 ? Math.floor(n / 1000) : n;
}