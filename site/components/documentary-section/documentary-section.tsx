"use client";

import Image from "next/image";
import { useRef } from "react";
import styles from "@/app/page.module.scss";
import { useSmoothScrollReady } from "@/components/smooth-scroll/smooth-scroll";
import { MOTION_QUERIES, useMotionProfile } from "@/hooks/use-motion-profile";
import { gsap, scheduleScrollRefresh, useGSAP } from "@/lib/gsap";

const backgroundImage = "/images/documentary/amazon-river-dawn.png";
const documentaryUrl = "https://www.youtube.com/watch?v=SSdwbEcAsWc&t=12s";

export function DocumentarySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isSmoothScrollReady = useSmoothScrollReady();
  const reduceMotion = useMotionProfile() === "reduced";

  useGSAP(
    () => {
      if (!isSmoothScrollReady) return;

      const section = sectionRef.current;
      if (!section) return;

      const background = section.querySelector<HTMLElement>(
        "[data-documentary-background]",
      );
      const line = section.querySelector<HTMLElement>(
        "[data-documentary-line]",
      );
      const action = section.querySelector<HTMLElement>(
        "[data-documentary-action]",
      );
      const frame = section.querySelector<HTMLElement>(
        "[data-documentary-frame]",
      );

      if (!background || !line || !action || !frame) return;

      if (reduceMotion) {
        scheduleScrollRefresh();
        return;
      }

      const media = gsap.matchMedia();

      media.add(MOTION_QUERIES.wide, () => {
        gsap.set(background, { scale: 1.08 });
        gsap.set(line, { yPercent: 118 });
        gsap.set(action, { autoAlpha: 0, y: 18 });
        gsap.set(frame, { autoAlpha: 0 });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + window.innerHeight * 2.2,
            pin: section,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(background, { scale: 1, duration: 0.92 }, 0)
          .to(
            line,
            {
              yPercent: 0,
              duration: 0.2,
              ease: "power2.out",
            },
            0.22,
          )
          .to(
            action,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.16,
              ease: "power2.out",
            },
            0.34,
          )
          .to(frame, { autoAlpha: 1, duration: 0.2 }, 0.28)
          .to(
            background,
            {
              scale: 1.025,
              xPercent: 0.8,
              duration: 0.72,
            },
            0.92,
          )
          .to({}, { duration: 0.32 }, 1.64);

        return () => timeline.kill();
      });

      media.add(MOTION_QUERIES.compact, () => {
        gsap.set(background, { scale: 1.055 });
        gsap.set(line, { yPercent: 112 });
        gsap.set(action, { autoAlpha: 0, y: 14 });
        gsap.set(frame, { autoAlpha: 0 });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(background, { scale: 1, duration: 1 }, 0)
          .to(line, { yPercent: 0, duration: 0.28 }, 0.12)
          .to(action, { autoAlpha: 1, y: 0, duration: 0.22 }, 0.3)
          .to(frame, { autoAlpha: 1, duration: 0.22 }, 0.24);

        return () => timeline.kill();
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
      className={`${styles.section} ${styles.documentary}`}
      id="documentario"
      aria-labelledby="documentario-title"
      data-header-theme="dark"
      data-header-chapter="documentario"
      data-scroll-anchor-progress="0.5"
    >
      <div className={styles.documentaryStage}>
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
