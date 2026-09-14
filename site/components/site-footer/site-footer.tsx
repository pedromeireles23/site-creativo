import styles from '@/app/page.module.scss';

export function SiteFooter() {
  return (
    <footer
      className={styles.siteFooter}
      aria-label="Rodapé"
      data-header-theme="dark"
      data-header-chapter="documentario"
    >
      <div className={styles.siteFooterGrid} aria-hidden="true" />

      <div className={styles.siteFooterWordmark}>
        <p>Floresta Viva</p>
      </div>
    </footer>
  );
}
