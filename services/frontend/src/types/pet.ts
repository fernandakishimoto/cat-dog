import type { PetSexType, PetSizeType, PetSpeciesType } from '@/types/adoption-request';

export type PetType = {
  id: string;
  name: string;
  species: PetSpeciesType;
  sex: PetSexType;
  size: PetSizeType;
  age_months: number;
  city: string;
  photo_url: string | null;
  created_at: string;
};

export type PetSummaryType = {
  name: string;
  species: PetSpeciesType;
  sex: PetSexType;
  size: PetSizeType;
  age_months: number;
  city: string;
  photo_url: string | null;
};

export type PetListResponseType = {
  data: PetType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
