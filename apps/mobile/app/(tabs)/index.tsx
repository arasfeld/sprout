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

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
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
    setIsLoading(true);

    // RLS on `child_memberships` table automatically filters to the current user.
    // Then we select the nested child data from that relationship.
    const { data: memberships, error: fetchError } = await supabase
      .from('child_memberships')
      .select('children(*)');

    setIsLoading(false);
    if (fetchError) {
      setError(fetchError.message);
      return;
    }

    // The query returns membership objects, each with a 'children' property.
    // We extract the 'children' object from each and filter out any nulls.
    const childrenData = (memberships ?? [])
      .map((membership) => membership.children)
      .filter((child): child is ChildRow => child !== null);

    setChildren(childrenData);
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
            <Item asChild variant="outline">
              <Pressable
                style={({ pressed }) => [pressed && styles.rowPressed]}
                onPress={() => handlePressChild(item)}
              >
                <ItemMedia>
                  <View
                    style={[styles.avatar, { backgroundColor: colors.muted }]}
                  />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{item.name}</ItemTitle>
                  <ItemDescription>{item.birthdate}</ItemDescription>
                </ItemContent>
              </Pressable>
            </Item>
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
  rowPressed: {
    opacity: 0.8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
