"use client";

import Image from "next/image";
import { useRef } from "react";
import styles from "@/app/page.module.scss";
import { useSmoothScrollReady } from "@/components/smooth-scroll/smooth-scroll";
import { useMotionProfile } from "@/hooks/use-motion-profile";
import { gsap, scheduleScrollRefresh, useGSAP } from "@/lib/gsap";

const backgroundImage = "/images/documentary/amazon-river-dawn.png";
const documentaryUrl = "https://www.youtube.com/watch?v=SSdwbEcAsWc&t=12s";

export function DocumentarySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isSmoothScrollReady = useSmoothScrollReady();
  const reduceMotion = useMotionProfile() === "reduced";

  useGSAP(
    () => {
      if (!isSmoothScrollReady) return;

      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage) return;

      if (reduceMotion) {
        scheduleScrollRefresh();
        return;
      }

      const entrance = gsap.fromTo(
        stage,
        { autoAlpha: 0, yPercent: 7 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 1.05,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: section,
            start: "top 88%",
            once: true,
          },
        },
      );

      scheduleScrollRefresh();
      return () => {
        entrance.scrollTrigger?.kill();
        entrance.kill();
      };
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
      className={`${styles.section} ${styles.documentary}`}
      id="documentario"
      aria-labelledby="documentario-title"
      data-header-theme="dark"
      data-header-chapter="documentario"
      data-scroll-anchor-progress="0.5"
    >
      <div ref={stageRef} className={styles.documentaryStage}>
        <Image
          className={styles.documentaryBackground}
          data-documentary-background
          src={backgroundImage}
          alt="Vista aérea cinematográfica da floresta amazônica e de um grande rio ao amanhecer"
          fill
          sizes="100vw"
        />
        <div className={styles.documentaryVeil} aria-hidden="true" />

        <div
          className={styles.documentaryFrame}
          data-documentary-frame
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className={styles.documentaryContent}>
          <h2 id="documentario-title" className={styles.documentaryLineClip}>
            <span data-documentary-line>assista ao documentário</span>
          </h2>

          <a
            className={styles.documentaryAction}
            data-documentary-action
            data-cursor-label="Assistir"
            data-cursor-tone="light"
            href={documentaryUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Assistir ao documentário no YouTube (abre em nova aba)"
          >
            assistir
          </a>
        </div>
      </div>
    </section>
  );
}
