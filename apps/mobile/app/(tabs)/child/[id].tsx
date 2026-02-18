import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { FieldContent, FieldLegend, FieldSet } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/services/supabase';

type ChildRow = {
  id: string;
  name: string;
  birthdate: string;
  created_by: string;
};

export default function ChildDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [child, setChild] = useState<ChildRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const router = useRouter();

  const fetchChild = useCallback(async () => {
    if (!id) return;
    setError(null);
    const { data, error: fetchError } = await (
      supabase as unknown as {
        from: (table: string) => {
          select: (cols: string) => {
            eq: (
              col: string,
              val: string,
            ) => {
              single: () => Promise<{
                data: ChildRow | null;
                error: { message: string } | null;
              }>;
            };
          };
        };
      }
    )
      .from('children')
      .select('*')
      .eq('id', id)
      .single();

    setIsLoading(false);
    if (fetchError) {
      setError(fetchError.message);
      return;
    }
    setChild(data);
  }, [id]);

  useEffect(() => {
    fetchChild();
  }, [fetchChild]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !child) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.centered}>
          <Text
            variant="subtitle"
            style={{ color: colors.destructive, textAlign: 'center' }}
          >
            {error ?? 'Child not found'}
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
      <View style={styles.header}>
        <Button variant="ghost" size="sm" onPress={handleBack}>
          Back
        </Button>
      </View>
      <View style={styles.content}>
        <Text variant="title" style={{ color: colors.foreground }}>
          {child.name}
        </Text>
        <Text
          variant="muted"
          style={[styles.birthdate, { color: colors.mutedForeground }]}
        >
          Birth date: {child.birthdate}
        </Text>
        <Separator style={styles.sectionSeparator} />
        <FieldSet>
          <FieldLegend>Timeline</FieldLegend>
          <FieldContent>
            <Text
              variant="muted"
              style={[
                styles.timelinePlaceholder,
                { color: colors.mutedForeground },
              ]}
            >
              Events will appear here.
            </Text>
          </FieldContent>
        </FieldSet>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginTop: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  birthdate: {
    marginTop: 4,
  },
  sectionSeparator: {
    marginVertical: 20,
  },
  timelinePlaceholder: {
    marginTop: 8,
  },
});
