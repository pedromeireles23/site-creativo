'use client';

import Image from 'next/image';
import { type CSSProperties, useRef } from 'react';
import styles from '@/app/page.module.scss';
import { useSmoothScrollReady } from '@/components/smooth-scroll/smooth-scroll';
import { useMotionProfile } from '@/hooks/use-motion-profile';
import { gsap, scheduleScrollRefresh, useGSAP } from '@/lib/gsap';

const panoramaImage = '/images/territorios/territorios-transicao-final.png';

const moisture = [
  { x: 9, y: 27, size: 2 },
  { x: 17, y: 69, size: 3 },
  { x: 29, y: 39, size: 2 },
  { x: 38, y: 77, size: 2 },
  { x: 47, y: 21, size: 3 },
  { x: 58, y: 64, size: 2 },
  { x: 68, y: 33, size: 2 },
  { x: 76, y: 73, size: 3 },
  { x: 87, y: 24, size: 2 },
  { x: 92, y: 57, size: 2 },
] as const;

type MoistureStyle = CSSProperties & {
  '--speck-x': string;
  '--speck-y': string;
  '--speck-size': string;
};

export function EpilogueSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const isSmoothScrollReady = useSmoothScrollReady();
  const reduceMotion = useMotionProfile() === 'reduced';

  useGSAP(
    () => {
      if (!isSmoothScrollReady) return;

      const root = rootRef.current;
      if (!root) return;

      const whole = root.querySelector<HTMLElement>('[data-whole]');
      const panorama = root.querySelector<HTMLElement>('[data-whole-panorama]');
      const night = root.querySelector<HTMLElement>('[data-whole-night]');
      const wholeLines = gsap.utils.toArray<HTMLElement>(
        '[data-whole-line]',
        root,
      );
      const wholeMeta = gsap.utils.toArray<HTMLElement>(
        '[data-whole-meta]',
        root,
      );
      const wholeCopy = root.querySelector<HTMLElement>('[data-whole-copy]');
      const pulse = root.querySelector<SVGPathElement>('[data-whole-pulse]');
      const signature = root.querySelector<HTMLElement>('[data-signature]');
      const signatureMeta = root.querySelector<HTMLElement>(
        '[data-signature-meta]',
      );
      const signatureRule = root.querySelector<HTMLElement>(
        '[data-signature-rule]',
      );
      const signatureBrand = root.querySelector<HTMLElement>(
        '[data-signature-brand]',
      );
      const signatureName = root.querySelector<HTMLElement>(
        '[data-signature-name]',
      );
      const specks = gsap.utils.toArray<HTMLElement>(
        '[data-signature-speck]',
        root,
      );

      if (
        !whole ||
        !panorama ||
        !night ||
        !wholeCopy ||
        !pulse ||
        !signature ||
        !signatureMeta ||
        !signatureRule ||
        !signatureBrand ||
        !signatureName
      ) {
        return;
      }

      if (reduceMotion) {
        return;
      }

      const media = gsap.matchMedia();

      const buildTimelines = (scrollDistance: number, compact: boolean) => {
        gsap.set(panorama, {
          autoAlpha: 1,
          scale: compact ? 1.045 : 1.075,
        });
        gsap.set(night, { opacity: 0.34 });
        gsap.set(wholeLines, { yPercent: 118 });
        gsap.set(wholeMeta, { autoAlpha: 0, y: 16 });
        gsap.set(pulse, { strokeDashoffset: 1 });

        const wholeTimeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: whole,
            start: 'top top',
            end: () => '+=' + window.innerHeight * scrollDistance,
            pin: whole,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        wholeTimeline
          .to(panorama, { scale: 1, duration: 0.72 }, 0)
          .to(
            wholeMeta,
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.035,
              duration: 0.13,
            },
            0.13,
          )
          .to(
            wholeLines,
            {
              yPercent: 0,
              stagger: 0.055,
              duration: 0.18,
            },
            0.18,
          )
          .to(pulse, { strokeDashoffset: 0, duration: 0.3 }, 0.2)
          .to(night, { opacity: 0.72, duration: 0.72 }, 0)
          .to(
            wholeCopy,
            {
              autoAlpha: 0,
              y: compact ? -18 : -30,
              duration: 0.12,
            },
            0.84,
          )
          .to(wholeMeta, { autoAlpha: 0, y: -10, duration: 0.1 }, 0.85)
          .to(pulse, { opacity: 0, duration: 0.1 }, 0.85)
          .to(night, { opacity: 0.9, duration: 0.16 }, 0.82);

        gsap.set(signatureMeta, { autoAlpha: 0, y: 14 });
        gsap.set(signatureRule, {
          scaleX: 0,
          transformOrigin: '50% 50%',
        });
        gsap.set(signatureBrand, { autoAlpha: 0, y: 16 });
        gsap.set(signatureName, {
          autoAlpha: 0,
          y: compact ? 30 : 48,
          scale: compact ? 0.98 : 0.965,
        });
        gsap.set(specks, {
          autoAlpha: 0,
          y: (index) => (index % 2 === 0 ? 18 : -14),
        });

        const signatureTimeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: signature,
            start: 'top 92%',
            end: 'top 18%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        signatureTimeline
          .to(
            specks,
            {
              autoAlpha: (index) => (index % 3 === 0 ? 0.62 : 0.36),
              y: 0,
              stagger: { each: 0.025, from: 'random' },
              duration: 0.32,
            },
            0,
          )
          .to(signatureMeta, { autoAlpha: 1, y: 0, duration: 0.18 }, 0.1)
          .to(signatureRule, { scaleX: 1, duration: 0.24 }, 0.22)
          .to(signatureBrand, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.32)
          .to(
            signatureName,
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.42 },
            0.38,
          );

        return () => {
          wholeTimeline.kill();
          signatureTimeline.kill();
        };
      };

      const buildCompactTimelines = () => {
        gsap.set(panorama, { autoAlpha: 1, scale: 1.055 });
        gsap.set(night, { opacity: 0.42 });
        gsap.set(wholeLines, { yPercent: 0 });
        gsap.set(wholeMeta, { autoAlpha: 1, y: 0 });
        gsap.set(wholeCopy, { autoAlpha: 1, y: 0 });
        gsap.set(pulse, { strokeDashoffset: 0, opacity: 0.5 });
        gsap.set(signatureMeta, { autoAlpha: 1, y: 0 });
        gsap.set(signatureRule, { scaleX: 1, transformOrigin: '50% 50%' });
        gsap.set(signatureBrand, { autoAlpha: 1, y: 0 });
        gsap.set(signatureName, { autoAlpha: 1, y: 0, scale: 1 });
        gsap.set(specks, { autoAlpha: 0.36, y: 0 });

        const wholeTimeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: whole,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        });

        wholeTimeline
          .to(panorama, { scale: 1, duration: 1 }, 0)
          .to(night, { opacity: 0.82, duration: 1 }, 0)
          .to(pulse, { opacity: 0.15, duration: 0.7 }, 0.3)
          .to(wholeCopy, { y: -12, autoAlpha: 0.86, duration: 0.46 }, 0.54);

        const signatureCopyReveal = gsap.from(
          [signatureMeta, signatureBrand, signatureName],
          {
            autoAlpha: 0,
            y: 24,
            duration: 0.72,
            stagger: 0.08,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: signature,
              start: 'top 76%',
              toggleActions: 'play none none reverse',
            },
          },
        );

        const signatureRuleReveal = gsap.from(signatureRule, {
          scaleX: 0,
          duration: 0.58,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: signature,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          },
        });

        return () => {
          wholeTimeline.kill();
          signatureCopyReveal.kill();
          signatureRuleReveal.kill();
        };
      };

      media.add('(min-width: 901px)', () => buildTimelines(2, false));
      media.add('(max-width: 900px)', buildCompactTimelines);

      scheduleScrollRefresh();

      return () => media.revert();
    },
    {
      scope: rootRef,
      dependencies: [isSmoothScrollReady, reduceMotion],
      revertOnUpdate: true,
    },
  );

  return (
    <div className={styles.epilogueSequence} ref={rootRef}>
      <section
        className={styles.whole}
        id="inteiro"
        aria-labelledby="inteiro-title"
        data-header-theme="dark"
        data-header-chapter="inteiro"
        data-whole
      >
        <div className={styles.wholeStage}>
          <div className={styles.wholePanoramaFrame}>
            <Image
              className={styles.wholePanorama}
              data-whole-panorama
              src={panoramaImage}
              alt="A floresta amazônica inteira entre a copa e a névoa"
              fill
              sizes="100vw"
            />
          </div>

          <div
            className={styles.wholeNight}
            data-whole-night
            aria-hidden="true"
          />

          <svg
            className={styles.wholePulse}
            viewBox="0 0 1200 180"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              data-whole-pulse
              pathLength="1"
              d="M0 112 C118 70 202 142 326 91 C450 39 527 129 650 82 C786 30 867 115 980 68 C1060 34 1128 54 1200 31"
            />
          </svg>

          <div className={styles.wholeContent}>
            <p className={styles.chapterLabel} data-whole-meta>
              <span>08</span>
              <span aria-hidden="true" className={styles.chapterLine} />
              Inteiro
            </p>

            <div className={styles.wholeCopy} data-whole-copy>
              <p data-whole-meta>Um só corpo · em movimento</p>
              <h2 id="inteiro-title">
                <span className={styles.wholeLineClip}>
                  <span data-whole-line>Água. Raiz. Pelo.</span>
                </span>
                <span className={styles.wholeLineClip}>
                  <span data-whole-line>Pena. Luz.</span>
                </span>
                <span className={styles.wholeLineClip}>
                  <em data-whole-line>Tudo pulsa ao mesmo tempo.</em>
                </span>
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.signature}`}
        id="silencio"
        aria-labelledby="silencio-title"
        data-header-theme="dark"
        data-header-chapter="silencio"
        data-signature
      >
        <Image
          className={styles.signatureBackground}
          src={panoramaImage}
          alt=""
          fill
          sizes="100vw"
        />
        <div className={styles.signatureVeil} aria-hidden="true" />

        <div className={styles.signatureSpecks} aria-hidden="true">
          {moisture.map((speck, index) => (
            <span
              data-signature-speck
              key={`${speck.x}-${speck.y}-${index}`}
              style={
                {
                  '--speck-x': `${speck.x}%`,
                  '--speck-y': `${speck.y}%`,
                  '--speck-size': `${speck.size}px`,
                } as MoistureStyle
              }
            />
          ))}
        </div>

        <p
          className={`${styles.chapterLabel} ${styles.signatureChapter}`}
          data-signature-meta
        >
          <span>09</span>
          <span aria-hidden="true" className={styles.chapterLine} />
          Silêncio
        </p>

        <div className={styles.signatureInner}>
          <span
            className={styles.signatureRule}
            data-signature-rule
            aria-hidden="true"
          />
          <p data-signature-brand>Floresta Viva</p>
          <h2 id="silencio-title" data-signature-name>
            Pedro Meireles
          </h2>
        </div>
      </section>
    </div>
  );
}
