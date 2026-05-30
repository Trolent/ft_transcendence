import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { tError } from "@/features/i18n";
import { Avatar, Heading, Input, List, Text, Pagination, PageLayout } from "@/components";
import { getLeaderboard, type LeaderboardEntry } from "@/api/leaderboard.api";

type LeaderboardListItem = LeaderboardEntry & { id: string; [key: string]: unknown };

const LIMIT = 20;
const DEBOUNCE_MS = 300;

export default function Leaderboard() {
  const { t } = useTranslation(['pages', 'common']);
  const [players, setPlayers] = useState<LeaderboardListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [minLevel, setMinLevel] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tooShort = query.trim().length > 0 && query.trim().length < 3;

  // Debounce query and reset to page 1
  useEffect(() => {
    if (tooShort) {
      setDebouncedQuery('');
      setCurrentPage(1);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
      setCurrentPage(1);
    }, DEBOUNCE_MS);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, tooShort]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getLeaderboard(currentPage, LIMIT, debouncedQuery, sortOrder, minLevel)
      .then((response) => {
        if (cancelled) return;
        setPlayers(response.data.map((entry) => ({ ...entry, id: entry.username })));
        setTotalPages(response.totalPages);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? tError(err.message, t) : t('leaderboard.error'));
        setTotalPages(1);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [currentPage, debouncedQuery, sortOrder, minLevel]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageLayout maxWidth="max-w-lg">
      <Heading level={3} className="mt-10 sm:text-2xl sm:tracking-[0.2em]">{t('leaderboard.title')}</Heading>

      <Input
        className="mt-6"
        placeholder={t('leaderboard.search_placeholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="flex gap-2 mt-2 items-end">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-dim">{t('leaderboard.sort_label')}</span>
          <select
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value as 'asc' | 'desc'); setCurrentPage(1); }}
          >
            <option value="desc">{t('leaderboard.sort_desc')}</option>
            <option value="asc">{t('leaderboard.sort_asc')}</option>
          </select>
        </div>
        <Input
          label={t('leaderboard.min_level')}
          type="number"
          min={1}
          value={minLevel}
          onChange={(e) => { setMinLevel(Math.max(1, parseInt(e.target.value) || 1)); setCurrentPage(1); }}
        />
      </div>

      {tooShort && (
        <Text className="mt-6" variant="muted">{t('common:search.min_chars')}</Text>
      )}
      {!tooShort && loading && (
        <Text className="mt-6" variant="muted">{t('leaderboard.loading')}</Text>
      )}
      {!tooShort && error && !loading && (
        <Text className="mt-6" variant="error">{error}</Text>
      )}
      {!tooShort && !loading && !error && players.length === 0 && (
        <Text className="mt-6" variant="muted">
          {debouncedQuery.trim() ? t('leaderboard.search_empty') : t('leaderboard.empty')}
        </Text>
      )}
      {!loading && !error && players.length > 0 && (
        <div className="flex flex-col gap-6">
          <List
            className="mt-6"
            items={players}
            renderItem={(item: LeaderboardListItem) => (
              <Link
                to={`/profile/${item.username}`}
                className="flex items-center gap-4 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-default"
              >
                {!debouncedQuery.trim() 
                  ? <Heading level={4}>#{item.rank}</Heading>
                  : <Heading level={4}>-</Heading>
                }
                <Avatar username={item.username} src={item.avatarUrl ?? undefined} size="sm" />
                <div className="min-w-0 flex-1">
                  <Text className="truncate">{item.username}</Text>
                  <Text size="xs" variant="muted">
                    {t('leaderboard.wpm', { wpm: item.avgWpm })} — {t('leaderboard.level', { level: item.level })} — {t('leaderboard.games', { count: item.gamesPlayed })}
                  </Text>
                </div>
              </Link>
            )}
          />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </PageLayout>
  );
}
