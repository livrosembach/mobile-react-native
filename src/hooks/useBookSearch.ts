import { useState, useCallback, useRef } from 'react';
import { SearchBook } from '../types/book';
import { searchBooks } from '../api/openLibrary';

const PAGE_SIZE = 20;

export function useBookSearch() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<SearchBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // Cancel stale requests
  const currentQuery = useRef<string>('');
  const fetchingPage = useRef<number | null>(null);
  const seenIds = useRef<Set<string>>(new Set());

  const executeSearch = useCallback(
    async (q: string, pageNum: number, replace: boolean) => {
      if (!q.trim()) return;
      if (fetchingPage.current === pageNum && currentQuery.current === q) return;

      currentQuery.current = q;
      fetchingPage.current = pageNum;

      if (replace) {
        setLoading(true);
        setError(null);
        seenIds.current = new Set();
        setBooks([]);
        setPage(1);
      } else {
        setLoadingMore(true);
      }

      try {
        const result = await searchBooks({ q, page: pageNum, limit: PAGE_SIZE });

        // Discard if query changed while fetching
        if (currentQuery.current !== q) return;

        setTotal(result.total);

        const newBooks = result.books.filter((b) => {
          if (seenIds.current.has(b.workId)) return false;
          seenIds.current.add(b.workId);
          return true;
        });

        if (replace) {
          setBooks(newBooks);
        } else {
          setBooks((prev) => [...prev, ...newBooks]);
        }

        const fetched = (pageNum - 1) * PAGE_SIZE + result.books.length;
        setHasMore(fetched < result.total && result.books.length === PAGE_SIZE);
        setPage(pageNum);
      } catch (e) {
        if (currentQuery.current === q) {
          setError('Search failed. Please try again.');
        }
      } finally {
        if (currentQuery.current === q) {
          setLoading(false);
          setLoadingMore(false);
        }
        fetchingPage.current = null;
      }
    },
    [],
  );

  const search = useCallback(
    (q: string) => {
      setQuery(q);
      executeSearch(q, 1, true);
    },
    [executeSearch],
  );

  const loadMore = useCallback(() => {
    if (loadingMore || loading || !hasMore || !query.trim()) return;
    const nextPage = page + 1;
    executeSearch(query, nextPage, false);
  }, [loadingMore, loading, hasMore, page, query, executeSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setBooks([]);
    setError(null);
    setHasMore(false);
    setTotal(0);
    setPage(1);
    currentQuery.current = '';
  }, []);

  return {
    query,
    books,
    loading,
    loadingMore,
    error,
    hasMore,
    total,
    search,
    loadMore,
    clearSearch,
  };
}
