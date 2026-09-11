'use client';

import { useRef } from 'react';
import Image from 'next/image';
import styles from '@/app/page.module.scss';
import { useSmoothScrollReady } from '@/components/smooth-scroll/smooth-scroll';
import { MOTION_QUERIES, useMotionProfile } from '@/hooks/use-motion-profile';
import {
  gsap,
  scheduleScrollRefresh,
  useGSAP,
} from '@/lib/gsap';

export function HeroExperience() {
  const heroRef = useRef<HTMLElement>(null);
  const breathRef = useRef<HTMLElement>(null);
  const isSmoothScrollReady = useSmoothScrollReady();
  const reduceMotion = useMotionProfile() === 'reduced';

  useGSAP(
    () => {
      if (!isSmoothScrollReady) return;

      const hero = heroRef.current;
      const breath = breathRef.current;
      if (!hero || !breath) return;

      const pinnedHero = hero.querySelector<HTMLElement>('[data-hero-pin]');
      const title = hero.querySelector<HTMLElement>('[data-hero-title]');
      const intro = hero.querySelector<HTMLElement>('[data-hero-intro]');
      const cue = hero.querySelector<HTMLElement>('[data-scroll-cue]');
      const cuePreview = hero.querySelector<HTMLElement>(
        '[data-scroll-cue-preview]',
      );
      const cuePreviewImage = hero.querySelector<HTMLElement>(
        '[data-scroll-cue-preview-image]',
      );
      const cueArrow = hero.querySelector<HTMLElement>(
        '[data-scroll-cue-arrow]',
      );
      const background = hero.querySelector<HTMLElement>(
        '[data-hero-background]',
      );
      const shade = hero.querySelector<HTMLElement>('[data-hero-shade]');
      const atmosphericMist =
        hero.querySelector<HTMLElement>('[data-hero-mist]');
      const midForest = hero.querySelector<HTMLElement>('[data-forest-mid]');
      const frontForest = hero.querySelector<HTMLElement>(
        '[data-forest-front]',
      );
      const transitionPlane = hero.querySelector<HTMLElement>(
        '[data-transition-plane]',
      );
      const breathChapter = breath.querySelector<HTMLElement>(
        '[data-breath-chapter]',
      );
      const textReveal =
        breath.querySelector<HTMLElement>('[data-text-reveal]');
      const breathKicker = breath.querySelector<HTMLElement>(
        '[data-breath-kicker]',
      );
      const breathKickerText = breath.querySelector<HTMLElement>(
        '[data-breath-kicker-text]',
      );
      const scribblePaths = breath.querySelectorAll<SVGPathElement>(
        '[data-scribble-path]',
      );

      if (
        !pinnedHero ||
        !title ||
        !intro ||
        !cue ||
        !cuePreview ||
        !cuePreviewImage ||
        !cueArrow ||
        !background ||
        !shade ||
        !atmosphericMist ||
        !midForest ||
        !frontForest ||
        !transitionPlane ||
        !breathChapter ||
        !breathKicker ||
        !breathKickerText ||
        !textReveal
      ) {
        return;
      }

      const canHover = window.matchMedia(
        '(hover: hover) and (pointer: fine)',
      ).matches;
      const collapsedCueHeight = cue.getBoundingClientRect().height;
      const cueTargets = [cue, cuePreview, cuePreviewImage, cueArrow];

      const expandCue = () => {
        const expandedHeight = Math.min(
          296,
          Math.max(244, window.innerHeight * 0.39),
        );

        gsap.to(cue, {
          height: expandedHeight,
          borderRadius: '0.3rem',
          borderLeftColor: 'rgb(243 240 231 / 38%)',
          borderRightColor: 'rgb(243 240 231 / 38%)',
          boxShadow: '0 1.7rem 4.8rem rgb(3 12 8 / 34%)',
          duration: reduceMotion ? 0 : 0.72,
          ease: 'power4.out',
          overwrite: true,
        });
        gsap.to(cuePreview, {
          autoAlpha: 1,
          duration: reduceMotion ? 0 : 0.38,
          ease: 'power2.out',
          overwrite: true,
        });
        gsap.to(cuePreviewImage, {
          scale: 1,
          duration: reduceMotion ? 0 : 1.05,
          ease: 'power3.out',
          overwrite: true,
        });
        gsap.to(cueArrow, {
          x: 3,
          y: 3,
          duration: reduceMotion ? 0 : 0.45,
          ease: 'power3.out',
          overwrite: true,
        });
      };

      const collapseCue = () => {
        gsap.to(cue, {
          height: collapsedCueHeight,
          borderRadius: 0,
          borderLeftColor: 'rgb(243 240 231 / 0%)',
          borderRightColor: 'rgb(243 240 231 / 0%)',
          boxShadow: '0 0 0 rgb(3 12 8 / 0%)',
          duration: reduceMotion ? 0 : 0.56,
          ease: 'power3.inOut',
          overwrite: true,
        });
        gsap.to(cuePreview, {
          autoAlpha: 0,
          duration: reduceMotion ? 0 : 0.28,
          ease: 'power2.in',
          overwrite: true,
        });
        gsap.to(cuePreviewImage, {
          scale: 1.08,
          duration: reduceMotion ? 0 : 0.56,
          ease: 'power3.inOut',
          overwrite: true,
        });
        gsap.to(cueArrow, {
          x: 0,
          y: 0,
          duration: reduceMotion ? 0 : 0.38,
          ease: 'power3.out',
          overwrite: true,
        });
      };

      const onCueFocusOut = (event: FocusEvent) => {
        if (!cue.contains(event.relatedTarget as Node | null)) collapseCue();
      };

      if (canHover) {
        cue.addEventListener('pointerenter', expandCue);
        cue.addEventListener('pointerleave', collapseCue);
      }
      cue.addEventListener('focusin', expandCue);
      cue.addEventListener('focusout', onCueFocusOut);

      const media = gsap.matchMedia();

      media.add(
        {
          desktop: MOTION_QUERIES.wide,
          compact: MOTION_QUERIES.compact,
          reduce: MOTION_QUERIES.reduced,
        },
        (context) => {
          const { compact, reduce } = context.conditions as {
            compact: boolean;
            reduce: boolean;
          };
          if (reduce) return;

          if (compact) {
            gsap.set(title, {
              scaleX: 0.82,
              transformOrigin: '50% 100%',
              filter: 'blur(0px)',
            });
            gsap.set(midForest, { y: 0, yPercent: 100, scale: 1 });
            gsap.set(frontForest, { y: 0, yPercent: 100, scale: 1 });
            gsap.set(transitionPlane, {
              rotationX: 90,
              autoAlpha: 1,
              y: 0,
              yPercent: 0,
            });
            gsap.set(textReveal, {
              autoAlpha: 1,
              y: 0,
              '--mask-position': '-40%',
            });

            const heroTimeline = gsap.timeline({
              defaults: { duration: 1, ease: 'none' },
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
                pin: pinnedHero,
                pinSpacing: false,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            heroTimeline
              .fromTo(
                background,
                { scale: 1.025, yPercent: 0 },
                { scale: 1.075, yPercent: -2.5 },
                0,
              )
              .to(shade, { opacity: 0.42 }, 0)
              .to(
                atmosphericMist,
                { xPercent: 6, yPercent: -16, scale: 1.14 },
                0,
              )
              .to(title, { y: '-60svh', filter: 'blur(10px)' }, 0)
              .to(intro, { yPercent: -38, opacity: 0, duration: 0.3 }, 0.52)
              .to(cue, { opacity: 0, duration: 0.24 }, 0.48)
              .fromTo(
                midForest,
                { y: 0, yPercent: 100 },
                { y: 0, yPercent: -80 },
                0,
              )
              .fromTo(
                frontForest,
                { y: 0, yPercent: 100 },
                { y: 0, yPercent: -10 },
                0,
              )
              .fromTo(
                transitionPlane,
                { rotationX: 90 },
                { rotationX: 0, duration: 0.35 },
                0.4,
              );

            const chapterReveal = gsap.from(breathChapter, {
              autoAlpha: 0,
              y: 18,
              duration: 0.52,
              ease: 'power2.out',
              immediateRender: false,
              scrollTrigger: {
                trigger: breath,
                start: 'top 86%',
                toggleActions: 'play none none reverse',
              },
            });

            const copyReveal = gsap.fromTo(
              textReveal,
              { '--mask-position': '-40%', y: 18 },
              {
                '--mask-position': '100%',
                y: 0,
                ease: 'none',
                immediateRender: false,
                scrollTrigger: {
                  trigger: textReveal,
                  start: 'top 86%',
                  end: 'top 38%',
                  scrub: 0.25,
                  invalidateOnRefresh: true,
                },
              },
            );

            const kickerReveal = gsap.timeline({
              scrollTrigger: {
                trigger: breathKicker,
                start: 'top 84%',
                toggleActions: 'play none none reverse',
              },
            });

            kickerReveal.fromTo(
              breathKickerText,
              { autoAlpha: 0, y: 10 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
                immediateRender: false,
              },
              0,
            );

            if (scribblePaths.length) {
              kickerReveal.fromTo(
                scribblePaths,
                { strokeDashoffset: 520 },
                {
                  strokeDashoffset: 0,
                  duration: 0.86,
                  stagger: 0.06,
                  ease: 'power2.out',
                  immediateRender: false,
                },
                0.08,
              );
            }

            return () => {
              heroTimeline.kill();
              chapterReveal.kill();
              copyReveal.kill();
              kickerReveal.kill();
            };
          }

          gsap.set(intro, { xPercent: 0 });
          gsap.set(title, {
            xPercent: 0,
            scaleX: 0.86,
            transformOrigin: '50% 100%',
          });

          const timeline = gsap.timeline({
            defaults: { duration: 1, ease: 'none' },
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              pin: pinnedHero,
              pinSpacing: false,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .fromTo(
              background,
              { scale: 1.025, yPercent: 0 },
              { scale: 1.075, yPercent: -2.5 },
              0,
            )
            .to(shade, { opacity: 0.42 }, 0)
            .to(atmosphericMist, { xPercent: 6, yPercent: -16, scale: 1.14 }, 0)
            .to(
              title,
              {
                y: '-60svh',
                filter: 'blur(10px)',
              },
              0,
            )
            .to(intro, { yPercent: -38, opacity: 0, duration: 0.3 }, 0.52)
            .to(cue, { opacity: 0, duration: 0.24 }, 0.48)
            .fromTo(midForest, { yPercent: 100 }, { yPercent: -80 }, 0)
            .fromTo(frontForest, { yPercent: 100 }, { yPercent: -10 }, 0)
            .fromTo(
              transitionPlane,
              { rotationX: 90 },
              { rotationX: 0, duration: 0.35 },
              0.4,
            );

          gsap.fromTo(
            breathChapter,
            { autoAlpha: 0, y: 12 },
            {
              autoAlpha: 1,
              y: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: breath,
                start: 'top 70%',
                end: 'top 45%',
                scrub: true,
              },
            },
          );

          gsap.fromTo(
            textReveal,
            { '--mask-position': '-40%' },
            {
              '--mask-position': '100%',
              ease: 'none',
              scrollTrigger: {
                trigger: textReveal,
                start: 'top 80%',
                end: 'top 32%',
                scrub: true,
              },
            },
          );

          if (scribblePaths.length) {
            gsap.fromTo(
              scribblePaths,
              { strokeDashoffset: 520 },
              {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: textReveal,
                  start: 'top 86%',
                  end: 'top 58%',
                  scrub: true,
                },
              },
            );
          }
        },
      );

      scheduleScrollRefresh();
      return () => {
        if (canHover) {
          cue.removeEventListener('pointerenter', expandCue);
          cue.removeEventListener('pointerleave', collapseCue);
        }
        cue.removeEventListener('focusin', expandCue);
        cue.removeEventListener('focusout', onCueFocusOut);
        gsap.killTweensOf(cueTargets);
        media.revert();
      };
    },
    {
      scope: heroRef,
      dependencies: [isSmoothScrollReady, reduceMotion],
      revertOnUpdate: true,
    },
  );

  return (
    <>
      <section
        ref={heroRef}
        className={styles.heroSequence}
        id="despertar"
        aria-labelledby="hero-title"
        data-header-theme="dark"
      >
        <div className={styles.heroTransitionBridge} aria-hidden="true">
          <div className={styles.heroTransitionPlane} data-transition-plane>
            <div className={styles.heroTransitionCanvas}>
              <Image
                className={styles.heroTransitionMist}
                src="/images/forest-mist-transition.png"
                alt=""
                fill
                sizes="100vw"
                fetchPriority="low"
              />
            </div>
          </div>
        </div>

        <div className={styles.hero} data-hero-pin>
          <div className={styles.heroStage}>
            {reduceMotion ? (
              <Image
                className={styles.heroImage}
                data-hero-background
                src="/videos/hero-fauna-v4-poster.jpg"
                alt="Onça-pintada em meio à floresta amazônica"
                fill
                preload
                sizes="100vw"
              />
            ) : (
              <video
                className={styles.heroImage}
                data-hero-background
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="/videos/hero-fauna-v4-poster.jpg"
                aria-hidden="true"
              >
                <source src="/videos/hero-fauna-v4.webm" type="video/webm" />
                <source src="/videos/hero-fauna-v4.mp4" type="video/mp4" />
              </video>
            )}
            <div
              className={styles.heroShade}
              data-hero-shade
              aria-hidden="true"
            />
            <div
              className={styles.heroMist}
              data-hero-mist
              aria-hidden="true"
            />
            <div
              className={styles.heroExitMist}
              data-hero-exit-mist
              aria-hidden="true"
            />

            <Image
              className={`${styles.heroForest} ${styles.heroForestMid}`}
              data-forest-mid
              src="/images/forest-transition-mid.png"
              alt=""
              fill
              sizes="100vw"
              fetchPriority="low"
              aria-hidden="true"
            />

            <div className={styles.heroIntro} data-hero-intro>
              <p>Um bioma em movimento</p>
              <p>Há lugares que apenas respiram mais baixo.</p>
            </div>

            <h1 className={styles.heroTitle} id="hero-title" data-hero-title>
              Amazônia
            </h1>

            <Image
              className={`${styles.heroForest} ${styles.heroForestFront}`}
              data-forest-front
              src="/images/forest-transition-front.png"
              alt=""
              fill
              sizes="100vw"
              fetchPriority="low"
              aria-hidden="true"
            />

            <a
              className={styles.scrollCue}
              data-cursor-label="Assistir"
              data-scroll-cue
              href="https://www.youtube.com/watch?v=SSdwbEcAsWc&t=12s"
              target="_blank"
              rel="noreferrer"
              aria-label="Assistir ao filme no YouTube (abre em nova aba)"
            >
              <span
                className={styles.scrollCuePreview}
                data-scroll-cue-preview
                aria-hidden="true"
              >
                <Image
                  className={styles.scrollCuePreviewImage}
                  data-scroll-cue-preview-image
                  src="/images/hero-amazon-dawn.png"
                  alt=""
                  fill
                  sizes="17rem"
                />
                <span className={styles.scrollCuePreviewShade} />
              </span>

              <span className={styles.scrollCueContent}>
                <span>Assistir ao filme</span>
                <span
                  className={styles.scrollCueArrow}
                  data-scroll-cue-arrow
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 16 16" fill="none">
                    <path d="M4 4h8v8M12 4 4 12" />
                  </svg>
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <section
        ref={breathRef}
        className={`${styles.section} ${styles.breath}`}
        id="folego"
        aria-labelledby="folego-title"
        data-header-theme="light"
        data-header-chapter="folego"
      >
        <p className={styles.chapterLabel} data-breath-chapter>
          <span>02</span>
          <span aria-hidden="true" className={styles.chapterLine} />
          Fôlego
        </p>

        <div className={styles.breathComposition}>
          <div className={styles.breathKicker} data-breath-kicker>
            <svg viewBox="0 0 230 86" aria-hidden="true">
              <path
                data-scribble-path
                d="M10 43C35 9 174 4 216 34C252 60 62 94 17 55C-7 34 91 12 201 43"
              />
              <path data-scribble-path d="M20 51C61 73 187 75 216 38" />
            </svg>
            <p data-breath-kicker-text>Um organismo vivo</p>
          </div>

          <div className={styles.breathReveal} data-text-reveal>
            <h2 id="folego-title">
              Antes de ser paisagem, a floresta respira.
            </h2>
          </div>
        </div>
      </section>
    </>
  );
}
