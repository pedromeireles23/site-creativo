'use client';

import Image from 'next/image';
import { type ReactNode, useId, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/app/page.module.scss';
import { useSmoothScrollReady } from '@/components/smooth-scroll/smooth-scroll';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const contourPaths = [
  'M80 430 C122 315 224 250 330 272 C422 291 475 245 538 174 C589 117 661 139 687 225',
  'M50 492 C126 361 212 322 310 334 C421 347 487 309 555 229 C603 172 659 186 704 254',
  'M35 555 C145 430 239 389 343 401 C445 413 520 369 592 294 C636 248 676 257 713 291',
  'M61 614 C169 509 273 466 379 475 C477 484 552 449 621 385 C655 354 688 349 716 360',
  'M118 660 C220 586 319 548 418 554 C509 560 580 536 651 486',
  'M111 318 C152 234 222 179 304 173 C391 167 432 128 466 62',
  'M180 307 C215 241 272 216 336 222 C407 229 451 194 492 125',
];

export function MapTrailSection({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isSmoothScrollReady = useSmoothScrollReady();
  const clipId = 'map-trail-' + useId().replaceAll(':', '');

  useGSAP(
    () => {
      if (!isSmoothScrollReady) return;

      const section = sectionRef.current;
      if (!section) return;

      const stage = section.querySelector<HTMLElement>('[data-map-stage]');
      const intro = section.querySelector<HTMLElement>('[data-map-intro]');
      const mapLayout = section.querySelector<HTMLElement>('[data-map-layout]');
      const mapFigure = section.querySelector<HTMLElement>('[data-map-figure]');
      const trail = section.querySelector<SVGPathElement>('[data-map-trail]');
      const carryover = section.querySelector<HTMLElement>(
        '[data-map-carryover]',
      );
      const entryFog = section.querySelector<HTMLElement>(
        '[data-territory-next-fog]',
      );
      const jaguarReveal = section.querySelector<HTMLElement>(
        '[data-map-jaguar-reveal]',
      );
      const jaguarImage = section.querySelector<HTMLElement>(
        '[data-jaguar-image]',
      );
      const jaguarEyeImage = section.querySelector<HTMLElement>(
        '[data-jaguar-eye-image]',
      );
      const jaguarEyes =
        section.querySelector<HTMLElement>('[data-jaguar-eyes]');
      const jaguarVeil =
        section.querySelector<HTMLElement>('[data-jaguar-veil]');
      const jaguarGhost = section.querySelector<HTMLElement>(
        '[data-jaguar-ghost]',
      );
      const jaguarLines = gsap.utils.toArray<HTMLElement>(
        '[data-jaguar-line]',
        section,
      );
      const jaguarMeta = gsap.utils.toArray<HTMLElement>(
        '[data-jaguar-meta]',
        section,
      );
      const labels = gsap.utils.toArray<SVGElement>(
        '[data-map-label]',
        section,
      );

      if (
        !stage ||
        !intro ||
        !mapLayout ||
        !mapFigure ||
        !trail ||
        !carryover ||
        !entryFog ||
        !jaguarReveal ||
        !jaguarImage ||
        !jaguarEyeImage ||
        !jaguarEyes ||
        !jaguarVeil ||
        !jaguarGhost
      ) {
        return;
      }

      const trailLength = trail.getTotalLength();
      gsap.set(trail, {
        strokeDasharray: trailLength,
        strokeDashoffset: trailLength,
      });

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(trail, { strokeDashoffset: 0 });
        return;
      }

      const media = gsap.matchMedia();
      const jaguarVisuals = [jaguarImage, jaguarEyeImage];

      const updateHeader = (progress: number) => {
        const isJaguarVisible = progress >= 0.3;
        section.dataset.headerTheme = isJaguarVisible ? 'dark' : 'light';
        section.dataset.headerChapter = isJaguarVisible
          ? 'olhos'
          : 'territorios';
      };

      media.add('(min-width: 901px)', () => {
        gsap.set(intro, { autoAlpha: 0, y: 32 });
        gsap.set(mapLayout, { autoAlpha: 0 });
        gsap.set(mapFigure, { scale: 0.84 });
        gsap.set(labels, { autoAlpha: 0, y: 12 });
        gsap.set(carryover, { autoAlpha: 1, scale: 1.015 });
        gsap.set(jaguarReveal, { yPercent: 102 });
        gsap.set(jaguarVisuals, { scale: 1.12 });
        gsap.set(jaguarEyes, { autoAlpha: 0 });
        gsap.set(jaguarVeil, { autoAlpha: 0.86 });
        gsap.set(jaguarGhost, { autoAlpha: 0, xPercent: -3 });
        gsap.set(jaguarLines, { yPercent: 115 });
        gsap.set(jaguarMeta, { autoAlpha: 0, y: 18 });

        const entryReveal = gsap.to(intro, {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 88%',
            end: 'top 24%',
            scrub: true,
          },
        });

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + window.innerHeight * 2.5,
            pin: section,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => updateHeader(self.progress),
          },
        });

        timeline
          .to(entryFog, { autoAlpha: 0, yPercent: -28, duration: 0.16 }, 0)
          .to(carryover, { autoAlpha: 0, scale: 1.045, duration: 0.2 }, 0.07)
          .to(intro, { autoAlpha: 0, scale: 0.9, y: -34, duration: 0.14 }, 0.11)
          .to(mapLayout, { autoAlpha: 1, duration: 0.14 }, 0.2)
          .to(mapFigure, { scale: 1, duration: 0.18 }, 0.2)
          .to(trail, { strokeDashoffset: 0, duration: 0.28 }, 0.34)
          .to(
            labels,
            { autoAlpha: 1, y: 0, stagger: 0.035, duration: 0.1 },
            0.4,
          )
          .to(
            mapFigure,
            {
              scale: 1.52,
              xPercent: 13,
              yPercent: 15,
              transformOrigin: '35% 25%',
              duration: 0.28,
            },
            0.65,
          )
          .to(mapLayout, { autoAlpha: 0, duration: 0.18 }, 0.72)
          .to(jaguarReveal, { yPercent: 0, duration: 0.24 }, 0.72)
          .to(jaguarVisuals, { scale: 1, duration: 0.54 }, 0.78)
          .to(jaguarEyes, { autoAlpha: 1, duration: 0.11 }, 0.8)
          .to(jaguarVeil, { autoAlpha: 0.12, duration: 0.34 }, 0.84)
          .to(jaguarGhost, { autoAlpha: 1, xPercent: 0, duration: 0.22 }, 0.94)
          .to(
            jaguarMeta,
            { autoAlpha: 1, y: 0, stagger: 0.035, duration: 0.14 },
            0.98,
          )
          .to(jaguarLines, { yPercent: 0, stagger: 0.07, duration: 0.18 }, 1)
          .to(jaguarEyes, { autoAlpha: 0, duration: 0.16 }, 1.08)
          .to(jaguarReveal, { yPercent: 0, duration: 1.26 }, 1.24);

        return () => {
          entryReveal.kill();
          timeline.kill();
        };
      });

      media.add('(max-width: 900px)', () => {
        gsap.set([intro, mapLayout, jaguarReveal], {
          autoAlpha: 1,
          x: 0,
          y: 0,
          yPercent: 0,
        });
        gsap.set(mapFigure, { scale: 1 });
        gsap.set(labels, { autoAlpha: 1, y: 0 });
        gsap.set(carryover, { autoAlpha: 0 });
        gsap.set(entryFog, { autoAlpha: 1, yPercent: 0 });
        gsap.set(jaguarVisuals, { scale: 1 });
        gsap.set(jaguarEyes, { autoAlpha: 0.28 });
        gsap.set(jaguarVeil, { autoAlpha: 0.18 });
        gsap.set(jaguarGhost, { autoAlpha: 1, xPercent: 0 });
        gsap.set(jaguarLines, { yPercent: 0 });
        gsap.set(jaguarMeta, { autoAlpha: 1, y: 0 });
        gsap.set(trail, { strokeDashoffset: 0 });

        const entryReveal = gsap.from(intro, {
          autoAlpha: 0,
          y: 28,
          duration: 0.7,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: intro,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        });

        const mapReveal = gsap.from(mapLayout, {
          autoAlpha: 0,
          y: 34,
          duration: 0.76,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: mapLayout,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        });

        const trailReveal = gsap.from(trail, {
          strokeDashoffset: trailLength,
          duration: 1.2,
          ease: 'power2.inOut',
          immediateRender: false,
          scrollTrigger: {
            trigger: mapFigure,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          },
        });

        const fogDrift = gsap.fromTo(
          entryFog,
          { yPercent: -10, autoAlpha: 0.78 },
          {
            yPercent: 16,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 34%',
              scrub: 0.25,
            },
          },
        );

        const jaguarRevealMotion = gsap.from(jaguarVisuals, {
          scale: 1.08,
          duration: 1.1,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: jaguarReveal,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        });

        const jaguarCopyReveal = gsap.from(
          [jaguarGhost, ...jaguarMeta, ...jaguarLines],
          {
            autoAlpha: 0,
            y: 22,
            duration: 0.62,
            stagger: 0.045,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: jaguarReveal,
              start: 'top 66%',
              toggleActions: 'play none none reverse',
            },
          },
        );

        return () => {
          entryReveal.kill();
          mapReveal.kill();
          trailReveal.kill();
          fogDrift.kill();
          jaguarRevealMotion.kill();
          jaguarCopyReveal.kill();
        };
      });

      window.requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => media.revert();
    },
    {
      scope: sectionRef,
      dependencies: [isSmoothScrollReady],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.mapTrail}
      aria-labelledby="map-trail-title"
      data-header-theme="light"
      data-header-chapter="territorios"
    >
      <div
        className={styles.mapEntryFog}
        data-territory-next-fog
        aria-hidden="true"
      />

      <div className={styles.mapTrailStage} data-map-stage>
        <div
          className={styles.mapCarryover}
          data-map-carryover
          aria-hidden="true"
        >
          <Image
            className={styles.mapCarryoverImage}
            src="/images/territorios/territorios-transicao-final.png"
            alt=""
            fill
            sizes="100vw"
          />
          <span />
        </div>

        <div className={styles.mapAtmosphere} aria-hidden="true">
          <span />
          <span />
        </div>

        <div className={styles.mapTrailIntro} data-map-intro>
          <p>Do mapa à mata</p>
          <h2 id="map-trail-title">
            O mapa termina.
            <em>O rastro continua.</em>
          </h2>
        </div>

        <div className={styles.mapTrailLayout} data-map-layout>
          <header className={styles.mapTrailCopy}>
            <p>Cartografia da mata · corredor invisível</p>
            <h3>A floresta desenha caminhos que os olhos não veem.</h3>
            <p>
              Água, relevo e sombra abrem passagens que só o corpo reconhece.
            </p>
          </header>

          <figure className={styles.mapFigure} data-map-figure>
            <svg
              viewBox="0 0 720 720"
              aria-labelledby="forest-map-title forest-map-description"
            >
              <title id="forest-map-title">Cartografia abstrata da mata</title>
              <desc id="forest-map-description">
                Curvas de relevo, cursos d&apos;água e um rastro simbólico de
                onça atravessando um território sob a copa.
              </desc>
              <defs>
                <clipPath id={clipId}>
                  <circle cx="360" cy="360" r="314" />
                </clipPath>
                <radialGradient id={clipId + '-glow'} cx="42%" cy="38%" r="62%">
                  <stop offset="0%" stopColor="#496a50" stopOpacity="0.82" />
                  <stop offset="58%" stopColor="#8fb9b4" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#8fb9b4" stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle className={styles.mapFill} cx="360" cy="360" r="314" />
              <g className={styles.mapGrid} clipPath={'url(#' + clipId + ')'}>
                <path d="M40 240 H690" />
                <path d="M40 360 H690" />
                <path d="M40 480 H690" />
                <path d="M240 35 V690" />
                <path d="M360 35 V690" />
                <path d="M480 35 V690" />
              </g>
              <circle
                className={styles.mapAmazonGlow}
                cx="314"
                cy="312"
                r="280"
                fill={'url(#' + clipId + '-glow)'}
                clipPath={'url(#' + clipId + ')'}
              />

              <g
                className={styles.mapContours}
                clipPath={'url(#' + clipId + ')'}
              >
                {contourPaths.map((path) => (
                  <path d={path} key={path} />
                ))}
              </g>

              <path
                className={styles.mapRiver}
                clipPath={'url(#' + clipId + ')'}
                d="M86 82 C168 152 143 241 235 283 C315 320 337 392 309 471 C281 548 346 617 463 680"
              />
              <circle className={styles.mapOutline} cx="360" cy="360" r="314" />

              <path
                className={styles.mapTrailLine}
                data-map-trail
                d="M165 504 C218 449 283 459 315 408 C354 346 329 283 390 247 C441 217 503 239 551 184"
              />

              <g className={styles.mapOrigin} data-map-label>
                <circle cx="165" cy="504" r="5" />
                <circle cx="165" cy="504" r="14" />
              </g>

              <g className={styles.mapDestination} data-map-label>
                <circle cx="551" cy="184" r="5" />
                <circle cx="551" cy="184" r="14" />
              </g>
            </svg>

            <figcaption>
              <span data-map-label>Território sob a copa</span>
              <span data-map-label>Rastro da onça</span>
            </figcaption>
          </figure>

          <p className={styles.mapScale} data-map-label>
            Sem fronteira. Apenas presença.
          </p>
        </div>

        <div className={styles.mapJaguarReveal} data-map-jaguar-reveal>
          {children}
        </div>
      </div>
    </section>
  );
}
