'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import styles from './AdminTabs.module.css';

type AdminTabType = {
  href: Route;
  labelKey: string;
  testId: string;
};

const ADMIN_TABS: AdminTabType[] = [
  { href: '/solicitacoes', labelKey: 'tabSolicitacoes', testId: 'admin-tab-solicitacoes' },
  { href: '/pets', labelKey: 'tabPets', testId: 'admin-tab-pets' },
];

export default function AdminTabs() {
  const { t } = useTranslation('ADMIN_LAYOUT');
  const pathname = usePathname();

  return (
    <nav className={styles.tabs} aria-label={t('tabsAriaLabel')} data-testid="admin-tabs">
      {ADMIN_TABS.map(tab => {
        const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={[styles.tab, isActive ? styles.tabActive : ''].filter(Boolean).join(' ')}
            data-testid={tab.testId}
            aria-current={isActive ? 'page' : undefined}
          >
            {t(tab.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
