import { HeroExperience } from '@/components/hero-experience/hero-experience';
import { FaunaSection } from '@/components/fauna-section/fauna-section';
import { EpilogueSection } from '@/components/epilogue-section/epilogue-section';
import { JaguarSection } from '@/components/jaguar-section/jaguar-section';
import { MacawSection } from '@/components/macaw-section/macaw-section';
import { SiteHeader } from '@/components/site-header/site-header';
import { MapTrailSection } from '@/components/map-trail-section/map-trail-section';
import { TerritoriesSection } from '@/components/territories-section/territories-section';
import { VeinsSection } from '@/components/veins-section/veins-section';
import styles from './page.module.scss';

export default function Home() {
  return (
    <>
      <a className={styles.skipLink} href="#conteudo">
        Pular para o conteúdo
      </a>

      <SiteHeader />

      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      <main id="conteudo">
        <HeroExperience />

        <VeinsSection />

        <FaunaSection />

        <TerritoriesSection />

        <MapTrailSection>
          <JaguarSection />
        </MapTrailSection>

        <MacawSection />

        <EpilogueSection />
      </main>
    </>
  );
}
