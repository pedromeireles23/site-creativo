'use client';

import {
  useCallback,
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useMotionCapabilities } from '@/hooks/use-motion-profile';
import { gsap, scheduleScrollRefresh, ScrollTrigger } from '@/lib/gsap';

type SmoothScrollController = {
  resize: () => void;
  scrollTo: (
    target: number | HTMLElement,
    options: { force: boolean; immediate: boolean },
  ) => void;
  start: () => void;
  stop: () => void;
};

type SmoothScrollContextValue = {
  isReady: boolean;
  navigateToHash: (hash: string) => void;
  pause: () => void;
  resume: () => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  isReady: true,
  navigateToHash: () => undefined,
  pause: () => undefined,
  resume: () => undefined,
});

const resolveHashScrollTarget = (hash: string) => {
  const target = document.getElementById(hash);
  if (!target) return null;

  const progress = Number.parseFloat(target.dataset.scrollAnchorProgress ?? '');
  if (!Number.isFinite(progress)) return target;

  const pinnedTrigger = ScrollTrigger.getAll()
    .filter((trigger) => {
      const triggerElement = trigger.trigger;

      return (
        Boolean(trigger.vars.pin) &&
        triggerElement instanceof Element &&
        (triggerElement === target || triggerElement.contains(target))
      );
    })
    .sort(
      (first, second) => second.end - second.start - (first.end - first.start),
    )[0];

  if (!pinnedTrigger) return target;

  const clampedProgress = Math.min(1, Math.max(0, progress));
  return (
    pinnedTrigger.start +
    (pinnedTrigger.end - pinnedTrigger.start) * clampedProgress
  );
};

export function useSmoothScrollReady() {
  return useContext(SmoothScrollContext).isReady;
}

