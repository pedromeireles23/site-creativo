'use client';

import { useId, useRef } from 'react';
import Image from 'next/image';
import styles from '@/app/page.module.scss';
import { useSmoothScrollReady } from '@/components/smooth-scroll/smooth-scroll';
import { MOTION_QUERIES, useMotionProfile } from '@/hooks/use-motion-profile';
import { gsap, scheduleScrollRefresh, useGSAP } from '@/lib/gsap';

const territories = [
  {
    number: '01',
    name: 'Terra firme',
    type: 'Chão alto · não inundável',
    copy: 'Onde os grandes rios não chegam, árvores altas sustentam a parte mais antiga da floresta.',
    image: '/images/territorios/terra-firme.png',
  },
  {
    number: '02',
    name: 'Várzea',
    type: 'Água branca · sazonal',
    copy: 'Durante parte do ano, o rio avança. Quando recua, deixa nutrientes e redesenha a paisagem.',
    image: '/images/territorios/varzea.png',
  },
  {
    number: '03',
    name: 'Igapó',
    type: 'Água negra · inundável',
    copy: 'Nas águas escuras e lentas, raízes e troncos passam meses habitando seus próprios reflexos.',
    image: '/images/territorios/igapo.png',
  },
];

export function TerritoriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const revealId = `territory-reveal-${useId().replaceAll(':', '')}`;
  const isSmoothScrollReady = useSmoothScrollReady();
  const reduceMotion = useMotionProfile() === 'reduced';

  useGSAP(
    () => {
      if (!isSmoothScrollReady) return;

      const section = sectionRef.current;
      if (!section) return;

      const stage = section.querySelector<HTMLElement>(
        '[data-territory-stage]',
      );
      const opening = section.querySelector<HTMLElement>(
        '[data-territory-opening]',
      );
      const openingImage = section.querySelector<HTMLElement>(
        '[data-territory-opening-image]',
      );
      const heading = section.querySelector<HTMLElement>(
        '[data-territory-heading]',
      );
      const openingMist = section.querySelector<HTMLElement>(
        '[data-territory-opening-mist]',
      );
      const texture = section.querySelector<HTMLElement>(
        '[data-territory-texture]',
      );
      const revealRects = gsap.utils.toArray<SVGRectElement>(
        '[data-territory-reveal-strip]',
        section,
      );
      const track = section.querySelector<HTMLElement>(
        '[data-territory-track]',
      );
      const cards = gsap.utils.toArray<HTMLElement>(
        '[data-territory-card]',
        section,
      );
      const finale = section.querySelector<HTMLElement>(
        '[data-territory-finale]',
      );
      const finaleText = section.querySelector<HTMLElement>(
        '[data-territory-finale-text]',
      );
      const nextSection = section.nextElementSibling as HTMLElement | null;
      const nextFog = nextSection?.querySelector<HTMLElement>(
        '[data-territory-next-fog]',
      );
      const hint = section.querySelector<HTMLElement>('[data-territory-hint]');
      const lastCard = cards.at(-1);

      if (
        !stage ||
        !opening ||
        !openingImage ||
        !heading ||
        !texture ||
        !track ||
        !finale ||
        !finaleText ||
        !hint ||
        !lastCard ||
        revealRects.length !== 3
      ) {
        return;
      }

      if (reduceMotion) {
        return;
      }

      const media = gsap.matchMedia();

      media.add(MOTION_QUERIES.cinematic, () => {
        const compact = window.matchMedia(MOTION_QUERIES.compact).matches;
        const viewportHeight = window.innerHeight;
        const horizontalDistance = Math.max(
          0,
          track.scrollWidth - window.innerWidth,
        );
        const introDistance = (compact ? 1.15 : 1.5) * viewportHeight;
        const revealDistance = (compact ? 0.85 : 1) * viewportHeight;
        const horizontalDuration = (compact ? 1.35 : 1.5) * horizontalDistance;

        gsap.set(revealRects[0], { attr: { width: 0.3333 } });
        gsap.set(revealRects[1], { attr: { width: 0.3334 } });
        gsap.set(revealRects[2], { attr: { width: 0.3333 } });
        gsap.set(texture, { clipPath: 'inset(0% 0% 0% 0%)' });
        gsap.set(cards, { y: 0, autoAlpha: 1 });
        gsap.set(finaleText, { x: compact ? 24 : 56, autoAlpha: 0 });
        gsap.set(hint, { autoAlpha: 0 });

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () =>
              `+=${introDistance + revealDistance + horizontalDuration}`,
            pin: stage,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .fromTo(
            openingImage,
            { scale: 1.015 },
            { scale: compact ? 1.055 : 1.075, duration: introDistance },
            0,
          )
          .fromTo(
            heading,
            { scale: 1 },
            {
              scale: compact ? 0.62 : 0.68,
              transformOrigin: 'center center',
              duration: 0.5 * introDistance,
            },
            0,
          )
          .addLabel('clipReveal', 0.5 * introDistance)
          .to(
            revealRects[2],
            { attr: { width: 0 }, duration: 0.5 * revealDistance },
            'clipReveal',
          )
          .to(
            revealRects[1],
            { attr: { width: 0 }, duration: 0.75 * revealDistance },
            'clipReveal',
          )
          .to(
            revealRects[0],
            { attr: { width: 0 }, duration: revealDistance },
            'clipReveal',
          )
          .addLabel(
            'horizontalScroll',
            0.5 * introDistance + 0.3 * revealDistance,
          )
          .to(
            track,
            { x: -horizontalDistance, duration: horizontalDuration },
            'horizontalScroll',
          )
          .to(
            hint,
            { autoAlpha: 0.72, duration: 0.08 * horizontalDuration },
            'horizontalScroll',
          )
          .to(
            hint,
            { autoAlpha: 0, duration: 0.08 * horizontalDuration },
            `-=${0.24 * horizontalDuration}`,
          );

        const wipeTrigger = {
          trigger: lastCard,
          start: 'right-=30% right',
          endTrigger: finale,
          end: 'left left',
          containerAnimation: timeline,
          scrub: true,
        } as const;

        const backgroundWipe = gsap.fromTo(
          texture,
          { clipPath: 'inset(0% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 100% 0% 0%)',
            ease: 'none',
            scrollTrigger: wipeTrigger,
          },
        );

        const finaleReveal = gsap.fromTo(
          finaleText,
          { x: compact ? 24 : 56, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: finale,
              start: 'left 62%',
              end: 'left 12%',
              containerAnimation: timeline,
              scrub: true,
            },
          },
        );

        const nextFogReveal =
          nextSection && nextFog
            ? gsap.fromTo(
                nextFog,
                { yPercent: 8, autoAlpha: 1 },
                {
                  yPercent: -18,
                  autoAlpha: 1,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: nextSection,
                    start: 'top bottom',
                    end: 'top top',
                    scrub: true,
                  },
                },
              )
            : null;

        return () => {
          backgroundWipe.kill();
          finaleReveal.kill();
          nextFogReveal?.kill();
          timeline.kill();
        };
      });

      media.add(MOTION_QUERIES.shortLandscape, () => {
        gsap.set(cards, { autoAlpha: 1, y: 0 });
        gsap.set(finaleText, { autoAlpha: 1, x: 0 });

        const openingMotion = gsap.fromTo(
          openingImage,
          { scale: 1.025 },
          {
            scale: 1.075,
            ease: 'none',
            scrollTrigger: {
              trigger: opening,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.25,
              invalidateOnRefresh: true,
            },
          },
        );

        const openingMistMotion = openingMist
          ? gsap.fromTo(
              openingMist,
              { yPercent: 16, autoAlpha: 0.72 },
              {
                yPercent: -5,
                autoAlpha: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: opening,
                  start: 'top top',
                  end: 'bottom top',
                  scrub: 0.25,
                  invalidateOnRefresh: true,
                },
              },
            )
          : null;

        const headingReveal = gsap.from(heading, {
          autoAlpha: 0,
          y: 24,
          duration: 0.72,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: opening,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          },
        });

        const cardReveals = cards.map((card) =>
          gsap.from(card, {
            autoAlpha: 0,
            y: 30,
            duration: 0.68,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }),
        );

        const finaleReveal = gsap.from(finaleText, {
          autoAlpha: 0,
          y: 28,
          duration: 0.72,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: finale,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        });

        return () => {
          openingMotion.kill();
          openingMistMotion?.kill();
          headingReveal.kill();
          cardReveals.forEach((tween) => tween.kill());
          finaleReveal.kill();
        };
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
      className={`${styles.section} ${styles.territories}`}
      id="territorios"
      aria-labelledby="territorios-title"
      data-header-theme="dark"
    >
      <div className={styles.territoryStage} data-territory-stage>
        <div className={styles.territoryFinalBackground} aria-hidden="true">
          <Image
            className={styles.territoryFinalBackgroundImage}
            src="/images/territorios/territorios-transicao-final.png"
            alt=""
            fill
            sizes="100vw"
          />
          <div className={styles.territoryFinaleShade} />
          <div className={styles.territoryFinaleMist} />
        </div>

        <div className={styles.territoryTexture} data-territory-texture>
          <Image
            className={styles.territoryTextureImage}
            src="/images/territorios/territorios-textura.png"
            alt=""
            fill
            sizes="100vw"
            aria-hidden="true"
          />
          <div
            className={styles.territoryTextureShade}
            data-territory-texture-shade
            aria-hidden="true"
          />
        </div>

        <svg
          className={styles.territoryClipDefs}
          width="0"
          height="0"
          aria-hidden="true"
        >
          <defs>
            <clipPath id={revealId} clipPathUnits="objectBoundingBox">
              <rect
                data-territory-reveal-strip
                x="0"
                y="0"
                width="0.3333"
                height="1"
              />
              <rect
                data-territory-reveal-strip
                x="0.3333"
                y="0"
                width="0.3334"
                height="1"
              />
              <rect
                data-territory-reveal-strip
                x="0.6667"
                y="0"
                width="0.3333"
                height="1"
              />
            </clipPath>
          </defs>
        </svg>

        <div
          className={styles.territoryOpening}
          data-territory-opening
          style={{ clipPath: `url(#${revealId})` }}
        >
          <Image
            className={styles.territoryOpeningImage}
            data-territory-opening-image
            src="/images/territorios/territorios-abertura.png"
            alt="Vista aérea da floresta amazônica ao amanhecer"
            fill
            sizes="100vw"
          />
          <div className={styles.territoryOpeningShade} aria-hidden="true" />
          <div
            className={styles.territoryOpeningMist}
            data-territory-opening-mist
            aria-hidden="true"
          />

          <p className={styles.territoryChapter} data-territory-intro>
            <span>05</span>
            <span aria-hidden="true" className={styles.territoryChapterLine} />
            Territórios
          </p>

          <div className={styles.territoryHeading} data-territory-heading>
            <p>Três formas de habitar a água</p>
            <h2 id="territorios-title">
              <span className={styles.territoryTitleMain}>A floresta</span>
              <span className={styles.territoryTitleEditorial}>
                não é uma só.
              </span>
            </h2>
          </div>
        </div>

        <div className={styles.territoryCards} data-territory-track>
          <div className={styles.territoryLeadPanel} aria-hidden="true" />
          {territories.map((territory) => {
            const glassFilterId = `territory-glass-${territory.number}`;

            return (
              <div className={styles.territoryCardPanel} key={territory.name}>
                <article className={styles.territoryCard} data-territory-card>
                  <svg
                    className={styles.territoryGlassSvg}
                    width="0"
                    height="0"
                    aria-hidden="true"
                  >
                    <defs>
                      <filter
                        id={glassFilterId}
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                      >
                        <feTurbulence
                          type="fractalNoise"
                          baseFrequency="0.008 0.008"
                          numOctaves="2"
                          seed="100"
                          result="noise"
                        />
                        <feGaussianBlur
                          in="noise"
                          stdDeviation="2"
                          result="blurred"
                        />
                        <feDisplacementMap
                          in="SourceGraphic"
                          in2="blurred"
                          scale="40"
                          xChannelSelector="R"
                          yChannelSelector="G"
                        />
                      </filter>
                    </defs>
                  </svg>
                  <div
                    className={styles.territoryGlassFilter}
                    style={{ filter: `url(#${glassFilterId})` }}
                    aria-hidden="true"
                  />
                  <div
                    className={styles.territoryGlassOverlay}
                    aria-hidden="true"
                  />
                  <div
                    className={styles.territoryGlassSpecular}
                    aria-hidden="true"
                  />

                  <div className={styles.territoryCardInner}>
                    <div className={styles.territoryCardImage}>
                      <Image
                        src={territory.image}
                        alt={`Paisagem de ${territory.name} na Amazônia`}
                        fill
                        sizes="(max-width: 1023px) 92vw, 50vw"
                      />
                    </div>

                    <header className={styles.territoryCardHeader}>
                      <span>{territory.number}</span>
                      <h3>{territory.name}</h3>
                      <p>{territory.copy}</p>
                    </header>

                    <footer>
                      <span>{territory.type}</span>
                      <span aria-hidden="true">↘</span>
                    </footer>
                  </div>
                </article>
              </div>
            );
          })}

          <article
            className={styles.territoryFinale}
            data-territory-finale
            aria-labelledby="territorios-final-title"
          >
            <Image
              className={styles.territoryFinaleMobileImage}
              src="/images/territorios/territorios-transicao-final.png"
              alt="Copas da floresta amazônica desaparecendo entre a neblina"
              fill
              sizes="100vw"
            />
            <div
              className={styles.territoryFinaleCopy}
              data-territory-finale-text
            >
              <p>Além da paisagem</p>
              <h3 id="territorios-final-title">
                A floresta
                <span>também observa.</span>
              </h3>
              <p>
                Entre a névoa e o silêncio, outras presenças começam a aparecer.
              </p>
            </div>
          </article>
        </div>

        <p
          className={styles.territoryHint}
          data-territory-hint
          aria-hidden="true"
        >
          Percorra os territórios <span>→</span>
        </p>
      </div>
    </section>
  );
}
