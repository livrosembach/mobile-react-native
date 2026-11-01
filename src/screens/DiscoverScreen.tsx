import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Pressable,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut, BookOpen, AlertCircle } from 'lucide-react-native';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { useBooks } from '../hooks/useBooks';
import { useLibrary } from '../contexts/LibraryContext';
import { useAuth } from '../contexts/AuthContext';
import { BookCard } from '../components/BookCard';
import { Button } from '../components/Button';
import { Colors, Typography, Spacing } from '../theme';
import { SearchBook } from '../types/book';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Discover'>,
  NativeStackScreenProps<RootStackParamList>
>;

const { width } = Dimensions.get('window');
const COLUMNS = 2;
const CARD_MARGIN = Spacing.md;
const CARD_WIDTH = (width - Spacing.lg * 2 - CARD_MARGIN) / COLUMNS;

export function DiscoverScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { books, loading, loadingMore, error, loadMore, refresh } = useBooks();
  const { isFavorite } = useLibrary();
  const { user, logout } = useAuth();

  const navigateToDetail = useCallback(
    (workId: string) => {
      navigation.navigate('BookDetails', { workId });
    },
    [navigation],
  );

  const renderBook = useCallback(
    ({ item }: { item: SearchBook }) => (
      <View style={styles.cardWrapper}>
        <BookCard
          workId={item.workId}
          title={item.title}
          authors={item.authors}
          coverId={item.coverId}
          firstPublishYear={item.firstPublishYear}
          isFavorite={isFavorite(item.workId)}
          onPress={() => navigateToDetail(item.workId)}
          cardWidth={CARD_WIDTH}
        />
      </View>
    ),
    [isFavorite, navigateToDetail],
  );

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={Colors.terracotta} />
        <Text style={styles.loadingMoreText}>Loading more books…</Text>
      </View>
    );
  }, [loadingMore]);

  const ListHeader = (
    <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top + Spacing.md, Spacing.xxl) }]}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.heading}>New Arrivals</Text>
          <Text style={styles.subheading}>Recently published books to discover</Text>
        </View>
        <Pressable
          onPress={logout}
          style={styles.profileBtn}
          accessibilityRole="button"
          accessibilityLabel="Account and sign out"
          accessibilityHint={`Signed in as ${user?.email ?? ''}. Tap to sign out.`}
        >
          <LogOut size={22} color={Colors.olive} />
        </Pressable>
      </View>
    </View>
  );

  if (loading && books.length === 0) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={Colors.terracotta} />
        <Text style={styles.loadingText}>Curating your discover feed…</Text>
      </View>
    );
  }

  if (error && books.length === 0) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <AlertCircle size={48} color={Colors.error} style={{ marginBottom: Spacing.md }} />
        <Text style={styles.errorTitle}>Couldn't load books</Text>
        <Text style={styles.errorBody}>{error}</Text>
        <Button label="Try Again" onPress={refresh} variant="secondary" />
      </View>
    );
  }

  if (!loading && books.length === 0) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <BookOpen size={48} color={Colors.terracotta} style={{ marginBottom: Spacing.md }} />
        <Text style={styles.errorTitle}>No books found</Text>
        <Text style={styles.errorBody}>Pull down to refresh the catalog.</Text>
        <Button label="Refresh" onPress={refresh} variant="secondary" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.workId}
        renderItem={renderBook}
        numColumns={COLUMNS}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={loading && books.length > 0}
            onRefresh={refresh}
            tintColor={Colors.terracotta}
          />
        }
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Book discovery feed"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  headerContainer: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.ink,
    fontFamily: 'serif',
    letterSpacing: 0.2,
  },
  subheading: {
    ...Typography.small,
    color: Colors.inkMuted,
    marginTop: Spacing.xs,
  },
  profileBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  loadingMoreText: {
    ...Typography.small,
    color: Colors.inkMuted,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.inkMuted,
    marginTop: Spacing.md,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  errorTitle: {
    ...Typography.h3,
    color: Colors.ink,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  errorBody: {
    ...Typography.body,
    color: Colors.inkMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
});
