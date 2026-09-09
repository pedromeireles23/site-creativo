'use client';

import { useRef } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { chapters, menuGroups, type MenuKey } from './site-menu-data';
import styles from './site-header.module.scss';

gsap.registerPlugin(useGSAP);

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

  useGSAP(
    () => {
      if (!open || !panelRef.current) return;

      gsap.fromTo(
        panelRef.current,
        { xPercent: -102 },
        { xPercent: 0, duration: 0.72, ease: 'power4.out' },
      );
    },
    { dependencies: [open], scope: panelRef, revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (!open || !panelRef.current) return;

      const items = panelRef.current.querySelectorAll('[data-menu-item]');
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.045,
          ease: 'power2.out',
        },
      );
    },
    {
      dependencies: [activeMenu, open],
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

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <Dialog.Portal data-slot="dialog-portal">
        <Dialog.Backdrop
          data-slot="dialog-overlay"
          className="fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
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
            <div className={styles.panelTop}>
              <button
                className={styles.closeButton}
                type="button"
                onClick={onClose}
              >
                Fechar <span aria-hidden="true">×</span>
              </button>
              <p>{currentChapterNumber} / 09</p>
            </div>

            {activeMenu === 'index' && (
              <div className={styles.groupChooser} data-menu-item>
                <a href="#despertar" onClick={onClose}>
                  Início
                </a>
                {(
                  Object.keys(menuGroups) as Array<Exclude<MenuKey, 'index'>>
                ).map((key) => (
                  <button
                    type="button"
                    onClick={() => onActiveMenuChange(key)}
                    key={key}
                  >
                    {menuGroups[key].label} <span aria-hidden="true">✦</span>
                  </button>
                ))}
              </div>
            )}

            <div className={styles.panelHeading} data-menu-item>
              <p>{menuEyebrow}</p>
              <h2>{menuTitle}</h2>
            </div>

            <ol className={styles.chapterList}>
              {visibleChapters.map((chapter) => (
                <li data-menu-item key={chapter.id}>
                  <a
                    href={`#${chapter.id}`}
                    aria-current={
                      currentChapter === chapter.id ? 'location' : undefined
                    }
                    onClick={onClose}
                  >
                    <span>{chapter.number}</span>
                    <span>
                      <strong>{chapter.label}</strong>
                      <small>{chapter.note}</small>
                    </span>
                    <span aria-hidden="true">↘</span>
                  </a>
                </li>
              ))}
            </ol>

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
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
