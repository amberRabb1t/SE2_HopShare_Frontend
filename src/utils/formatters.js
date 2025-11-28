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
  return n > 10_000_000_000 ? Math.floor(n / 1000) : n;
}

/**
 * Parse datetime-local string (e.g. "2025-12-31T18:30") to unix seconds.
 * Returns undefined if invalid.
 */
export function parseDateTimeToUnix(value) {
  if (!value || typeof value !== 'string') return undefined;
  const d = new Date(value);
  const ms = d.getTime();
  if (!Number.isFinite(ms)) return undefined;
  return Math.floor(ms / 1000);
}

/**
 * Parse date string (e.g. "2025-12-31") to unix seconds (00:00 local time).
 * Returns undefined if invalid.
 */
export function parseDateToUnix(value) {
  if (!value || typeof value !== 'string') return undefined;
  const d = new Date(value + 'T00:00');
  const ms = d.getTime();
  if (!Number.isFinite(ms)) return undefined;
  return Math.floor(ms / 1000);
}