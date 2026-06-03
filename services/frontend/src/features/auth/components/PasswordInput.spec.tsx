import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@/lib/i18n';

import PasswordInput from './PasswordInput';

describe('PasswordInput', () => {
  const defaultProps = {
    label: 'Senha',
    'data-testid': 'password-field',
    i18nNamespace: 'AUTH_LOGIN',
  };

  it('should render the label', () => {
    render(<PasswordInput {...defaultProps} />);
    expect(screen.getByText('Senha')).toBeInTheDocument();
  });

  it('should render as password type by default (hidden)', () => {
    render(<PasswordInput {...defaultProps} />);
    const input = screen.getByTestId('password-field');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should toggle to text type when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<PasswordInput {...defaultProps} />);

    const input = screen.getByTestId('password-field');
    const toggleButton = screen.getByTestId('password-field-toggle');

    expect(input).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should render toggle button with correct testID', () => {
    render(<PasswordInput {...defaultProps} />);
    expect(screen.getByTestId('password-field-toggle')).toBeInTheDocument();
  });

  it('should display error message when provided', () => {
    render(<PasswordInput {...defaultProps} errorMessage="Este campo é obrigatório." />);
    expect(screen.getByText('Este campo é obrigatório.')).toBeInTheDocument();
  });

  it('should not display error message when not provided', () => {
    render(<PasswordInput {...defaultProps} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should forward onChange events', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<PasswordInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByTestId('password-field');
    await user.type(input, 'test');

    expect(onChange).toHaveBeenCalled();
  });

  it('should have accessible aria-label on toggle button', () => {
    render(<PasswordInput {...defaultProps} />);
    const toggleButton = screen.getByTestId('password-field-toggle');
    expect(toggleButton).toHaveAttribute('aria-label');
  });
});
