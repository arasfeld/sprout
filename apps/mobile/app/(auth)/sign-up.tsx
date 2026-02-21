import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/services/supabase';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();

  const handleSignUp = async () => {
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace('/(tabs)');
  };

  const passwordMismatch = password !== confirmPassword;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text variant="title" style={styles.title}>
              Create account
            </Text>
            <Pressable onPress={() => router.back()} style={styles.closeButton}>
              <IconSymbol
                name="xmark"
                size={24}
                color={colors.mutedForeground}
              />
            </Pressable>
          </View>
          <FieldSet>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="Email"
                  value={email}
                  onChangeText={(t) => setEmail(t)}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <FieldContent>
                <Input
                  autoComplete="new-password"
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={(t) => setPassword(t)}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Confirm password</FieldLabel>
              <FieldContent>
                <Input
                  autoComplete="new-password"
                  invalid={passwordMismatch}
                  placeholder="Confirm password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={(t) => setConfirmPassword(t)}
                />
              </FieldContent>
            </Field>
            <FieldError errors={error ? [{ message: error }] : []} />
            <Button
              fullWidth
              loading={loading}
              onPress={handleSignUp}
              size="lg"
              style={styles.button}
            >
              Create account
            </Button>
          </FieldSet>
          <Pressable onPress={() => router.back()} style={styles.linkWrap}>
            <Text style={{ color: colors.primary }}>
              Already have an account? Sign in
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  keyboard: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginBottom: 0,
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
  },
  button: {
    marginTop: 8,
    marginBottom: 24,
  },
  linkWrap: {
    alignSelf: 'center',
  },
});
