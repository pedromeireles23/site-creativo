'use client';

import { useEffect, useRef } from 'react';
import { useMotionProfile } from '@/hooks/use-motion-profile';
import { gsap } from '@/lib/gsap';
import styles from './custom-cursor.module.scss';

type CursorMode = 'default' | 'hidden' | 'label';

const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, summary, [role="button"], [contenteditable="true"]';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const verticalLineRef = useRef<HTMLSpanElement>(null);
  const horizontalLineRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const labelTextRef = useRef<HTMLSpanElement>(null);
  const motionProfile = useMotionProfile();

  useEffect(() => {
    if (motionProfile !== 'full') return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const verticalLine = verticalLineRef.current;
    const horizontalLine = horizontalLineRef.current;
    const label = labelRef.current;
    const labelText = labelTextRef.current;

    if (
      !cursor ||
      !dot ||
      !verticalLine ||
      !horizontalLine ||
      !label ||
      !labelText
    ) {
      return;
    }

    let hasPosition = false;
    let currentMode: CursorMode | undefined;
    let currentLabel = '';

    gsap.set(cursor, {
      autoAlpha: 0,
      scale: 1,
      xPercent: -150,
      yPercent: -150,
    });
    gsap.set(dot, { rotation: 0, scale: 1 });
    gsap.set(verticalLine, { autoAlpha: 0, height: 0 });
    gsap.set(horizontalLine, { autoAlpha: 0, width: 0 });
    gsap.set(label, { autoAlpha: 0, y: 4 });

    const moveX = gsap.quickTo(cursor, 'x', {
      duration: 0.22,
      ease: 'power3.out',
    });
    const moveY = gsap.quickTo(cursor, 'y', {
      duration: 0.22,
      ease: 'power3.out',
    });

    const setMode = (mode: CursorMode, nextLabel = '') => {
      if (mode === currentMode && nextLabel === currentLabel) return;

      currentMode = mode;
      currentLabel = nextLabel;

      const showsLabel = mode === 'label';
      const hidesCursor = mode === 'hidden';

      if (showsLabel) labelText.textContent = nextLabel;

      gsap.to(cursor, {
        autoAlpha: hidesCursor || !hasPosition ? 0 : 1,
        scale: hidesCursor ? 0.35 : 1,
        duration: 0.2,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      gsap.to(dot, {
        rotation: showsLabel ? 45 : 0,
        duration: 0.28,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      gsap.to(verticalLine, {
        autoAlpha: showsLabel ? 1 : 0,
        height: showsLabel ? 12 : 0,
        duration: 0.28,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      gsap.to(horizontalLine, {
        autoAlpha: showsLabel ? 1 : 0,
        width: showsLabel ? 12 : 0,
        duration: 0.28,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      gsap.to(label, {
        autoAlpha: showsLabel ? 1 : 0,
        y: showsLabel ? 0 : 4,
        duration: showsLabel ? 0.28 : 0.18,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;

      if (!hasPosition) {
        hasPosition = true;
        gsap.set(cursor, { x: event.clientX, y: event.clientY });
      } else {
        moveX(event.clientX);
        moveY(event.clientY);
      }

      const target = event.target instanceof Element ? event.target : null;
      const labelledTarget = target?.closest<HTMLElement>(
        '[data-cursor-label]',
      );
      const cursorLabel = labelledTarget?.dataset.cursorLabel?.trim();

      if (cursorLabel) {
        setMode('label', cursorLabel);
      } else if (target?.closest(INTERACTIVE_SELECTOR)) {
        setMode('hidden');
      } else {
        setMode('default');
      }
    };

    const hideCursor = (event?: PointerEvent) => {
      if (event?.relatedTarget) return;
      hasPosition = false;
      currentMode = undefined;
      gsap.to(cursor, {
        autoAlpha: 0,
        duration: 0.16,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };
    const handleWindowBlur = () => hideCursor();

    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });
    window.addEventListener('pointerout', hideCursor, { passive: true });
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', hideCursor);
      window.removeEventListener('blur', handleWindowBlur);
      gsap.killTweensOf([cursor, dot, verticalLine, horizontalLine, label]);
    };
  }, [motionProfile]);

  if (motionProfile !== 'full') return null;

  return (
    <div className={styles.cursor} ref={cursorRef} aria-hidden="true">
      <span className={styles.verticalLine} ref={verticalLineRef} />
      <span className={styles.horizontalLine} ref={horizontalLineRef} />
      <span className={styles.dot} ref={dotRef} />
      <span className={styles.label} ref={labelRef}>
        <span ref={labelTextRef} />
      </span>
    </div>
  );
}
