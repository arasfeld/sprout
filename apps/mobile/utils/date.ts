/**
 * Formats a Date object to a YYYY-MM-DD string.
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a Date object to a human readable date (e.g., Feb 19, 2026).
 */
export function formatDateHuman(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a Date object to a human readable time (e.g., 10:30 PM).
 */
export function formatTimeHuman(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formats a Date object to a human readable date and time (e.g., Feb 19, 10:30 PM).
 */
export function formatDateTimeHuman(date: Date): string {
  return `${formatDateHuman(date)}, ${formatTimeHuman(date)}`;
}
