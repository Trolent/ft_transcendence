import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { tError } from "@/features/i18n";
import { Avatar, Heading, List, Text, Pagination, PageLayout } from "@/components";
import { getLeaderboard, type LeaderboardEntry } from "@/api/leaderboard.api";

type LeaderboardListItem = LeaderboardEntry & { id: string; [key: string]: unknown };

const LIMIT = 20;

export default function Leaderboard() {
  const { t } = useTranslation('pages');
  const [players, setPlayers] = useState<LeaderboardListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getLeaderboard(currentPage, LIMIT)
      .then((response) => {
        setPlayers(response.data.map((entry) => ({
          ...entry,
          id: entry.username,
        })));
        setTotalPages(response.totalPages);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? tError(err.message, t) : t('leaderboard.error'));
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageLayout maxWidth="max-w-lg">
      <Heading level={3} className="mt-10 sm:mt-0 sm:text-2xl sm:tracking-[0.2em]">{t('leaderboard.title')}</Heading>
      {loading && (
        <Text className="mt-6" variant="muted">
          {t('leaderboard.loading')}
        </Text>
      )}
      {error && !loading && (
        <Text className="mt-6" variant="error">
          {error}
        </Text>
      )}
      {!loading && !error && players.length === 0 && (
        <Text className="mt-6" variant="muted">
          {t('leaderboard.empty')}
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
                <Heading level={4}>#{item.rank}</Heading>
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
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
        </div>
      )}
    </PageLayout>
  );
}
