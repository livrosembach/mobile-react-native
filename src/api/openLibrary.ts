import axios from 'axios';
import {
  OLSearchResponse,
  OLWorkDetail,
  OLSearchResult,
  Book,
  SearchBook,
} from '../types/book';
import { normalizeWorkId, parseDescription } from '../utils';

const BASE = 'https://openlibrary.org';

const olClient = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: { 'Accept': 'application/json' },
});

// ─── Search / Discovery ───────────────────────────────────────────────────────

export interface SearchParams {
  q: string;
  page?: number;
  limit?: number;
  sort?: 'new' | 'editions' | 'scans';
}

const SEARCH_FIELDS = [
  'key',
  'title',
  'author_name',
  'cover_i',
  'first_publish_year',
  'subject',
  'edition_count',
].join(',');

export async function searchBooks(params: SearchParams): Promise<{
  books: SearchBook[];
  total: number;
}> {
  const { q, page = 1, limit = 20, sort } = params;
  const response = await olClient.get<OLSearchResponse>('/search.json', {
    params: {
      q,
      page,
      limit,
      ...(sort ? { sort } : {}),
      fields: SEARCH_FIELDS,
    },
  });

  const { numFound, docs } = response.data;

  const books: SearchBook[] = docs.map((doc) => ({
    workId: normalizeWorkId(doc.key),
    title: doc.title,
    authors: doc.author_name ?? [],
    coverId: doc.cover_i ?? null,
    firstPublishYear: doc.first_publish_year ?? null,
  }));

  return { books, total: numFound };
}

/**
 * Discovery feed: recently published books.
 * OL supports sort=new on the search endpoint.
 * We fall back to a broad query if needed.
 */
export async function fetchRecentBooks(
  page: number = 1,
  limit: number = 20,
): Promise<{ books: SearchBook[]; total: number }> {
  return searchBooks({
    q: 'subject:fiction OR subject:nonfiction OR subject:history OR subject:science',
    page,
    limit,
    sort: 'new',
  });
}

// ─── Book Details ─────────────────────────────────────────────────────────────

export async function fetchWorkDetail(workId: string): Promise<Book> {
  const response = await olClient.get<OLWorkDetail>(`/works/${workId}.json`);
  const work = response.data;

  // Resolve author names (OL returns refs, not inline names)
  const authorNames = await resolveAuthors(work.authors ?? []);

  // Parse cover
  const coverId = work.covers?.[0] ?? null;

  // Parse description safely
  const description = parseDescription(work.description);

  // Attempt to extract first publish year from first_publish_date
  let firstPublishYear: number | null = null;
  if (work.first_publish_date) {
    const match = work.first_publish_date.match(/\d{4}/);
    if (match) firstPublishYear = parseInt(match[0], 10);
  }

  return {
    workId: normalizeWorkId(work.key),
    title: work.title,
    authors: authorNames,
    coverId,
    firstPublishYear,
    subjects: work.subjects?.slice(0, 10) ?? [],
    description,
  };
}

// ─── Author resolution ────────────────────────────────────────────────────────

interface OLAuthorDetail {
  name?: string;
  personal_name?: string;
}

async function resolveAuthors(
  authorRefs: Array<{ author?: { key?: string }; type?: { key?: string } }>,
): Promise<string[]> {
  if (!authorRefs || !authorRefs.length) return [];

  // Fetch up to 3 authors to avoid too many parallel requests
  const limited = authorRefs.slice(0, 3);

  const results = await Promise.allSettled(
    limited.map(async (ref) => {
      const key = ref.author?.key ?? (ref as any)?.key;
      if (!key) return 'Unknown Author';
      const cleanKey = key.startsWith('/') ? key : `/${key}`;
      const res = await olClient.get<OLAuthorDetail>(`${cleanKey}.json`);
      return res.data.personal_name ?? res.data.name ?? 'Unknown Author';
    }),
  );

  return results
    .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
    .map((r) => r.value);
}
