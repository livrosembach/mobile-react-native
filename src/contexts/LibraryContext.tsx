import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { LibraryBook, LibraryBookUpdate, ReadingStatus } from '../types/book';
import {
  getLibrary,
  upsertLibraryBook,
  updateLibraryBook,
  removeLibraryBook,
} from '../services/libraryService';
import { useAuth } from './AuthContext';

interface LibraryContextValue {
  library: LibraryBook[];
  loading: boolean;
  error: string | null;
  /** Returns the library entry for a given workId, or undefined */
  getBookEntry: (workId: string) => LibraryBook | undefined;
  isFavorite: (workId: string) => boolean;
  addOrUpdateBook: (entry: LibraryBook) => Promise<void>;
  toggleFavorite: (workId: string, meta: { title: string; coverId: number | null }) => Promise<void>;
  setReadingStatus: (
    workId: string,
    status: ReadingStatus,
    meta: { title: string; coverId: number | null },
  ) => Promise<void>;
  setRating: (
    workId: string,
    rating: number | null,
    meta: { title: string; coverId: number | null },
  ) => Promise<void>;
  refresh: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [library, setLibrary] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLibrary = useCallback(async () => {
    if (!user) {
      setLibrary([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const books = await getLibrary(user.uid);
      setLibrary(books);
    } catch (e) {
      setError('Failed to load your library.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  const getBookEntry = useCallback(
    (workId: string) => library.find((b) => b.workId === workId),
    [library],
  );

  const isFavorite = useCallback(
    (workId: string) => library.find((b) => b.workId === workId)?.isFavorite ?? false,
    [library],
  );

  /** Ensure a book exists in the library with default values, then apply update */
  const ensureAndUpdate = useCallback(
    async (
      workId: string,
      meta: { title: string; coverId: number | null },
      updates: LibraryBookUpdate,
    ) => {
      if (!user) return;
      const existing = library.find((b) => b.workId === workId);
      const now = Date.now();

      if (existing) {
        // Optimistic update
        setLibrary((prev) =>
          prev.map((b) =>
            b.workId === workId
              ? { ...b, ...updates, updatedAt: now }
              : b,
          ),
        );
        await updateLibraryBook(user.uid, workId, updates);
      } else {
        const newEntry: LibraryBook = {
          workId,
          title: meta.title,
          coverId: meta.coverId,
          isFavorite: updates.isFavorite ?? false,
          readingStatus: updates.readingStatus ?? 'want_to_read',
          rating: updates.rating ?? null,
          createdAt: now,
          updatedAt: now,
        };
        // Optimistic add
        setLibrary((prev) => [newEntry, ...prev]);
        await upsertLibraryBook(user.uid, newEntry);
      }
    },
    [user, library],
  );

  const addOrUpdateBook = useCallback(
    async (entry: LibraryBook) => {
      if (!user) return;
      const now = Date.now();
      const withTimestamp = { ...entry, updatedAt: now };
      setLibrary((prev) => {
        const idx = prev.findIndex((b) => b.workId === entry.workId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = withTimestamp;
          return next;
        }
        return [withTimestamp, ...prev];
      });
      await upsertLibraryBook(user.uid, withTimestamp);
    },
    [user],
  );

  const toggleFavorite = useCallback(
    async (workId: string, meta: { title: string; coverId: number | null }) => {
      const current = library.find((b) => b.workId === workId);
      const newFav = !current?.isFavorite;
      await ensureAndUpdate(workId, meta, { isFavorite: newFav });
    },
    [library, ensureAndUpdate],
  );

  const setReadingStatus = useCallback(
    async (
      workId: string,
      status: ReadingStatus,
      meta: { title: string; coverId: number | null },
    ) => {
      await ensureAndUpdate(workId, meta, { readingStatus: status });
    },
    [ensureAndUpdate],
  );

  const setRating = useCallback(
    async (
      workId: string,
      rating: number | null,
      meta: { title: string; coverId: number | null },
    ) => {
      await ensureAndUpdate(workId, meta, { rating });
    },
    [ensureAndUpdate],
  );

  return (
    <LibraryContext.Provider
      value={{
        library,
        loading,
        error,
        getBookEntry,
        isFavorite,
        addOrUpdateBook,
        toggleFavorite,
        setReadingStatus,
        setRating,
        refresh: loadLibrary,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used inside LibraryProvider');
  return ctx;
}
