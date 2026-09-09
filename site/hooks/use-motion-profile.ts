'use client';

import { useSyncExternalStore } from 'react';

export type MotionProfile = 'full' | 'compact' | 'reduced';

export const MOTION_QUERIES = {
  compact: '(max-width: 900px), (pointer: coarse)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const;

const subscribers = new Set<() => void>();
let compactQuery: MediaQueryList | undefined;
let reducedQuery: MediaQueryList | undefined;
let currentProfile: MotionProfile = 'reduced';
let listening = false;

function readProfile(): MotionProfile {
  if (reducedQuery?.matches) return 'reduced';
  if (compactQuery?.matches) return 'compact';
  return 'full';
}

function notifyProfileChange() {
  const nextProfile = readProfile();
  if (nextProfile === currentProfile) return;

  currentProfile = nextProfile;
  subscribers.forEach((subscriber) => subscriber());
}

function ensureQueries() {
  if (typeof window === 'undefined' || compactQuery) return;

  compactQuery = window.matchMedia(MOTION_QUERIES.compact);
  reducedQuery = window.matchMedia(MOTION_QUERIES.reduced);
  currentProfile = readProfile();
}

function subscribe(subscriber: () => void) {
  ensureQueries();
  subscribers.add(subscriber);

  if (!listening) {
    compactQuery?.addEventListener('change', notifyProfileChange);
    reducedQuery?.addEventListener('change', notifyProfileChange);
    listening = true;
  }

  return () => {
    subscribers.delete(subscriber);

    if (subscribers.size === 0 && listening) {
      compactQuery?.removeEventListener('change', notifyProfileChange);
      reducedQuery?.removeEventListener('change', notifyProfileChange);
      listening = false;
    }
  };
}

function getSnapshot() {
  ensureQueries();
  return currentProfile;
}

function getServerSnapshot(): MotionProfile {
  return 'reduced';
}

export function useMotionProfile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
