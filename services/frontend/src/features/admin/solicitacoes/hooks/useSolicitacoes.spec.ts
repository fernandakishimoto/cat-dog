import { renderHook, act, waitFor } from '@testing-library/react';

import { adoptionRequestService } from '@/http/adoptionRequestService';
import { useSolicitacoes } from './useSolicitacoes';

jest.mock('@/http/adoptionRequestService', () => ({
  adoptionRequestService: {
    list: jest.fn(),
  },
}));

const mockList = adoptionRequestService.list as jest.Mock;

const mockResponse = {
  data: [
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
  ],
  total: 1,
  page: 1,
  limit: 20,
  totalPages: 1,
};

describe('useSolicitacoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start with isLoading=true and empty data', () => {
    mockList.mockReturnValueOnce(new Promise(() => {}));

    const { result } = renderHook(() => useSolicitacoes());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.solicitacoes).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should populate solicitacoes after successful fetch', async () => {
    mockList.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useSolicitacoes());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.solicitacoes).toHaveLength(1);
    expect(result.current.solicitacoes[0].id).toBe('uuid-1');
    expect(result.current.error).toBeNull();
  });

  it('should set error when fetch fails', async () => {
    mockList.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSolicitacoes());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('ADMIN_SOLICITACOES:errorLoading');
    expect(result.current.solicitacoes).toEqual([]);
  });

  it('should refetch when setFilters is called', async () => {
    mockList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useSolicitacoes());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setFilters({ species: 'gato' });
    });

    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(2));
    expect(mockList).toHaveBeenLastCalledWith(expect.objectContaining({ species: 'gato', page: 1 }));
  });

  it('should change page with setPage', async () => {
    mockList.mockResolvedValue({ ...mockResponse, page: 2, totalPages: 3 });

    const { result } = renderHook(() => useSolicitacoes());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setPage(2);
    });

    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(2));
    expect(mockList).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
  });
});
