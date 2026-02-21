import type { Event } from '@sprout/core';
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
import { useEvents } from '@/hooks/queries/use-events';
import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';
import { useTheme } from '@/hooks/use-theme';
import { formatTimeHuman } from '@/utils/date';

const QUICK_ACTIONS = [
  { id: 'feed', label: 'Feed', icon: 'drop.fill', color: '#3B82F6' },
  { id: 'sleep', label: 'Sleep', icon: 'moon.fill', color: '#6366F1' },
  { id: 'diaper', label: 'Diaper', icon: 'plus.circle.fill', color: '#10B981' },
  { id: 'growth', label: 'Growth', icon: 'chart.bar.fill', color: '#F59E0B' },
  { id: 'meds', label: 'Meds', icon: 'pills.fill', color: '#EF4444' },
  { id: 'activity', label: 'Activity', icon: 'figure.child', color: '#EC4899' },
] as const;

const EVENT_CONFIG: Record<
  string,
  { icon: string; color: string; label: string }
> = {
  activity: { icon: 'figure.child', color: '#EC4899', label: 'Activity' },
  diaper: { icon: 'plus.circle.fill', color: '#10B981', label: 'Diaper' },
  growth: { icon: 'chart.bar.fill', color: '#F59E0B', label: 'Growth' },
  meal: { icon: 'drop.fill', color: '#3B82F6', label: 'Feeding' },
  meds: { icon: 'pills.fill', color: '#EF4444', label: 'Medication' },
  message: { icon: 'paperplane.fill', color: '#8B5CF6', label: 'Message' },
  nap: { icon: 'moon.fill', color: '#6366F1', label: 'Sleep' },
  note: { icon: 'square.and.pencil', color: '#6B7280', label: 'Note' },
};

function TimelineItem({ event, isLast }: { event: Event; isLast: boolean }) {
  const { colors } = useTheme();
  const config = EVENT_CONFIG[event.type] ?? EVENT_CONFIG.note!;
  const date = new Date(event.created_at);
  const timeStr = formatTimeHuman(date);

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLineContainer}>
        <View style={[styles.timelineIcon, { backgroundColor: config.color }]}>
          <IconSymbol name={config.icon as any} size={16} color="white" />
        </View>
        {!isLast && (
          <View
            style={[styles.timelineLine, { backgroundColor: colors.border }]}
          />
        )}
      </View>
      <View style={styles.timelineContent}>
        <View style={styles.timelineHeader}>
          <Text variant="subtitle" style={styles.timelineTitle}>
            {config.label}
          </Text>
          <Text variant="muted" style={styles.timelineTime}>
            {timeStr}
          </Text>
        </View>
        <Text
          variant="muted"
          numberOfLines={2}
          style={styles.timelineDescription}
        >
          {renderEventDescription(event)}
        </Text>
      </View>
    </View>
  );
}

function renderEventDescription(event: Event) {
  const payload = event.payload as any;
  const notes = payload.notes || payload.note || payload.text;

  switch (event.type) {
    case 'meal':
      const mealParts = [];
      if (payload.amount)
        mealParts.push(`${payload.amount}${payload.unit || ''}`);
      if (payload.food_type) mealParts.push(payload.food_type);
      return mealParts.length > 0
        ? `Fed ${mealParts.join(' of ')}`
        : 'Feeding session';
    case 'diaper':
      return `${payload.status || 'Changed'}${notes ? `: ${notes}` : ''}`;
    case 'nap':
      return payload.duration ? `Slept for ${payload.duration}` : 'Nap session';
    case 'growth':
      return `Measured ${payload.value}${payload.unit || ''}`;
    case 'meds':
      return `Gave ${payload.name || 'medication'}${payload.dosage ? ` (${payload.dosage})` : ''}`;
    default:
      return notes || 'Logged activity';
  }
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { selectedChild, isLoading: isSelectionLoading } = useChildSelection();
  const {
    data: children = [],
    isLoading: isChildrenLoading,
    error: childrenError,
    refetch: refetchChildren,
    isRefetching: isRefetchingChildren,
  } = useChildren();

  const {
    data: events = [],
    error: eventsError,
    refetch: refetchEvents,
    isRefetching: isRefetchingEvents,
  } = useEvents(selectedChild?.id || null);

  useRefreshOnFocus();

  const isLoading = isSelectionLoading || isChildrenLoading;
  const isRefetching = isRefetchingChildren || isRefetchingEvents;
  const error = childrenError || eventsError;

  const handleRefresh = async () => {
    await Promise.all([refetchChildren(), refetchEvents()]);
  };

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
          <Button onPress={handleRefresh} style={{ marginTop: 16 }}>
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
      <ChildSelector />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
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
            {events.length > 0 && (
              <View style={styles.section}>
                {(() => {
                  const latestEvent = events[0]!;
                  const config =
                    EVENT_CONFIG[latestEvent.type] ?? EVENT_CONFIG.note!;
                  return (
                    <Card
                      style={[
                        styles.statusCard,
                        { backgroundColor: colors.card },
                      ]}
                    >
                      <View style={styles.statusHeader}>
                        <Text variant="muted" style={styles.statusLabel}>
                          Latest Activity
                        </Text>
                        <Text variant="muted" style={styles.statusTime}>
                          {formatTimeHuman(new Date(latestEvent.created_at))}
                        </Text>
                      </View>
                      <View style={styles.statusContent}>
                        <View
                          style={[
                            styles.statusIcon,
                            { backgroundColor: config.color + '20' },
                          ]}
                        >
                          <IconSymbol
                            name={(config.icon || 'info.circle.fill') as any}
                            size={20}
                            color={config.color}
                          />
                        </View>
                        <View style={styles.statusInfo}>
                          <Text
                            variant="bodySemibold"
                            style={styles.statusTitle}
                          >
                            {config.label || 'Activity'}
                          </Text>
                          <Text variant="muted" numberOfLines={1}>
                            {renderEventDescription(latestEvent)}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  );
                })()}
              </View>
            )}

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
                      router.push(`/events/${action.id}` as Href);
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
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => router.push('/timeline' as Href)}
                >
                  View all
                </Button>
              </View>

              {events.length === 0 ? (
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
              ) : (
                <View style={styles.timelineList}>
                  {events.slice(0, 5).map((event, index) => (
                    <TimelineItem
                      key={event.id}
                      event={event}
                      isLast={index === Math.min(events.length, 5) - 1}
                    />
                  ))}
                </View>
              )}
            </View>

            <View style={styles.footer}>
              <Button
                variant="outline"
                size="sm"
                onPress={() => router.push('/add-child' as Href)}
                style={{ flex: 1, gap: 8 }}
              >
                <IconSymbol name="plus" size={16} color={colors.foreground} />
                <Text variant="bodySemibold">Add Another Child</Text>
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
  statusCard: {
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
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
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
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
    fontWeight: '600',
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
  timelineList: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineLineContainer: {
    alignItems: 'center',
    width: 32,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    marginTop: -4,
    marginBottom: -4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  timelineTime: {
    fontSize: 12,
  },
  timelineDescription: {
    fontSize: 14,
    lineHeight: 20,
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
