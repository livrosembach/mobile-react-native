import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, Radii } from '../theme';
import { ReadingStatus } from '../types/book';
import { READING_STATUS_LABELS } from '../utils';

const STATUSES: ReadingStatus[] = ['want_to_read', 'reading', 'read'];

interface ReadingStatusPickerProps {
  current: ReadingStatus | null;
  onChange: (status: ReadingStatus) => void;
}

export function ReadingStatusPicker({ current, onChange }: ReadingStatusPickerProps) {
  return (
    <View
      style={styles.row}
      accessibilityRole="radiogroup"
      accessibilityLabel="Reading status"
    >
      {STATUSES.map((status) => {
        const selected = current === status;
        return (
          <Pressable
            key={status}
            onPress={() => onChange(status)}
            style={({ pressed }) => [
              styles.chip,
              selected && styles.chipSelected,
              pressed && !selected && styles.chipPressed,
            ]}
            accessibilityRole="radio"
            accessibilityLabel={READING_STATUS_LABELS[status]}
            accessibilityState={{ checked: selected }}
          >
            <Text
              style={[styles.chipText, selected && styles.chipTextSelected]}
              numberOfLines={1}
            >
              {READING_STATUS_LABELS[status]}
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
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.round,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: Colors.terracotta,
    borderColor: Colors.terracotta,
  },
  chipPressed: {
    backgroundColor: Colors.highlight,
  },
  chipText: {
    ...Typography.small,
    color: Colors.inkMuted,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: Colors.surface,
    fontWeight: '600',
  },
});
