'use client';

import { useCallback, useState } from 'react';

import { authService } from '@/http/authService';
import { RegisterFormValuesType } from '@/features/auth/validators/authValidators';

type UseRegisterReturnType = {
  onSubmit: (values: RegisterFormValuesType) => Promise<void>;
  isLoading: boolean;
  registerError: string | null;
  registerSuccess: boolean;
};

export function useRegister(): UseRegisterReturnType {
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const onSubmit = useCallback(async (values: RegisterFormValuesType) => {
    setIsLoading(true);
    setRegisterError(null);
    setRegisterSuccess(false);
    try {
      await authService.register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      setRegisterSuccess(true);
    } catch {
      setRegisterError('AUTH_REGISTER:errorGeneric');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { onSubmit, isLoading, registerError, registerSuccess };
}
