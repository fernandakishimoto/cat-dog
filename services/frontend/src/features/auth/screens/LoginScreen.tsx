'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

import AuthCard from '@/components/AuthCard/AuthCard';
import PasswordInput from '@/features/auth/components/PasswordInput';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { loginSchema, LoginFormValuesType } from '@/features/auth/validators/authValidators';

import styles from './LoginScreen.module.css';

export default function LoginScreen() {
  const { t } = useTranslation('AUTH_LOGIN');
  const router = useRouter();
  const { onSubmit, isLoading, loginError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValuesType>({
    resolver: zodResolver(loginSchema),
  });

  const handleForgotPassword = useCallback(() => undefined, []);

  const handleGoToRegister = useCallback(() => {
    router.push('/register');
  }, [router]);

  return (
    <AuthCard>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.fieldContainer}>
          <label htmlFor="login-email" className={styles.label}>
            {t('emailLabel')}
          </label>
          <input
            id="login-email"
            type="email"
            placeholder={t('emailPlaceholder')}
            className={styles.input}
            data-testid="login-email"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email ? (
            <span className={styles.errorText} data-testid="login-email-error">
              {t(errors.email.message as string)}
            </span>
          ) : null}
        </div>

        <PasswordInput
          label={t('passwordLabel')}
          placeholder={t('passwordPlaceholder')}
          data-testid="login-password"
          i18nNamespace="AUTH_LOGIN"
          errorMessage={errors.password ? t(errors.password.message as string) : undefined}
          {...register('password')}
        />

        {loginError ? (
          <div className={styles.formError} data-testid="login-error-message">
            {t(loginError)}
          </div>
        ) : null}

        <button type="button" className={styles.forgotPasswordLink} onClick={handleForgotPassword} data-testid="forgot-password-link">
          {t('forgotPasswordLink')}
        </button>

        <button type="submit" className={styles.submitButton} disabled={isLoading} data-testid="login-submit">
          {isLoading ? <span className={styles.spinner} aria-hidden="true" /> : null}
          {t('submitButton')}
        </button>
      </form>

      <div className={styles.footer}>
        <button type="button" className={styles.goToRegisterLink} onClick={handleGoToRegister} data-testid="go-to-register-link">
          {t('goToRegisterLink')}
        </button>
      </div>
    </AuthCard>
  );
}
