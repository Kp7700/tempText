export type ExpirationDuration =
  | '5m'
  | '30m'
  | '1h'
  | '8h'
  | '1d'
  | '7d'
  | '1mo'
  | '6mo'
  | '1y';

export interface DurationOption {
  value: ExpirationDuration;
  label: string;
  shortLabel: string;
  durationMs: number;
  description: string;
}

export interface TemporaryTextRecord {
  id: string;
  text: string;
  createdAt: number; // epoch ms
  expiresAt: number; // epoch ms
  duration: ExpirationDuration;
  createdAtFormatted?: string;
  expiresAtFormatted?: string;
}

export interface LinkCreationResult {
  id: string;
  url: string;
  expiresAtDate: Date;
  durationLabel: string;
  duration: ExpirationDuration;
  textLength: number;
  text?: string;
}

export type FetchStatus = 'loading' | 'active' | 'expired' | 'not_found' | 'error';

export interface TextFetchResult {
  status: FetchStatus;
  data?: TemporaryTextRecord;
  errorMessage?: string;
}
