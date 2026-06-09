'use client';

import { useCallback, useEffect, useState } from 'react';

import { adoptionRequestService } from '@/http/adoptionRequestService';
import type { AdoptionRequestSummaryType, ListSolicitacoesFiltersType } from '@/types/adoption-request';

type PaginationMetaType = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type UseSolicitacoesReturnType = {
  solicitacoes: AdoptionRequestSummaryType[];
  pagination: PaginationMetaType;
  isLoading: boolean;
  error: string | null;
  setFilters: (filters: ListSolicitacoesFiltersType) => void;
  setPage: (page: number) => void;
};

const DEFAULT_PAGINATION: PaginationMetaType = { total: 0, page: 1, limit: 20, totalPages: 0 };

export function useSolicitacoes(): UseSolicitacoesReturnType {
  const [solicitacoes, setSolicitacoes] = useState<AdoptionRequestSummaryType[]>([]);
  const [pagination, setPagination] = useState<PaginationMetaType>(DEFAULT_PAGINATION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ListSolicitacoesFiltersType>({ page: 1, limit: 20 });

  const fetchData = useCallback(async (currentFilters: ListSolicitacoesFiltersType) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adoptionRequestService.list(currentFilters);
      setSolicitacoes(response.data);
      setPagination({ total: response.total, page: response.page, limit: response.limit, totalPages: response.totalPages });
    } catch {
      setError('ADMIN_SOLICITACOES:errorLoading');
      setSolicitacoes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(filters);
  }, [filters, fetchData]);

  const setFilters = useCallback((newFilters: ListSolicitacoesFiltersType) => {
    setFiltersState(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFiltersState(prev => ({ ...prev, page }));
  }, []);

  return { solicitacoes, pagination, isLoading, error, setFilters, setPage };
}
