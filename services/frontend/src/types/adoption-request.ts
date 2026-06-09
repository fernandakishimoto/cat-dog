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
  pet_name: string;
  pet_species: PetSpeciesType;
  pet_sex: PetSexType;
  pet_size: PetSizeType;
  pet_age_months: number;
  pet_city: string;
  status: AdoptionProcessStepType;
};

export type AdoptionRequestDetailType = AdoptionRequestSummaryType & {
  adopter_email: string;
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
