'use client';

import Image from 'next/image';
import { type CSSProperties, useRef } from 'react';
import styles from '@/app/page.module.scss';
import { useSmoothScrollReady } from '@/components/smooth-scroll/smooth-scroll';
import { useMotionProfile } from '@/hooks/use-motion-profile';
import { gsap, scheduleScrollRefresh, useGSAP } from '@/lib/gsap';

const canopyImage = '/images/macaw/canopy-opening-amazon.png';
const macawImage = '/images/macaw/scarlet-macaw-flight.png';
const nextPanoramaImage = '/images/territorios/territorios-transicao-final.png';

export function MacawSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isSmoothScrollReady = useSmoothScrollReady();
  const reduceMotion = useMotionProfile() === 'reduced';

  useGSAP(
    () => {
      if (!isSmoothScrollReady) return;

      const section = sectionRef.current;
      if (!section) return;

      const stage = section.querySelector<HTMLElement>('[data-macaw-stage]');
      const background = section.querySelector<HTMLElement>(
        '[data-macaw-background]',
      );
      const bird = section.querySelector<HTMLElement>('[data-macaw-bird]');
      const ghost = section.querySelector<HTMLElement>('[data-macaw-ghost]');
      const copy = section.querySelector<HTMLElement>('[data-macaw-copy]');
      const lines = gsap.utils.toArray<HTMLElement>(
        '[data-macaw-line]',
        section,
      );
      const meta = gsap.utils.toArray<HTMLElement>(
        '[data-macaw-meta]',
        section,
      );
      const traces = gsap.utils.toArray<HTMLElement>(
        '[data-macaw-trace]',
        section,
      );
      const strips = gsap.utils.toArray<HTMLElement>(
        '[data-macaw-strip]',
        section,
      );

      if (!stage || !background || !bird || !ghost || !copy) return;

      if (reduceMotion) {
        return;
      }

      const media = gsap.matchMedia();

      const setHeaderTheme = (progress: number) => {
        section.dataset.headerTheme = progress > 0.82 ? 'dark' : 'light';
      };

      media.add('(min-width: 901px)', () => {
        gsap.set(background, { scale: 1.08 });
        gsap.set(bird, {
          autoAlpha: 0,
          xPercent: -34,
          yPercent: 26,
          rotate: -7,
          scale: 0.76,
        });
        gsap.set(ghost, { autoAlpha: 0, xPercent: -5 });
        gsap.set(lines, { yPercent: 118 });
        gsap.set(meta, { autoAlpha: 0, y: 18 });
        gsap.set(traces, { scaleX: 0, transformOrigin: '0% 50%' });
        gsap.set(strips, { autoAlpha: 1, yPercent: 104 });

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + window.innerHeight * 2.2,
            pin: section,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setHeaderTheme(self.progress),
          },
        });

        timeline
          .to(background, { scale: 1, duration: 0.92 }, 0)
          .to(traces, { scaleX: 1, stagger: 0.025, duration: 0.18 }, 0.08)
          .to(
            bird,
            {
              autoAlpha: 1,
              xPercent: 0,
              yPercent: 0,
              rotate: 0,
              scale: 1,
              duration: 0.36,
              ease: 'power2.out',
            },
            0.12,
          )
          .to(ghost, { autoAlpha: 1, xPercent: 0, duration: 0.22 }, 0.2)
          .to(
            meta,
            { autoAlpha: 1, y: 0, stagger: 0.035, duration: 0.14 },
            0.24,
          )
          .to(lines, { yPercent: 0, stagger: 0.065, duration: 0.18 }, 0.27)
          .to(
            bird,
            { xPercent: 7, yPercent: -5, rotate: 1.5, duration: 0.34 },
            0.48,
          )
          .to(copy, { autoAlpha: 0, y: -24, duration: 0.12 }, 0.76)
          .to(traces, { autoAlpha: 0, duration: 0.1 }, 0.75)
          .to(
            bird,
            {
              xPercent: 58,
              yPercent: -24,
              rotate: 4,
              scale: 0.82,
              autoAlpha: 0.54,
              duration: 0.24,
            },
            0.74,
          )
          .to(strips, { yPercent: 0, stagger: 0.024, duration: 0.2 }, 0.79);

        return () => timeline.kill();
      });

      media.add('(max-width: 900px)', () => {
        const compactStrips = strips.slice(0, 5);

        gsap.set(background, { scale: 1.055 });
        gsap.set(bird, {
          autoAlpha: 1,
          xPercent: -8,
          yPercent: 2,
          rotate: -2,
          scale: 0.9,
        });
        gsap.set(ghost, { autoAlpha: 0.34, xPercent: 0 });
        gsap.set(lines, { yPercent: 0 });
        gsap.set(meta, { autoAlpha: 1, y: 0 });
        gsap.set(traces, { scaleX: 0.35, transformOrigin: '0% 50%' });
        gsap.set(compactStrips, { autoAlpha: 1, yPercent: 104 });

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
            invalidateOnRefresh: true,
            onUpdate: (self) => setHeaderTheme(self.progress),
          },
        });

        timeline
          .to(background, { scale: 1, duration: 1 }, 0)
          .to(traces, { scaleX: 1, stagger: 0.03, duration: 0.44 }, 0.08)
          .to(
            bird,
            {
              xPercent: 8,
              yPercent: -8,
              rotate: 2,
              scale: 1,
              duration: 1,
            },
            0,
          )
          .to(ghost, { autoAlpha: 0.68, duration: 0.55 }, 0.16)
          .to(copy, { y: -10, duration: 1 }, 0)
          .to(
            compactStrips,
            { yPercent: 0, stagger: 0.035, duration: 0.18 },
            0.8,
          );

        return () => timeline.kill();
      });

      scheduleScrollRefresh();
      return () => media.revert();
    },
    {
      scope: sectionRef,
      dependencies: [isSmoothScrollReady, reduceMotion],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${styles.macaw}`}
      id="asas"
      aria-labelledby="asas-title"
      data-header-theme="light"
      data-header-chapter="asas"
    >
      <div className={styles.macawStage} data-macaw-stage>
        <div className={styles.macawBackgroundFrame}>
          <Image
            className={styles.macawBackground}
            data-macaw-background
            src={canopyImage}
            alt="Copa da floresta amazônica se abrindo entre a névoa e a luz"
            fill
            sizes="100vw"
          />
        </div>
        <div className={styles.macawWash} aria-hidden="true" />

        <p
          className={`${styles.ghostWord} ${styles.macawGhostWord}`}
          data-macaw-ghost
          aria-hidden="true"
        >
          ASAS
        </p>

        <div className={styles.macawColorTrace} aria-hidden="true">
          <span data-macaw-trace />
          <span data-macaw-trace />
          <span data-macaw-trace />
        </div>

        <div className={styles.macawBird} data-macaw-bird>
          <Image
            src={macawImage}
            alt="Arara-vermelha em voo com as asas abertas"
            fill
            sizes="(max-width: 900px) 110vw, 72vw"
          />
        </div>

        <div className={styles.macawContent}>
          <p className={styles.chapterLabel} data-macaw-meta>
            <span>07</span>
            <span aria-hidden="true" className={styles.chapterLine} />
            Asas
          </p>

          <div className={styles.macawCopy} data-macaw-copy>
            <p data-macaw-meta>A cor encontra movimento</p>
            <h2 id="asas-title">
              <span className={styles.macawLineClip}>
                <span data-macaw-line>Quando suas asas se abrem,</span>
              </span>
              <span className={styles.macawLineClip}>
                <em data-macaw-line>o céu aprende novas cores.</em>
              </span>
            </h2>
            <p className={styles.macawSpecies} data-macaw-meta>
              Arara-vermelha <span aria-hidden="true">·</span> presença, voo e
              cor
            </p>
          </div>
        </div>

        <div className={styles.macawFeatherStrips} aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => (
            <span
              data-macaw-strip
              key={index}
              style={{ '--strip-index': index } as CSSProperties}
            >
              <Image
                className={styles.macawStripImage}
                src={nextPanoramaImage}
                alt=""
                fill
                sizes="100vw"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
