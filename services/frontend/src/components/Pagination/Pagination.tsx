'use client';

import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Pagination.module.css';

type PaginationPropsType = {
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

const buildPageNumbers = (page: number, totalPages: number): Array<number | 'ellipsis'> => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | 'ellipsis'> = [1];

  if (page > 3) {
    pages.push('ellipsis');
  }

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  for (let current = start; current <= end; current += 1) {
    pages.push(current);
  }

  if (page < totalPages - 2) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);

  return pages;
};

export default function Pagination({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationPropsType) {
  const { t } = useTranslation('ADMIN_SOLICITACOES');
  const pageNumbers = useMemo(() => buildPageNumbers(page, totalPages), [page, totalPages]);

  const handlePrev = useCallback(() => {
    onPageChange(page - 1);
  }, [onPageChange, page]);

  const handleNext = useCallback(() => {
    onPageChange(page + 1);
  }, [onPageChange, page]);

  const handleLimitChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    onLimitChange(Number(event.target.value));
  }, [onLimitChange]);

  const handlePageClick = useCallback((nextPage: number) => {
    onPageChange(nextPage);
  }, [onPageChange]);

  if (totalPages <= 1 && limit === PAGE_SIZE_OPTIONS[0]) {
    return null;
  }

  return (
    <div className={styles.pagination} data-testid="pagination">
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navButton}
          disabled={page <= 1}
          onClick={handlePrev}
          aria-label={t('paginationPrev')}
          data-testid="pagination-prev"
        >
          ‹
        </button>

        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
                ...
              </span>
            );
          }

          const isActive = pageNumber === page;

          return (
            <button
              key={pageNumber}
              type="button"
              className={[styles.pageButton, isActive ? styles.pageButtonActive : ''].filter(Boolean).join(' ')}
              onClick={() => handlePageClick(pageNumber)}
              aria-current={isActive ? 'page' : undefined}
              data-testid={`pagination-page-${pageNumber}`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          type="button"
          className={styles.navButton}
          disabled={page >= totalPages}
          onClick={handleNext}
          aria-label={t('paginationNext')}
          data-testid="pagination-next"
        >
          ›
        </button>
      </div>

      <label className={styles.limitSelector}>
        <select
          className={styles.limitSelect}
          value={limit}
          onChange={handleLimitChange}
          aria-label={t('paginationLimitLabel')}
          data-testid="pagination-limit"
        >
          {PAGE_SIZE_OPTIONS.map(option => (
            <option key={option} value={option}>
              {t('paginationLimitOption').replace('{{limit}}', String(option))}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
