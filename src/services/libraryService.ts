import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { LibraryBook, LibraryBookUpdate } from '../types/book';

// ─── Path helpers ─────────────────────────────────────────────────────────────

function bookRef(userId: string, workId: string) {
  return doc(db, 'users', userId, 'books', workId);
}

function booksCol(userId: string) {
  return collection(db, 'users', userId, 'books');
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

/** Fetch a single library book entry. Returns null if not in library. */
export async function getLibraryBook(
  userId: string,
  workId: string,
): Promise<LibraryBook | null> {
  const snap = await getDoc(bookRef(userId, workId));
  if (!snap.exists()) return null;
  return snap.data() as LibraryBook;
}

/** Fetch the user's entire library, ordered by updatedAt desc. */
export async function getLibrary(userId: string): Promise<LibraryBook[]> {
  const q = query(booksCol(userId), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as LibraryBook);
}

/**
 * Add or update a book in the user's library.
 * Uses setDoc with merge so partial updates don't clobber existing fields.
 */
export async function upsertLibraryBook(
  userId: string,
  entry: LibraryBook,
): Promise<void> {
  const ref = bookRef(userId, entry.workId);
  const snap = await getDoc(ref);
  const now = Date.now();

  if (snap.exists()) {
    await updateDoc(ref, {
      ...entry,
      updatedAt: now,
    });
  } else {
    await setDoc(ref, {
      ...entry,
      createdAt: now,
      updatedAt: now,
    });
  }
}

/** Partially update a library book (e.g., just the rating or status). */
export async function updateLibraryBook(
  userId: string,
  workId: string,
  updates: LibraryBookUpdate,
): Promise<void> {
  await updateDoc(bookRef(userId, workId), {
    ...updates,
    updatedAt: Date.now(),
  });
}

/** Remove a book from the user's library. */
export async function removeLibraryBook(
  userId: string,
  workId: string,
): Promise<void> {
  await deleteDoc(bookRef(userId, workId));
}
