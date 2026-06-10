import { adoptionRequestService } from './adoptionRequestService';
import apiClient from './apiClient';
import type { AdoptionRequestListResponseType, AdoptionRequestDetailType } from '@/types/adoption-request';

jest.mock('./apiClient', () => ({
  get: jest.fn(),
  patch: jest.fn(),
}));

const mockGet = apiClient.get as jest.Mock;
const mockPatch = apiClient.patch as jest.Mock;

const mockSummary = {
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
    photo_url: null,
  },
} as const;

const mockDetail = {
  ...mockSummary,
  observations: null,
  updated_at: '2026-06-08T10:00:00Z',
} as const;

describe('adoptionRequestService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list()', () => {
    it('should return paginated adoption requests', async () => {
      const mockResponse: AdoptionRequestListResponseType = {
        data: [mockSummary],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      };
      mockGet.mockResolvedValueOnce({ data: mockResponse });

      const result = await adoptionRequestService.list({ page: 1 });

      expect(mockGet).toHaveBeenCalledWith('/adoption-requests', { params: { page: 1 } });
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should pass filters as query params', async () => {
      mockGet.mockResolvedValueOnce({ data: { data: [], total: 0, page: 1, limit: 20, totalPages: 0 } });

      await adoptionRequestService.list({ species: 'gato', city: 'Curitiba' });

      expect(mockGet).toHaveBeenCalledWith('/adoption-requests', {
        params: { species: 'gato', city: 'Curitiba' },
      });
    });
  });

  describe('getById()', () => {
    it('should return adoption request detail', async () => {
      mockGet.mockResolvedValueOnce({ data: mockDetail });

      const result = await adoptionRequestService.getById('uuid-1');

      expect(mockGet).toHaveBeenCalledWith('/adoption-requests/uuid-1');
      expect(result.id).toBe('uuid-1');
      expect(result.adopter_email).toBe('maria@email.com');
    });
  });

  describe('updateStatus()', () => {
    it('should patch status and return updated detail', async () => {
      const updated: AdoptionRequestDetailType = { ...mockDetail, status: 'documentacao' };
      mockPatch.mockResolvedValueOnce({ data: updated });

      const result = await adoptionRequestService.updateStatus('uuid-1', 'documentacao');

      expect(mockPatch).toHaveBeenCalledWith('/adoption-requests/uuid-1/status', {
        status: 'documentacao',
        observations: undefined,
      });
      expect(result.status).toBe('documentacao');
    });

    it('should include observations when provided', async () => {
      const updated: AdoptionRequestDetailType = {
        ...mockDetail,
        status: 'entrevista',
        observations: 'Cliente aprovado na entrevista',
      };
      mockPatch.mockResolvedValueOnce({ data: updated });

      const result = await adoptionRequestService.updateStatus(
        'uuid-1',
        'entrevista',
        'Cliente aprovado na entrevista',
      );

      expect(mockPatch).toHaveBeenCalledWith('/adoption-requests/uuid-1/status', {
        status: 'entrevista',
        observations: 'Cliente aprovado na entrevista',
      });
      expect(result.observations).toBe('Cliente aprovado na entrevista');
    });
  });
});
