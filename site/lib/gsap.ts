'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

let refreshFrame: number | undefined;

export function scheduleScrollRefresh() {
  if (typeof window === 'undefined' || refreshFrame !== undefined) return;

  refreshFrame = window.requestAnimationFrame(() => {
    refreshFrame = undefined;
    ScrollTrigger.refresh();
  });
}

export { gsap, ScrollTrigger, useGSAP };
