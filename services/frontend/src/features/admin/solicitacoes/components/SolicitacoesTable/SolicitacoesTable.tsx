'use client';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import type { AdoptionRequestSummaryType } from '@/types/adoption-request';

import styles from './SolicitacoesTable.module.css';

type SolicitacoesTablePropsType = {
  solicitacoes: AdoptionRequestSummaryType[];
  onViewRequest: (id: string) => void;
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
            <th data-testid="table-header-city">{t('tableHeaderCity')}</th>
            <th data-testid="table-header-age">{t('tableHeaderAge')}</th>
            <th data-testid="table-header-sex">{t('tableHeaderSex')}</th>
            <th data-testid="table-header-size">{t('tableHeaderSize')}</th>
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

function SolicitacaoRow({ item, onViewRequest, formatDate, t }: SolicitacaoRowPropsType) {
  const handleView = useCallback(() => {
    onViewRequest(item.id);
  }, [item.id, onViewRequest]);

  return (
    <tr data-testid={`table-row-${item.id}`}>
      <td>{formatDate(item.created_at)}</td>
      <td>{item.pet_name}</td>
      <td>{item.pet_city}</td>
      <td>{t('ageMonths').replace('{{months}}', String(item.pet_age_months))}</td>
      <td>{item.pet_sex}</td>
      <td>{item.pet_size}</td>
      <td>
        <button
          type="button"
          className={styles.viewButton}
          onClick={handleView}
          data-testid={`view-request-${item.id}`}
          aria-label={t('actionViewRequest')}
        >
          {t('actionViewRequest')}
        </button>
      </td>
    </tr>
  );
}
