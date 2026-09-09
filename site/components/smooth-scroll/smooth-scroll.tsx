'use client';

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const SmoothScrollReadyContext = createContext(true);

export function useSmoothScrollReady() {
  return useContext(SmoothScrollReadyContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const compactViewport = window.matchMedia(
      '(max-width: 900px), (pointer: coarse)',
    ).matches;

    if (reduceMotion || compactViewport) {
      let disposed = false;
      let refreshFrame: number | undefined;
      let hashFrame: number | undefined;

      const scrollToHash = () => {
        const hash = decodeURIComponent(window.location.hash.slice(1));
        if (!hash) return;

        document.getElementById(hash)?.scrollIntoView({
          block: 'start',
          behavior: 'instant',
        });
      };

      const scheduleHashScroll = () => {
        if (hashFrame !== undefined) {
          window.cancelAnimationFrame(hashFrame);
        }

        hashFrame = window.requestAnimationFrame(scrollToHash);
      };

      const refreshTimeout = window.setTimeout(() => {
        refreshFrame = window.requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          scheduleHashScroll();
        });
      }, 180);
      const settleTimeout = window.setTimeout(scheduleHashScroll, 720);

      window.addEventListener('hashchange', scheduleHashScroll);

      queueMicrotask(() => {
        if (!disposed) setIsReady(true);
      });

      return () => {
        disposed = true;
        window.removeEventListener('hashchange', scheduleHashScroll);
        window.clearTimeout(refreshTimeout);
        window.clearTimeout(settleTimeout);
        if (refreshFrame !== undefined) {
          window.cancelAnimationFrame(refreshFrame);
        }
        if (hashFrame !== undefined) {
          window.cancelAnimationFrame(hashFrame);
        }
      };
    }

    const lenis = new Lenis({
      autoRaf: false,
      anchors: true,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchInertiaExponent: 1.7,
      touchMultiplier: 1,
    });
    const updateScrollTrigger = () => ScrollTrigger.update();
    const updateLenis = (time: number) => lenis.raf(time * 1000);

    lenis.on('scroll', updateScrollTrigger);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    let refreshTimeout: number | undefined;
    let refreshFrame: number | undefined;
    let destroyed = false;

    const refresh = () => {
      refreshFrame = undefined;
      lenis.resize();
      ScrollTrigger.refresh();
    };

    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimeout);
      refreshTimeout = window.setTimeout(() => {
        if (refreshFrame !== undefined) {
          window.cancelAnimationFrame(refreshFrame);
        }

        refreshFrame = window.requestAnimationFrame(refresh);
      }, 120);
    };

    window.addEventListener('resize', scheduleRefresh, { passive: true });
    window.addEventListener('orientationchange', scheduleRefresh, {
      passive: true,
    });

    if (document.readyState === 'complete') {
      scheduleRefresh();
    } else {
      window.addEventListener('load', scheduleRefresh, { once: true });
    }

    void document.fonts.ready.then(() => {
      if (!destroyed) scheduleRefresh();
    });

    queueMicrotask(() => {
      if (!destroyed) setIsReady(true);
    });

    return () => {
      destroyed = true;
      window.removeEventListener('load', scheduleRefresh);
      window.removeEventListener('resize', scheduleRefresh);
      window.removeEventListener('orientationchange', scheduleRefresh);
      window.clearTimeout(refreshTimeout);

      if (refreshFrame !== undefined) {
        window.cancelAnimationFrame(refreshFrame);
      }

      lenis.off('scroll', updateScrollTrigger);
      gsap.ticker.remove(updateLenis);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return (
    <SmoothScrollReadyContext.Provider value={isReady}>
      {children}
    </SmoothScrollReadyContext.Provider>
  );
}
