import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@/lib/i18n';
import type { AdoptionRequestDetailType } from '@/types/adoption-request';

import SolicitacaoModal from './SolicitacaoModal';

const mockDetail: AdoptionRequestDetailType = {
  id: 'uuid-1',
  created_at: '2026-06-08T10:00:00Z',
  updated_at: '2026-06-08T10:00:00Z',
  adopter_name: 'Maria Silva',
  adopter_email: 'maria@email.com',
  status: 'entrevista',
  observations: 'Lar com quintal',
  pet_id: 'pet-1',
  pet: {
    name: 'Bolinha',
    species: 'cachorro',
    sex: 'macho',
    size: 'medio',
    age_months: 24,
    city: 'São Paulo',
    photo_url: null,
  },
};

const defaultProps = {
  isOpen: true,
  detail: mockDetail,
  isLoadingDetail: false,
  detailError: null,
  updateError: null,
  onClose: jest.fn(),
  onUpdateStatus: jest.fn(),
};

describe('SolicitacaoModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen=false', () => {
    render(<SolicitacaoModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('solicitacao-modal')).not.toBeInTheDocument();
  });

  it('should render modal overlay when isOpen=true', () => {
    render(<SolicitacaoModal {...defaultProps} />);
    expect(screen.getByTestId('solicitacao-modal')).toBeInTheDocument();
  });

  it('should display adopter name, pet name and city', () => {
    render(<SolicitacaoModal {...defaultProps} />);
    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByText('Bolinha')).toBeInTheDocument();
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
  });

  it('should show loading spinner when isLoadingDetail=true', () => {
    render(<SolicitacaoModal {...defaultProps} detail={null} isLoadingDetail={true} />);
    expect(screen.getByTestId('modal-loading')).toBeInTheDocument();
  });

  it('should show error message when detailError is set', () => {
    render(<SolicitacaoModal {...defaultProps} detail={null} detailError="ADMIN_SOLICITACOES:modalErrorLoading" />);
    expect(screen.getByTestId('modal-detail-error')).toBeInTheDocument();
  });

  it('should show Avançar and Retroceder buttons for intermediate stages', () => {
    render(<SolicitacaoModal {...defaultProps} />);
    expect(screen.getByTestId('modal-action-advance')).toBeInTheDocument();
    expect(screen.getByTestId('modal-action-back')).toBeInTheDocument();
  });

  it('should show Aprovar and Rejeitar buttons when status=aprovacao_final', () => {
    render(<SolicitacaoModal {...defaultProps} detail={{ ...mockDetail, status: 'aprovacao_final' }} />);
    expect(screen.getByTestId('modal-action-approve')).toBeInTheDocument();
    expect(screen.getByTestId('modal-action-reject')).toBeInTheDocument();
  });

  it('should show finalized message and no action buttons when status=aprovado', () => {
    render(<SolicitacaoModal {...defaultProps} detail={{ ...mockDetail, status: 'aprovado' }} />);
    expect(screen.getByTestId('modal-finalized')).toBeInTheDocument();
    expect(screen.queryByTestId('modal-action-advance')).not.toBeInTheDocument();
    expect(screen.queryByTestId('modal-action-approve')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<SolicitacaoModal {...defaultProps} />);

    await user.click(screen.getByTestId('modal-close-button'));

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onUpdateStatus with next step when Avançar is clicked', async () => {
    const user = userEvent.setup();
    render(<SolicitacaoModal {...defaultProps} />);

    await user.click(screen.getByTestId('modal-action-advance'));

    expect(defaultProps.onUpdateStatus).toHaveBeenCalledWith('visita');
  });
});
