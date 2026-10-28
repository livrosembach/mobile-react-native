import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { useLibrary } from '../contexts/LibraryContext';
import { Colors, Typography, Spacing, Radii, Shadows } from '../theme';
import { LibraryBook } from '../types/book';
import { getCoverUrl } from '../utils';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Favorites'>,
  NativeStackScreenProps<RootStackParamList>
>;

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - Spacing.lg * 2;

export function FavoritesScreen({ navigation }: Props) {
  const { library } = useLibrary();
  const favorites = library.filter((b) => b.isFavorite);

  const navigateToDetail = useCallback(
    (workId: string) => navigation.navigate('BookDetails', { workId }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: LibraryBook }) => {
      const coverUrl = getCoverUrl(item.coverId, 'M');
      return (
        <Pressable
          onPress={() => navigateToDetail(item.workId)}
          style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}. Favorited book. Tap to open details.`}
        >
          {coverUrl ? (
            <Image
              source={{ uri: coverUrl }}
              style={styles.cover}
              resizeMode="cover"
              accessibilityLabel={`Cover of ${item.title}`}
            />
          ) : (
            <View style={styles.placeholderCover}>
              <Text style={styles.placeholderChar}>
                {item.title.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.meta}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            {item.rating !== null && (
              <Text style={styles.rating}>
                {'★'.repeat(item.rating)}
                {'☆'.repeat(5 - item.rating)}
                <Text style={styles.ratingNum}> {item.rating}/5</Text>
              </Text>
            )}
          </View>

          <Text style={styles.chevron} accessibilityElementsHidden>›</Text>
        </Pressable>
      );
    },
    [navigateToDetail],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.workId}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.heading}>Favourites</Text>
            <Text style={styles.count}>
              {favorites.length} book{favorites.length !== 1 ? 's' : ''}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>♡</Text>
            <Text style={styles.emptyTitle}>No favourites yet</Text>
            <Text style={styles.emptyBody}>
              Open a book's detail page and tap the heart to save it here.
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Favourited books"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    flexGrow: 1,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.ink,
    fontFamily: 'serif',
    letterSpacing: 0.2,
  },
  count: {
    ...Typography.small,
    color: Colors.inkMuted,
    marginTop: Spacing.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radii.md,
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
    ...Shadows.card,
  },
  itemPressed: {
    opacity: 0.85,
  },
  cover: {
    width: 56,
    height: 80,
    borderRadius: Radii.sm,
  },
  placeholderCover: {
    width: 56,
    height: 80,
    borderRadius: Radii.sm,
    backgroundColor: Colors.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderChar: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.terracotta,
    opacity: 0.7,
  },
  meta: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  title: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.ink,
    marginBottom: Spacing.xs,
  },
  rating: {
    fontSize: 14,
    color: Colors.star,
  },
  ratingNum: {
    color: Colors.inkMuted,
    fontSize: 13,
  },
  chevron: {
    fontSize: 22,
    color: Colors.border,
    paddingHorizontal: Spacing.xs,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 56,
    color: Colors.terracottaLight,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.ink,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyBody: {
    ...Typography.body,
    color: Colors.inkMuted,
    textAlign: 'center',
  },
});
