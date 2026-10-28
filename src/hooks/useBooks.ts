import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchBook } from '../types/book';
import { fetchRecentBooks } from '../api/openLibrary';

const PAGE_SIZE = 20;

export function useBooks() {
  const [books, setBooks] = useState<SearchBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  // Prevent concurrent fetches of the same page
  const fetchingPage = useRef<number | null>(null);
  const seenIds = useRef<Set<string>>(new Set());

  const loadPage = useCallback(async (pageNum: number, replace: boolean) => {
    if (fetchingPage.current === pageNum) return;
    fetchingPage.current = pageNum;

    if (replace) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      const result = await fetchRecentBooks(pageNum, PAGE_SIZE);
      setTotal(result.total);

      if (replace) {
        seenIds.current = new Set();
        setBooks([]);
      }

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
    } catch (e) {
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      fetchingPage.current = null;
    }
  }, []);

  useEffect(() => {
    loadPage(1, true);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(nextPage, false);
  }, [loadingMore, loading, hasMore, page, loadPage]);

  const refresh = useCallback(() => {
    setPage(1);
    loadPage(1, true);
  }, [loadPage]);

  return {
    books,
    loading,
    loadingMore,
    error,
    hasMore,
    total,
    loadMore,
    refresh,
  };
}
