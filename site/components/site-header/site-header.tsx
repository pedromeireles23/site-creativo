'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { chapters, menuGroups, type MenuKey } from './site-menu-data';
import styles from './site-header.module.scss';

const SiteMenu = dynamic(
  () => import('./site-menu').then((module) => module.SiteMenu),
  {
    loading: () => <div className={styles.dialogShell} aria-hidden="true" />,
    ssr: false,
  },
);

const preloadSiteMenu = () => {
  void import('./site-menu');
};

type HeaderTheme = 'dark' | 'light';

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>('index');
  const [headerTheme, setHeaderTheme] = useState<HeaderTheme>('dark');
  const [currentChapter, setCurrentChapter] = useState('despertar');

  const openMenu = (menu: MenuKey, trigger: HTMLElement) => {
    lastTriggerRef.current = trigger;
    setActiveMenu(menu);
    setMenuMounted(true);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  };

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let lastY = window.scrollY;
    let headerVisible = true;
    let ticking = false;

    const setVisibility = (visible: boolean) => {
      if (headerVisible === visible) return;
      headerVisible = visible;

      gsap.to(header, {
        yPercent: visible ? 0 : -125,
        duration: reduceMotion ? 0 : 0.42,
        ease: 'power3.out',
        overwrite: true,
      });
    };

    const updateTheme = () => {
      const readingLine = Math.min(96, window.innerHeight * 0.14);
      const sections = document.querySelectorAll<HTMLElement>(
        '[data-header-theme]',
      );

      for (const section of sections) {
        const bounds = section.getBoundingClientRect();
        if (bounds.top <= readingLine && bounds.bottom > readingLine) {
          const theme = section.dataset.headerTheme as HeaderTheme | undefined;
          if (theme) setHeaderTheme(theme);
          const chapter = section.dataset.headerChapter ?? section.id;
          if (chapter) setCurrentChapter(chapter);
          break;
        }
      }
    };

    const update = () => {
      const nextY = window.scrollY;
      const delta = nextY - lastY;

      updateTheme();

      if (menuOpen || nextY < 72) {
        setVisibility(true);
      } else if (delta > 8) {
        setVisibility(false);
      } else if (delta < -8) {
        setVisibility(true);
      }

      lastY = nextY;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    updateTheme();
    if (menuOpen) {
      headerVisible = true;
      gsap.to(header, {
        yPercent: 0,
        duration: reduceMotion ? 0 : 0.42,
        ease: 'power3.out',
        overwrite: true,
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateTheme);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateTheme);
      gsap.killTweensOf(header);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={styles.header}
        data-menu-open={menuOpen}
        data-theme={menuOpen ? 'light' : headerTheme}
        ref={headerRef}
      >
        <nav className={styles.navigation} aria-label="Navegação principal">
          <div className={styles.desktopLeft}>
            {(Object.keys(menuGroups) as Array<Exclude<MenuKey, 'index'>>).map(
              (key) => (
                <button
                  className={styles.navigationItem}
                  data-active={menuOpen && activeMenu === key}
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={menuOpen && activeMenu === key}
                  onPointerEnter={preloadSiteMenu}
                  onPointerDown={preloadSiteMenu}
                  onFocus={preloadSiteMenu}
                  onClick={(event) => openMenu(key, event.currentTarget)}
                  key={key}
                >
                  {menuGroups[key].label}
                </button>
              ),
            )}
          </div>

          <div className={styles.mobileLeft}>
            <button
              className={styles.navigationItem}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onPointerEnter={preloadSiteMenu}
              onPointerDown={preloadSiteMenu}
              onFocus={preloadSiteMenu}
              onClick={(event) => openMenu('index', event.currentTarget)}
            >
              Menu
            </button>
          </div>

          <a
            className={styles.logo}
            href="#despertar"
            aria-label="Floresta Viva — voltar ao início"
          >
            <span className={styles.logoMark} aria-hidden="true" />
            <span className={styles.logoText}>Floresta Viva</span>
          </a>

          <div className={styles.desktopRight}>
            <a className={styles.navigationItem} href="#camadas">
              Camadas
            </a>
            <a className={styles.navigationItem} href="#silencio">
              Silêncio
            </a>
          </div>

          <div className={styles.mobileRight}>
            <a
              className={`${styles.navigationItem} ${styles.mobileAccent}`}
              href="#silencio"
            >
              Silêncio
            </a>
          </div>
        </nav>

        <output className={styles.srOnly} aria-live="polite">
          Capítulo atual:{' '}
          {chapters.find((chapter) => chapter.id === currentChapter)?.label}
        </output>
      </header>

      {menuMounted && (
        <SiteMenu
          activeMenu={activeMenu}
          currentChapter={currentChapter}
          onActiveMenuChange={setActiveMenu}
          onClose={closeMenu}
          open={menuOpen}
        />
      )}
    </>
  );
}
