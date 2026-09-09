'use client';

import { type KeyboardEvent, useRef, useState } from 'react';
import Image from 'next/image';
import styles from '@/app/page.module.scss';

const fauna = [
  {
    number: '01',
    layer: 'Rio',
    name: 'Ariranha',
    scientificName: 'Pteronura brasiliensis',
    copy: 'A corrente também se move em família.',
    image: '/images/fauna/ariranha-amazonia.png',
    position: 'center center',
  },
  {
    number: '02',
    layer: 'Solo',
    name: 'Anta',
    scientificName: 'Tapirus terrestris',
    copy: 'Cada passo espalha uma nova floresta.',
    image: '/images/fauna/anta-amazonia.png',
    position: '52% center',
  },
  {
    number: '03',
    layer: 'Sub-bosque',
    name: 'Jaguatirica',
    scientificName: 'Leopardus pardalis',
    copy: 'A sombra também aprendeu a enxergar.',
    image: '/images/fauna/jaguatirica-amazonia.png',
    position: 'center center',
  },
  {
    number: '04',
    layer: 'Copa',
    name: 'Macaco-aranha',
    scientificName: 'Ateles paniscus',
    copy: 'Entre galhos, nenhuma árvore está sozinha.',
    image: '/images/fauna/macaco-aranha-amazonia.png',
    position: 'center center',
  },
  {
    number: '05',
    layer: 'Céu',
    name: 'Harpia',
    scientificName: 'Harpia harpyja',
    copy: 'Do alto, a floresta revela sua escala.',
    image: '/images/fauna/harpia-amazonia.png',
    position: 'center center',
  },
];

export function FaunaSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handlePanelKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | undefined;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % fauna.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + fauna.length) % fauna.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = fauna.length - 1;
    }

    if (nextIndex === undefined) return;

    event.preventDefault();
    setActiveIndex(nextIndex);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <section
      className={`${styles.section} ${styles.layers}`}
      id="camadas"
      aria-labelledby="camadas-title"
      data-header-theme="light"
    >
      <div className={styles.faunaStage}>
        <header className={styles.layersHeading}>
          <p className={styles.chapterLabel}>
            <span>04</span>
            <span aria-hidden="true" className={styles.chapterLine} />
            Camadas
          </p>
          <h2 id="camadas-title">Nada vive sozinho.</h2>
        </header>

        <fieldset
          className={styles.faunaPanels}
          aria-label="Camadas da fauna amazônica"
        >
          {fauna.map((animal, index) => {
            const isActive = index === activeIndex;

            return (
              <article
                className={`${styles.faunaCard} ${
                  isActive ? styles.faunaCardActive : ''
                }`}
                key={animal.name}
              >
                <Image
                  className={styles.faunaImage}
                  src={animal.image}
                  alt={`${animal.name} em seu habitat na floresta amazônica`}
                  fill
                  sizes="(max-width: 900px) 100vw, 52vw"
                  style={{ objectPosition: animal.position }}
                />
                <div className={styles.faunaShade} aria-hidden="true" />

                <button
                  ref={(element) => {
                    buttonRefs.current[index] = element;
                  }}
                  className={styles.faunaButton}
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`Destacar ${animal.name}, camada ${animal.layer}`}
                  onClick={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onKeyDown={(event) => handlePanelKeyDown(event, index)}
                  onPointerMove={(event) => {
                    if (event.pointerType === 'mouse') setActiveIndex(index);
                  }}
                >
                  <span className={styles.faunaMeta}>
                    <span>{animal.number}</span>
                    <span>{animal.layer}</span>
                  </span>

                  <span className={styles.faunaCopy}>
                    <span className={styles.faunaScientific}>
                      {animal.scientificName}
                    </span>
                    <strong className={styles.faunaCardName}>
                      {animal.name}
                    </strong>
                    <span className={styles.faunaDescription}>
                      {animal.copy}
                    </span>
                    <span className={styles.faunaFutureLink}>
                      Página da espécie em breve{' '}
                      <span aria-hidden="true">↗</span>
                    </span>
                  </span>
                </button>
              </article>
            );
          })}
        </fieldset>
      </div>
    </section>
  );
}
