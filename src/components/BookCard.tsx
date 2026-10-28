import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
  AccessibilityProps,
} from 'react-native';
import { Colors, Typography, Radii, Spacing, Shadows } from '../theme';
import { getCoverUrl } from '../utils';

interface BookCardProps {
  workId: string;
  title: string;
  authors: string[];
  coverId: number | null;
  firstPublishYear: number | null;
  isFavorite?: boolean;
  onPress: () => void;
  cardWidth?: number;
}

export function BookCard({
  workId,
  title,
  authors,
  coverId,
  firstPublishYear,
  isFavorite = false,
  onPress,
  cardWidth = 150,
}: BookCardProps) {
  const coverUrl = getCoverUrl(coverId, 'M');
  const authorText = authors.length > 0 ? authors.join(', ') : 'Unknown Author';
  const accessLabel = `${title} by ${authorText}${firstPublishYear ? `, ${firstPublishYear}` : ''}${isFavorite ? ', favorited' : ''}`;

  const coverHeight = Math.round(cardWidth * 1.5);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { width: cardWidth, opacity: pressed ? 0.85 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessLabel}
      accessibilityHint="Opens book details"
    >
      {/* Cover */}
      <View style={[styles.coverContainer, { height: coverHeight, width: cardWidth }]}>
        {coverUrl ? (
          <Image
            source={{ uri: coverUrl }}
            style={styles.cover}
            resizeMode="cover"
            accessibilityLabel={`Cover of ${title}`}
          />
        ) : (
          <CoverPlaceholder title={title} width={cardWidth} height={coverHeight} />
        )}

        {/* Favorite badge */}
        {isFavorite && (
          <View style={styles.favBadge} accessibilityLabel="Favorited">
            <Text style={styles.favIcon} accessibilityElementsHidden>
              ♥
            </Text>
          </View>
        )}
      </View>

      {/* Meta */}
      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={2} accessibilityElementsHidden>
          {title}
        </Text>
        <Text style={styles.author} numberOfLines={1} accessibilityElementsHidden>
          {authorText}
        </Text>
        {firstPublishYear && (
          <Text style={styles.year} accessibilityElementsHidden>
            {firstPublishYear}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────

function CoverPlaceholder({
  title,
  width,
  height,
}: {
  title: string;
  width: number;
  height: number;
}) {
  // Use first character of title for the placeholder aesthetic
  const initial = title?.charAt(0)?.toUpperCase() ?? '?';
  return (
    <View style={[styles.placeholder, { width, height }]}>
      <Text style={styles.placeholderInitial}>{initial}</Text>
      <Text style={styles.placeholderText} numberOfLines={3}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radii.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
    overflow: 'hidden',
  },
  coverContainer: {
    borderRadius: Radii.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.surfaceWarm,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  favBadge: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: Colors.terracotta,
    borderRadius: Radii.round,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: {
    color: Colors.surface,
    fontSize: 13,
  },
  meta: {
    padding: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  title: {
    ...Typography.small,
    fontWeight: '600',
    color: Colors.ink,
    marginBottom: 2,
  },
  author: {
    ...Typography.tiny,
    color: Colors.inkMuted,
    marginBottom: 1,
  },
  year: {
    ...Typography.tiny,
    color: Colors.inkSubtle,
  },
  placeholder: {
    backgroundColor: Colors.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
  placeholderInitial: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.terracotta,
    opacity: 0.6,
    lineHeight: 56,
  },
  placeholderText: {
    ...Typography.tiny,
    color: Colors.inkMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
