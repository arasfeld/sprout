import { type Href, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useChildSelection } from '@/components/child-context';
import { ChildSelector } from '@/components/child-selector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Text } from '@/components/ui/text';
import { useChildren } from '@/hooks/queries/use-children';
import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';
import { useTheme } from '@/hooks/use-theme';

const QUICK_ACTIONS = [
  { id: 'feed', label: 'Feed', icon: 'drop.fill', color: '#3B82F6' },
  { id: 'sleep', label: 'Sleep', icon: 'moon.fill', color: '#6366F1' },
  { id: 'diaper', label: 'Diaper', icon: 'plus.circle.fill', color: '#10B981' },
  { id: 'growth', label: 'Growth', icon: 'chart.bar.fill', color: '#F59E0B' },
  { id: 'meds', label: 'Meds', icon: 'pills.fill', color: '#EF4444' },
  { id: 'tummy', label: 'Tummy', icon: 'figure.child', color: '#EC4899' },
] as const;

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { selectedChild, isLoading: isSelectionLoading } = useChildSelection();
  const {
    data: children = [],
    isLoading: isChildrenLoading,
    error,
    refetch,
    isRefetching,
  } = useChildren();

  useRefreshOnFocus();

  const isLoading = isSelectionLoading || isChildrenLoading;

  if (isLoading && !isRefetching) {
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
        <ChildSelector />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
      >
        {children.length === 0 ? (
          <View style={[styles.empty, { borderColor: colors.border }]}>
            <IconSymbol
              name="figure.child"
              size={48}
              color={colors.mutedForeground}
            />
            <Text
              variant="title"
              style={{ marginTop: 16, textAlign: 'center' }}
            >
              Welcome to Sprout
            </Text>
            <Text
              variant="muted"
              style={[styles.emptyHint, { color: colors.mutedForeground }]}
            >
              Add your first child to start tracking their growth and
              activities.
            </Text>
            <Button
              variant="default"
              onPress={() => router.push('/add-child' as Href)}
              style={{ marginTop: 24, width: '100%' }}
            >
              Add child
            </Button>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text variant="subtitle" style={styles.sectionTitle}>
                Quick Actions
              </Text>
              <View style={styles.grid}>
                {QUICK_ACTIONS.map((action) => (
                  <Pressable
                    key={action.id}
                    style={({ pressed }) => [
                      styles.gridItem,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => {
                      // Placeholder for navigation to event entry forms
                      console.log('Action:', action.id);
                    }}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: action.color + '1A' },
                      ]}
                    >
                      <IconSymbol
                        name={action.icon as any}
                        size={28}
                        color={action.color}
                      />
                    </View>
                    <Text variant="muted" style={styles.actionLabel}>
                      {action.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="subtitle" style={styles.sectionTitle}>
                  Timeline
                </Text>
                <Button variant="ghost" size="sm" onPress={() => {}}>
                  View all
                </Button>
              </View>
              <Card style={styles.timelinePlaceholder}>
                <IconSymbol
                  name="clock.fill"
                  size={32}
                  color={colors.mutedForeground}
                />
                <Text
                  variant="muted"
                  style={{ marginTop: 12, textAlign: 'center' }}
                >
                  No activities yet for {selectedChild?.name}.
                </Text>
                <Text
                  variant="muted"
                  style={{ fontSize: 13, textAlign: 'center' }}
                >
                  Use the quick actions above to log an event.
                </Text>
              </Card>
            </View>

            <View style={styles.footer}>
              <Button
                variant="outline"
                size="sm"
                onPress={() => router.push('/add-child' as Href)}
                style={{ flex: 1 }}
              >
                Add another child
              </Button>
            </View>
          </>
        )}
      </ScrollView>
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
    // Clean header
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  gridItem: {
    width: '33.33%',
    padding: 8,
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  timelinePlaceholder: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  empty: {
    flex: 1,
    marginTop: 40,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
  },
  emptyHint: {
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 24,
  },
});
