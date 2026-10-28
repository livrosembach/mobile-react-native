// ─── Open Library domain types ───────────────────────────────────────────────

export interface OLSearchResult {
  key: string; // e.g. "/works/OL45804W"
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
  edition_count?: number;
  language?: string[];
}

export interface OLSearchResponse {
  numFound: number;
  start: number;
  docs: OLSearchResult[];
}

export interface OLDescription {
  type: string;
  value: string;
}

export interface OLAuthorRef {
  author: { key: string };
  type: { key: string };
}

export interface OLWorkDetail {
  key: string;
  title: string;
  description?: string | OLDescription;
  covers?: number[];
  subjects?: string[];
  authors?: OLAuthorRef[];
  first_publish_date?: string;
  subject_places?: string[];
  subject_times?: string[];
}

// ─── Normalized domain types ──────────────────────────────────────────────────

export interface Book {
  workId: string;          // e.g. "OL45804W"
  title: string;
  authors: string[];
  coverId: number | null;
  firstPublishYear: number | null;
  subjects: string[];
  description: string | null;
}

export interface SearchBook {
  workId: string;
  title: string;
  authors: string[];
  coverId: number | null;
  firstPublishYear: number | null;
}

// ─── Library / User types ─────────────────────────────────────────────────────

export type ReadingStatus = 'want_to_read' | 'reading' | 'read';

export interface LibraryBook {
  workId: string;
  title: string;
  coverId: number | null;
  isFavorite: boolean;
  readingStatus: ReadingStatus;
  rating: number | null;  // 1–5 or null
  createdAt: number;
  updatedAt: number;
}

// Partial update payload for Firestore
export type LibraryBookUpdate = Partial<Omit<LibraryBook, 'workId' | 'createdAt'>>;
