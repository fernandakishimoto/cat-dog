'use client';

import { forwardRef, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './PasswordInput.module.css';

type PasswordInputPropsType = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  errorMessage?: string;
  i18nNamespace?: string;
  'data-testid'?: string;
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputPropsType>(
  ({ label, errorMessage, i18nNamespace = 'AUTH_LOGIN', id, 'data-testid': testId, ...rest }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { t } = useTranslation(i18nNamespace);

    const handleToggle = useCallback(() => {
      setIsPasswordVisible(prev => !prev);
    }, []);

    const inputId = id ?? testId ?? `password-input-${i18nNamespace}`;

    return (
      <div className={styles.container}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            id={inputId}
            type={isPasswordVisible ? 'text' : 'password'}
            className={styles.input}
            data-testid={testId}
            {...rest}
          />
          <button
            type="button"
            className={styles.toggleButton}
            onClick={handleToggle}
            aria-label={t('passwordToggleLabel')}
            data-testid={testId ? `${testId}-toggle` : undefined}
          >
            {isPasswordVisible ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errorMessage ? <span className={styles.errorMessage}>{errorMessage}</span> : null}
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
