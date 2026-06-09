'use client';

import { useCallback, useState } from 'react';

import { adoptionRequestService } from '@/http/adoptionRequestService';
import type { AdoptionRequestDetailType, AdoptionProcessStepType } from '@/types/adoption-request';

type UseSolicitacaoModalReturnType = {
  isOpen: boolean;
  detail: AdoptionRequestDetailType | null;
  isLoadingDetail: boolean;
  detailError: string | null;
  updateError: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
  updateStatus: (status: AdoptionProcessStepType, observations?: string) => Promise<void>;
};

export function useSolicitacaoModal(): UseSolicitacaoModalReturnType {
  const [isOpen, setIsOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdoptionRequestDetailType | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const openModal = useCallback((id: string) => {
    setIsOpen(true);
    setCurrentId(id);
    setDetail(null);
    setDetailError(null);
    setUpdateError(null);
    setIsLoadingDetail(true);

    adoptionRequestService.getById(id)
      .then(data => {
        setDetail(data);
      })
      .catch(() => {
        setDetailError('ADMIN_SOLICITACOES:modalErrorLoading');
      })
      .finally(() => {
        setIsLoadingDetail(false);
      });
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setCurrentId(null);
    setDetail(null);
    setDetailError(null);
    setUpdateError(null);
  }, []);

  const updateStatus = useCallback(async (status: AdoptionProcessStepType, observations?: string) => {
    if (!currentId) return;

    setUpdateError(null);
    try {
      const updated = await adoptionRequestService.updateStatus(currentId, status, observations);
      setDetail(updated);
    } catch {
      setUpdateError('ADMIN_SOLICITACOES:modalErrorUpdate');
    }
  }, [currentId]);

  return { isOpen, detail, isLoadingDetail, detailError, updateError, openModal, closeModal, updateStatus };
}
