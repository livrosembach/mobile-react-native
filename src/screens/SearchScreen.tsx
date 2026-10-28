import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Pressable,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { useBookSearch } from '../hooks/useBookSearch';
import { useLibrary } from '../contexts/LibraryContext';
import { BookCard } from '../components/BookCard';
import { Button } from '../components/Button';
import { Colors, Typography, Spacing, Radii } from '../theme';
import { SearchBook } from '../types/book';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

const { width } = Dimensions.get('window');
const COLUMNS = 2;
const CARD_MARGIN = Spacing.md;
const CARD_WIDTH = (width - Spacing.lg * 2 - CARD_MARGIN) / COLUMNS;

export function SearchScreen({ navigation }: Props) {
  const [inputValue, setInputValue] = useState('');
  const { books, loading, loadingMore, error, total, hasMore, search, loadMore, clearSearch } =
    useBookSearch();
  const { isFavorite } = useLibrary();

  const handleSearch = useCallback(() => {
    if (!inputValue.trim()) return;
    search(inputValue.trim());
  }, [inputValue, search]);

  const handleClear = useCallback(() => {
    setInputValue('');
    clearSearch();
  }, [clearSearch]);

  const navigateToDetail = useCallback(
    (workId: string) => navigation.navigate('BookDetails', { workId }),
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
      <View style={styles.loadingFooter}>
        <ActivityIndicator color={Colors.terracotta} />
      </View>
    );
  }, [loadingMore]);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Search by title, author, or keyword…"
            placeholderTextColor={Colors.inkSubtle}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            accessibilityLabel="Search books"
            accessibilityHint="Type a title, author, or keyword and press Search"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="never"
          />
          {inputValue.length > 0 && (
            <Pressable
              onPress={handleClear}
              style={styles.clearBtn}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={8}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={handleSearch}
          style={({ pressed }) => [styles.searchBtn, pressed && styles.searchBtnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Search"
          disabled={loading || !inputValue.trim()}
        >
          {loading ? (
            <ActivityIndicator color={Colors.surface} size="small" />
          ) : (
            <Text style={styles.searchBtnText}>Search</Text>
          )}
        </Pressable>
      </View>

      {/* Results or states */}
      {books.length > 0 && (
        <Text style={styles.resultsCount}>
          {total.toLocaleString()} result{total !== 1 ? 's' : ''} for "{books.length > 0 ? inputValue : ''}"
        </Text>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Search failed</Text>
          <Text style={styles.errorBody}>{error}</Text>
          <Button label="Try Again" onPress={handleSearch} variant="secondary" />
        </View>
      )}

      {!loading && !error && books.length === 0 && inputValue.trim().length > 0 && (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.errorTitle}>No results</Text>
          <Text style={styles.errorBody}>
            No books found for "{inputValue}". Try a different term.
          </Text>
        </View>
      )}

      {!loading && !error && books.length === 0 && inputValue.trim().length === 0 && (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.promptTitle}>Explore the catalog</Text>
          <Text style={styles.promptBody}>
            Search by title, author, or any keyword to find your next book.
          </Text>
        </View>
      )}

      {books.length > 0 && (
        <FlatList
          data={books}
          keyExtractor={(item) => item.workId}
          renderItem={renderBook}
          numColumns={COLUMNS}
          ListFooterComponent={renderFooter}
          onEndReached={hasMore ? loadMore : undefined}
          onEndReachedThreshold={0.4}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Search results"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
    gap: Spacing.sm,
    backgroundColor: Colors.background,
  },
  inputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    height: 48,
    color: Colors.ink,
    ...Typography.body,
  },
  clearBtn: {
    padding: Spacing.xs,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    color: Colors.inkSubtle,
    fontSize: 14,
  },
  searchBtn: {
    height: 48,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.terracotta,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  searchBtnPressed: {
    opacity: 0.8,
  },
  searchBtnText: {
    ...Typography.label,
    color: Colors.surface,
  },
  resultsCount: {
    ...Typography.small,
    color: Colors.inkMuted,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  promptTitle: {
    ...Typography.h3,
    color: Colors.ink,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  promptBody: {
    ...Typography.body,
    color: Colors.inkMuted,
    textAlign: 'center',
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
  loadingFooter: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
});
