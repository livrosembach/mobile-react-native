import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TextInputProps,
} from 'react-native';
import { Colors, Typography, Radii, Spacing } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...rest }: InputProps) {
  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={styles.label} nativeID={`label-${rest.testID}`}>
          {label}
        </Text>
      )}
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={Colors.inkSubtle}
        {...rest}
      />
      {error && (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.label,
    color: Colors.inkMuted,
    marginBottom: Spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    color: Colors.ink,
    ...Typography.body,
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    ...Typography.small,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});
