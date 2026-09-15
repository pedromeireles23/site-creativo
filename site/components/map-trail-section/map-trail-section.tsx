'use client';

import Image from 'next/image';
import { Fragment, type ReactNode, useId, useRef } from 'react';
import styles from '@/app/page.module.scss';
import { useSmoothScrollReady } from '@/components/smooth-scroll/smooth-scroll';
import { MOTION_QUERIES, useMotionProfile } from '@/hooks/use-motion-profile';
import { gsap, scheduleScrollRefresh, useGSAP } from '@/lib/gsap';

// Simplified from Natural Earth 1:110m public-domain country geometries.
const countries = [
  {
    name: 'Argentina',
    path: 'M381 811L391 825L421 834L405 841L381 836ZM504 560L494 607L509 617L514 635L503 649L486 655L451 657L454 677L447 681L420 682L422 693L436 693L439 699L420 709L415 726L396 732L393 740L414 751L411 761L375 790L386 808L344 804L340 789L328 786L327 774L339 762L352 723L342 695L350 658L356 654L353 632L368 605L360 573L369 541L385 523L383 496L396 491L407 466L422 469L429 477L433 468L446 469L468 489L502 504L493 526L526 529L543 508L549 523Z',
  },
  {
    name: 'Chile',
    path: 'M381 811L381 836L400 837L386 845L354 838L313 814L353 827L363 815ZM370 419L383 439L380 450L390 478L399 479L396 491L383 496L385 523L369 541L360 573L368 605L353 632L356 654L350 658L342 695L352 723L339 762L327 774L328 786L340 789L344 804L382 808L356 814L350 825L310 807L303 767L319 748L302 744L313 734L317 716L329 720L335 696L328 694L324 707L317 706L330 661L325 638L349 585L349 545L365 461L361 427Z',
  },
  {
    name: 'Uruguai',
    path: 'M504 560L511 559L547 581L554 588L547 607L520 612L495 602Z',
  },
  {
    name: 'Brasil',
    path: 'M552 600L554 588L547 581L511 559L504 560L549 523L549 514L538 510L542 491L529 490L525 472L501 469L498 448L506 425L497 415L497 404L476 404L472 376L417 351L418 331L385 345L359 345L360 328L341 334L329 328L321 306L331 296L333 281L367 270L372 234L365 216L374 211L368 210L368 203L393 199L398 209L415 213L440 197L430 194L424 176L443 180L467 171L469 164L478 166L483 177L478 191L488 207L522 201L523 194L557 198L575 175L584 201L590 202L585 223L605 224L605 236L614 228L647 239L650 252L702 254L733 276L751 279L761 304L756 323L716 368L710 422L691 467L679 479L650 483L616 501L606 512L602 543Z',
  },
  {
    name: 'Bolívia',
    path: 'M371 344L385 345L418 331L417 351L472 376L476 404L497 404L497 415L506 425L502 445L488 439L458 442L448 471L433 468L429 477L422 469L407 466L390 478L380 450L383 439L370 419L377 407L373 389L381 362Z',
  },
  {
    name: 'Peru',
    path: 'M367 270L333 281L331 296L321 306L329 328L341 334L360 328L359 345L371 344L381 362L373 389L377 407L361 427L298 386L256 302L240 291L238 275L250 260L249 271L263 277L269 273L278 255L303 239L308 222L331 248L365 252L358 264Z',
  },
  {
    name: 'Colômbia',
    path: 'M401 208L393 199L368 203L368 210L374 211L365 216L372 234L367 270L358 264L365 252L331 248L308 222L282 217L265 203L286 179L277 141L284 133L282 126L302 116L311 98L327 96L350 83L329 119L334 120L344 143L365 144L372 153L395 154L390 171L396 185L390 190Z',
  },
  {
    name: 'Venezuela',
    path: 'M469 164L467 171L443 180L424 176L430 194L440 197L407 214L390 190L396 185L390 171L395 154L372 153L365 144L344 143L334 120L329 119L333 105L351 90L344 94L347 105L342 111L351 119L350 99L364 94L366 86L386 104L423 109L429 103L457 102L447 105L480 128L462 155Z',
  },
  {
    name: 'Guiana',
    path: 'M516 201L494 208L482 202L478 166L462 155L480 128L510 155L499 176Z',
  },
  {
    name: 'Suriname',
    path: 'M539 196L523 194L522 201L516 201L504 184L499 176L510 155L545 157Z',
  },
  {
    name: 'Equador',
    path: 'M305 224L303 239L278 255L269 273L263 277L249 271L256 252L243 247L243 234L253 213L266 206Z',
  },
  {
    name: 'Paraguai',
    path: 'M498 448L501 469L525 472L529 490L542 491L536 520L526 529L493 526L502 504L468 489L448 471L458 442L488 439Z',
  },
  {
    name: 'Guiana Francesa',
    path: 'M571 175L557 198L539 196L545 157Z',
  },
] as const;

