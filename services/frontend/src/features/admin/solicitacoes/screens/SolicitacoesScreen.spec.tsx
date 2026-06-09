import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@/lib/i18n';
import { useSolicitacoes } from '@/features/admin/solicitacoes/hooks/useSolicitacoes';
import { useSolicitacaoModal } from '@/features/admin/solicitacoes/hooks/useSolicitacaoModal';

import SolicitacoesScreen from './SolicitacoesScreen';

jest.mock('@/features/admin/solicitacoes/hooks/useSolicitacoes');
jest.mock('@/features/admin/solicitacoes/hooks/useSolicitacaoModal');

const mockUseSolicitacoes = useSolicitacoes as jest.MockedFunction<typeof useSolicitacoes>;
const mockUseSolicitacaoModal = useSolicitacaoModal as jest.MockedFunction<typeof useSolicitacaoModal>;

const defaultSolicitacoesHook = {
  solicitacoes: [],
  pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  isLoading: false,
  error: null,
  setFilters: jest.fn(),
  setPage: jest.fn(),
};

const defaultModalHook = {
  isOpen: false,
  detail: null,
  isLoadingDetail: false,
  detailError: null,
  updateError: null,
  openModal: jest.fn(),
  closeModal: jest.fn(),
  updateStatus: jest.fn(),
};

describe('SolicitacoesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSolicitacoes.mockReturnValue(defaultSolicitacoesHook);
    mockUseSolicitacaoModal.mockReturnValue(defaultModalHook);
  });

  it('should render page title', () => {
    render(<SolicitacoesScreen />);
    expect(screen.getByTestId('page-title')).toBeInTheDocument();
  });

  it('should render search input and filters', () => {
    render(<SolicitacoesScreen />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('filter-species')).toBeInTheDocument();
    expect(screen.getByTestId('filter-sex')).toBeInTheDocument();
    expect(screen.getByTestId('filter-size')).toBeInTheDocument();
  });

  it('should render empty state when no solicitacoes', () => {
    render(<SolicitacoesScreen />);
    expect(screen.getByTestId('table-empty-state')).toBeInTheDocument();
  });

  it('should show loading spinner when isLoading=true', () => {
    mockUseSolicitacoes.mockReturnValue({ ...defaultSolicitacoesHook, isLoading: true });
    render(<SolicitacoesScreen />);
    expect(screen.getByTestId('list-loading')).toBeInTheDocument();
  });

  it('should show error message when error is set', () => {
    mockUseSolicitacoes.mockReturnValue({ ...defaultSolicitacoesHook, error: 'ADMIN_SOLICITACOES:errorLoading' });
    render(<SolicitacoesScreen />);
    expect(screen.getByTestId('list-error')).toBeInTheDocument();
  });

  it('should call openModal when "Ver solicitação" is clicked from the table', async () => {
    const user = userEvent.setup();
    mockUseSolicitacoes.mockReturnValue({
      ...defaultSolicitacoesHook,
      solicitacoes: [{
        id: 'uuid-1',
        created_at: '2026-06-08T10:00:00Z',
        adopter_name: 'Maria',
        pet_name: 'Bolinha',
        pet_species: 'cachorro',
        pet_sex: 'macho',
        pet_size: 'medio',
        pet_age_months: 24,
        pet_city: 'São Paulo',
        status: 'formulario',
      }],
    });

    render(<SolicitacoesScreen />);

    await user.click(screen.getByTestId('view-request-uuid-1'));

    expect(defaultModalHook.openModal).toHaveBeenCalledWith('uuid-1');
  });

  it('should call setFilters when search input changes', async () => {
    const user = userEvent.setup({ delay: null });
    render(<SolicitacoesScreen />);

    await user.type(screen.getByTestId('search-input'), 'Bolinha');

    await waitFor(() => {
      expect(defaultSolicitacoesHook.setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'Bolinha' }),
      );
    });
  });
});
