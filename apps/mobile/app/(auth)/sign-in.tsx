import { type Href, useRouter } from 'expo-router';
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
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/services/supabase';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <View style={styles.content}>
          <Text variant="title" style={styles.title}>
            Sign in
          </Text>
          <Input
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="Email"
            value={email}
            onChangeText={(t) => setEmail(t)}
            containerStyle={styles.input}
          />
          <Input
            autoComplete="password"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(t) => setPassword(t)}
            containerStyle={styles.input}
          />
          {error ? (
            <Text style={[styles.error, { color: colors.destructive }]}>
              {error}
            </Text>
          ) : null}
          <Button
            fullWidth
            loading={loading}
            onPress={handleSignIn}
            size="lg"
            style={styles.button}
          >
            Sign in
          </Button>
          <Pressable
            onPress={() => router.push('/(auth)/sign-up' as Href)}
            style={styles.linkWrap}
          >
            <Text style={{ color: colors.primary }}>
              Don&apos;t have an account? Create one
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
  title: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  error: {
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    marginTop: 8,
    marginBottom: 24,
  },
  linkWrap: {
    alignSelf: 'center',
  },
});
