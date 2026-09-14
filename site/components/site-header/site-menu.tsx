'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { CustomEase } from 'gsap/CustomEase';
import { useSmoothScrollControls } from '@/components/smooth-scroll/smooth-scroll';
import { useMotionProfile } from '@/hooks/use-motion-profile';
import { gsap, useGSAP } from '@/lib/gsap';
import { menuGroups, type MenuEntry, type MenuKey } from './site-menu-data';
import styles from './site-header.module.scss';

gsap.registerPlugin(CustomEase);

const closedMenuClip = 'inset(0% 100% 0% 0% round 0.5rem)';
const openMenuClip = 'inset(0% 0% 0% 0% round 0.5rem)';
const menuClipEase = CustomEase.create('menuClip', '0.76,0,0.24,1');

type SiteMenuProps = {
  activeMenu: MenuKey;
  onActiveMenuChange: (menu: MenuKey) => void;
  onClose: () => void;
  open: boolean;
};

export function SiteMenu({
  activeMenu,
  onActiveMenuChange,
  onClose,
  open,
}: SiteMenuProps) {
  const panelGroupRef = useRef<HTMLDivElement>(null);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const motionProfile = useMotionProfile();
  const { navigateToHash, pause, resume } = useSmoothScrollControls();
  const resolvedMenuKey = activeMenu === 'index' ? 'animals' : activeMenu;
  const activeGroup = menuGroups[resolvedMenuKey];
  const activeEntry = activeGroup.entries.find(
    (entry) => entry.id === activeEntryId,
  );
  const activeEntryPosition = activeEntry
    ? Math.max(
        0,
        activeGroup.entries.findIndex((entry) => entry.id === activeEntry.id),
      )
    : null;

  useEffect(() => {
    if (!open) return;

    pause();
    return resume;
  }, [open, pause, resume]);

  useGSAP(
    () => {
      const panelGroup = panelGroupRef.current;
      if (!panelGroup) return;

      gsap.killTweensOf(panelGroup);
      const media = gsap.matchMedia();

      media.add('(max-width: 800px)', () => {
        gsap.set(panelGroup, { xPercent: 0 });

        if (!open) {
          gsap.set(panelGroup, { clipPath: closedMenuClip });
          return;
        }

        gsap.fromTo(
          panelGroup,
          { clipPath: closedMenuClip },
          {
            clipPath: openMenuClip,
            duration: motionProfile === 'reduced' ? 0 : 0.45,
            ease: menuClipEase,
          },
        );
      });

      media.add('(min-width: 801px)', () => {
        gsap.set(panelGroup, { clearProps: 'clipPath' });

        if (!open) {
          gsap.set(panelGroup, { xPercent: -104 });
          return;
        }

        gsap.fromTo(
          panelGroup,
          { xPercent: -104 },
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
      scope: panelGroupRef,
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      if (!open || !panelGroupRef.current || window.innerWidth <= 800) return;

      const items =
        panelGroupRef.current.querySelectorAll<HTMLElement>('[data-menu-item]');
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: motionProfile === 'reduced' ? 0 : 0.42,
          stagger: 0.04,
          ease: 'power2.out',
        },
      );
    },
    {
      dependencies: [activeMenu, motionProfile, open],
      scope: panelGroupRef,
      revertOnUpdate: true,
    },
  );

  const handleDestinationClick = (
    event: MouseEvent<HTMLAnchorElement>,
    destination: string,
  ) => {
    event.preventDefault();
    closeMenu();
    navigateToHash(destination);
  };

  const closeMenu = () => {
    setActiveEntryId(null);
    setExpandedEntryId(null);
    onClose();
  };

  const selectEntry = (entry: MenuEntry) => {
    setActiveEntryId(entry.id);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) closeMenu();
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
            Animais e flora da Amazônia
          </Dialog.Title>
          <Dialog.Description
            data-slot="dialog-description"
            className={`text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground ${styles.srOnly}`}
          >
            Escolha uma presença da floresta para ver sua imagem.
          </Dialog.Description>

          <button
            className={styles.scrim}
            data-cursor-tone="light"
            type="button"
            tabIndex={-1}
            aria-label="Fechar navegação"
            onClick={closeMenu}
          />

          <div className={styles.panelGroup} ref={panelGroupRef}>
            <div className={styles.panel}>
              <div className={styles.desktopMenu}>
                <div className={styles.panelTop}>
                  <p>
                    {activeEntryPosition === null
                      ? '--'
                      : String(activeEntryPosition + 1).padStart(2, '0')}{' '}
                    / {String(activeGroup.entries.length).padStart(2, '0')}
                  </p>
                </div>

                <div className={styles.panelHeading} data-menu-item>
                  <p>{activeGroup.eyebrow}</p>
                  <h2>{activeGroup.label}</h2>
                  <span>{activeGroup.description}</span>
                </div>

                <ol className={styles.menuEntryList}>
                  {activeGroup.entries.map((entry) => {
                    const isSelected = activeEntry?.id === entry.id;

                    return (
                      <li data-menu-item key={entry.id}>
                        <button
                          type="button"
                          data-cursor-tone="gold"
                          aria-pressed={isSelected}
                          data-selected={isSelected}
                          onClick={() => selectEntry(entry)}
                          onFocus={() => selectEntry(entry)}
                          onPointerEnter={() => selectEntry(entry)}
                        >
                          <span>{entry.number}</span>
                          <span>
                            <strong>{entry.label}</strong>
                            <small>{entry.scientificName ?? entry.note}</small>
                          </span>
                          <span aria-hidden="true">↘</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                <div className={styles.panelFooter} data-menu-item>
                  <a
                    data-cursor-tone="gold"
                    href="#camadas"
                    onClick={(event) =>
                      handleDestinationClick(event, 'camadas')
                    }
                  >
                    Explorar as camadas
                  </a>
                  <a
                    data-cursor-tone="light"
                    href="#documentario"
                    onClick={(event) =>
                      handleDestinationClick(event, 'documentario')
                    }
                  >
                    Ver documentário
                  </a>
                </div>
              </div>

              <div className={styles.mobileMenu}>
                <div className={styles.mobileMenuTop}>
                  <p>Floresta viva</p>
                </div>

                <div className={styles.mobileMenuTitleBar}>
                  {activeMenu === 'index' ? (
                    <a
                      data-cursor-tone="gold"
                      href="#despertar"
                      onClick={(event) =>
                        handleDestinationClick(event, 'despertar')
                      }
                    >
                      Início
                    </a>
                  ) : (
                    <div>
                      <span>{activeGroup.label}</span>
                      <button
                        type="button"
                        data-cursor-tone="gold"
                        aria-label="Voltar às categorias"
                        onClick={() => {
                          setActiveEntryId(null);
                          setExpandedEntryId(null);
                          onActiveMenuChange('index');
                        }}
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                  )}
                </div>

                {activeMenu === 'index' ? (
                  <nav
                    className={styles.mobileMenuNav}
                    aria-label="Animais e flora"
                  >
                    {(
                      Object.keys(menuGroups) as Array<
                        Exclude<MenuKey, 'index'>
                      >
                    ).map((key) => (
                      <button
                        type="button"
                        data-cursor-tone="gold"
                        onClick={() => {
                          setActiveEntryId(null);
                          setExpandedEntryId(null);
                          onActiveMenuChange(key);
                        }}
                        key={key}
                      >
                        <span>
                          <strong>{menuGroups[key].label}</strong>
                          <small>
                            {menuGroups[key].entries.length} encontros
                          </small>
                        </span>
                        <span aria-hidden="true">✦</span>
                      </button>
                    ))}
                  </nav>
                ) : (
                  <div className={styles.mobileMenuContent} data-lenis-prevent>
                    <p className={styles.mobileMenuEyebrow}>
                      {activeGroup.eyebrow}
                    </p>
                    <ol className={styles.mobileEntryList}>
                      {activeGroup.entries.map((entry) => {
                        const isExpanded = expandedEntryId === entry.id;
                        const dropdownId = `mobile-entry-${entry.id}`;

                        return (
                          <li key={entry.id}>
                            <button
                              type="button"
                              data-cursor-tone="gold"
                              aria-expanded={isExpanded}
                              aria-controls={dropdownId}
                              onClick={() => {
                                selectEntry(entry);
                                setExpandedEntryId(
                                  isExpanded ? null : entry.id,
                                );
                              }}
                            >
                              <span>{entry.number}</span>
                              <span>
                                <strong>{entry.label}</strong>
                                <small>
                                  {entry.scientificName ?? entry.note}
                                </small>
                              </span>
                              <span aria-hidden="true">
                                {isExpanded ? '−' : '+'}
                              </span>
                            </button>

                            {isExpanded && (
                              <div
                                className={styles.mobileEntryDropdown}
                                id={dropdownId}
                              >
                                <figure>
                                  <div className={styles.mobileEntryImage}>
                                    <Image
                                      src={entry.image}
                                      alt={entry.imageAlt}
                                      fill
                                      sizes="calc(100vw - 2.5rem)"
                                      style={{
                                        objectPosition:
                                          entry.imagePosition ?? 'center',
                                      }}
                                    />
                                    <span aria-hidden="true" />
                                  </div>
                                  <figcaption>
                                    <span>{entry.note}</span>
                                    {!entry.hideDestinationLink && (
                                      <a
                                        data-cursor-tone="light"
                                        href={`#${entry.destination}`}
                                        onClick={(event) =>
                                          handleDestinationClick(
                                            event,
                                            entry.destination,
                                          )
                                        }
                                      >
                                        Explorar{' '}
                                        <span aria-hidden="true">↘</span>
                                      </a>
                                    )}
                                  </figcaption>
                                </figure>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}

                <div className={styles.mobileMenuFooter}>
                  <a
                    data-cursor-tone="gold"
                    href="#camadas"
                    onClick={(event) =>
                      handleDestinationClick(event, 'camadas')
                    }
                  >
                    Ir às camadas
                  </a>
                  <a
                    data-cursor-tone="light"
                    href="#documentario"
                    onClick={(event) =>
                      handleDestinationClick(event, 'documentario')
                    }
                  >
                    Ver documentário
                  </a>
                </div>
              </div>
            </div>

            {activeEntry && (
              <aside
                className={styles.desktopPreview}
                id="menu-desktop-preview"
                aria-live="polite"
                data-with-link={!activeEntry.hideDestinationLink}
                data-menu-item
              >
                <Image
                  className={styles.desktopPreviewImage}
                  key={activeEntry.image}
                  src={activeEntry.image}
                  alt={activeEntry.imageAlt}
                  fill
                  sizes="(max-width: 1100px) 46vw, 34vw"
                  style={{
                    objectPosition: activeEntry.imagePosition ?? 'center',
                  }}
                />
                <span
                  className={styles.desktopPreviewShade}
                  aria-hidden="true"
                />
                <div className={styles.desktopPreviewCopy}>
                  <p>{activeGroup.eyebrow}</p>
                  <h3>{activeEntry.label}</h3>
                  <span>{activeEntry.scientificName ?? activeEntry.note}</span>
                </div>
                {!activeEntry.hideDestinationLink && (
                  <a
                    className={styles.desktopPreviewLink}
                    data-cursor-tone="light"
                    href={`#${activeEntry.destination}`}
                    onClick={(event) =>
                      handleDestinationClick(event, activeEntry.destination)
                    }
                  >
                    Explorar no site <span aria-hidden="true">↘</span>
                  </a>
                )}
              </aside>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
