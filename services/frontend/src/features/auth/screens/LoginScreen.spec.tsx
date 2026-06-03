import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@/lib/i18n';
import { useLogin } from '@/features/auth/hooks/useLogin';

import LoginScreen from './LoginScreen';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ''} />
  ),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('@/features/auth/hooks/useLogin');

const mockUseLogin = useLogin as jest.MockedFunction<typeof useLogin>;

const defaultHookReturn = {
  onSubmit: jest.fn(),
  isLoading: false,
  loginError: null,
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLogin.mockReturnValue(defaultHookReturn);
  });

  it('should render email field, password field, submit button, forgot password link and go-to-register link', () => {
    render(<LoginScreen />);

    expect(screen.getByTestId('login-email')).toBeInTheDocument();
    expect(screen.getByTestId('login-password')).toBeInTheDocument();
    expect(screen.getByTestId('login-submit')).toBeInTheDocument();
    expect(screen.getByTestId('forgot-password-link')).toBeInTheDocument();
    expect(screen.getByTestId('go-to-register-link')).toBeInTheDocument();
  });

  it('should show validation error when email is empty and form is submitted', async () => {
    const user = userEvent.setup();
    render(<LoginScreen />);

    await user.click(screen.getByTestId('login-submit'));

    await waitFor(() => {
      expect(screen.getByTestId('login-email-error')).toBeInTheDocument();
    });

    expect(defaultHookReturn.onSubmit).not.toHaveBeenCalled();
  });

  it('should show validation error for invalid email format', async () => {
    const user = userEvent.setup();
    render(<LoginScreen />);

    await user.type(screen.getByTestId('login-email'), 'not-an-email');
    await user.click(screen.getByTestId('login-submit'));

    await waitFor(() => {
      expect(screen.getByTestId('login-email-error')).toBeInTheDocument();
    });

    expect(defaultHookReturn.onSubmit).not.toHaveBeenCalled();
  });

  it('should disable submit button and show spinner when isLoading=true', () => {
    mockUseLogin.mockReturnValue({ ...defaultHookReturn, isLoading: true });
    render(<LoginScreen />);

    const submitButton = screen.getByTestId('login-submit');
    expect(submitButton).toBeDisabled();
  });

  it('should show login error message when loginError is set', () => {
    mockUseLogin.mockReturnValue({ ...defaultHookReturn, loginError: 'AUTH_LOGIN:errorGeneric' });
    render(<LoginScreen />);

    expect(screen.getByTestId('login-error-message')).toBeInTheDocument();
  });

  it('should not show error message when loginError is null', () => {
    render(<LoginScreen />);
    expect(screen.queryByTestId('login-error-message')).not.toBeInTheDocument();
  });

  it('should not navigate and not throw when forgot-password-link is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginScreen />);

    await expect(user.click(screen.getByTestId('forgot-password-link'))).resolves.not.toThrow();
  });

  it('should call onSubmit with valid credentials', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
    mockUseLogin.mockReturnValue({ ...defaultHookReturn, onSubmit: mockOnSubmit });

    render(<LoginScreen />);

    await user.type(screen.getByTestId('login-email'), 'test@example.com');
    await user.type(screen.getByTestId('login-password'), 'password123');
    await user.click(screen.getByTestId('login-submit'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          password: 'password123',
        },
        expect.anything(),
      );
    });
  });
});
