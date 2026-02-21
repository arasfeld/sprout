import { format } from 'date-fns';

/**
 * Formats a Date object to a YYYY-MM-DD string.
 */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Formats a Date object to a human readable date (e.g., Feb 19, 2026).
 */
export function formatDateHuman(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

/**
 * Formats a Date object to a long human readable date (e.g., February 19, 2026).
 */
export function formatDateLongHuman(date: Date): string {
  return format(date, 'MMMM d, yyyy');
}

/**
 * Formats a Date object to a human readable time (e.g., 10:30 PM).
 */
export function formatTimeHuman(date: Date): string {
  return format(date, 'h:mm a');
}

/**
 * Formats a Date object to a human readable date and time (e.g., Feb 19, 2026, 10:30 PM).
 */
export function formatDateTimeHuman(date: Date): string {
  return format(date, 'MMM d, yyyy, h:mm a');
}
