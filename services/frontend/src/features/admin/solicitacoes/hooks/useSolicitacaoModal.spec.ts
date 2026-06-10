import { renderHook, act, waitFor } from '@testing-library/react';

import { adoptionRequestService } from '@/http/adoptionRequestService';
import { useSolicitacaoModal } from './useSolicitacaoModal';

jest.mock('@/http/adoptionRequestService', () => ({
  adoptionRequestService: {
    getById: jest.fn(),
    updateStatus: jest.fn(),
  },
}));

const mockGetById = adoptionRequestService.getById as jest.Mock;
const mockUpdateStatus = adoptionRequestService.updateStatus as jest.Mock;

const mockDetail = {
  id: 'uuid-1',
  created_at: '2026-06-08T10:00:00Z',
  updated_at: '2026-06-08T10:00:00Z',
  adopter_name: 'Maria Silva',
  adopter_email: 'maria@email.com',
  status: 'entrevista' as const,
  observations: null,
  pet_id: 'pet-1',
  pet: {
    name: 'Bolinha',
    species: 'cachorro' as const,
    sex: 'macho' as const,
    size: 'medio' as const,
    age_months: 24,
    city: 'São Paulo',
    photo_url: null,
  },
};

describe('useSolicitacaoModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start with isOpen=false and detail=null', () => {
    const { result } = renderHook(() => useSolicitacaoModal());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.detail).toBeNull();
  });

  it('should open modal and fetch detail on openModal()', async () => {
    mockGetById.mockResolvedValueOnce(mockDetail);

    const { result } = renderHook(() => useSolicitacaoModal());

    act(() => {
      result.current.openModal('uuid-1');
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.isLoadingDetail).toBe(true);

    await waitFor(() => expect(result.current.isLoadingDetail).toBe(false));

    expect(result.current.detail).toEqual(mockDetail);
    expect(result.current.detailError).toBeNull();
  });

  it('should set detailError when fetch fails', async () => {
    mockGetById.mockRejectedValueOnce(new Error('Not found'));

    const { result } = renderHook(() => useSolicitacaoModal());

    act(() => {
      result.current.openModal('uuid-bad');
    });

    await waitFor(() => expect(result.current.isLoadingDetail).toBe(false));

    expect(result.current.detailError).toBe('ADMIN_SOLICITACOES:modalErrorLoading');
    expect(result.current.detail).toBeNull();
  });

  it('should close modal and clear detail on closeModal()', async () => {
    mockGetById.mockResolvedValueOnce(mockDetail);

    const { result } = renderHook(() => useSolicitacaoModal());

    await act(async () => {
      result.current.openModal('uuid-1');
    });

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.detail).toBeNull();
  });

  it('should call updateStatus and refresh detail', async () => {
    const updatedDetail = { ...mockDetail, status: 'visita' as const };
    mockGetById.mockResolvedValueOnce(mockDetail);
    mockUpdateStatus.mockResolvedValueOnce(updatedDetail);

    const { result } = renderHook(() => useSolicitacaoModal());

    await act(async () => {
      result.current.openModal('uuid-1');
    });
    await waitFor(() => expect(result.current.isLoadingDetail).toBe(false));

    await act(async () => {
      await result.current.updateStatus('visita');
    });

    expect(mockUpdateStatus).toHaveBeenCalledWith('uuid-1', 'visita', undefined);
    expect(result.current.detail?.status).toBe('visita');
  });

  it('should set updateError when updateStatus fails', async () => {
    mockGetById.mockResolvedValueOnce(mockDetail);
    mockUpdateStatus.mockRejectedValueOnce(new Error('Server error'));

    const { result } = renderHook(() => useSolicitacaoModal());

    await act(async () => {
      result.current.openModal('uuid-1');
    });
    await waitFor(() => expect(result.current.isLoadingDetail).toBe(false));

    await act(async () => {
      await result.current.updateStatus('visita');
    });

    expect(result.current.updateError).toBe('ADMIN_SOLICITACOES:modalErrorUpdate');
  });
});
