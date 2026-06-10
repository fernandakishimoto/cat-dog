'use client';

import { useCallback, useState } from 'react';
import axios from 'axios';

import { authService } from '@/http/authService';
import type { LoginFormValuesType } from '@/features/auth/validators/authValidators';

type UseLoginReturnType = {
  onSubmit: (values: LoginFormValuesType) => Promise<void>;
  isLoading: boolean;
  loginError: string | null;
};

const normalizeRole = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().toLowerCase();
};

const getRoleFromAccessToken = (accessToken: string): string => {
  try {
    const payloadEncoded = accessToken.split('.')[1];
    if (!payloadEncoded) {
      return '';
    }

    const payloadDecoded = JSON.parse(atob(payloadEncoded.replace(/-/g, '+').replace(/_/g, '/')));
    const userMetadataRole = normalizeRole(payloadDecoded?.user_metadata?.role);
    const appMetadataRole = normalizeRole(payloadDecoded?.app_metadata?.role);

    return userMetadataRole || appMetadataRole;
  } catch {
    return '';
  }
};

export function useLogin(): UseLoginReturnType {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = useCallback(async (values: LoginFormValuesType) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const response = await authService.login({ email: values.email, password: values.password });
      const encodedAccessToken = encodeURIComponent(response.accessToken);
      document.cookie = `access_token=${encodedAccessToken}; Path=/; Max-Age=3600; SameSite=Lax`;
      const responseRole = normalizeRole(response.user.role);
      const tokenRole = getRoleFromAccessToken(response.accessToken);
      const role = responseRole || tokenRole;
      const destination = role === 'admin' ? '/solicitacoes' : '/';
      const hasAccessTokenCookie = document.cookie.includes('access_token=');

      if (!hasAccessTokenCookie) {
        setLoginError('AUTH_LOGIN:errorGeneric');
        setIsLoading(false);
        return;
      }

      window.location.assign(destination);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // no-op: generic UI error is displayed to user
      }
      setLoginError('AUTH_LOGIN:errorGeneric');
      setIsLoading(false);
    }
  }, []);

  return { onSubmit, isLoading, loginError };
}
