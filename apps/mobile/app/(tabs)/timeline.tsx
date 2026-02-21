import { parseISO, format, isSameDay } from 'date-fns';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useChildSelection } from '@/components/child-context';
import { ChildSelector } from '@/components/child-selector';
import {
  CalendarProvider,
  Timeline,
  WeekCalendar,
} from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { useEvents } from '@/hooks/queries/use-events';
import { useTheme } from '@/hooks/use-theme';
import type { Event } from '@sprout/core';

type ViewMode = 'timeline' | 'list' | 'week';

const VIEW_OPTIONS = [
  { label: 'Timeline', value: 'timeline' },
  { label: 'List', value: 'list' },
  { label: 'Week', value: 'week' },
];

function getEventTime(event: Event): Date {
  const startTime = (event.payload as any)?.startTime;
  if (startTime) {
    return parseISO(startTime);
  }
  return parseISO(event.created_at);
}

function getEventEndTime(event: Event, startDate: Date): Date {
  const endTime = (event.payload as any)?.endTime;
  if (endTime) {
    return parseISO(endTime);
  }
  // Default to 20 minutes if no end time to reduce horizontal squeezing
  return new Date(startDate.getTime() + 20 * 60000);
}

export default function TimelineScreen() {
  const { colors, mode } = useTheme();
  const { selectedChild, isLoading: isSelectionLoading } = useChildSelection();
  const { data: events = [], isLoading: isEventsLoading } = useEvents(
    selectedChild?.id ?? null,
  );

  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd'),
  );

  const isLoading = isSelectionLoading || isEventsLoading;

  const handleViewChange = (index: number) => {
    const option = VIEW_OPTIONS[index];
    if (option) {
      setViewMode(option.value as ViewMode);
    }
  };

  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) => getEventTime(b).getTime() - getEventTime(a).getTime(),
    );
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (viewMode === 'list') return sortedEvents;
    const selected = parseISO(selectedDate);
    return sortedEvents.filter((event) =>
      isSameDay(getEventTime(event), selected),
    );
  }, [sortedEvents, viewMode, selectedDate]);

  // Transform events for react-native-calendars Timeline
  const timelineEvents = useMemo(() => {
    return filteredEvents.map((event) => {
      const start = getEventTime(event);
      const end = getEventEndTime(event, start);

      return {
        id: event.id,
        start: format(start, 'yyyy-MM-dd HH:mm:ss'),
        end: format(end, 'yyyy-MM-dd HH:mm:ss'),
        title: event.type.charAt(0).toUpperCase() + event.type.slice(1),
        summary:
          (event.payload as any)?.notes || (event.payload as any)?.note || '',
        color: getEventColor(event.type),
      };
    });
  }, [filteredEvents]);

  const isToday = useMemo(
    () => isSameDay(parseISO(selectedDate), new Date()),
    [selectedDate],
  );

  const initialTime = useMemo(() => {
    if (!isToday) return undefined;
    const now = new Date();
    return { hour: now.getHours(), minutes: now.getMinutes() };
  }, [isToday]);

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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <ChildSelector />
          <Pressable
            onPress={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
            style={({ pressed }) => [
              styles.todayButton,
              { borderColor: colors.border },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text variant="bodySemibold" style={{ color: colors.primary }}>
              Today
            </Text>
          </Pressable>
        </View>
        <View style={styles.segmentedWrapper}>
          <SegmentedControl
            options={VIEW_OPTIONS}
            selectedIndex={VIEW_OPTIONS.findIndex((o) => o.value === viewMode)}
            onValueChange={handleViewChange}
          />
        </View>
      </View>

      <CalendarProvider date={selectedDate} onDateChanged={setSelectedDate}>
        {viewMode === 'timeline' && (
          <View style={{ flex: 1 }}>
            <WeekCalendar />
            <Timeline
              key={`timeline-${mode}-${selectedDate}`}
              date={selectedDate}
              events={timelineEvents}
              start={0}
              end={24}
              format24h={false}
              initialTime={initialTime}
              scrollToFirst={!isToday}
              overlapEventsSpacing={8}
              rightEdgeSpacing={24}
            />
          </View>
        )}
        {viewMode === 'week' && (
          <View style={{ flex: 1 }}>
            <WeekCalendar />
            <FlatList
              data={filteredEvents}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => <EventItem event={item} />}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text variant="muted">No events for this day</Text>
                </View>
              }
            />
          </View>
        )}
        {viewMode === 'list' && (
          <FlatList
            data={sortedEvents}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => <EventItem event={item} showDate />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text variant="muted">No events recorded yet</Text>
              </View>
            }
          />
        )}
      </CalendarProvider>
    </SafeAreaView>
  );
}

function EventItem({
  event,
  showDate = false,
}: {
  event: Event;
  showDate?: boolean;
}) {
  const date = getEventTime(event);

  return (
    <Card style={styles.eventCard}>
      <View
        style={[
          styles.eventIcon,
          { backgroundColor: getEventColor(event.type) + '20' },
        ]}
      >
        <IconSymbol
          name={getEventIcon(event.type) as any}
          size={20}
          color={getEventColor(event.type)}
        />
      </View>
      <View style={styles.eventInfo}>
        <View style={styles.eventHeader}>
          <Text variant="bodySemibold">
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </Text>
          <Text variant="muted" style={styles.eventTime}>
            {showDate ? format(date, 'MMM d, h:mm a') : format(date, 'h:mm a')}
          </Text>
        </View>
        {((event.payload as any)?.notes || (event.payload as any)?.note) && (
          <Text variant="muted" numberOfLines={2} style={styles.eventNote}>
            {(event.payload as any).notes || (event.payload as any).note}
          </Text>
        )}
      </View>
    </Card>
  );
}

function getEventColor(type: string): string {
  switch (type) {
    case 'meal':
      return '#3B82F6';
    case 'nap':
      return '#6366F1';
    case 'diaper':
      return '#10B981';
    case 'growth':
      return '#F59E0B';
    case 'meds':
      return '#EF4444';
    case 'activity':
      return '#EC4899';
    default:
      return '#6B7280';
  }
}

function getEventIcon(type: string): string {
  switch (type) {
    case 'meal':
      return 'drop.fill';
    case 'nap':
      return 'moon.fill';
    case 'diaper':
      return 'plus.circle.fill';
    case 'growth':
      return 'chart.bar.fill';
    case 'meds':
      return 'pills.fill';
    case 'activity':
      return 'figure.child';
    default:
      return 'info.circle.fill';
  }
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
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  segmentedWrapper: {
    paddingHorizontal: 16,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  eventCard: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 12,
  },
  eventNote: {
    fontSize: 13,
    marginTop: 2,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
});
