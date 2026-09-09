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
import { useMotionProfile } from '@/hooks/use-motion-profile';
import { gsap, scheduleScrollRefresh, ScrollTrigger } from '@/lib/gsap';

type SmoothScrollController = {
  start: () => void;
  stop: () => void;
};

type SmoothScrollContextValue = {
  isReady: boolean;
  pause: () => void;
  resume: () => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  isReady: true,
  pause: () => undefined,
  resume: () => undefined,
});

export function useSmoothScrollReady() {
  return useContext(SmoothScrollContext).isReady;
}

export function useSmoothScrollControls() {
  return useContext(SmoothScrollContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const motionProfile = useMotionProfile();
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

  const contextValue = useMemo(
    () => ({ isReady, pause, resume }),
    [isReady, pause, resume],
  );

  useLayoutEffect(() => {
    let disposed = false;

    const setupNativeScrolling = () => {
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
        scheduleScrollRefresh();
        scheduleHashScroll();
      }, 180);
      const settleTimeout = window.setTimeout(scheduleHashScroll, 720);

      window.addEventListener('hashchange', scheduleHashScroll);

      queueMicrotask(() => {
        if (!disposed) setIsReady(true);
      });

      return () => {
        window.removeEventListener('hashchange', scheduleHashScroll);
        window.clearTimeout(refreshTimeout);
        window.clearTimeout(settleTimeout);
        if (hashFrame !== undefined) {
          window.cancelAnimationFrame(hashFrame);
        }
      };
    };

    if (motionProfile !== 'full') {
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
        let tickerActive = false;

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

        if (document.readyState === 'complete') {
          scheduleRefresh();
        } else {
          window.addEventListener('load', scheduleRefresh, { once: true });
        }

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
          window.clearTimeout(refreshTimeout);

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
  }, [motionProfile]);

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
