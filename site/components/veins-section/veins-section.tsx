'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/app/page.module.scss';
import { useSmoothScrollReady } from '@/components/smooth-scroll/smooth-scroll';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function VeinsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isSmoothScrollReady = useSmoothScrollReady();

  useGSAP(
    () => {
      if (!isSmoothScrollReady) return;

      const section = sectionRef.current;
      if (!section) return;

      const image = section.querySelector<HTMLElement>('[data-water-image]');
      const info = section.querySelector<HTMLElement>('[data-water-info]');
      const statement = section.querySelector<HTMLElement>(
        '[data-water-statement]',
      );

      if (!image || !info || !statement) return;

      const media = gsap.matchMedia();

      media.add(
        {
          desktop: '(min-width: 901px)',
          compact: '(max-width: 900px)',
          textMotion: '(min-width: 768px)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { compact, textMotion, reduce } = context.conditions as {
            compact: boolean;
            textMotion: boolean;
            reduce: boolean;
          };

          if (reduce) return;

          if (compact) {
            gsap.set(info, { y: 0 });
            gsap.set(statement, { '--water-mask-position': '100%' });

            const imageMotion = gsap.fromTo(
              image,
              { scale: 1.035, yPercent: -1 },
              {
                scale: 1.065,
                yPercent: -3,
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.25,
                  invalidateOnRefresh: true,
                },
              },
            );

            const infoReveal = gsap.from(info, {
              autoAlpha: 0,
              y: 22,
              duration: 0.62,
              ease: 'power3.out',
              immediateRender: false,
              scrollTrigger: {
                trigger: section,
                start: 'top 78%',
                toggleActions: 'play none none reverse',
              },
            });

            const statementReveal = gsap.from(statement, {
              autoAlpha: 0,
              y: 30,
              duration: 0.68,
              ease: 'power3.out',
              immediateRender: false,
              scrollTrigger: {
                trigger: statement,
                start: 'top 84%',
                toggleActions: 'play none none reverse',
              },
            });

            return () => {
              imageMotion.kill();
              infoReveal.kill();
              statementReveal.kill();
            };
          }

          gsap.fromTo(
            image,
            {
              scale: compact ? 1.035 : 1.68,
              yPercent: compact ? -1 : -34,
            },
            {
              scale: compact ? 1.07 : 1.78,
              yPercent: compact ? -3 : -39,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );

          if (textMotion) {
            gsap.fromTo(
              info,
              {
                y: () => Math.min(window.innerHeight * 0.09, 96),
              },
              {
                y: () => -Math.min(window.innerHeight * 0.04, 48),
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 92%',
                  end: 'top 28%',
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          gsap.fromTo(
            statement,
            { '--water-mask-position': '-30%' },
            {
              '--water-mask-position': '100%',
              ease: 'none',
              scrollTrigger: {
                trigger: statement,
                start: compact ? 'top 88%' : 'top 84%',
                end: compact ? 'top 40%' : 'top 34%',
                scrub: true,
              },
            },
          );
        },
      );

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
      className={`${styles.section} ${styles.water}`}
      id="veias"
      aria-labelledby="veias-title"
    >
      <picture className={styles.waterVisual}>
        <source
          media="(max-width: 900px)"
          srcSet="/images/veias-river-mist-mobile.png"
        />
        <Image
          className={styles.waterImage}
          data-water-image
          src="/images/veias-river-mist-desktop.png"
          alt="Rio amazônico serpenteando pela floresta sob a névoa"
          fill
          sizes="100vw"
        />
      </picture>

      <div className={styles.waterWash} aria-hidden="true" />
      <div
        className={`${styles.waterThemeZone} ${styles.waterThemeLight}`}
        data-header-theme="light"
        data-header-chapter="veias"
        aria-hidden="true"
      />
      <div
        className={`${styles.waterThemeZone} ${styles.waterThemeDark}`}
        data-header-theme="dark"
        data-header-chapter="veias"
        aria-hidden="true"
      />

      <div className={styles.waterContentGrid}>
        <div className={styles.waterIntro} data-water-info>
          <p className={styles.chapterLabel}>
            <span>03</span>
            <span aria-hidden="true" className={styles.chapterLine} />
            Veias
          </p>

          <p className={styles.waterLead}>A água não atravessa a floresta.</p>

          <div className={styles.waterNote}>
            <p className={styles.waterNoteTitle}>O ciclo das águas</p>
            <p className={styles.waterNoteBody}>
              Na Amazônia, a água retorna à atmosfera pela floresta e volta em
              forma de chuva. Entre copa, solo e rios, esse ciclo distribui
              umidade e sustenta a vida muito além de suas margens.
            </p>
          </div>
        </div>
      </div>

      <h2
        className={styles.waterStatement}
        id="veias-title"
        data-water-statement
      >
        Ela a mantém em movimento.
      </h2>
    </section>
  );
}
