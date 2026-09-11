import Image from 'next/image';
import styles from '@/app/page.module.scss';

const jaguarImage = '/images/jaguar/jaguar-eyes-amazon.png';

export function JaguarSection() {
  return (
    <section
      className={`${styles.section} ${styles.jaguar}`}
      id="olhos"
      aria-labelledby="olhos-title"
      data-jaguar-scene
      data-header-theme="dark"
      data-header-chapter="olhos"
      data-scroll-anchor-progress="0.6"
    >
      <Image
        className={styles.jaguarImage}
        data-jaguar-image
        src={jaguarImage}
        alt="Onça-pintada parcialmente oculta entre a vegetação úmida da floresta amazônica"
        fill
        sizes="100vw"
      />

      <div className={styles.jaguarShade} aria-hidden="true" />
      <div className={styles.jaguarVeil} data-jaguar-veil aria-hidden="true" />
      <div className={styles.jaguarEyes} data-jaguar-eyes aria-hidden="true">
        <Image
          className={styles.jaguarEyesImage}
          data-jaguar-eye-image
          src={jaguarImage}
          alt=""
          fill
          sizes="100vw"
        />
      </div>
      <div className={styles.jaguarAtmosphere} aria-hidden="true">
        <span />
        <span />
      </div>

      <p
        className={`${styles.ghostWord} ${styles.jaguarGhostWord}`}
        data-jaguar-ghost
        aria-hidden="true"
      >
        OLHOS
      </p>

      <div className={styles.jaguarContent}>
        <p className={styles.chapterLabel} data-jaguar-meta>
          <span>06</span>
          <span aria-hidden="true" className={styles.chapterLine} />
          Olhos
        </p>

        <div className={styles.jaguarStatement}>
          <p className={styles.jaguarKicker} data-jaguar-meta>
            Presença sob a copa
          </p>
          <h2 id="olhos-title">
            <span className={styles.jaguarLineClip}>
              <span data-jaguar-line>Ela não atravessa a mata.</span>
            </span>
            <span className={styles.jaguarLineClip}>
              <em data-jaguar-line>A mata se move com ela.</em>
            </span>
          </h2>
        </div>

        <footer className={styles.jaguarFooter} data-jaguar-meta>
          <p className={styles.species}>
            Onça-pintada <span aria-hidden="true">·</span> <i>Panthera onca</i>
          </p>
          <p aria-hidden="true">Presença sem fronteira</p>
        </footer>
      </div>
    </section>
  );
}
