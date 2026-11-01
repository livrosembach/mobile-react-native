import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Colors, Typography, Spacing, Radii } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};

    if (!email.trim()) {
      next.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      next.email = 'Enter a valid email address.';
    }

    if (!password) {
      next.password = 'Password is required.';
    } else if (password.length < 6) {
      next.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      next.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      next.confirmPassword = 'Passwords do not match.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(email.trim(), password);
      // Auth state change will navigate to main app
    } catch (e: unknown) {
      console.error('Registration error:', e);
      const msg = e instanceof Error ? e.message : String(e);
      Alert.alert('Registration Failed', formatFirebaseError(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: Math.max(insets.top + Spacing.xl, Spacing.xxl + Spacing.lg) },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.wordmark}>folio.</Text>
          <Text style={styles.tagline}>Create your reading archive</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Create account</Text>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            textContentType="emailAddress"
            autoComplete="email"
            accessibilityLabel="Email address"
            testID="register-email"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            returnKeyType="next"
            textContentType="newPassword"
            autoComplete="password-new"
            accessibilityLabel="Password"
            testID="register-password"
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleRegister}
            textContentType="newPassword"
            accessibilityLabel="Confirm password"
            testID="register-confirm-password"
          />

          <Button
            label="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.submitBtn}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Button
            label="Sign in"
            onPress={() => navigation.goBack()}
            variant="ghost"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function formatFirebaseError(msg: string): string {
  if (msg.includes('configuration-not-found')) {
    return 'Authentication is not yet enabled in your Firebase Console. Go to Build > Authentication, click "Get Started", and enable the "Email/Password" sign-in method.';
  }
  if (msg.includes('operation-not-allowed')) {
    return 'Email/Password sign-in is disabled. In Firebase Console, go to Authentication > Sign-in method and enable Email/Password.';
  }
  if (msg.includes('email-already-in-use')) {
    return 'This email is already registered. Try signing in instead.';
  }
  if (msg.includes('weak-password')) {
    return 'Please choose a stronger password (at least 6 characters).';
  }
  if (msg.includes('invalid-api-key') || msg.includes('api-key-not-valid')) {
    return 'Invalid Firebase API key. Please check your .env configuration.';
  }
  if (msg.includes('network-request-failed')) {
    return 'Network error. Please verify your internet connection.';
  }
  return msg.replace(/^Firebase:\s*/, '') || 'An error occurred. Please try again.';
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl + Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  wordmark: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.terracotta,
    fontFamily: 'serif',
    letterSpacing: -1,
    marginBottom: Spacing.xs,
  },
  tagline: {
    ...Typography.body,
    color: Colors.inkMuted,
    textAlign: 'center',
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  formTitle: {
    ...Typography.h2,
    color: Colors.ink,
    marginBottom: Spacing.lg,
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    ...Typography.body,
    color: Colors.inkMuted,
    marginBottom: Spacing.xs,
  },
});