const amazonPath =
  'M286 196C339 157 425 150 511 162C600 174 674 211 686 260C665 306 617 358 561 392C490 434 400 423 339 380C294 348 265 273 286 196Z';

const documentaryUrl = 'https://www.youtube.com/watch?v=SSdwbEcAsWc&t=12s';
const tabletCinematicQuery =
  '(min-width: 768px) and (max-width: 1023px) and (min-height: 701px), (min-width: 768px) and (max-width: 1023px) and (orientation: portrait)';
const phoneCinematicQuery =
  '(max-width: 767px) and (min-height: 701px), (max-width: 767px) and (orientation: portrait)';

export function MapTrailSection({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isSmoothScrollReady = useSmoothScrollReady();
  const reduceMotion = useMotionProfile() === 'reduced';
  const id = 'amazon-atlas-' + useId().replaceAll(':', '');

  useGSAP(
    () => {
      if (!isSmoothScrollReady) return;

      const section = sectionRef.current;
      if (!section) return;

      const editorial = section.querySelector<HTMLElement>(
        '[data-atlas-editorial]',
      );
      const stage = section.querySelector<HTMLElement>('[data-atlas-stage]');
      const mapTrack = section.querySelector<HTMLElement>(
        '[data-atlas-map-track]',
      );
      const camera = section.querySelector<HTMLElement>('[data-atlas-camera]');
      const route = section.querySelector<SVGPathElement>('[data-atlas-route]');
      const marker = section.querySelector<SVGGElement>('[data-atlas-marker]');
      const amazon = section.querySelector<SVGPathElement>(
        '[data-atlas-amazon]',
      );
      const label = section.querySelector<HTMLElement>('[data-atlas-label]');
      const stats = section.querySelector<HTMLElement>('[data-atlas-stats]');
      const film = section.querySelector<HTMLElement>('[data-atlas-film]');
      const chapter = section.querySelector<HTMLElement>(
        '[data-atlas-chapter]',
      );
      const oceanGrid = section.querySelector<HTMLElement>(
        '[data-atlas-ocean-grid]',
      );

      if (
        !editorial ||
        !stage ||
        !mapTrack ||
        !camera ||
        !route ||
        !marker ||
        !amazon ||
        !label ||
        !stats ||
        !film ||
        !chapter ||
        !oceanGrid
      ) {
        return;
      }

      const routeLength = route.getTotalLength();
      const markerPosition = { progress: 0 };
      const placeMarker = () => {
        const point = route.getPointAtLength(
          routeLength * markerPosition.progress,
        );
        gsap.set(marker, { x: point.x, y: point.y });
      };

      gsap.set(route, {
        strokeDasharray: routeLength,
        strokeDashoffset: routeLength,
      });
      placeMarker();

      if (reduceMotion) {
        markerPosition.progress = 0.72;
        placeMarker();
        gsap.set(route, { strokeDashoffset: 0 });
        gsap.set([amazon, label, stats, film, chapter], {
          autoAlpha: 1,
          x: 0,
          y: 0,
        });
        gsap.set(camera, { clearProps: 'transform' });
        scheduleScrollRefresh();
        return;
      }

      const media = gsap.matchMedia();

      media.add('(min-width: 768px)', () => {
        gsap.fromTo(
          editorial,
          { yPercent: -4 },
          {
            yPercent: 18,
            ease: 'none',
            scrollTrigger: {
              trigger: editorial,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });

      const createJourney = (compact: boolean) => {
        const journeyStart = 'top 82%';
        const journeyEnd = 'bottom 28%';

        gsap.set(camera, { transformOrigin: compact ? '48% 29%' : '48% 27%' });
        gsap.set(amazon, { autoAlpha: 0.08 });
        gsap.set(label, { autoAlpha: 0, y: 18 });
        gsap.set(stats, { autoAlpha: 1 });
        gsap.set(film, { autoAlpha: 1 });
        gsap.set(chapter, { autoAlpha: 0, y: 16 });

        const cameraDepth = gsap.fromTo(
          camera,
          {
            scale: compact ? 0.8 : 0.82,
            xPercent: compact ? -1 : -3,
            y: compact ? '4svh' : '2svh',
          },
          {
            scale: compact ? 1.16 : 1.22,
            xPercent: compact ? 3 : 5,
            y: compact ? '96svh' : '82svh',
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: journeyStart,
              end: journeyEnd,
              scrub: 0.35,
              invalidateOnRefresh: true,
            },
          },
        );

        const gridDepth = gsap.fromTo(
          oceanGrid,
          { backgroundPosition: '0 0' },
          {
            backgroundPosition: compact ? '0 72svh' : '0 92svh',
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: journeyStart,
              end: journeyEnd,
              scrub: true,
            },
          },
        );

        const chapterReveal = gsap.fromTo(
          chapter,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: 'top 88%',
              end: 'top 58%',
              scrub: true,
            },
          },
        );

        const routeReveal = gsap.to(route, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: stage,
            start: journeyStart,
            end: journeyEnd,
            scrub: true,
            onEnter: () => {
              section.dataset.headerTheme = 'dark';
            },
            onEnterBack: () => {
              section.dataset.headerTheme = 'dark';
            },
            onLeaveBack: () => {
              section.dataset.headerTheme = 'light';
            },
          },
        });

        const markerJourney = gsap.to(markerPosition, {
          progress: 1,
          ease: 'none',
          onUpdate: placeMarker,
          scrollTrigger: {
            trigger: stage,
            start: journeyStart,
            end: journeyEnd,
            scrub: true,
          },
        });

        const amazonReveal = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: journeyStart,
            end: journeyEnd,
            scrub: true,
          },
        });
        amazonReveal
          .to(amazon, { autoAlpha: 0.92, ease: 'none', duration: 0.68 })
          .to(
            label,
            { autoAlpha: 1, y: 0, ease: 'none', duration: 0.32 },
            0.44,
          );

        const statsJourney = gsap.fromTo(
          stats,
          { y: '48vh' },
          {
            y: '-16vh',
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: journeyStart,
              end: journeyEnd,
              scrub: true,
            },
          },
        );

        const filmJourney = gsap.fromTo(
          film,
          { y: '48vh' },
          {
            y: '-16vh',
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: journeyStart,
              end: journeyEnd,
              scrub: true,
            },
          },
        );

        return () => {
          cameraDepth.kill();
          gridDepth.kill();
          chapterReveal.kill();
          routeReveal.kill();
          markerJourney.kill();
          amazonReveal.kill();
          statsJourney.kill();
          filmJourney.kill();
        };
      };

      const createPhoneJourney = () => {
        gsap.set(camera, { clearProps: 'transform' });
        gsap.set(route, { strokeDashoffset: routeLength });
        gsap.set(markerPosition, { progress: 0, onUpdate: placeMarker });
        gsap.set(oceanGrid, { clearProps: 'backgroundPosition' });
        gsap.set(chapter, { autoAlpha: 1, y: 0 });
        gsap.set(amazon, { autoAlpha: 0.08 });
        gsap.set(label, { autoAlpha: 0, y: 18 });
        gsap.set([film, stats], {
          autoAlpha: 1,
          clearProps: 'transform',
        });

        // The track keeps its place in the page while the map travels more slowly.
        // Cards stay in normal flow and progressively cover this background layer.
        const mapDrift = gsap.fromTo(
          camera,
          { y: 0 },
          {
            y: () =>
              Math.max(0, stage.offsetHeight - mapTrack.offsetTop) * 0.72,
            ease: 'none',
            scrollTrigger: {
              trigger: mapTrack,
              start: 'top top',
              endTrigger: stage,
              end: 'bottom top',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );

        const svgTimeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: mapTrack,
            start: 'top 82%',
            end: 'center 35%',
            scrub: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              section.dataset.headerTheme = 'dark';
            },
            onEnterBack: () => {
              section.dataset.headerTheme = 'dark';
            },
            onLeaveBack: () => {
              section.dataset.headerTheme = 'light';
            },
          },
        });

        svgTimeline
          .to(route, { strokeDashoffset: 0, duration: 1 }, 0)
          .to(
            markerPosition,
            {
              progress: 1,
              duration: 1,
              onUpdate: placeMarker,
            },
            0,
          )
          .to(amazon, { autoAlpha: 0.92, duration: 0.68 }, 0)
          .to(label, { autoAlpha: 1, y: 0, duration: 0.32 }, 0.44);

        return () => {
          mapDrift.kill();
          svgTimeline.kill();
        };
      };

      media.add(MOTION_QUERIES.wide, () => createJourney(false));
      media.add(tabletCinematicQuery, () => createJourney(true));
      media.add(phoneCinematicQuery, createPhoneJourney);

      media.add(MOTION_QUERIES.shortLandscape, () => {
        markerPosition.progress = 0.74;
        placeMarker();
        gsap.set(route, { strokeDashoffset: 0 });
        gsap.set(camera, { scale: 1, x: 0, y: 0 });
        gsap.set([amazon, label, stats, film, chapter], {
          autoAlpha: 1,
          x: 0,
          y: 0,
        });
      });

      scheduleScrollRefresh();
      return () => {
        media.revert();
      };
    },
    {
      scope: sectionRef,
      dependencies: [isSmoothScrollReady, reduceMotion],
      revertOnUpdate: true,
    },
  );

  return (
    <Fragment>
      <section
        ref={sectionRef}
        className={styles.amazonAtlas}
        aria-labelledby="amazon-atlas-title"
        data-header-theme="light"
        data-header-chapter="territorios"
      >
        <header className={styles.atlasEditorial} data-atlas-editorial>
          <div className={styles.atlasEditorialCoordinates} aria-hidden="true">
            <span>
              Cordilheira dos Andes<small>Oeste continental</small>
            </span>
            <span>
              Oceano Atlântico<small>Costa oriental</small>
            </span>
          </div>

          <div className={styles.atlasEditorialCopy}>
            <p>Cartografia da Amazônia · escala continental</p>
            <h2 id="amazon-atlas-title">
              Uma floresta que não cabe em uma fronteira.
            </h2>
            <p>
              Vista de cima, a Amazônia deixa de ser apenas paisagem e revela
              sua verdadeira escala.
            </p>
          </div>
        </header>

        <div className={styles.atlasStage} data-atlas-stage>
          <div className={styles.atlasOcean} aria-hidden="true" />
          <div
            className={styles.atlasOceanGrid}
            data-atlas-ocean-grid
            aria-hidden="true"
          />

          <div className={styles.atlasChapter} data-atlas-chapter>
            <span>Amazônia</span>
            <i />
            <span>Escala</span>
          </div>

          <div className={styles.atlasOceanLabels} aria-hidden="true">
            <span>Oceano Pacífico</span>
            <span>Oceano Atlântico</span>
          </div>

          <div className={styles.atlasMapTrack} data-atlas-map-track>
            <div className={styles.atlasMapCamera} data-atlas-camera>
              <svg
                className={styles.atlasMap}
                viewBox="0 0 1000 1000"
                aria-labelledby={`${id}-title ${id}-description`}
              >
                <title id={`${id}-title`}>
                  América do Sul e região amazônica
                </title>
                <desc id={`${id}-description`}>
                  Mapa físico da América do Sul com a região amazônica destacada
                  durante a rolagem.
                </desc>
                <defs>
                  <pattern
                    id={`${id}-relief`}
                    patternUnits="userSpaceOnUse"
                    width="1000"
                    height="1000"
                  >
                    <image
                      href="/images/maps/amazon-relief-texture-v1.png"
                      width="1000"
                      height="1000"
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </pattern>
                  <linearGradient
                    id={`${id}-shade`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0" stopColor="#dfe9e2" stopOpacity="0.38" />
                    <stop
                      offset="0.52"
                      stopColor="#718d7c"
                      stopOpacity="0.08"
                    />
                    <stop offset="1" stopColor="#020806" stopOpacity="0.72" />
                  </linearGradient>
                  <radialGradient
                    id={`${id}-amazon-glow`}
                    cx="48%"
                    cy="37%"
                    r="48%"
                  >
                    <stop offset="0" stopColor="#8fcfc5" stopOpacity="0.56" />
                    <stop
                      offset="0.66"
                      stopColor="#456f62"
                      stopOpacity="0.26"
                    />
                    <stop offset="1" stopColor="#17362c" stopOpacity="0.04" />
                  </radialGradient>
                  <filter
                    id={`${id}-land-shadow`}
                    x="-30%"
                    y="-30%"
                    width="160%"
                    height="170%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="22"
                      stdDeviation="24"
                      floodColor="#000"
                      floodOpacity="0.72"
                    />
                  </filter>
                  <filter
                    id={`${id}-marker-glow`}
                    x="-300%"
                    y="-300%"
                    width="700%"
                    height="700%"
                  >
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <clipPath id={`${id}-continent`}>
                    {countries.map((country) => (
                      <path key={country.name} d={country.path} />
                    ))}
                  </clipPath>
                </defs>

                <g filter={`url(#${id}-land-shadow)`}>
                  {countries.map((country) => (
                    <path
                      key={country.name}
                      className={styles.atlasCountry}
                      d={country.path}
                      fill={`url(#${id}-relief)`}
                    />
                  ))}
                </g>

                <g clipPath={`url(#${id}-continent)`}>
                  <rect
                    className={styles.atlasLandShade}
                    x="180"
                    y="55"
                    width="610"
                    height="815"
                    fill={`url(#${id}-shade)`}
                  />
                  <path
                    className={styles.atlasAmazonFill}
                    data-atlas-amazon
                    d={amazonPath}
                    fill={`url(#${id}-amazon-glow)`}
                  />
                  <g className={styles.atlasRivers}>
                    <path d="M292 252C359 276 407 255 468 267C522 278 584 274 652 250" />
                    <path d="M330 305C391 295 433 312 482 326C528 339 568 333 622 306" />
                    <path d="M391 186C398 229 423 248 468 267" />
                    <path d="M511 162C508 203 492 238 468 267" />
                  </g>
                </g>

                <g className={styles.atlasBorders}>
                  {countries.map((country) => (
                    <path key={country.name} d={country.path} />
                  ))}
                </g>

                <path
                  className={styles.atlasAmazonBase}
                  d={amazonPath}
                  aria-hidden="true"
                />
                <path
                  className={styles.atlasAmazonRoute}
                  data-atlas-route
                  d={amazonPath}
                  aria-hidden="true"
                />

                <g
                  className={styles.atlasMarker}
                  data-atlas-marker
                  filter={`url(#${id}-marker-glow)`}
                  aria-hidden="true"
                >
                  <circle r="19" />
                  <circle r="7" />
                </g>
              </svg>

              <div className={styles.atlasMapLabel} data-atlas-label>
                <i aria-hidden="true" />
                <span>Bioma amazônico</span>
                <strong>Escala continental</strong>
              </div>
            </div>
          </div>

          <div className={styles.atlasCardsOuter}>
            <div className={styles.atlasCardsSticky} data-atlas-cards>
              <a
                className={styles.atlasFilmCard}
                data-atlas-film
                data-cursor-label="Assistir"
                href={documentaryUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Assistir ao documentário da abertura no YouTube (abre em nova aba)"
              >
                <span className={styles.atlasFilmImage} aria-hidden="true">
                  <Image
                    src="/images/hero-amazon-dawn.png"
                    alt=""
                    fill
                    sizes="(max-width: 720px) 92vw, 31rem"
                  />
                  <i />
                </span>
                <span className={styles.atlasFilmCopy}>
                  <span>
                    <small>Documentário</small>
                    Assistir ao filme
                  </span>
                  <svg viewBox="0 0 40 40" aria-hidden="true">
                    <circle cx="20" cy="20" r="19" />
                    <path d="m17 14 10 6-10 6Z" />
                  </svg>
                </span>
              </a>

              <aside className={styles.atlasStatsCard} data-atlas-stats>
                <p className={styles.atlasCardEyebrow}>A floresta em escala</p>
                <dl>
                  <div>
                    <dt>Extensão do bioma</dt>
                    <dd>6,7 milhões km²</dd>
                  </div>
                  <div>
                    <dt>Presença territorial</dt>
                    <dd>8 países + Guiana Francesa</dd>
                  </div>
                  <div>
                    <dt>Faixa média diária</dt>
                    <dd>20–25 °C</dd>
                  </div>
                </dl>
                <small>Fontes: WWF, OTCA e NASA · valores de referência</small>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {children}
    </Fragment>
  );
}
