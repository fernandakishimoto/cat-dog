'use client';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import type { AdoptionRequestDetailType, AdoptionProcessStepType } from '@/types/adoption-request';
import { ADOPTION_PROCESS_STEPS, FINAL_STEPS } from '@/types/adoption-request';

import styles from './SolicitacaoModal.module.css';

type SolicitacaoModalPropsType = {
  isOpen: boolean;
  detail: AdoptionRequestDetailType | null;
  isLoadingDetail: boolean;
  detailError: string | null;
  updateError: string | null;
  onClose: () => void;
  onUpdateStatus: (status: AdoptionProcessStepType, observations?: string) => void;
};

export default function SolicitacaoModal({
  isOpen,
  detail,
  isLoadingDetail,
  detailError,
  updateError,
  onClose,
  onUpdateStatus,
}: SolicitacaoModalPropsType) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} data-testid="solicitacao-modal">
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <ModalHeader onClose={onClose} />
        <div className={styles.body}>
          {isLoadingDetail ? <ModalLoading /> : null}
          {!isLoadingDetail && detailError ? <ModalError errorKey={detailError} /> : null}
          {!isLoadingDetail && !detailError && detail ? (
            <ModalContent detail={detail} updateError={updateError} onUpdateStatus={onUpdateStatus} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ModalHeader({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('ADMIN_SOLICITACOES');

  return (
    <div className={styles.header}>
      <h2 id="modal-title" className={styles.title}>{t('modalTitle')}</h2>
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label={t('modalClose')}
        data-testid="modal-close-button"
      >
        ✕
      </button>
    </div>
  );
}

function ModalLoading() {
  return <div className={styles.loading} data-testid="modal-loading" aria-busy="true" />;
}

function ModalError({ errorKey }: { errorKey: string }) {
  const { t } = useTranslation('ADMIN_SOLICITACOES');
  const key = errorKey.includes(':') ? errorKey.split(':')[1] : errorKey;
  return (
    <div className={styles.errorMessage} data-testid="modal-detail-error">
      {t(key)}
    </div>
  );
}

type ModalContentPropsType = {
  detail: AdoptionRequestDetailType;
  updateError: string | null;
  onUpdateStatus: (status: AdoptionProcessStepType, observations?: string) => void;
};

function ModalContent({ detail, updateError, onUpdateStatus }: ModalContentPropsType) {
  const { t } = useTranslation('ADMIN_SOLICITACOES');
  const isFinalized = FINAL_STEPS.includes(detail.status);

  return (
    <>
      <dl className={styles.fields}>
        <ModalField label={t('modalDateLabel')} value={new Date(detail.created_at).toLocaleDateString('pt-BR')} />
        <ModalField label={t('modalAdopterLabel')} value={detail.adopter_name} subValue={detail.adopter_email} />
        <ModalField label={t('modalAnimalLabel')} value={detail.pet?.name ?? t('petUnavailable')} />
        <ModalField label={t('modalCityLabel')} value={detail.pet?.city ?? '-'} />
        <ModalField
          label={t('modalObservationsLabel')}
          value={detail.observations ?? t('modalObservationsEmpty')}
        />
      </dl>

      <ProcessStepper status={detail.status} />

      {updateError ? (
        <div className={styles.errorMessage} data-testid="modal-update-error">
          {t(updateError.includes(':') ? updateError.split(':')[1] : updateError)}
        </div>
      ) : null}

      {isFinalized ? (
        <div className={styles.finalizedMessage} data-testid="modal-finalized">
          {t('modalFinalized')}
        </div>
      ) : (
        <ModalActions detail={detail} onUpdateStatus={onUpdateStatus} />
      )}
    </>
  );
}

function ModalField({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div className={styles.field}>
      <dt className={styles.fieldLabel}>{label}</dt>
      <dd className={styles.fieldValue}>
        {value}
        {subValue ? <span className={styles.fieldSubValue}> ({subValue})</span> : null}
      </dd>
    </div>
  );
}

function ProcessStepper({ status }: { status: AdoptionProcessStepType }) {
  const { t } = useTranslation('ADMIN_SOLICITACOES');

  const stepLabelKey: Record<AdoptionProcessStepType, string> = {
    formulario: 'stepFormulario',
    documentacao: 'stepDocumentacao',
    entrevista: 'stepEntrevista',
    visita: 'stepVisita',
    aprovacao_final: 'stepAprovacaoFinal',
    aprovado: 'stepAprovado',
    rejeitado: 'stepRejeitado',
  };

  const currentIndex = ADOPTION_PROCESS_STEPS.indexOf(status as typeof ADOPTION_PROCESS_STEPS[number]);

  return (
    <div className={styles.stepper} aria-label={t('modalProcessTitle')}>
      {ADOPTION_PROCESS_STEPS.map((step, index) => (
        <div
          key={step}
          className={[
            styles.step,
            step === status ? styles.stepActive : '',
            index < currentIndex ? styles.stepDone : '',
          ].filter(Boolean).join(' ')}
          data-testid={`stepper-step-${step}`}
        >
          <span className={styles.stepLabel}>{t(stepLabelKey[step])}</span>
        </div>
      ))}
    </div>
  );
}

type ModalActionsPropsType = {
  detail: AdoptionRequestDetailType;
  onUpdateStatus: (status: AdoptionProcessStepType, observations?: string) => void;
};

function ModalActions({ detail, onUpdateStatus }: ModalActionsPropsType) {
  const { t } = useTranslation('ADMIN_SOLICITACOES');
  const currentIndex = ADOPTION_PROCESS_STEPS.indexOf(detail.status as typeof ADOPTION_PROCESS_STEPS[number]);
  const isLastStep = currentIndex === ADOPTION_PROCESS_STEPS.length - 1;
  const hasPrev = currentIndex > 0;
  const hasNext = !isLastStep && currentIndex >= 0;

  const handleAdvance = useCallback(() => {
    if (isLastStep || currentIndex < 0) return;
    onUpdateStatus(ADOPTION_PROCESS_STEPS[currentIndex + 1]);
  }, [currentIndex, isLastStep, onUpdateStatus]);

  const handleBack = useCallback(() => {
    if (!hasPrev) return;
    onUpdateStatus(ADOPTION_PROCESS_STEPS[currentIndex - 1]);
  }, [currentIndex, hasPrev, onUpdateStatus]);

  const handleApprove = useCallback(() => {
    onUpdateStatus('aprovado');
  }, [onUpdateStatus]);

  const handleReject = useCallback(() => {
    onUpdateStatus('rejeitado');
  }, [onUpdateStatus]);

  if (isLastStep) {
    return (
      <div className={styles.actions}>
        {hasPrev ? (
          <button type="button" className={styles.secondaryButton} onClick={handleBack} data-testid="modal-action-back">
            {t('modalActionBack')}
          </button>
        ) : null}
        <button type="button" className={styles.rejectButton} onClick={handleReject} data-testid="modal-action-reject">
          {t('modalActionReject')}
        </button>
        <button type="button" className={styles.approveButton} onClick={handleApprove} data-testid="modal-action-approve">
          {t('modalActionApprove')}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.actions}>
      {hasPrev ? (
        <button type="button" className={styles.secondaryButton} onClick={handleBack} data-testid="modal-action-back">
          {t('modalActionBack')}
        </button>
      ) : null}
      {hasNext ? (
        <button type="button" className={styles.primaryButton} onClick={handleAdvance} data-testid="modal-action-advance">
          {t('modalActionAdvance')}
        </button>
      ) : null}
    </div>
  );
}
