import React from 'react';
import {
  CalendarProvider as RNCCalendarProvider,
  WeekCalendar as RNCWeekCalendar,
  Timeline as RNCTimeline,
  type CalendarContextProviderProps,
  type WeekCalendarProps,
  type TimelineProps,
  Calendar as RNCCalendar,
  type CalendarProps,
} from 'react-native-calendars';
import { useTheme } from '@/hooks/use-theme';

/**
 * Custom hook to get the common calendar theme based on our app's design system.
 */
export function useCalendarTheme() {
  const { colors, typography } = useTheme();

  return {
    calendarBackground: colors.background,
    textSectionTitleColor: colors.mutedForeground,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: colors.primaryForeground,
    todayTextColor: colors.primary,
    dayTextColor: colors.foreground,
    textDisabledColor: colors.mutedForeground,
    dotColor: colors.primary,
    selectedDotColor: colors.primaryForeground,
    arrowColor: colors.primary,
    monthTextColor: colors.foreground,
    indicatorColor: colors.primary,
    // Typography
    textDayFontFamily: typography.fonts.sans,
    textMonthFontFamily: typography.fonts.sans,
    textDayHeaderFontFamily: typography.fonts.sans,
    textDayFontSize: typography.fontSize.md,
    textMonthFontSize: typography.fontSize.lg,
    textDayHeaderFontSize: typography.fontSize.sm,
    textDayFontWeight: typography.fontWeight.medium,
    textMonthFontWeight: typography.fontWeight.semibold,
    textDayHeaderFontWeight: typography.fontWeight.medium,
  };
}

/**
 * Themed CalendarProvider component.
 */
export function CalendarProvider({
  theme,
  ...props
}: CalendarContextProviderProps) {
  const { mode } = useTheme();
  const calendarTheme = useCalendarTheme();

  return (
    <RNCCalendarProvider
      key={`calendar-provider-${mode}`}
      {...props}
      theme={{
        ...calendarTheme,
        ...theme,
      }}
    />
  );
}

/**
 * Themed Calendar component.
 */
export function Calendar({ theme, ...props }: CalendarProps) {
  const { mode } = useTheme();
  const calendarTheme = useCalendarTheme();

  return (
    <RNCCalendar
      key={`calendar-${mode}`}
      {...props}
      theme={{
        ...calendarTheme,
        ...theme,
      }}
    />
  );
}

/**
 * Themed WeekCalendar component.
 */
export function WeekCalendar({ theme, ...props }: WeekCalendarProps) {
  const { mode } = useTheme();
  const calendarTheme = useCalendarTheme();

  return (
    <RNCWeekCalendar
      key={`week-calendar-${mode}`}
      firstDay={1}
      {...props}
      theme={{
        ...calendarTheme,
        ...theme,
      }}
    />
  );
}

/**
 * Themed Timeline component.
 */
export function Timeline({ theme, ...props }: TimelineProps) {
  const { colors, mode } = useTheme();
  const calendarTheme = useCalendarTheme();

  return (
    <RNCTimeline
      key={`timeline-${mode}`}
      {...props}
      theme={{
        ...calendarTheme,
        // Timeline specific overrides
        timeLabel: {
          color: colors.mutedForeground,
          fontSize: 12,
        },
        eventTitle: {
          color: colors.foreground,
          fontSize: 14,
          fontWeight: '600',
        },
        eventSummary: {
          color: colors.mutedForeground,
          fontSize: 12,
        },
        backgroundColor: colors.background,
        line: {
          backgroundColor: colors.border,
        },
        verticalLine: {
          backgroundColor: colors.border,
        },
        ...theme,
      }}
    />
  );
}
