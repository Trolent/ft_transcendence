import { type HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { Btn } from "@/components";

interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  ...props
}: PaginationProps) {
  const { t } = useTranslation('common');
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div
      className={["flex items-center justify-center gap-2", className].join(" ")}
      {...props}
    >
      <Btn
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
      > {"\u25C0"} {t('pagination.prev')} </Btn>

      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <Btn
            key={page}
            variant={currentPage === page ? "primary" : "ghost"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={currentPage === page ? "pointer-events-none" : ""}
          >
            {page}
          </Btn>
        ))}
      </div>

      <Btn
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
      > {t('pagination.next')} {"\u25B6"}
      </Btn>
    </div>
  );
}
