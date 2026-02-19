import type { Child } from '@sprout/core';
import { type Href, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Text } from '@/components/ui/text';
import { useChildren } from '@/hooks/queries/use-children';
import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  useRefreshOnFocus();

  const {
    data: children = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useChildren();

  const handlePressChild = useCallback(
    (child: Child) => {
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
            {(error as Error).message}
          </Text>
          <Button onPress={() => refetch()} style={{ marginTop: 16 }}>
            Try again
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
        <View style={styles.headerRow}>
          <Text variant="title">My children</Text>
          <Button
            variant="default"
            size="sm"
            onPress={() => router.push('/(tabs)/add-child' as Href)}
          >
            Add child
          </Button>
        </View>
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
          <Button
            variant="ghost"
            size="sm"
            onPress={() => refetch()}
            style={{ marginTop: 16 }}
          >
            Refresh
          </Button>
        </View>
      ) : (
        <FlatList
          data={children}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
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
