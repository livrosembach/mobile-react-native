# Folio — Mobile App

A React Native mobile application built with Expo for discovering books, browsing Open Library catalogs, and managing a personal reading library with Firebase authentication and Firestore persistence.

---

## 📋 Prerequisites

Before running the project, ensure you have installed:

- **[Node.js](https://nodejs.org/)** (v18 or higher recommended)
- **npm** (or yarn/bun)
- **Physical device or emulator:**
  - **iOS Simulator** (macOS with Xcode installed) or **Android Emulator** (Android Studio)
  - Or the **Expo Go** app installed on your physical iOS or Android phone

---

## 🚀 Setup & Installation

### 1. Clone the repository and install dependencies

```bash
git clone <repository-url>
cd mobile-react-native
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase configuration values:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

> **Note**: A Firebase project with **Authentication (Email/Password)** and **Cloud Firestore** enabled is required for account and library synchronization features.

---

## 📱 Running the App

Start the Expo development server:

```bash
npx expo start
```

Once the server is running in the terminal:

- **Physical device (Expo Go)**:
  - **iOS**: Scan the QR code using the iOS Camera app and tap the Expo prompt.
  - **Android**: Scan the QR code using the **Expo Go** app.
- **iOS Simulator**: Press `i` in the terminal (or run `npm run ios`).
- **Android Emulator**: Press `a` in the terminal (or run `npm run android`).
- **Reload**: Press `r` to reload the bundle.

---

## 🛠 Diagnostics & Verification

To verify TypeScript types and project dependencies:

```bash
npx tsc --noEmit     # Typecheck without emitting code
npx expo-doctor      # Verify dependencies & Expo configuration
```
