import { type Href, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/services/supabase';

type ChildRow = {
  id: string;
  name: string;
  birthdate: string;
  created_by: string;
};

export default function HomeScreen() {
  const [children, setChildren] = useState<ChildRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const router = useRouter();

  const fetchChildren = useCallback(async () => {
    setError(null);
    const { data, error: fetchError } = await (
      supabase as unknown as {
        from: (table: string) => {
          select: (cols: string) => Promise<{
            data: ChildRow[] | null;
            error: { message: string } | null;
          }>;
        };
      }
    )
      .from('children')
      .select('*');

    setIsLoading(false);
    if (fetchError) {
      setError(fetchError.message);
      return;
    }
    setChildren(data ?? []);
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  const handlePressChild = useCallback(
    (child: ChildRow) => {
      router.push({
        pathname: '/(tabs)/child/[id]',
        params: { id: child.id },
      } as Href);
    },
    [router],
  );

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

  if (error) {
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
            {error}
          </Text>
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
        <Text variant="title">My children</Text>
      </View>
      {children.length === 0 ? (
        <View style={[styles.empty, { borderColor: colors.border }]}>
          <Text
            variant="subtitle"
            style={{ color: colors.mutedForeground, textAlign: 'center' }}
          >
            No children yet
          </Text>
          <Text
            variant="muted"
            style={[styles.emptyHint, { color: colors.mutedForeground }]}
          >
            Children you add or are linked to will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={children}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.row,
                { backgroundColor: colors.card, borderColor: colors.border },
                pressed && styles.rowPressed,
              ]}
              onPress={() => handlePressChild(item)}
            >
              <View style={styles.rowContent}>
                <View
                  style={[styles.avatar, { backgroundColor: colors.muted }]}
                />
                <View style={styles.rowText}>
                  <Text
                    variant="bodySemibold"
                    style={{ color: colors.foreground }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    variant="muted"
                    style={{ color: colors.mutedForeground }}
                  >
                    {item.birthdate}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  row: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  rowPressed: {
    opacity: 0.8,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  empty: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyHint: {
    marginTop: 8,
    textAlign: 'center',
  },
});
