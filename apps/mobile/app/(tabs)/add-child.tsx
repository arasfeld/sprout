import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/components/auth-context';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useCreateChild } from '@/hooks/mutations/use-create-child';
import { useTheme } from '@/hooks/use-theme';

const BIRTHDATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function parseISODate(s: string): Date | null {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isValidBirthdate(value: string): boolean {
  if (!BIRTHDATE_REGEX.test(value)) return false;
  const d = parseISODate(value);
  if (!d) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d <= today;
}

export default function AddChildScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const { mutateAsync: createChild, isPending: loading } = useCreateChild();
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    birthdate?: string;
  }>({});

  const handleSubmit = useCallback(() => {
    setError(null);
    setFieldErrors({});

    const nameTrimmed = name.trim();
    if (!nameTrimmed) {
      setFieldErrors((e) => ({ ...e, name: 'Name is required' }));
      return;
    }
    if (!birthdate.trim()) {
      setFieldErrors((e) => ({ ...e, birthdate: 'Birth date is required' }));
      return;
    }
    if (!isValidBirthdate(birthdate.trim())) {
      setFieldErrors((e) => ({
        ...e,
        birthdate: 'Use YYYY-MM-DD and a date in the past',
      }));
      return;
    }

    if (!user?.id) {
      setError('You must be signed in to add a child.');
      return;
    }

    // Use mutate (not async) to go back immediately while update happens in background
    createChild(
      { name: nameTrimmed, birthdate: birthdate.trim() },
      {
        onError: (e) => {
          setError(e.message);
        },
      },
    );
    router.back();
  }, [name, birthdate, user?.id, router, createChild]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (!user) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.centered}>
          <Text variant="subtitle" style={{ color: colors.destructive }}>
            You must be signed in to add a child.
          </Text>
          <Button onPress={handleBack} style={styles.backButton}>
            Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <View style={styles.header}>
          <Button variant="ghost" size="sm" onPress={handleBack}>
            Back
          </Button>
        </View>
        <View style={styles.content}>
          <Text variant="title" style={styles.title}>
            Add child
          </Text>
          <Text
            variant="muted"
            style={[styles.subtitle, { color: colors.mutedForeground }]}
          >
            Add a child to your timeline. You can log events and share with
            other caregivers.
          </Text>
          <FieldSet style={styles.form}>
            <Field invalid={Boolean(fieldErrors.name)}>
              <FieldLabel>Name</FieldLabel>
              <FieldContent>
                <Input
                  autoCapitalize="words"
                  autoComplete="name"
                  placeholder="Child's name"
                  value={name}
                  onChangeText={setName}
                  editable={!loading}
                />
                <FieldError
                  errors={
                    fieldErrors.name
                      ? [{ message: fieldErrors.name }]
                      : undefined
                  }
                />
              </FieldContent>
            </Field>
            <Field invalid={Boolean(fieldErrors.birthdate)}>
              <FieldLabel>Birth date</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="YYYY-MM-DD"
                  value={birthdate}
                  onChangeText={setBirthdate}
                  editable={!loading}
                />
                <FieldError
                  errors={
                    fieldErrors.birthdate
                      ? [{ message: fieldErrors.birthdate }]
                      : undefined
                  }
                />
              </FieldContent>
            </Field>
            {error ? (
              <FieldError>
                <Text variant="muted" style={{ color: colors.destructive }}>
                  {error}
                </Text>
              </FieldError>
            ) : null}
            <Button
              onPress={handleSubmit}
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? 'Adding…' : 'Add child'}
            </Button>
          </FieldSet>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
  submitButton: {
    marginTop: 8,
  },
});
