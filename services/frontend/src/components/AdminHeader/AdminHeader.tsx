'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import styles from './AdminHeader.module.css';

const clearAccessTokenCookie = (): void => {
  document.cookie = 'access_token=; Path=/; Max-Age=0; SameSite=Lax';
};

export default function AdminHeader() {
  const { t } = useTranslation('ADMIN_LAYOUT');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    clearAccessTokenCookie();
    window.location.assign('/login');
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggleMenu();
    }
  }, [handleToggleMenu]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header} data-testid="admin-header">
      <div className={styles.logoContainer}>
        <Image
          src="/images/catdog-logo.png"
          alt={t('logoAlt')}
          width={120}
          height={32}
          className={styles.logo}
          data-testid="admin-logo"
          priority
        />
      </div>

      <div className={styles.userMenu} ref={menuRef}>
        <button
          type="button"
          className={styles.userButton}
          onClick={handleToggleMenu}
          onKeyDown={handleKeyDown}
          aria-label={t('userMenuLabel')}
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          data-testid="admin-user-button"
        >
          <span className={styles.userIcon} aria-hidden="true" />
        </button>

        {isMenuOpen ? (
          <div className={styles.dropdown} role="menu" data-testid="admin-user-menu">
            <button
              type="button"
              className={styles.logoutButton}
              onClick={handleLogout}
              role="menuitem"
              data-testid="admin-logout-button"
            >
              {t('logoutButton')}
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
