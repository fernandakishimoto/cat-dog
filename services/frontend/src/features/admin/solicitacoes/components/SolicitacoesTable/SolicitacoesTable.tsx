'use client';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { AdoptionProcessStepType, AdoptionRequestSummaryType } from '@/types/adoption-request';
import { FINAL_STEPS } from '@/types/adoption-request';

import styles from './SolicitacoesTable.module.css';

type SolicitacoesTablePropsType = {
  solicitacoes: AdoptionRequestSummaryType[];
  onViewRequest: (id: string) => void;
};

const getStatusBadgeClass = (status: AdoptionProcessStepType): string => {
  if (status === 'aprovado') {
    return styles.statusApproved;
  }

  if (status === 'rejeitado') {
    return styles.statusRejected;
  }

  return styles.statusPending;
};

const getStatusLabelKey = (status: AdoptionProcessStepType): string => {
  if (status === 'aprovado') {
    return 'statusAprovado';
  }

  if (status === 'rejeitado') {
    return 'statusRejeitado';
  }

  return 'statusPendente';
};

export default function SolicitacoesTable({ solicitacoes, onViewRequest }: SolicitacoesTablePropsType) {
  const { t } = useTranslation('ADMIN_SOLICITACOES');

  const formatDate = useCallback((isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('pt-BR');
  }, []);

  if (solicitacoes.length === 0) {
    return (
      <div className={styles.emptyState} data-testid="table-empty-state">
        {t('emptyState')}
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th data-testid="table-header-date">{t('tableHeaderDate')}</th>
            <th data-testid="table-header-pet">{t('tableHeaderPet')}</th>
            <th data-testid="table-header-requester">{t('tableHeaderRequester')}</th>
            <th data-testid="table-header-status">{t('tableHeaderStatus')}</th>
            <th data-testid="table-header-actions">{t('tableHeaderActions')}</th>
          </tr>
        </thead>
        <tbody>
          {solicitacoes.map(item => (
            <SolicitacaoRow
              key={item.id}
              item={item}
              onViewRequest={onViewRequest}
              formatDate={formatDate}
              t={t}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type SolicitacaoRowPropsType = {
  item: AdoptionRequestSummaryType;
  onViewRequest: (id: string) => void;
  formatDate: (date: string) => string;
  t: (key: string) => string;
};

function PetAvatar({ photoUrl, petName, itemId }: { photoUrl: string | null; petName: string; itemId: string }) {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  if (photoUrl && !hasError) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={photoUrl}
        alt={petName}
        className={styles.petPhoto}
        loading="lazy"
        onError={handleError}
        data-testid={`pet-photo-${itemId}`}
      />
    );
  }

  return (
    <span
      className={styles.petPhotoFallback}
      aria-hidden="true"
      data-testid={`pet-photo-fallback-${itemId}`}
    />
  );
}

function SolicitacaoRow({ item, onViewRequest, formatDate, t }: SolicitacaoRowPropsType) {
  const handleView = useCallback(() => {
    onViewRequest(item.id);
  }, [item.id, onViewRequest]);

  const petName = item.pet?.name ?? t('petUnavailable');
  const petCity = item.pet?.city ?? '-';
  const statusClass = getStatusBadgeClass(item.status);
  const statusLabelKey = getStatusLabelKey(item.status);

  return (
    <tr data-testid={`table-row-${item.id}`}>
      <td>{formatDate(item.created_at)}</td>
      <td>
        <div className={styles.petCell}>
          <PetAvatar
            photoUrl={item.pet?.photo_url ?? null}
            petName={petName}
            itemId={item.id}
          />
          <div className={styles.petInfo}>
            <span className={styles.petName}>{petName}</span>
            <span className={styles.petCity}>{petCity}</span>
          </div>
        </div>
      </td>
      <td>
        <div className={styles.requesterCell}>
          <span className={styles.requesterName}>{item.adopter_name}</span>
          <span className={styles.requesterEmail}>{item.adopter_email}</span>
        </div>
      </td>
      <td>
        <span className={[styles.statusBadge, statusClass].join(' ')} data-testid={`status-badge-${item.id}`}>
          {t(statusLabelKey)}
        </span>
      </td>
      <td>
        <button
          type="button"
          className={styles.viewButton}
          onClick={handleView}
          data-testid={`view-request-${item.id}`}
          aria-label={t('actionViewRequest')}
        >
          <span className={styles.viewIcon} aria-hidden="true" />
          {t('actionViewRequest')}
        </button>
      </td>
    </tr>
  );
}
