import { type ReactNode } from "react";
import { useTranslation } from 'react-i18next';
import Input from './Input';
import { List } from './List';
import { Pagination } from './Pagination';
import { usePaginatedSearch } from '@/hooks/usePaginatedSearch';

interface ListItem {
  id: string | number;
  [key: string]: unknown;
}

interface SearchListProps<T extends ListItem> {
  fetchFn: (query: string, page: number) => Promise<{ data: T[]; totalPages: number }>;
  renderItem: (item: T) => ReactNode;
  placeholder?: string;
  emptyMessage?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchList<T extends ListItem>({
  fetchFn,
  renderItem,
  placeholder,
  emptyMessage,
  debounceMs = 300,
  className = '',
}: SearchListProps<T>) {
  const { t } = useTranslation('common');
  const { query, setQuery, page, setPage, items, totalPages, loading, error, tooShort } =
    usePaginatedSearch(fetchFn, debounceMs);

  return (
    <div className={['flex flex-col gap-4', className].join(' ')}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder ?? t('search.placeholder')}
        disabled={loading}
        error={error ?? undefined}
      />

      {tooShort && (
        <p className="text-dim text-sm text-center font-mono">{t('search.min_chars')}</p>
      )}

      {loading && (
        <p className="text-dim text-sm text-center font-mono">{t('loading')}</p>
      )}

      {!loading && !tooShort && query.trim() && items.length === 0 && (
        <p className="text-dim text-sm text-center font-mono">
          {emptyMessage ?? t('search.empty')}
        </p>
      )}

      {items.length > 0 && (
        <>
          <List
            items={items}
            renderItem={(item) => renderItem(item)}
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
