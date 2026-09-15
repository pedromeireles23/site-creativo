'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

let refreshPromise: Promise<void> | undefined;

function requestScrollRefresh() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (refreshPromise) return refreshPromise;

  refreshPromise = new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      try {
        ScrollTrigger.refresh();
      } finally {
        refreshPromise = undefined;
        resolve();
      }
    });
  });

  return refreshPromise;
}

export function scheduleScrollRefresh() {
  void requestScrollRefresh();
}

export function waitForScrollRefresh() {
  return requestScrollRefresh();
}

export { gsap, ScrollTrigger, useGSAP };
