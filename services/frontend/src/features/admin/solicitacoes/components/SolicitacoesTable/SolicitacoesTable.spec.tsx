import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@/lib/i18n';
import type { AdoptionRequestSummaryType } from '@/types/adoption-request';

import SolicitacoesTable from './SolicitacoesTable';

const mockSolicitacoes: AdoptionRequestSummaryType[] = [
  {
    id: 'uuid-1',
    created_at: '2026-06-08T10:00:00Z',
    adopter_name: 'Maria Silva',
    adopter_email: 'maria@email.com',
    status: 'formulario',
    pet_id: 'pet-1',
    pet: {
      name: 'Bolinha',
      species: 'cachorro',
      sex: 'macho',
      size: 'medio',
      age_months: 24,
      city: 'São Paulo',
      photo_url: 'https://example.com/bolinha.jpg',
    },
  },
];

const defaultProps = {
  solicitacoes: mockSolicitacoes,
  onViewRequest: jest.fn(),
};

describe('SolicitacoesTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render table headers', () => {
    render(<SolicitacoesTable {...defaultProps} />);

    expect(screen.getByTestId('table-header-date')).toBeInTheDocument();
    expect(screen.getByTestId('table-header-pet')).toBeInTheDocument();
    expect(screen.getByTestId('table-header-requester')).toBeInTheDocument();
    expect(screen.getByTestId('table-header-status')).toBeInTheDocument();
    expect(screen.getByTestId('table-header-actions')).toBeInTheDocument();
  });

  it('should render a row for each solicitacao', () => {
    render(<SolicitacoesTable {...defaultProps} />);

    expect(screen.getByTestId('table-row-uuid-1')).toBeInTheDocument();
    expect(screen.getByText('Bolinha')).toBeInTheDocument();
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
    expect(screen.getByText('maria@email.com')).toBeInTheDocument();
  });

  it('should render pet photo when photo_url is available', () => {
    render(<SolicitacoesTable {...defaultProps} />);

    expect(screen.getByTestId('pet-photo-uuid-1')).toBeInTheDocument();
  });

  it('should render empty state when list is empty', () => {
    render(<SolicitacoesTable {...defaultProps} solicitacoes={[]} />);

    expect(screen.getByTestId('table-empty-state')).toBeInTheDocument();
  });

  it('should call onViewRequest with the row id when "Ver solicitação" is clicked', async () => {
    const user = userEvent.setup();
    render(<SolicitacoesTable {...defaultProps} />);

    await user.click(screen.getByTestId('view-request-uuid-1'));

    expect(defaultProps.onViewRequest).toHaveBeenCalledWith('uuid-1');
  });
});
