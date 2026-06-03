import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import AuthCard from './AuthCard';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { 'data-testid'?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ''} />
  ),
}));

describe('AuthCard', () => {
  it('should render with testID="auth-card"', () => {
    render(
      <AuthCard>
        <p>Test content</p>
      </AuthCard>,
    );

    expect(screen.getByTestId('auth-card')).toBeInTheDocument();
  });

  it('should render the logo image', () => {
    render(
      <AuthCard>
        <p>Test content</p>
      </AuthCard>,
    );

    expect(screen.getByTestId('auth-card-logo')).toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <AuthCard>
        <p>Child content here</p>
      </AuthCard>,
    );

    expect(screen.getByText('Child content here')).toBeInTheDocument();
  });

  it('should render logo with correct alt text', () => {
    render(
      <AuthCard>
        <p>Content</p>
      </AuthCard>,
    );

    expect(screen.getByAltText('CatDog')).toBeInTheDocument();
  });
});
