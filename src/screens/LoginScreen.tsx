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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  function validate(): boolean {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Enter a valid email address.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    }

    return valid;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      // Navigation handled by auth state in root navigator
    } catch (e: unknown) {
      console.error('Login error:', e);
      const msg = e instanceof Error ? e.message : String(e);
      Alert.alert('Sign In Failed', formatFirebaseError(msg));
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
        {/* Editorial header */}
        <View style={styles.header}>
          <Text style={styles.wordmark}>folio.</Text>
          <Text style={styles.tagline}>Your personal reading archive</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Sign in</Text>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            textContentType="emailAddress"
            autoComplete="email"
            accessibilityLabel="Email address"
            testID="login-email"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            textContentType="password"
            autoComplete="password"
            accessibilityLabel="Password"
            testID="login-password"
          />

          <Button
            label="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.submitBtn}
            accessibilityHint="Sign in to your account"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Button
            label="Create an account"
            onPress={() => navigation.navigate('Register')}
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
    return 'Email/Password sign-in is disabled in Firebase Console. Please enable it in Authentication > Sign-in method.';
  }
  if (msg.includes('user-not-found') || msg.includes('invalid-credential') || msg.includes('wrong-password')) {
    return 'Incorrect email or password.';
  }
  if (msg.includes('too-many-requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
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
    marginBottom: Spacing.xxl,
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
