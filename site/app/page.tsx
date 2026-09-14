import Image from 'next/image';
import { HeroExperience } from '@/components/hero-experience/hero-experience';
import { CustomCursor } from '@/components/custom-cursor/custom-cursor';
import { DocumentarySection } from '@/components/documentary-section/documentary-section';
import { FaunaSection } from '@/components/fauna-section/fauna-section';
import { EpilogueSection } from '@/components/epilogue-section/epilogue-section';
import { JaguarSection } from '@/components/jaguar-section/jaguar-section';
import { MacawSection } from '@/components/macaw-section/macaw-section';
import { SiteHeader } from '@/components/site-header/site-header';
import { SiteFooter } from '@/components/site-footer/site-footer';
import { MapTrailSection } from '@/components/map-trail-section/map-trail-section';
import { TerritoriesSection } from '@/components/territories-section/territories-section';
import { VeinsSection } from '@/components/veins-section/veins-section';
import styles from './page.module.scss';

const showArchivedEnding = false;
const showJaguarSection = false;

export default function Home() {
  return (
    <>
      <a className={styles.skipLink} href="#conteudo">
        Pular para o conteúdo
      </a>

      <SiteHeader />

      <CustomCursor />

      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      <main id="conteudo">
        <HeroExperience />

        <VeinsSection />

        <FaunaSection />

        <div className={styles.territoryJourney}>
          <div className={styles.territoryJourneyBackground} aria-hidden="true">
            <div className={styles.territoryJourneyBackgroundVisual}>
              <Image
                className={styles.territoryJourneyBackgroundImage}
                src="/images/territorios/territorios-transicao-final.png"
                alt=""
                fill
                sizes="100vw"
              />
              <span className={styles.territoryJourneyShade} />
              <span className={styles.territoryJourneyMist} />
            </div>
          </div>

          <TerritoriesSection />

          <MapTrailSection>
            {showJaguarSection && <JaguarSection />}
          </MapTrailSection>
        </div>

        <DocumentarySection />

        {showArchivedEnding && (
          <>
            <MacawSection />
            <EpilogueSection />
          </>
        )}

        <SiteFooter />
      </main>
    </>
  );
}
