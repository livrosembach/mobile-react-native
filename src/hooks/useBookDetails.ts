import { useState, useEffect, useCallback } from 'react';
import { Book } from '../types/book';
import { fetchWorkDetail } from '../api/openLibrary';

export function useBookDetails(workId: string) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!workId) return;
    setLoading(true);
    setError(null);
    try {
      const detail = await fetchWorkDetail(workId);
      setBook(detail);
    } catch (e) {
      setError('Could not load book details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [workId]);

  useEffect(() => {
    load();
  }, [load]);

  return { book, loading, error, retry: load };
}
