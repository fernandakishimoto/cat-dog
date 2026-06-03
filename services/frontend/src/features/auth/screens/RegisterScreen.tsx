'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

import AuthCard from '@/components/AuthCard/AuthCard';
import PasswordInput from '@/features/auth/components/PasswordInput';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { registerSchema, RegisterFormValuesType } from '@/features/auth/validators/authValidators';

import styles from './RegisterScreen.module.css';

export default function RegisterScreen() {
  const { t } = useTranslation('AUTH_REGISTER');
  const router = useRouter();
  const { onSubmit, isLoading, registerError, registerSuccess } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValuesType>({
    resolver: zodResolver(registerSchema),
  });

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <AuthCard>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.fieldContainer}>
          <label htmlFor="register-name" className={styles.label}>
            {t('nameLabel')}
          </label>
          <input
            id="register-name"
            type="text"
            placeholder={t('namePlaceholder')}
            className={styles.input}
            data-testid="register-name"
            aria-invalid={Boolean(errors.name)}
            {...register('name')}
          />
          {errors.name ? (
            <span className={styles.errorText} data-testid="register-name-error">
              {t(errors.name.message as string)}
            </span>
          ) : null}
        </div>

        <div className={styles.fieldContainer}>
          <label htmlFor="register-email" className={styles.label}>
            {t('emailLabel')}
          </label>
          <input
            id="register-email"
            type="email"
            placeholder={t('emailPlaceholder')}
            className={styles.input}
            data-testid="register-email"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email ? (
            <span className={styles.errorText} data-testid="register-email-error">
              {t(errors.email.message as string)}
            </span>
          ) : null}
        </div>

        <PasswordInput
          label={t('passwordLabel')}
          placeholder={t('passwordPlaceholder')}
          data-testid="register-password"
          i18nNamespace="AUTH_REGISTER"
          errorMessage={errors.password ? t(errors.password.message as string) : undefined}
          {...register('password')}
        />

        <PasswordInput
          label={t('confirmPasswordLabel')}
          placeholder={t('confirmPasswordPlaceholder')}
          data-testid="register-confirm-password"
          i18nNamespace="AUTH_REGISTER"
          errorMessage={errors.confirmPassword ? t(errors.confirmPassword.message as string) : undefined}
          {...register('confirmPassword')}
        />

        {registerError ? (
          <div className={styles.formError} data-testid="register-error-message">
            {t(registerError)}
          </div>
        ) : null}

        {registerSuccess ? (
          <div className={styles.successMessage} data-testid="register-success-message">
            {t('successMessage')}
          </div>
        ) : null}

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || registerSuccess}
            data-testid="register-submit"
          >
            {isLoading ? <span className={styles.spinner} aria-hidden="true" /> : null}
            {t('submitButton')}
          </button>

          <button
            type="button"
            className={styles.backButton}
            onClick={handleBack}
            data-testid="back-button"
          >
            {t('backButton')}
          </button>
        </div>
      </form>
    </AuthCard>
  );
}
