'use client';

import { useSyncExternalStore } from 'react';

export type MotionProfile = 'full' | 'compact' | 'reduced';
export type MotionPreference = 'normal' | 'reduced';
export type MotionLayout = 'phone' | 'tablet' | 'wide' | 'shortLandscape';
export type PointerProfile = 'coarse' | 'fine';

export type MotionCapabilities = {
  preference: MotionPreference;
  layout: MotionLayout;
  pointer: PointerProfile;
  canHover: boolean;
};

export const MOTION_QUERIES = {
  phone: '(max-width: 639px)',
  tablet: '(min-width: 640px) and (max-width: 1023px)',
  wide: '(min-width: 1024px)',
  compact: '(max-width: 1023px)',
  shortLandscape:
    '(max-width: 1023px) and (max-height: 700px) and (orientation: landscape)',
  compactCinematic:
    '(max-width: 1023px) and (min-height: 701px), (max-width: 1023px) and (orientation: portrait)',
  cinematic:
    '(min-width: 1024px), (min-height: 701px), (orientation: portrait)',
  coarse: '(pointer: coarse)',
  hover: '(hover: hover) and (pointer: fine)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const;

type QueryKey = keyof typeof MOTION_QUERIES;

const SERVER_CAPABILITIES: MotionCapabilities = {
  preference: 'reduced',
  layout: 'phone',
  pointer: 'coarse',
  canHover: false,
};

const subscribers = new Set<() => void>();
const queryLists: Partial<Record<QueryKey, MediaQueryList>> = {};
let currentCapabilities = SERVER_CAPABILITIES;
let currentProfile: MotionProfile = 'reduced';
let listening = false;

function queryMatches(key: QueryKey) {
  return queryLists[key]?.matches ?? false;
}

function readCapabilities(): MotionCapabilities {
  const shortLandscape = queryMatches('shortLandscape');
  const layout: MotionLayout = shortLandscape
    ? 'shortLandscape'
    : queryMatches('phone')
      ? 'phone'
      : queryMatches('tablet')
        ? 'tablet'
        : 'wide';

  return {
    preference: queryMatches('reduced') ? 'reduced' : 'normal',
    layout,
    pointer: queryMatches('coarse') ? 'coarse' : 'fine',
    canHover: queryMatches('hover'),
  };
}

function readLegacyProfile(capabilities: MotionCapabilities): MotionProfile {
  if (capabilities.preference === 'reduced') return 'reduced';
  if (capabilities.layout !== 'wide' || capabilities.pointer === 'coarse') {
    return 'compact';
  }
  return 'full';
}

function capabilitiesAreEqual(
  previous: MotionCapabilities,
  next: MotionCapabilities,
) {
  return (
    previous.preference === next.preference &&
    previous.layout === next.layout &&
    previous.pointer === next.pointer &&
    previous.canHover === next.canHover
  );
}

function notifyProfileChange() {
  const nextCapabilities = readCapabilities();
  if (capabilitiesAreEqual(currentCapabilities, nextCapabilities)) return;

  currentCapabilities = nextCapabilities;
  currentProfile = readLegacyProfile(nextCapabilities);
  subscribers.forEach((subscriber) => subscriber());
}

function ensureQueries() {
  if (typeof window === 'undefined' || queryLists.phone) return;

  (Object.keys(MOTION_QUERIES) as QueryKey[]).forEach((key) => {
    queryLists[key] = window.matchMedia(MOTION_QUERIES[key]);
  });

  currentCapabilities = readCapabilities();
  currentProfile = readLegacyProfile(currentCapabilities);
}

function subscribe(subscriber: () => void) {
  ensureQueries();
  subscribers.add(subscriber);

  if (!listening) {
    (Object.keys(queryLists) as QueryKey[]).forEach((key) => {
      queryLists[key]?.addEventListener('change', notifyProfileChange);
    });
    listening = true;
  }

  return () => {
    subscribers.delete(subscriber);

    if (subscribers.size === 0 && listening) {
      (Object.keys(queryLists) as QueryKey[]).forEach((key) => {
        queryLists[key]?.removeEventListener('change', notifyProfileChange);
      });
      listening = false;
    }
  };
}

function getCapabilitiesSnapshot() {
  ensureQueries();
  return currentCapabilities;
}

function getServerCapabilitiesSnapshot() {
  return SERVER_CAPABILITIES;
}

function getProfileSnapshot() {
  ensureQueries();
  return currentProfile;
}

function getServerProfileSnapshot(): MotionProfile {
  return 'reduced';
}

export function useMotionCapabilities() {
  return useSyncExternalStore(
    subscribe,
    getCapabilitiesSnapshot,
    getServerCapabilitiesSnapshot,
  );
}

export function useMotionProfile() {
  return useSyncExternalStore(
    subscribe,
    getProfileSnapshot,
    getServerProfileSnapshot,
  );
}
