import React, { useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Heart, AlertCircle } from 'lucide-react-native';
import { RootStackParamList } from '../types/navigation';
import { useBookDetails } from '../hooks/useBookDetails';
import { useLibrary } from '../contexts/LibraryContext';
import { StarRating } from '../components/StarRating';
import { ReadingStatusPicker } from '../components/ReadingStatusPicker';
import { Button } from '../components/Button';
import { Colors, Typography, Spacing, Radii, Shadows } from '../theme';
import { getCoverUrl, formatYear } from '../utils';
import { ReadingStatus } from '../types/book';

type Props = NativeStackScreenProps<RootStackParamList, 'BookDetails'>;

const { width } = Dimensions.get('window');
const COVER_WIDTH = Math.min(width * 0.45, 200);
const COVER_HEIGHT = Math.round(COVER_WIDTH * 1.52);

export function BookDetailsScreen({ route, navigation }: Props) {
  const { workId } = route.params;
  const { book, loading, error, retry } = useBookDetails(workId);
  const {
    getBookEntry,
    isFavorite,
    toggleFavorite,
    setReadingStatus,
    setRating,
  } = useLibrary();

  const entry = getBookEntry(workId);
  const fav = isFavorite(workId);

  // Set dynamic navigation title once book loads
  useLayoutEffect(() => {
    if (book) {
      navigation.setOptions({ title: book.title });
    }
  }, [book, navigation]);

  const handleToggleFavorite = useCallback(() => {
    if (!book) return;
    toggleFavorite(workId, { title: book.title, coverId: book.coverId });
  }, [book, workId, toggleFavorite]);

  const handleStatusChange = useCallback(
    (status: ReadingStatus) => {
      if (!book) return;
      setReadingStatus(workId, status, { title: book.title, coverId: book.coverId });
    },
    [book, workId, setReadingStatus],
  );

  const handleRating = useCallback(
    (rating: number) => {
      if (!book) return;
      // Toggle off if same rating
      const newRating = entry?.rating === rating ? null : rating;
      setRating(workId, newRating, { title: book.title, coverId: book.coverId });
    },
    [book, workId, entry, setRating],
  );

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.terracotta} />
        <Text style={styles.loadingText}>Loading book…</Text>
      </View>
    );
  }

  // ─── Error ──────────────────────────────────────────────────────────────────
  if (error || !book) {
    return (
      <View style={styles.center}>
        <AlertCircle size={48} color={Colors.error} style={{ marginBottom: Spacing.md }} />
        <Text style={styles.errorTitle}>Couldn't load this book</Text>
        <Text style={styles.errorBody}>{error ?? 'Unknown error'}</Text>
        <Button label="Try Again" onPress={retry} variant="secondary" />
      </View>
    );
  }

  const coverUrl = getCoverUrl(book.coverId, 'L');
  const authorText = book.authors.length > 0 ? book.authors.join(', ') : 'Unknown Author';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero area */}
      <View style={styles.hero}>
        {/* Cover */}
        <View style={styles.coverShadow}>
          {coverUrl ? (
            <Image
              source={{ uri: coverUrl }}
              style={[styles.cover, { width: COVER_WIDTH, height: COVER_HEIGHT }]}
              resizeMode="cover"
              accessibilityLabel={`Cover of ${book.title}`}
            />
          ) : (
            <View style={[styles.coverPlaceholder, { width: COVER_WIDTH, height: COVER_HEIGHT }]}>
              <Text style={styles.placeholderInitial}>
                {book.title.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Favorite button */}
        <Pressable
          onPress={handleToggleFavorite}
          style={({ pressed }) => [
            styles.favBtn,
            fav && styles.favBtnActive,
            pressed && styles.favBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={fav ? 'Remove from favourites' : 'Add to favourites'}
          accessibilityState={{ checked: fav }}
        >
          <Heart
            size={18}
            color={fav ? Colors.terracotta : Colors.inkSubtle}
            fill={fav ? Colors.terracotta : 'transparent'}
          />
          <Text style={[styles.favLabel, fav && styles.favLabelActive]}>
            {fav ? 'Favourited' : 'Add to Favourites'}
          </Text>
        </Pressable>
      </View>

      {/* Book info */}
      <View style={styles.infoSection}>
        <Text style={styles.title} accessibilityRole="header">
          {book.title}
        </Text>
        <Text style={styles.author}>{authorText}</Text>
        {book.firstPublishYear && (
          <Text style={styles.year}>First published {formatYear(book.firstPublishYear)}</Text>
        )}
      </View>

      {/* Reading Status */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Reading Status</Text>
        <ReadingStatusPicker
          current={entry?.readingStatus ?? null}
          onChange={handleStatusChange}
        />
      </View>

      {/* Rating */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Your Rating</Text>
        <StarRating
          rating={entry?.rating ?? null}
          onRate={handleRating}
          size={32}
        />
        {entry?.rating !== null && entry?.rating !== undefined && (
          <Text style={styles.ratingHint}>
            Tap your current rating to clear it.
          </Text>
        )}
      </View>

      {/* Description */}
      {book.description && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About this Book</Text>
          <Text style={styles.description}>{book.description}</Text>
        </View>
      )}

      {/* Subjects */}
      {book.subjects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Subjects</Text>
          <View style={styles.tagRow}>
            {book.subjects.slice(0, 8).map((s, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xxl,
  },
  center: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  // Hero
  hero: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceWarm,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  coverShadow: {
    ...Shadows.modal,
    borderRadius: Radii.md,
    marginBottom: Spacing.lg,
  },
  cover: {
    borderRadius: Radii.md,
  },
  coverPlaceholder: {
    borderRadius: Radii.md,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderInitial: {
    fontSize: 64,
    fontWeight: '700',
    color: Colors.terracotta,
    opacity: 0.6,
  },
  // Favorite
  favBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radii.round,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    minHeight: 44,
  },
  favBtnActive: {
    backgroundColor: Colors.highlight,
    borderColor: Colors.terracotta,
  },
  favBtnPressed: {
    opacity: 0.7,
  },
  favIcon: {
    fontSize: 18,
    color: Colors.inkSubtle,
  },
  favIconActive: {
    color: Colors.terracotta,
  },
  favLabel: {
    ...Typography.label,
    color: Colors.inkMuted,
  },
  favLabelActive: {
    color: Colors.terracotta,
  },
  // Info
  infoSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.ink,
    fontFamily: 'serif',
    marginBottom: Spacing.xs,
    lineHeight: 32,
  },
  author: {
    ...Typography.body,
    color: Colors.inkMuted,
    marginBottom: Spacing.xs,
  },
  year: {
    ...Typography.small,
    color: Colors.inkSubtle,
  },
  // Sections
  section: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionLabel: {
    ...Typography.label,
    color: Colors.olive,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    color: Colors.ink,
    lineHeight: 24,
  },
  ratingHint: {
    ...Typography.tiny,
    color: Colors.inkSubtle,
    marginTop: Spacing.sm,
  },
  // Tags
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.surfaceWarm,
    borderRadius: Radii.round,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    ...Typography.small,
    color: Colors.inkMuted,
  },
  spacer: { height: Spacing.xl },
  // Loading / error
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
