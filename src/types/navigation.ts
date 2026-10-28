import { ParamListBase } from '@react-navigation/native';

// ─── Auth Stack ───────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// ─── Main Tabs ────────────────────────────────────────────────────────────────
export type TabParamList = {
  Discover: undefined;
  Search: undefined;
  Favorites: undefined;
  MyBooks: undefined;
};

// ─── Root Stack (wraps tabs + modal screens) ──────────────────────────────────
export type RootStackParamList = {
  Tabs: undefined;
  BookDetails: { workId: string };
};

// Merge for useNavigation type safety
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
