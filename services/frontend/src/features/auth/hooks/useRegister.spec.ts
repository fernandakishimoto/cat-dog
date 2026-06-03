import { renderHook, act } from '@testing-library/react';

import { authService } from '@/http/authService';
import { useRegister } from './useRegister';

jest.mock('@/http/authService', () => ({
  authService: {
    register: jest.fn(),
  },
}));

const mockRegister = authService.register as jest.Mock;

const validValues = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password123',
};

describe('useRegister', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useRegister());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.registerError).toBeNull();
    expect(result.current.registerSuccess).toBe(false);
  });

  it('should set isLoading=true while request is pending', async () => {
    let resolveRegister: (value: unknown) => void;
    const pendingPromise = new Promise(resolve => {
      resolveRegister = resolve;
    });
    mockRegister.mockReturnValueOnce(pendingPromise);

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.onSubmit(validValues);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveRegister!(undefined);
    });
  });

  it('should set registerSuccess=true on success', async () => {
    mockRegister.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.onSubmit(validValues);
    });

    expect(result.current.registerSuccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.registerError).toBeNull();
  });

  it('should not send confirmPassword to authService', async () => {
    mockRegister.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.onSubmit(validValues);
    });

    expect(mockRegister).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    expect(mockRegister.mock.calls[0][0]).not.toHaveProperty('confirmPassword');
  });

  it('should set registerError when registration fails', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Conflict'));

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.onSubmit(validValues);
    });

    expect(result.current.registerError).toBe('AUTH_REGISTER:errorGeneric');
    expect(result.current.registerSuccess).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should reset error and success on new submit attempt', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Conflict'));
    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.onSubmit(validValues);
    });

    expect(result.current.registerError).toBe('AUTH_REGISTER:errorGeneric');

    mockRegister.mockResolvedValueOnce(undefined);
    await act(async () => {
      await result.current.onSubmit(validValues);
    });

    expect(result.current.registerError).toBeNull();
    expect(result.current.registerSuccess).toBe(true);
  });
});
