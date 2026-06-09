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
    pet_name: 'Bolinha',
    pet_species: 'cachorro',
    pet_sex: 'macho',
    pet_size: 'medio',
    pet_age_months: 24,
    pet_city: 'São Paulo',
    status: 'formulario',
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
    expect(screen.getByTestId('table-header-city')).toBeInTheDocument();
    expect(screen.getByTestId('table-header-actions')).toBeInTheDocument();
  });

  it('should render a row for each solicitacao', () => {
    render(<SolicitacoesTable {...defaultProps} />);

    expect(screen.getByTestId('table-row-uuid-1')).toBeInTheDocument();
    expect(screen.getByText('Bolinha')).toBeInTheDocument();
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
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
