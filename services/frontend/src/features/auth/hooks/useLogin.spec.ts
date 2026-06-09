import { renderHook, act } from '@testing-library/react';

import { authService } from '@/http/authService';
import { useLogin } from './useLogin';

jest.mock('@/http/authService', () => ({
  authService: {
    login: jest.fn(),
  },
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockLogin = authService.login as jest.Mock;

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with isLoading=false and loginError=null', () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.loginError).toBeNull();
  });

  it('should set isLoading=true while login request is pending', async () => {
    let resolveLogin: (value: unknown) => void;
    const pendingPromise = new Promise(resolve => {
      resolveLogin = resolve;
    });
    mockLogin.mockReturnValueOnce(pendingPromise);

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.onSubmit({ email: 'test@example.com', password: 'password123' });
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveLogin!({ user: { id: '1' }, accessToken: 'token', refreshToken: 'refresh' });
    });
  });

  it('should redirect admin to /admin/solicitacoes on successful login', async () => {
    mockLogin.mockResolvedValueOnce({
      user: { id: '1', name: 'Admin', email: 'admin@email.com', role: 'admin' },
      accessToken: 'token',
      refreshToken: 'refresh',
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.onSubmit({ email: 'admin@email.com', password: 'password123' });
    });

    expect(mockPush).toHaveBeenCalledWith('/admin/solicitacoes');
    expect(result.current.loginError).toBeNull();
  });

  it('should redirect adotante to / on successful login', async () => {
    mockLogin.mockResolvedValueOnce({
      user: { id: '2', name: 'Adotante', email: 'adotante@email.com', role: 'adotante' },
      accessToken: 'token',
      refreshToken: 'refresh',
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.onSubmit({ email: 'adotante@email.com', password: 'password123' });
    });

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should set loginError when login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Unauthorized'));

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.onSubmit({ email: 'test@example.com', password: 'wrongpassword' });
    });

    expect(result.current.loginError).toBe('AUTH_LOGIN:errorGeneric');
    expect(result.current.isLoading).toBe(false);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should reset loginError on new submit attempt', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Unauthorized'));

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.onSubmit({ email: 'test@example.com', password: 'wrong' });
    });

    expect(result.current.loginError).toBe('AUTH_LOGIN:errorGeneric');

    mockLogin.mockResolvedValueOnce({
      user: { id: '1', name: 'Test', email: 'test@example.com', role: 'adotante' },
      accessToken: 'token',
      refreshToken: 'refresh',
    });

    await act(async () => {
      await result.current.onSubmit({ email: 'test@example.com', password: 'password123' });
    });

    expect(result.current.loginError).toBeNull();
  });
});
