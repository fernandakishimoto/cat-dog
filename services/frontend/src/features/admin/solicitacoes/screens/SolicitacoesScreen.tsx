'use client';

import { useTranslation } from 'react-i18next';

import Pagination from '@/components/Pagination/Pagination';
import { useSolicitacoes } from '@/features/admin/solicitacoes/hooks/useSolicitacoes';
import { useSolicitacaoModal } from '@/features/admin/solicitacoes/hooks/useSolicitacaoModal';
import SolicitacoesTable from '@/features/admin/solicitacoes/components/SolicitacoesTable/SolicitacoesTable';
import SolicitacaoModal from '@/features/admin/solicitacoes/components/SolicitacaoModal/SolicitacaoModal';

import styles from './SolicitacoesScreen.module.css';

export default function SolicitacoesScreen() {
  const { t } = useTranslation('ADMIN_SOLICITACOES');
  const {
    solicitacoes,
    pagination,
    isLoading,
    error,
    setPage,
    setLimit,
  } = useSolicitacoes();
  const {
    isOpen,
    detail,
    isLoadingDetail,
    detailError,
    updateError,
    openModal,
    closeModal,
    updateStatus,
  } = useSolicitacaoModal();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
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
            <div className={styles.paginationWrapper}>
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                limit={pagination.limit}
                onPageChange={setPage}
                onLimitChange={setLimit}
              />
            </div>
          </>
        ) : null}
      </div>

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
