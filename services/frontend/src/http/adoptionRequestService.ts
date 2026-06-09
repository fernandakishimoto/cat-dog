import apiClient from '@/http/apiClient';
import type {
  AdoptionRequestDetailType,
  AdoptionRequestListResponseType,
  AdoptionProcessStepType,
  ListSolicitacoesFiltersType,
} from '@/types/adoption-request';

class AdoptionRequestService {

  async list(filters: ListSolicitacoesFiltersType = {}): Promise<AdoptionRequestListResponseType> {
    const response = await apiClient.get<AdoptionRequestListResponseType>('/adoption-requests', {
      params: filters,
    });
    return response.data;
  }

  async getById(id: string): Promise<AdoptionRequestDetailType> {
    const response = await apiClient.get<AdoptionRequestDetailType>(`/adoption-requests/${id}`);
    return response.data;
  }

  async updateStatus(id: string, status: AdoptionProcessStepType, observations?: string): Promise<AdoptionRequestDetailType> {
    const response = await apiClient.patch<AdoptionRequestDetailType>(
      `/adoption-requests/${id}/status`,
      { status, observations },
    );
    return response.data;
  }

}

export const adoptionRequestService = new AdoptionRequestService();
