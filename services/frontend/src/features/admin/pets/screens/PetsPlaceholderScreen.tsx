'use client';

import { useTranslation } from 'react-i18next';

import styles from './PetsPlaceholderScreen.module.css';

export default function PetsPlaceholderScreen() {
  const { t } = useTranslation('ADMIN_LAYOUT');

  return (
    <div className={styles.container} data-testid="pets-placeholder">
      <h1 className={styles.title}>{t('tabPets')}</h1>
      <p className={styles.message}>{t('petsPlaceholder')}</p>
    </div>
  );
}
