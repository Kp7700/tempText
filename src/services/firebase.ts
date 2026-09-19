import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Timestamp,
  Firestore,
} from 'firebase/firestore';
import {
  ExpirationDuration,
  LinkCreationResult,
  TemporaryTextRecord,
  TextFetchResult,
} from '../types';
import { calculateExpirationDate, getDurationOption, MAX_TEXT_LENGTH } from '../utils/duration';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Firebase configuration resolving with fallbacks
const firebaseConfig = {
  apiKey:
    firebaseConfigJson.apiKey ||
    import.meta.env.VITE_FIREBASE_API_KEY ||
    '',
  authDomain:
    firebaseConfigJson.authDomain ||
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    '',
  projectId:
    firebaseConfigJson.projectId ||
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    '',
  storageBucket:
    firebaseConfigJson.storageBucket ||
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    '',
  messagingSenderId:
    firebaseConfigJson.messagingSenderId ||
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    '',
  appId:
    firebaseConfigJson.appId ||
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '',
};

// Initialize Firebase App
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Support custom database ID if configured
const customDbId =
  (firebaseConfigJson as { firestoreDatabaseId?: string }).firestoreDatabaseId ||
  import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID ||
  undefined;

export const db: Firestore = customDbId ? getFirestore(app, customDbId) : getFirestore(app);

/**
 * URL-safe character set containing uppercase letters, lowercase letters, and numbers (62 chars).
 * Requirement: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
 */
export const SHORT_ID_CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const SHORT_ID_LENGTH = 7;

/**
 * Generate a cryptographically secure random ID of exactly 7 characters.
 * Uses browser/runtime crypto.getRandomValues with rejection sampling to eliminate modulo bias.
 * Does not use predictable sequential IDs or timestamps.
 */
export function generateShortId(length = SHORT_ID_LENGTH): string {
  const chars = SHORT_ID_CHARSET;
  const charsLength = chars.length; // 62
  // Discard bytes >= 248 (256 - (256 % 62)) to prevent modulo bias for uniform randomness
  const maxValidByte = 256 - (256 % charsLength);

  let result = '';
  const cryptoObj =
    typeof window !== 'undefined'
      ? window.crypto || (window as unknown as { msCrypto?: Crypto }).msCrypto
      : globalThis.crypto;

  while (result.length < length) {
    const buffer = new Uint8Array(length * 2);
    if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
      cryptoObj.getRandomValues(buffer);
    } else {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = Math.floor(Math.random() * 256);
      }
    }

    for (let i = 0; i < buffer.length && result.length < length; i++) {
      const byte = buffer[i];
      if (byte < maxValidByte) {
        result += chars[byte % charsLength];
      }
    }
  }

  return result;
}

// Backward-compatible alias for any legacy references
export const generateSecureId = generateShortId;

/**
 * Checks Firestore to see if a document with the candidate ID already exists.
 * Returns true if the ID is already in use (collision), false if available.
 */
export async function checkIfIdExists(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'temporaryTexts', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (err: unknown) {
    const errorObj = err as { code?: string; message?: string };
    // If Firestore security rules return permission-denied (e.g., an existing expired document),
    // treat it as occupied/collision to avoid overwriting or key collisions.
    if (errorObj?.code === 'permission-denied') {
      return true;
    }
    // For other unexpected errors, log and continue or return true for safety
    console.warn(`Error during collision check for ID "${id}":`, err);
    return false;
  }
}

/**
 * Stores temporary text record in Firestore and returns shareable link information.
 * Uses a unique 7-character short ID verified against Firestore for collisions.
 */
export async function createTemporaryTextRecord(
  text: string,
  duration: ExpirationDuration
): Promise<LinkCreationResult> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Text cannot be empty.');
  }

  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(`Text exceeds maximum allowed length of ${MAX_TEXT_LENGTH.toLocaleString()} characters.`);
  }

  // Generate a unique 7-character ID, verifying against Firestore to prevent collisions
  let id = '';
  const MAX_COLLISION_RETRIES = 10;
  for (let attempt = 0; attempt < MAX_COLLISION_RETRIES; attempt++) {
    const candidateId = generateShortId(SHORT_ID_LENGTH);
    const exists = await checkIfIdExists(candidateId);
    if (!exists) {
      id = candidateId;
      break;
    }
  }

  if (!id) {
    throw new Error('Failed to generate a unique short link ID. Please try again.');
  }

  const startDate = new Date();
  const expiresAtDate = calculateExpirationDate(duration, startDate);
  const durationOption = getDurationOption(duration);

  // Use Firestore Timestamp objects for database storage
  const createdAtTimestamp = Timestamp.fromDate(startDate);
  const expiresAtTimestamp = Timestamp.fromDate(expiresAtDate);

  const docRef = doc(db, 'temporaryTexts', id);
  await setDoc(docRef, {
    id,
    text,
    duration,
    createdAt: createdAtTimestamp,
    expiresAt: expiresAtTimestamp,
  });

  // Construct absolute URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const url = `${origin}/t/${id}`;

  return {
    id,
    url,
    expiresAtDate,
    durationLabel: durationOption.label,
    duration,
    textLength: text.length,
    text,
  };
}

/**
 * Fetches and verifies expiration of a temporary text record.
 * Strictly guarantees expired text is never exposed or returned to the UI.
 */
export async function fetchTemporaryTextRecord(id: string): Promise<TextFetchResult> {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return {
      status: 'not_found',
      errorMessage: 'Invalid link identifier.',
    };
  }

  try {
    const docRef = doc(db, 'temporaryTexts', id.trim());
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        status: 'not_found',
        errorMessage: 'Link not found or has been removed.',
      };
    }

    const data = docSnap.data();
    if (!data) {
      return { status: 'not_found' };
    }

    // Convert timestamps
    let expiresAtMs: number = 0;
    if (data.expiresAt && typeof (data.expiresAt as Timestamp).toMillis === 'function') {
      expiresAtMs = (data.expiresAt as Timestamp).toMillis();
    } else if (data.expiresAt instanceof Date) {
      expiresAtMs = data.expiresAt.getTime();
    } else if (typeof data.expiresAt === 'number') {
      expiresAtMs = data.expiresAt;
    }

    let createdAtMs: number = 0;
    if (data.createdAt && typeof (data.createdAt as Timestamp).toMillis === 'function') {
      createdAtMs = (data.createdAt as Timestamp).toMillis();
    } else if (data.createdAt instanceof Date) {
      createdAtMs = data.createdAt.getTime();
    } else if (typeof data.createdAt === 'number') {
      createdAtMs = data.createdAt;
    }

    const nowMs = Date.now();

    // Check if expired
    if (expiresAtMs <= nowMs) {
      // Enforce strict access expiration: do NOT return the text content
      return {
        status: 'expired',
        errorMessage: 'This link has expired and content is no longer available.',
      };
    }

    const record: TemporaryTextRecord = {
      id: data.id || id,
      text: typeof data.text === 'string' ? data.text : '',
      duration: data.duration || '1h',
      createdAt: createdAtMs,
      expiresAt: expiresAtMs,
    };

    return {
      status: 'active',
      data: record,
    };
  } catch (err: unknown) {
    const errorObj = err as { code?: string; message?: string };
    
    // Firestore security rules return 'permission-denied' when resource.data.expiresAt <= request.time
    if (errorObj?.code === 'permission-denied') {
      return {
        status: 'expired',
        errorMessage: 'This link has expired or access is restricted.',
      };
    }

    return {
      status: 'error',
      errorMessage: 'Unable to load text. Please check your network connection and try again.',
    };
  }
}
