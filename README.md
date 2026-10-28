# Folio — Editorial Book Discovery App

A refined, editorial-style mobile application for discovering books, exploring literary details, searching the Open Library catalog, and curating a private personal library with reading progress and star ratings.

Designed with an aesthetic inspired by independent bookstores and literary reviews: warm ivory tones, ink typography, terracotta accents, and generous whitespace.

---

## 📚 Table of Contents

- [Features & Academic Requirements (RF01–RF10)](#features--academic-requirements-rf01rf10)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Setup & Installation](#setup--installation)
- [Firebase Configuration](#firebase-configuration)
- [Firestore Schema & Security Rules](#firestore-schema--security-rules)
- [Running the App](#running-the-app)
- [Testing & Verification Guide](#testing--verification-guide)
- [Known Limitations of Open Library](#known-limitations-of-open-library)

---

## ✨ Features & Academic Requirements (RF01–RF10)

| Requirement | Description | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **RF01: Catalog Grid & Pagination** | 2-column FlatList grid with pagination, pull-to-refresh, loading indicators, and missing-cover fallback monogram. | ✅ | [`src/screens/DiscoverScreen.tsx`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/screens/DiscoverScreen.tsx), [`src/components/BookCard.tsx`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/components/BookCard.tsx), [`src/hooks/useBooks.ts`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/hooks/useBooks.ts) |
| **RF02: Stack Navigation & Dynamic Title** | Native stack navigation with typed route params (`workId`) and dynamic book title in header. | ✅ | [`src/navigation/RootNavigator.tsx`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/navigation/RootNavigator.tsx), [`src/screens/BookDetailsScreen.tsx`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/screens/BookDetailsScreen.tsx) (`useLayoutEffect`) |
| **RF03: Book Details & Description Parsing** | Dedicated API request for book details, author name resolution, subjects, and clean markdown/string description extraction. | ✅ | [`src/screens/BookDetailsScreen.tsx`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/screens/BookDetailsScreen.tsx), [`src/api/openLibrary.ts`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/api/openLibrary.ts), [`src/utils/index.ts`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/utils/index.ts) |
| **RF04: Global Favorite State** | Global favorite toggle managed via React Context API, updated in real time across Discover, Search, and Details. | ✅ | [`src/contexts/LibraryContext.tsx`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/contexts/LibraryContext.tsx) |
| **RF05: Dedicated Favorites Screen** | Dedicated tab displaying all favorited books with quick access to details and friendly empty state. | ✅ | [`src/screens/FavoritesScreen.tsx`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/screens/FavoritesScreen.tsx) |
| **RF06: Cloud Persistence (Firestore)** | Persistence bonus: User library state, favorites, reading status, and ratings saved to Firestore per authenticated user. | ✅ | [`src/services/libraryService.ts`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/services/libraryService.ts), [`firestore.rules`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/firestore.rules) |
| **RF07: Authentication & Reading Status** | Firebase Authentication (email/password), session persistence across restarts, reading status (`want_to_read`, `reading`, `read`), 1–5 star rating, and sign out. | ✅ | [`src/contexts/AuthContext.tsx`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/contexts/AuthContext.tsx), [`src/screens/LoginScreen.tsx`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/screens/LoginScreen.tsx), [`src/screens/RegisterScreen.tsx`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/screens/RegisterScreen.tsx), [`src/screens/MyBooksScreen.tsx`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/screens/MyBooksScreen.tsx) |
| **RF08: Search Screen** | Controlled search input with clear button, API search, pagination, result count, and empty/error states. | ✅ | [`src/screens/SearchScreen.tsx`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/screens/SearchScreen.tsx), [`src/hooks/useBookSearch.ts`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/src/hooks/useBookSearch.ts) |
| **RF09: Loading, Error & Retry States** | Explicit visual feedback during async operations, descriptive error messages, and retry actions on all data screens. | ✅ | All hooks and screens (`useBooks`, `useBookSearch`, `useBookDetails`) |
| **RF10: Accessibility (A11y)** | Accessible roles, dynamic labels (`accessibilityLabel`, `accessibilityState`), VoiceOver/TalkBack support, ≥44pt touch targets, and contrast ratios. | ✅ | Components, buttons, inputs, pickers, and tab bars |

---

## 🛠 Technology Stack

- **Framework**: React Native 0.88 with Expo SDK 58
- **Language**: TypeScript (strict mode enabled)
- **Navigation**:
  - `@react-navigation/native` v7
  - `@react-navigation/native-stack` v7
  - `@react-navigation/bottom-tabs` v7
- **HTTP Client**: Axios with timeout and query parameter serialization
- **State Management**: React Context API (`AuthContext`, `LibraryContext`) + custom hooks
- **Backend & Cloud Persistence**:
  - Firebase JS SDK v13 (`firebase/app`, `firebase/auth`, `firebase/firestore`)
  - `@react-native-async-storage/async-storage` for native session persistence
- **External API**: Open Library REST APIs (`/search.json`, `/works/{id}.json`, `/authors/{id}.json`, and Covers CDN)

---

## 📁 Project Architecture

```
mobile-react-native/
├── src/
│   ├── api/
│   │   └── openLibrary.ts        # Axios client, Open Library search & work endpoints
│   ├── components/
│   │   ├── BookCard.tsx          # Editorial book cover card with favorite indicator
│   │   ├── Button.tsx            # Accessible button with primary, secondary, ghost styles
│   │   ├── Input.tsx             # Accessible text field with error labels & hints
│   │   ├── ReadingStatusPicker.tsx # Pill-based reading status selector
│   │   └── StarRating.tsx        # 1-to-5 star rating component with clear action
│   ├── contexts/
│   │   ├── AuthContext.tsx       # Firebase session & authentication provider
│   │   └── LibraryContext.tsx    # User library state, favorites & optimistic updates
│   ├── hooks/
│   │   ├── useBooks.ts           # Discovery feed with deduplication & pagination
│   │   ├── useBookSearch.ts      # Search query management, debouncing & pagination
│   │   └── useBookDetails.ts     # Work detail fetching & retry logic
│   ├── navigation/
│   │   ├── AuthNavigator.tsx     # Login & Register stack
│   │   ├── RootNavigator.tsx     # Auth gate & modal/details stack
│   │   └── TabNavigator.tsx      # Bottom tab navigation (Discover, Search, Favorites, My Books)
│   ├── screens/
│   │   ├── BookDetailsScreen.tsx # Book details, dynamic title, reading status, star rating
│   │   ├── DiscoverScreen.tsx    # 2-column catalog of recently published books
│   │   ├── FavoritesScreen.tsx   # Curated list of favorited titles
│   │   ├── LoginScreen.tsx       # Email & password login
│   │   ├── MyBooksScreen.tsx     # Library grouped by reading status (Reading, Want to Read, Read)
│   │   ├── RegisterScreen.tsx    # Account creation with validation
│   │   └── SearchScreen.tsx      # Keyword search with result counts & clear button
│   ├── services/
│   │   ├── authService.ts        # Firebase Auth operations
│   │   ├── firebase.ts           # Firebase app, auth with AsyncStorage, and Firestore init
│   │   └── libraryService.ts     # Firestore CRUD for users/{userId}/books/{workId}
│   ├── theme/
│   │   └── index.ts              # Color tokens, typography, spacing, shadows, and radii
│   ├── types/
│   │   ├── book.ts               # Open Library API models & normalized domain types
│   │   └── navigation.ts         # Navigation param lists for TypeScript
│   └── utils/
│       └── index.ts              # Cover CDN URLs, description parser, formatting helpers
├── App.tsx                       # Root app component wrapping providers & navigators
├── firestore.rules               # Cloud Firestore security & validation rules
├── .env.example                  # Environment variable template
└── package.json
```

---

## 🚀 Setup & Installation

### 1. Clone & Install Dependencies

```bash
git clone <repo-url>
cd mobile-react-native
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase project configuration:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
EXPO_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

> **Note**: `.env` is ignored in Git via `.gitignore` to prevent secret leaks.

---

## 🔒 Firebase Configuration

1. Visit the [Firebase Console](https://console.firebase.google.com/).
2. Create a new Firebase project (or use an existing one).
3. **Authentication**:
   - Go to **Authentication** > **Sign-in method**.
   - Enable **Email/Password**.
4. **Cloud Firestore**:
   - Go to **Firestore Database** > **Create database**.
   - Select production or test mode in your preferred region.
   - Add your Web App in Project Settings to copy the config values to `.env`.

---

## 🛡 Firestore Schema & Security Rules

### Document Path
Each user's library is isolated under their unique Firebase user ID (`userId`):

```
/users/{userId}/books/{workId}
```

### Document Fields
```typescript
interface LibraryBook {
  workId: string;              // Open Library work identifier, e.g. "OL45804W"
  title: string;               // Book title
  coverId: number | null;      // Open Library cover ID
  isFavorite: boolean;         // True if marked as favorite
  readingStatus: 'want_to_read' | 'reading' | 'read';
  rating: number | null;       // 1–5 integer or null
  createdAt: number;           // Millisecond timestamp
  updatedAt: number;           // Millisecond timestamp
}
```

### Security Rules
The rules in [`firestore.rules`](file:///Users/liviarosembacholiveira/GitHub/mobile-react-native/firestore.rules) ensure:
- Only authenticated users can access `/users/{userId}/books/{workId}`.
- Users can only read, write, or delete their own documents (`request.auth.uid == userId`).
- Data validation enforces field types, status enums, and 1–5 star integer ratings.

To deploy via Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

---

## 📱 Running the App

Start the Expo development server:

```bash
npx expo start
```

- Press `i` to open in the iOS Simulator (macOS with Xcode).
- Press `a` to open in an Android Emulator.
- Scan the QR code with **Expo Go** on your physical mobile device.

To run diagnostic checks at any time:

```bash
npx tsc --noEmit     # Typecheck
npx expo-doctor      # Dependency & configuration diagnostics
```

---

## 🧪 Testing & Verification Guide

### 1. Authentication Flow (RF07)
1. Launch the app. The auth gate presents the `Login` screen.
2. Tap "Create an account" to navigate to `Register`.
3. Test validation by submitting with empty or mismatched passwords.
4. Create an account with a test email (`reader@example.com` / `password123`).
5. Verify you are automatically transitioned to the main tab interface.
6. Quit and re-launch the app: verify session is restored without re-logging in.
7. Go to **My Books** tab and tap "Sign Out" to verify session termination.

### 2. Catalog & Discovery (RF01, RF02)
1. Open the **Discover** tab.
2. Observe 2-column grid rendering real Open Library records with cover images or typographic monograms.
3. Scroll to the bottom: verify the footer spinner loads page 2 without duplicating books.
4. Pull down from the top to trigger pull-to-refresh.
5. Tap any book card to navigate into `BookDetails`. The header title dynamically updates to match the book.

### 3. Book Details & Description (RF03)
1. Observe cover image hero card with drop shadow.
2. Verify author name resolution (resolved from author reference IDs).
3. Read book description (clean text extracted from string or Open Library value objects).
4. View subject tag pills.

### 4. Reading Library & Favorites (RF04, RF05, RF06)
1. On the book detail page, tap "Add to Favourites" (heart icon).
2. Switch to the **Favourites** tab: verify the book immediately appears.
3. Return to detail and tap "Favourited" to unfavorite: verify it disappears from the Favourites tab.
4. Select a reading status ("Currently Reading", "Want to Read", or "Finished").
5. Select a 1–5 star rating. Tap the same star to clear rating.
6. Switch to the **My Books** tab: verify the book is categorized into the appropriate reading status section.
7. Verify all changes persist across reloads via Firestore.

### 5. Search (RF08, RF09)
1. Open the **Search** tab.
2. Type an author or keyword (e.g. "Tolkien", "Philosophy", or "Dune") and tap Search.
3. Verify total result counter appears (e.g., "1,240 results for 'Dune'").
4. Scroll to paginate through results.
5. Tap "✕" to clear search and return to the discovery prompt.
6. Test an impossible search term (e.g. "zzxxqwerty12345") to verify the friendly empty-results state.

### 6. Accessibility & Offline Error States (RF09, RF10)
1. Inspect accessibility with Screen Reader (VoiceOver on iOS / TalkBack on Android).
2. All interactive elements have descriptive roles and labels (e.g., star buttons announce "Rate 4 out of 5 stars").
3. Test network error handling by toggling Airplane Mode: verify the retry button appears and gracefully reloads upon reconnecting.

---

## ⚠️ Known Limitations of Open Library

- **Metadata Completeness**: Some older or obscure works lack cover images (`cover_i` is null). The app gracefully displays a styled initial monogram.
- **Author Resolution**: Open Library Work records often store author references (e.g. `/authors/OL...`) rather than names. The app resolves up to 3 authors asynchronously.
- **Description Formats**: Descriptions may be raw text strings or `{ type: string, value: string }` objects; the app normalizes both.
- **Rate Limiting**: Open Library is a free public API; excessive rapid requests can occasionally encounter 429 status codes. The app includes timeouts and error handling with user-initiated retry.
