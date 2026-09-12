'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionProfile } from '@/hooks/use-motion-profile';
import { gsap } from '@/lib/gsap';
import { chapters, menuGroups, type MenuKey } from './site-menu-data';
import { SiteMenu } from './site-menu';
import styles from './site-header.module.scss';

type HeaderTheme = 'dark' | 'light';

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const headerThemeRef = useRef<HeaderTheme>('dark');
  const currentChapterRef = useRef('despertar');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>('index');
  const [headerTheme, setHeaderTheme] = useState<HeaderTheme>('dark');
  const [currentChapter, setCurrentChapter] = useState('despertar');
  const motionProfile = useMotionProfile();

  const openMenu = (menu: MenuKey, trigger: HTMLElement) => {
    lastTriggerRef.current = trigger;
    setActiveMenu(menu);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    window.requestAnimationFrame(() =>
      lastTriggerRef.current?.focus({ preventScroll: true }),
    );
  };

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const reduceMotion = motionProfile === 'reduced';
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-header-theme]'),
    );
    let lastY = window.scrollY;
    let headerVisible = true;
    let frameId: number | null = null;

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

      for (const section of sections) {
        const bounds = section.getBoundingClientRect();
        if (bounds.top <= readingLine && bounds.bottom > readingLine) {
          const theme = section.dataset.headerTheme as HeaderTheme | undefined;
          if (theme && theme !== headerThemeRef.current) {
            headerThemeRef.current = theme;
            setHeaderTheme(theme);
          }
          const chapter = section.dataset.headerChapter ?? section.id;
          if (chapter && chapter !== currentChapterRef.current) {
            currentChapterRef.current = chapter;
            setCurrentChapter(chapter);
          }
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
      frameId = null;
    };

    const scheduleUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(update);
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
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      gsap.killTweensOf(header);
    };
  }, [menuOpen, motionProfile]);

  return (
    <>
      <header
        className={styles.header}
        data-menu-open={menuOpen}
        data-page-theme={headerTheme}
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
              href="#folego"
            >
              Explorar
            </a>
          </div>
        </nav>

        <output className={styles.srOnly} aria-live="polite">
          Capítulo atual:{' '}
          {chapters.find((chapter) => chapter.id === currentChapter)?.label}
        </output>
      </header>

      <SiteMenu
        activeMenu={activeMenu}
        currentChapter={currentChapter}
        onActiveMenuChange={setActiveMenu}
        onClose={closeMenu}
        open={menuOpen}
      />
    </>
  );
}
