'use client';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { PetSpeciesType, PetSexType, PetSizeType } from '@/types/adoption-request';
import { useSolicitacoes } from '@/features/admin/solicitacoes/hooks/useSolicitacoes';
import { useSolicitacaoModal } from '@/features/admin/solicitacoes/hooks/useSolicitacaoModal';
import SolicitacoesTable from '@/features/admin/solicitacoes/components/SolicitacoesTable/SolicitacoesTable';
import SolicitacaoModal from '@/features/admin/solicitacoes/components/SolicitacaoModal/SolicitacaoModal';

import styles from './SolicitacoesScreen.module.css';

export default function SolicitacoesScreen() {
  const { t } = useTranslation('ADMIN_SOLICITACOES');
  const { solicitacoes, pagination, isLoading, error, setFilters, setPage } = useSolicitacoes();
  const { isOpen, detail, isLoadingDetail, detailError, updateError, openModal, closeModal, updateStatus } = useSolicitacaoModal();

  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setFilters({ search: value });
  }, [setFilters]);

  const handleSpeciesChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PetSpeciesType | '';
    setFilters({ species: value || undefined });
  }, [setFilters]);

  const handleSexChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PetSexType | '';
    setFilters({ sex: value || undefined });
  }, [setFilters]);

  const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PetSizeType | '';
    setFilters({ size: value || undefined });
  }, [setFilters]);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle} data-testid="page-title">
        {t('pageTitle')}
      </h1>

      <div className={styles.filters}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={t('searchPlaceholder')}
          value={searchValue}
          onChange={handleSearchChange}
          data-testid="search-input"
          aria-label={t('searchPlaceholder')}
        />

        <select className={styles.filterSelect} onChange={handleSpeciesChange} data-testid="filter-species" aria-label={t('filterSpeciesLabel')}>
          <option value="">{t('filterSpeciesAll')}</option>
          <option value="gato">{t('filterSpeciesCat')}</option>
          <option value="cachorro">{t('filterSpeciesDog')}</option>
        </select>

        <select className={styles.filterSelect} onChange={handleSexChange} data-testid="filter-sex" aria-label={t('filterSexLabel')}>
          <option value="">{t('filterSexAll')}</option>
          <option value="macho">{t('filterSexMale')}</option>
          <option value="femea">{t('filterSexFemale')}</option>
        </select>

        <select className={styles.filterSelect} onChange={handleSizeChange} data-testid="filter-size" aria-label={t('filterSizeLabel')}>
          <option value="">{t('filterSizeAll')}</option>
          <option value="pequeno">{t('filterSizeSmall')}</option>
          <option value="medio">{t('filterSizeMedium')}</option>
          <option value="grande">{t('filterSizeLarge')}</option>
        </select>
      </div>

      {isLoading ? (
        <div className={styles.loading} data-testid="list-loading" aria-busy="true" />
      ) : null}

      {!isLoading && error ? (
        <div className={styles.errorMessage} data-testid="list-error">
          {t(error.includes(':') ? error.split(':')[1] : error)}
        </div>
      ) : null}

      {!isLoading && !error ? (
        <>
          <SolicitacoesTable solicitacoes={solicitacoes} onViewRequest={openModal} />
          {pagination.totalPages > 1 ? (
            <Pagination pagination={pagination} onPageChange={setPage} />
          ) : null}
        </>
      ) : null}

      <SolicitacaoModal
        isOpen={isOpen}
        detail={detail}
        isLoadingDetail={isLoadingDetail}
        detailError={detailError}
        updateError={updateError}
        onClose={closeModal}
        onUpdateStatus={updateStatus}
      />
    </div>
  );
}

type PaginationPropsType = {
  pagination: { page: number; totalPages: number };
  onPageChange: (page: number) => void;
};

function Pagination({ pagination, onPageChange }: PaginationPropsType) {
  const { t } = useTranslation('ADMIN_SOLICITACOES');

  const handlePrev = useCallback(() => {
    onPageChange(pagination.page - 1);
  }, [pagination.page, onPageChange]);

  const handleNext = useCallback(() => {
    onPageChange(pagination.page + 1);
  }, [pagination.page, onPageChange]);

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={styles.paginationButton}
        disabled={pagination.page <= 1}
        onClick={handlePrev}
        data-testid="pagination-prev"
      >
        {t('paginationPrev')}
      </button>
      <span className={styles.paginationInfo} data-testid="pagination-info">
        {t('paginationInfo')
          .replace('{{page}}', String(pagination.page))
          .replace('{{totalPages}}', String(pagination.totalPages))}
      </span>
      <button
        type="button"
        className={styles.paginationButton}
        disabled={pagination.page >= pagination.totalPages}
        onClick={handleNext}
        data-testid="pagination-next"
      >
        {t('paginationNext')}
      </button>
    </div>
  );
}
