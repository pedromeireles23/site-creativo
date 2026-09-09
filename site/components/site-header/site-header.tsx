'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import styles from './site-header.module.scss';

gsap.registerPlugin(useGSAP);

type MenuKey = 'index' | 'bioma' | 'vida' | 'travessia';
type HeaderTheme = 'dark' | 'light';

type Chapter = {
  id: string;
  number: string;
  label: string;
  note: string;
};

const chapters: Chapter[] = [
  {
    id: 'despertar',
    number: '01',
    label: 'Despertar',
    note: 'O primeiro fôlego',
  },
  { id: 'folego', number: '02', label: 'Fôlego', note: 'A mata respira' },
  { id: 'veias', number: '03', label: 'Veias', note: 'A água em movimento' },
  { id: 'camadas', number: '04', label: 'Camadas', note: 'Nada vive sozinho' },
  {
    id: 'territorios',
    number: '05',
    label: 'Territórios',
    note: 'A floresta não é uma só',
  },
  { id: 'olhos', number: '06', label: 'Olhos', note: 'A presença da onça' },
  { id: 'asas', number: '07', label: 'Asas', note: 'O céu ganha cor' },
  { id: 'inteiro', number: '08', label: 'Inteiro', note: 'Tudo pulsa junto' },
  {
    id: 'silencio',
    number: '09',
    label: 'Silêncio',
    note: 'O fim da travessia',
  },
];

const menuGroups: Record<
  Exclude<MenuKey, 'index'>,
  { label: string; eyebrow: string; chapters: string[] }
> = {
  bioma: {
    label: 'Bioma',
    eyebrow: 'A floresta',
    chapters: ['despertar', 'folego', 'veias', 'camadas', 'territorios'],
  },
  vida: {
    label: 'Vida',
    eyebrow: 'Presenças',
    chapters: ['olhos', 'asas'],
  },
  travessia: {
    label: 'Travessia',
    eyebrow: 'Um só corpo',
    chapters: ['inteiro', 'silencio'],
  },
};

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>('index');
  const [headerTheme, setHeaderTheme] = useState<HeaderTheme>('dark');
  const [currentChapter, setCurrentChapter] = useState('despertar');

  const openMenu = (menu: MenuKey, trigger: HTMLElement) => {
    lastTriggerRef.current = trigger;
    setActiveMenu(menu);
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

  useGSAP(
    () => {
      if (!menuOpen || !panelRef.current) return;

      gsap.fromTo(
        panelRef.current,
        { xPercent: -102 },
        { xPercent: 0, duration: 0.72, ease: 'power4.out' },
      );
    },
    { dependencies: [menuOpen], scope: panelRef, revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (!menuOpen || !panelRef.current) return;

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
      dependencies: [activeMenu, menuOpen],
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
    <Dialog
      open={menuOpen}
      onOpenChange={(open) => {
        if (open) setMenuOpen(true);
        else closeMenu();
      }}
    >
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

      <DialogContent className={styles.dialogShell} showCloseButton={false}>
        <DialogTitle className={styles.srOnly}>
          Navegação por capítulos
        </DialogTitle>
        <DialogDescription className={styles.srOnly}>
          Escolha uma parte da travessia Floresta Viva.
        </DialogDescription>

        <button
          className={styles.scrim}
          type="button"
          tabIndex={-1}
          aria-label="Fechar navegação"
          onClick={closeMenu}
        />

        <div className={styles.panel} ref={panelRef}>
          <div className={styles.panelTop}>
            <button
              className={styles.closeButton}
              type="button"
              onClick={closeMenu}
            >
              Fechar <span aria-hidden="true">×</span>
            </button>
            <p>{currentChapterNumber} / 09</p>
          </div>

          {activeMenu === 'index' && (
            <div className={styles.groupChooser} data-menu-item>
              <a href="#despertar" onClick={closeMenu}>
                Início
              </a>
              {(
                Object.keys(menuGroups) as Array<Exclude<MenuKey, 'index'>>
              ).map((key) => (
                <button
                  type="button"
                  onClick={() => setActiveMenu(key)}
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
                  onClick={closeMenu}
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
              <button type="button" onClick={() => setActiveMenu('index')}>
                Todos os capítulos
              </button>
            )}
            <a href="#silencio" onClick={closeMenu}>
              Ir ao silêncio
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
