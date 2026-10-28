import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Typography, Spacing, Radii } from '../theme';

interface StarRatingProps {
  rating: number | null;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

export function StarRating({
  rating,
  onRate,
  readonly = false,
  size = 28,
}: StarRatingProps) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="Personal rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating !== null && star <= rating;
        return (
          <Pressable
            key={star}
            onPress={() => !readonly && onRate?.(star)}
            disabled={readonly}
            style={({ pressed }) => [
              styles.star,
              !readonly && pressed && styles.starPressed,
            ]}
            accessibilityRole="radio"
            accessibilityLabel={`${star} star${star > 1 ? 's' : ''}`}
            accessibilityState={{ checked: filled }}
            accessibilityHint={readonly ? undefined : `Rate this book ${star} star${star > 1 ? 's' : ''}`}
          >
            <Text style={[styles.starIcon, { fontSize: size }, filled ? styles.filled : styles.empty]}>
              {filled ? '★' : '☆'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    padding: Spacing.xs,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starPressed: {
    opacity: 0.6,
  },
  starIcon: {
    lineHeight: 32,
  },
  filled: {
    color: Colors.star,
  },
  empty: {
    color: Colors.starEmpty,
  },
});
