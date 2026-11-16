/**
 * Zepp Prototype Service Layer
 *
 * Designed with clean interfaces so simulated demonstration persistence
 * can be swapped with Firebase Auth, Cloud Firestore, Firebase Storage,
 * and M-Pesa Daraja API Cloud Functions without refactoring UI components.
 *
 * Note: Never store real passwords or payment credentials in localStorage.
 */

export const ZEPP_STORAGE_KEY = 'zepp_demo_ecosystem_v1';

export interface FutureIntegrationStatus {
  firebaseAuthConfigured: boolean;
  firestoreConfigured: boolean;
  mpesaDarajaConfigured: boolean;
  mode: 'local-demonstration';
}

export function getIntegrationStatus(): FutureIntegrationStatus {
  return {
    firebaseAuthConfigured: false,
    firestoreConfigured: false,
    mpesaDarajaConfigured: false,
    mode: 'local-demonstration',
  };
}

export function loadPersistedState<T>(fallback: T): T {
  try {
    const raw = window.localStorage.getItem(ZEPP_STORAGE_KEY);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

export function savePersistedState<T>(state: T): void {
  try {
    window.localStorage.setItem(ZEPP_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota errors in demonstration mode (e.g. large uploaded data URLs)
  }
}

export function clearPersistedState(): void {
  try {
    window.localStorage.removeItem(ZEPP_STORAGE_KEY);
  } catch {
    // Ignore
  }
}
