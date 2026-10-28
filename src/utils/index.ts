// ─── Cover URL helpers ────────────────────────────────────────────────────────

export type CoverSize = 'S' | 'M' | 'L';

/**
 * Returns a cover image URL for a given Open Library cover ID.
 * Falls back to null so callers can render a placeholder.
 */
export function getCoverUrl(
  coverId: number | null | undefined,
  size: CoverSize = 'M',
): string | null {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

// ─── Work ID normalisation ────────────────────────────────────────────────────

/** Strip the "/works/" prefix so we always work with the bare ID. */
export function normalizeWorkId(key: string): string {
  return key.replace(/^\/works\//, '');
}

// ─── Description parsing ──────────────────────────────────────────────────────

/**
 * Open Library descriptions can be:
 *   - a plain string
 *   - { type: '/type/text', value: '...' }
 *   - undefined / null
 *
 * Never render raw HTML – strip simple tags instead.
 */
export function parseDescription(
  raw: string | { type: string; value: string } | undefined | null,
): string | null {
  if (!raw) return null;
  const text = typeof raw === 'string' ? raw : raw.value ?? '';
  if (!text.trim()) return null;
  // Strip basic HTML tags that sometimes appear in OL descriptions
  return text.replace(/<[^>]*>/g, '').trim();
}

// ─── Author resolution ────────────────────────────────────────────────────────

/** Strips the "/authors/" prefix from OL author keys. */
export function normalizeAuthorKey(key: string): string {
  return key.replace(/^\/authors\//, '');
}

// ─── Reading status labels ────────────────────────────────────────────────────

import { ReadingStatus } from '../types/book';

export const READING_STATUS_LABELS: Record<ReadingStatus, string> = {
  want_to_read: 'Want to Read',
  reading: 'Currently Reading',
  read: 'Read',
};

// ─── Date formatting ──────────────────────────────────────────────────────────

export function formatYear(year: number | null | undefined): string {
  if (!year) return 'Year unknown';
  return String(year);
}
