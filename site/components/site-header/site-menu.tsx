'use client';

import { useEffect, useRef, type MouseEvent } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { CustomEase } from 'gsap/CustomEase';
import { useMotionProfile } from '@/hooks/use-motion-profile';
import { gsap, useGSAP } from '@/lib/gsap';
import { useSmoothScrollControls } from '@/components/smooth-scroll/smooth-scroll';
import { chapters, menuGroups, type MenuKey } from './site-menu-data';
import styles from './site-header.module.scss';

gsap.registerPlugin(CustomEase);

const closedMenuClip = 'inset(0% 100% 0% 0% round 0.25rem)';
const openMenuClip = 'inset(0% 0% 0% 0% round 0.25rem)';
const menuClipEase = CustomEase.create('menuClip', '0.76,0,0.24,1');

type SiteMenuProps = {
  activeMenu: MenuKey;
  currentChapter: string;
  onActiveMenuChange: (menu: MenuKey) => void;
  onClose: () => void;
  open: boolean;
};

export function SiteMenu({
  activeMenu,
  currentChapter,
  onActiveMenuChange,
  onClose,
  open,
}: SiteMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const motionProfile = useMotionProfile();
  const { navigateToHash, pause, resume } = useSmoothScrollControls();

  useEffect(() => {
    if (!open) return;

    pause();
    return resume;
  }, [open, pause, resume]);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;

      gsap.killTweensOf(panel);
      const media = gsap.matchMedia();

      media.add('(max-width: 800px)', () => {
        gsap.set(panel, { xPercent: 0 });

        if (!open) {
          gsap.set(panel, { clipPath: closedMenuClip });
          return;
        }

        gsap.fromTo(
          panel,
          { clipPath: closedMenuClip },
          {
            clipPath: openMenuClip,
            duration: motionProfile === 'reduced' ? 0 : 0.45,
            ease: menuClipEase,
          },
        );
      });

      media.add('(min-width: 801px)', () => {
        gsap.set(panel, { clearProps: 'clipPath' });

        if (!open) {
          gsap.set(panel, { xPercent: -102 });
          return;
        }

        gsap.fromTo(
          panel,
          { xPercent: -102 },
          {
            xPercent: 0,
            duration: motionProfile === 'reduced' ? 0 : 0.72,
            ease: 'power4.out',
          },
        );
      });

      return () => media.revert();
    },
    {
      dependencies: [motionProfile, open],
      scope: panelRef,
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      if (!open || !panelRef.current || window.innerWidth <= 800) return;

      const items = panelRef.current.querySelectorAll('[data-menu-item]');
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: motionProfile === 'reduced' ? 0 : 0.42,
          stagger: 0.045,
          ease: 'power2.out',
        },
      );
    },
    {
      dependencies: [activeMenu, motionProfile, open],
      scope: panelRef,
      revertOnUpdate: true,
    },
  );

  const visibleChapters =
    activeMenu === 'index'
      ? chapters
      : chapters.filter((chapter) =>
          menuGroups[activeMenu].chapters.includes(chapter.id),
        );

  const menuTitle =
    activeMenu === 'index' ? 'Capítulos' : menuGroups[activeMenu].label;
  const menuEyebrow =
    activeMenu === 'index' ? 'Floresta Viva' : menuGroups[activeMenu].eyebrow;
  const currentChapterNumber =
    chapters.find((chapter) => chapter.id === currentChapter)?.number ?? '01';

  const handleDestinationClick = (
    event: MouseEvent<HTMLAnchorElement>,
    chapterId: string,
  ) => {
    event.preventDefault();
    onClose();
    navigateToHash(chapterId);
  };

  const chapterLinks = (
    chapterIds = visibleChapters.map(({ id }) => id),
    navigateImmediately = false,
  ) =>
    chapters
      .filter((chapter) => chapterIds.includes(chapter.id))
      .map((chapter) => (
        <li data-menu-item key={chapter.id}>
          <a
            href={`#${chapter.id}`}
            aria-current={
              currentChapter === chapter.id ? 'location' : undefined
            }
            onClick={(event) => {
              if (navigateImmediately) {
                handleDestinationClick(event, chapter.id);
              } else {
                onClose();
              }
            }}
          >
            <span>{chapter.number}</span>
            <span>
              <strong>{chapter.label}</strong>
              <small>{chapter.note}</small>
            </span>
            <span aria-hidden="true">↘</span>
          </a>
        </li>
      ));

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <Dialog.Portal data-slot="dialog-portal" keepMounted>
        <Dialog.Backdrop
          data-slot="dialog-overlay"
          className={`fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 ${styles.dialogBackdrop}`}
        />
        <Dialog.Popup
          data-slot="dialog-content"
          className={`fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 ${styles.dialogShell}`}
        >
          <Dialog.Title
            data-slot="dialog-title"
            className={`font-heading text-base leading-none font-medium ${styles.srOnly}`}
          >
            Navegação por capítulos
          </Dialog.Title>
          <Dialog.Description
            data-slot="dialog-description"
            className={`text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground ${styles.srOnly}`}
          >
            Escolha uma parte da travessia Floresta Viva.
          </Dialog.Description>

          <button
            className={styles.scrim}
            type="button"
            tabIndex={-1}
            aria-label="Fechar navegação"
            onClick={onClose}
          />

          <div className={styles.panel} ref={panelRef}>
            <div className={styles.desktopMenu}>
              <div className={styles.panelTop}>
                <Dialog.Close className={styles.closeButton}>
                  Fechar <span aria-hidden="true">×</span>
                </Dialog.Close>
                <p>{currentChapterNumber} / 09</p>
              </div>

              <div className={styles.panelHeading} data-menu-item>
                <p>{menuEyebrow}</p>
                <h2>{menuTitle}</h2>
              </div>

              <ol className={styles.chapterList}>{chapterLinks()}</ol>

              <div className={styles.panelFooter} data-menu-item>
                {activeMenu !== 'index' && (
                  <button
                    type="button"
                    onClick={() => onActiveMenuChange('index')}
                  >
                    Todos os capítulos
                  </button>
                )}
                <a href="#silencio" onClick={onClose}>
                  Ir ao silêncio
                </a>
              </div>
            </div>

            <div className={styles.mobileMenu}>
              <div className={styles.mobileMenuTop}>
                <Dialog.Close className={styles.mobileCloseButton}>
                  Fechar <span aria-hidden="true">×</span>
                </Dialog.Close>
                <p>{currentChapterNumber} / 09</p>
              </div>

              <div className={styles.mobileMenuTitleBar}>
                {activeMenu === 'index' ? (
                  <a
                    href="#despertar"
                    onClick={(event) =>
                      handleDestinationClick(event, 'despertar')
                    }
                  >
                    Início
                  </a>
                ) : (
                  <div>
                    <span>{menuTitle}</span>
                    <button
                      type="button"
                      aria-label="Voltar aos grupos"
                      onClick={() => onActiveMenuChange('index')}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                )}
              </div>

              {activeMenu === 'index' ? (
                <nav
                  className={styles.mobileMenuNav}
                  aria-label="Grupos de capítulos"
                >
                  {(
                    Object.keys(menuGroups) as Array<Exclude<MenuKey, 'index'>>
                  ).map((key) => (
                    <button
                      type="button"
                      onClick={() => onActiveMenuChange(key)}
                      key={key}
                    >
                      <span>{menuGroups[key].label}</span>
                      <span aria-hidden="true">✦</span>
                    </button>
                  ))}
                </nav>
              ) : (
                <div className={styles.mobileMenuContent} data-lenis-prevent>
                  <p className={styles.mobileMenuEyebrow}>{menuEyebrow}</p>
                  <ol className={styles.chapterList}>
                    {chapterLinks(menuGroups[activeMenu].chapters, true)}
                  </ol>
                </div>
              )}

              <div className={styles.mobileMenuFooter}>
                <a
                  href="#camadas"
                  onClick={(event) => handleDestinationClick(event, 'camadas')}
                >
                  Ir às camadas
                </a>
                <a
                  href="#silencio"
                  onClick={(event) => handleDestinationClick(event, 'silencio')}
                >
                  Ir ao silêncio
                </a>
              </div>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
