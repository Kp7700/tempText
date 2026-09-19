import { DurationOption, ExpirationDuration } from '../types';

export const DURATION_OPTIONS: DurationOption[] = [
  {
    value: '5m',
    label: '5 minutes',
    shortLabel: '5m',
    durationMs: 5 * 60 * 1000,
    description: 'Quick confidential exchange',
  },
  {
    value: '30m',
    label: '30 minutes',
    shortLabel: '30m',
    durationMs: 30 * 60 * 1000,
    description: 'Short meeting or task session',
  },
  {
    value: '1h',
    label: '1 hour',
    shortLabel: '1h',
    durationMs: 60 * 60 * 1000,
    description: 'Standard single-hour share',
  },
  {
    value: '8h',
    label: '8 hours',
    shortLabel: '8h',
    durationMs: 8 * 60 * 60 * 1000,
    description: 'Workday duration',
  },
  {
    value: '1d',
    label: '1 day',
    shortLabel: '1d',
    durationMs: 24 * 60 * 60 * 1000,
    description: '24 hours availability',
  },
  {
    value: '7d',
    label: '7 days',
    shortLabel: '7d',
    durationMs: 7 * 24 * 60 * 60 * 1000,
    description: 'One full week',
  },
  {
    value: '1mo',
    label: '1 month',
    shortLabel: '1mo',
    durationMs: 30 * 24 * 60 * 60 * 1000,
    description: '30 days duration',
  },
  {
    value: '6mo',
    label: '6 months',
    shortLabel: '6mo',
    durationMs: 180 * 24 * 60 * 60 * 1000,
    description: 'Half a year',
  },
  {
    value: '1y',
    label: '1 year',
    shortLabel: '1y',
    durationMs: 365 * 24 * 60 * 60 * 1000,
    description: 'One full year',
  },
];

export const MAX_TEXT_LENGTH = 50000;

export function getDurationOption(value: ExpirationDuration): DurationOption {
  const found = DURATION_OPTIONS.find((opt) => opt.value === value);
  return found || DURATION_OPTIONS[2]; // fallback to 1 hour
}

export function calculateExpirationDate(duration: ExpirationDuration, startDate = new Date()): Date {
  const option = getDurationOption(duration);
  return new Date(startDate.getTime() + option.durationMs);
}

export function formatDateTime(dateInput: Date | number): string {
  const date = typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }).format(date);
}

export function formatCountdown(expiresAt: number | Date, nowMs: number = Date.now()): {
  text: string;
  isExpired: boolean;
  totalSecondsRemaining: number;
} {
  const expireMs = typeof expiresAt === 'number' ? expiresAt : expiresAt.getTime();
  const diffMs = expireMs - nowMs;

  if (diffMs <= 0) {
    return {
      text: 'Expired',
      isExpired: true,
      totalSecondsRemaining: 0,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let text = '';
  if (days > 1) {
    text = `Expires in ${days} days, ${hours} hours`;
  } else if (days === 1) {
    text = `Expires in 1 day, ${hours} hours`;
  } else if (hours > 0) {
    text = `Expires in ${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    text = `Expires in ${minutes} minute${minutes === 1 ? '' : 's'} ${seconds}s`;
  } else {
    text = `Expires in ${seconds} second${seconds === 1 ? '' : 's'}`;
  }

  return {
    text,
    isExpired: false,
    totalSecondsRemaining: totalSeconds,
  };
}
