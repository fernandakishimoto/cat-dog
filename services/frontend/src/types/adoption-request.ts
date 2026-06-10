import type { PetSummaryType } from '@/types/pet';

export type { PetSummaryType };

export type AdoptionProcessStepType =
  | 'formulario'
  | 'documentacao'
  | 'entrevista'
  | 'visita'
  | 'aprovacao_final'
  | 'aprovado'
  | 'rejeitado';

export const ADOPTION_PROCESS_STEPS: AdoptionProcessStepType[] = [
  'formulario',
  'documentacao',
  'entrevista',
  'visita',
  'aprovacao_final',
];

export const FINAL_STEPS: AdoptionProcessStepType[] = ['aprovado', 'rejeitado'];

export type PetSpeciesType = 'gato' | 'cachorro';
export type PetSexType = 'macho' | 'femea';
export type PetSizeType = 'pequeno' | 'medio' | 'grande';

export type AdoptionRequestSummaryType = {
  id: string;
  created_at: string;
  adopter_name: string;
  adopter_email: string;
  status: AdoptionProcessStepType;
  pet_id: string;
  pet: PetSummaryType | null;
};

export type AdoptionRequestDetailType = AdoptionRequestSummaryType & {
  observations: string | null;
  updated_at: string;
};

export type AdoptionRequestListResponseType = {
  data: AdoptionRequestSummaryType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ListSolicitacoesFiltersType = {
  search?: string;
  species?: PetSpeciesType;
  sex?: PetSexType;
  size?: PetSizeType;
  city?: string;
  page?: number;
  limit?: number;
};
