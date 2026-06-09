'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { authService } from '@/http/authService';
import type { LoginFormValuesType } from '@/features/auth/validators/authValidators';

type UseLoginReturnType = {
  onSubmit: (values: LoginFormValuesType) => Promise<void>;
  isLoading: boolean;
  loginError: string | null;
};

export function useLogin(): UseLoginReturnType {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = useCallback(
    async (values: LoginFormValuesType) => {
      setIsLoading(true);
      setLoginError(null);
      try {
        const response = await authService.login({ email: values.email, password: values.password });
        const destination = response.user.role === 'admin' ? '/admin/solicitacoes' : '/';
        router.push(destination);
      } catch {
        setLoginError('AUTH_LOGIN:errorGeneric');
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  return { onSubmit, isLoading, loginError };
}
