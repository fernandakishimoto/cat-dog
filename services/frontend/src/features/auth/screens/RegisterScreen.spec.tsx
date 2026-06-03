import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@/lib/i18n';
import { useRegister } from '@/features/auth/hooks/useRegister';

import RegisterScreen from './RegisterScreen';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ''} />
  ),
}));

const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: mockBack,
  }),
}));

jest.mock('@/features/auth/hooks/useRegister');

const mockUseRegister = useRegister as jest.MockedFunction<typeof useRegister>;

const defaultHookReturn = {
  onSubmit: jest.fn(),
  isLoading: false,
  registerError: null,
  registerSuccess: false,
};

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRegister.mockReturnValue(defaultHookReturn);
  });

  it('should render all required fields and buttons', () => {
    render(<RegisterScreen />);

    expect(screen.getByTestId('register-name')).toBeInTheDocument();
    expect(screen.getByTestId('register-email')).toBeInTheDocument();
    expect(screen.getByTestId('register-password')).toBeInTheDocument();
    expect(screen.getByTestId('register-confirm-password')).toBeInTheDocument();
    expect(screen.getByTestId('register-submit')).toBeInTheDocument();
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
  });

  it('should show name validation error when name is too short', async () => {
    const user = userEvent.setup();
    render(<RegisterScreen />);

    await user.type(screen.getByTestId('register-name'), 'A');
    await user.type(screen.getByTestId('register-email'), 'test@example.com');
    await user.type(screen.getByTestId('register-password'), 'password123');
    await user.type(screen.getByTestId('register-confirm-password'), 'password123');
    await user.click(screen.getByTestId('register-submit'));

    await waitFor(() => {
      expect(screen.getByTestId('register-name-error')).toBeInTheDocument();
    });

    expect(defaultHookReturn.onSubmit).not.toHaveBeenCalled();
  });

  it('should show password length validation error', async () => {
    const user = userEvent.setup();
    render(<RegisterScreen />);

    await user.type(screen.getByTestId('register-name'), 'John Doe');
    await user.type(screen.getByTestId('register-email'), 'test@example.com');
    await user.type(screen.getByTestId('register-password'), 'short');
    await user.type(screen.getByTestId('register-confirm-password'), 'short');
    await user.click(screen.getByTestId('register-submit'));

    await waitFor(() => {
      const passwordErrors = screen.getAllByRole('generic').filter(el =>
        el.getAttribute('data-testid') === 'register-name-error' ||
        el.textContent?.includes('mínimo 8'),
      );
      expect(passwordErrors.length).toBeGreaterThan(0);
    });

    expect(defaultHookReturn.onSubmit).not.toHaveBeenCalled();
  });

  it('should show password match validation error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<RegisterScreen />);

    await user.type(screen.getByTestId('register-name'), 'John Doe');
    await user.type(screen.getByTestId('register-email'), 'test@example.com');
    await user.type(screen.getByTestId('register-password'), 'password123');
    await user.type(screen.getByTestId('register-confirm-password'), 'different456');
    await user.click(screen.getByTestId('register-submit'));

    await waitFor(() => {
      expect(screen.getByText('As senhas não coincidem.')).toBeInTheDocument();
    });

    expect(defaultHookReturn.onSubmit).not.toHaveBeenCalled();
  });

  it('should disable submit button when isLoading=true', () => {
    mockUseRegister.mockReturnValue({ ...defaultHookReturn, isLoading: true });
    render(<RegisterScreen />);

    expect(screen.getByTestId('register-submit')).toBeDisabled();
  });

  it('should show success message when registerSuccess=true', () => {
    mockUseRegister.mockReturnValue({ ...defaultHookReturn, registerSuccess: true });
    render(<RegisterScreen />);

    expect(screen.getByTestId('register-success-message')).toBeInTheDocument();
  });

  it('should show error message when registerError is set', () => {
    mockUseRegister.mockReturnValue({ ...defaultHookReturn, registerError: 'AUTH_REGISTER:errorGeneric' });
    render(<RegisterScreen />);

    expect(screen.getByTestId('register-error-message')).toBeInTheDocument();
  });

  it('should call router.back() when back button is clicked', async () => {
    const user = userEvent.setup();
    render(<RegisterScreen />);

    await user.click(screen.getByTestId('back-button'));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('should call onSubmit with valid form data', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
    mockUseRegister.mockReturnValue({ ...defaultHookReturn, onSubmit: mockOnSubmit });

    render(<RegisterScreen />);

    await user.type(screen.getByTestId('register-name'), 'John Doe');
    await user.type(screen.getByTestId('register-email'), 'john@example.com');
    await user.type(screen.getByTestId('register-password'), 'password123');
    await user.type(screen.getByTestId('register-confirm-password'), 'password123');
    await user.click(screen.getByTestId('register-submit'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        },
        expect.anything(),
      );
    });
  });

  it('should disable submit button when registerSuccess=true', () => {
    mockUseRegister.mockReturnValue({ ...defaultHookReturn, registerSuccess: true });
    render(<RegisterScreen />);

    expect(screen.getByTestId('register-submit')).toBeDisabled();
  });
});