export function useSmoothScrollControls() {
  return useContext(SmoothScrollContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const { preference: motionPreference } = useMotionCapabilities();
  const controllerRef = useRef<SmoothScrollController | null>(null);
  const pauseRequestedRef = useRef(false);

  const pause = useCallback(() => {
    pauseRequestedRef.current = true;
    controllerRef.current?.stop();
  }, []);

  const resume = useCallback(() => {
    pauseRequestedRef.current = false;
    controllerRef.current?.start();
  }, []);

  const navigateToHash = useCallback((hash: string) => {
    const normalizedHash = decodeURIComponent(hash.replace(/^#/, ''));
    if (!normalizedHash) return;

    const encodedHash = `#${encodeURIComponent(normalizedHash)}`;
    if (window.location.hash === encodedHash) {
      window.history.replaceState(null, '', encodedHash);
    } else {
      window.history.pushState(null, '', encodedHash);
    }

    window.requestAnimationFrame(() => {
      const controller = controllerRef.current;

      if (!controller) {
        const target = resolveHashScrollTarget(normalizedHash);
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'instant' });
        } else {
          target?.scrollIntoView({ block: 'start', behavior: 'instant' });
        }
        ScrollTrigger.update();
        return;
      }

      controller.resize();
      scheduleScrollRefresh();
      window.requestAnimationFrame(() => {
        const target = resolveHashScrollTarget(normalizedHash);
        if (target === null) return;

        controller.scrollTo(target, { force: true, immediate: true });
        ScrollTrigger.update();
      });
    });
  }, []);

  const contextValue = useMemo(
    () => ({ isReady, navigateToHash, pause, resume }),
    [isReady, navigateToHash, pause, resume],
  );

  useLayoutEffect(() => {
    let disposed = false;

    const setupNativeScrolling = () => {
      let hashFrame: number | undefined;

      const scrollToHash = () => {
        const hash = decodeURIComponent(window.location.hash.slice(1));
        if (!hash) return;

        const target = resolveHashScrollTarget(hash);
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'instant' });
        } else {
          target?.scrollIntoView({
            block: 'start',
            behavior: 'instant',
          });
        }
        ScrollTrigger.update();
      };

      const scheduleHashScroll = () => {
        if (hashFrame !== undefined) {
          window.cancelAnimationFrame(hashFrame);
        }

        hashFrame = window.requestAnimationFrame(scrollToHash);
      };

      const refreshTimeout = window.setTimeout(() => {
        scheduleScrollRefresh();
        scheduleHashScroll();
      }, 180);
      const settleTimeout = window.setTimeout(scheduleHashScroll, 720);

      window.addEventListener('hashchange', scheduleHashScroll);
      window.addEventListener('popstate', scheduleHashScroll);
      const handlePageShow = (event: PageTransitionEvent) => {
        if (event.persisted) scheduleHashScroll();
      };
      window.addEventListener('pageshow', handlePageShow);

      queueMicrotask(() => {
        if (!disposed) setIsReady(true);
      });

      return () => {
        window.removeEventListener('hashchange', scheduleHashScroll);
        window.removeEventListener('popstate', scheduleHashScroll);
        window.removeEventListener('pageshow', handlePageShow);
        window.clearTimeout(refreshTimeout);
        window.clearTimeout(settleTimeout);
        if (hashFrame !== undefined) {
          window.cancelAnimationFrame(hashFrame);
        }
      };
    };

    if (motionPreference === 'reduced') {
      const cleanup = setupNativeScrolling();

      return () => {
        disposed = true;
        cleanup();
      };
    }

    let cleanup: (() => void) | undefined;

    void import('lenis')
      .then(({ default: Lenis }) => {
        if (disposed) return;

        const lenis = new Lenis({
          autoRaf: false,
          anchors: true,
          autoResize: true,
          respectReducedMotion: true,
          smoothWheel: true,
          syncTouch: true,
          syncTouchLerp: 0.075,
          touchInertiaExponent: 1.7,
          touchMultiplier: 1,
        });
        const updateScrollTrigger = () => ScrollTrigger.update();
        const updateLenis = (time: number) => lenis.raf(time * 1000);

        controllerRef.current = lenis;
        if (pauseRequestedRef.current) lenis.stop();

        lenis.on('scroll', updateScrollTrigger);
        gsap.ticker.lagSmoothing(0);

        let refreshTimeout: number | undefined;
        let hashFrame: number | undefined;
        let tickerActive = false;

        const scrollToHash = () => {
          hashFrame = undefined;
          const hash = decodeURIComponent(window.location.hash.slice(1));
          if (!hash) return;

          lenis.resize();
          scheduleScrollRefresh();
          hashFrame = window.requestAnimationFrame(() => {
            hashFrame = undefined;
            const target = resolveHashScrollTarget(hash);
            if (target === null) return;

            lenis.scrollTo(target, { force: true, immediate: true });
            ScrollTrigger.update();
          });
        };

        const scheduleHashScroll = () => {
          if (hashFrame !== undefined) {
            window.cancelAnimationFrame(hashFrame);
          }

          hashFrame = window.requestAnimationFrame(scrollToHash);
        };

        const setTickerActive = (active: boolean) => {
          if (tickerActive === active) return;
          tickerActive = active;

          if (active) gsap.ticker.add(updateLenis);
          else gsap.ticker.remove(updateLenis);
        };

        const handleVisibilityChange = () => {
          setTickerActive(!document.hidden);

          if (!document.hidden) {
            lenis.resize();
            scheduleScrollRefresh();
          }
        };

        const scheduleRefresh = () => {
          window.clearTimeout(refreshTimeout);
          refreshTimeout = window.setTimeout(() => {
            lenis.resize();
            scheduleScrollRefresh();
          }, 120);
        };

        setTickerActive(!document.hidden);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('resize', scheduleRefresh, { passive: true });
        window.addEventListener('orientationchange', scheduleRefresh, {
          passive: true,
        });
        window.addEventListener('hashchange', scheduleHashScroll);
        window.addEventListener('popstate', scheduleHashScroll);
        const handlePageShow = (event: PageTransitionEvent) => {
          if (event.persisted) scheduleHashScroll();
        };
        window.addEventListener('pageshow', handlePageShow);

        if (document.readyState === 'complete') {
          scheduleRefresh();
        } else {
          window.addEventListener('load', scheduleRefresh, { once: true });
        }

        const initialHashTimeout = window.setTimeout(scheduleHashScroll, 180);
        const settledHashTimeout = window.setTimeout(scheduleHashScroll, 720);

        void document.fonts.ready.then(() => {
          if (!disposed) scheduleRefresh();
        });

        queueMicrotask(() => {
          if (!disposed) setIsReady(true);
        });

        cleanup = () => {
          document.removeEventListener(
            'visibilitychange',
            handleVisibilityChange,
          );
          window.removeEventListener('load', scheduleRefresh);
          window.removeEventListener('resize', scheduleRefresh);
          window.removeEventListener('orientationchange', scheduleRefresh);
          window.removeEventListener('hashchange', scheduleHashScroll);
          window.removeEventListener('popstate', scheduleHashScroll);
          window.removeEventListener('pageshow', handlePageShow);
          window.clearTimeout(refreshTimeout);
          window.clearTimeout(initialHashTimeout);
          window.clearTimeout(settledHashTimeout);

          if (hashFrame !== undefined) {
            window.cancelAnimationFrame(hashFrame);
          }

          lenis.off('scroll', updateScrollTrigger);
          setTickerActive(false);
          gsap.ticker.lagSmoothing(500, 33);
          if (controllerRef.current === lenis) controllerRef.current = null;
          lenis.destroy();
        };
      })
      .catch((error: unknown) => {
        if (disposed) return;

        console.error('Falha ao iniciar a rolagem suave.', error);
        cleanup = setupNativeScrolling();
      });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [motionPreference]);

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
