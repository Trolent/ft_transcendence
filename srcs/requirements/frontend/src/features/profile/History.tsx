import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Container, Text, Modal, Avatar, Pagination } from "@/components";
import { useAuth } from "@/features/auth";
import { getUserHistory, type HistoryEntry, type MatchPlayer } from "@/api/users.api";

const LIMIT = 10;

interface HistoryProps {
  username: string;
}

export default function History({ username }: HistoryProps) {
  const { t } = useTranslation('pages');
  const { user: me } = useAuth();
  const [history, setHistory]     = useState<HistoryEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [players, setPlayers]     = useState<MatchPlayer[] | null>(null);

  useEffect(() => {
    getUserHistory(username, currentPage, LIMIT).then(({ data, totalPages }) => {
      setHistory(data.filter((e) => e.finishedAt != null));
      setTotalPages(totalPages);
    });
  }, [username, currentPage]);

  return (
    <>
      <Container label={t('profile.history_label')}>
        {history.length === 0 ? (
          <Text variant="muted">{t('profile.history_empty')}</Text>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-fixed font-mono text-sm border-collapse">
                <thead>
                  <tr className="border-b border-dim">
                    <th className="text-left py-2 pr-4 text-xs uppercase tracking-widest text-dim font-normal whitespace-nowrap">{t('profile.history_date')}</th>
                    <th className="text-left py-2 pr-4 text-xs uppercase tracking-widest text-dim font-normal">{t('profile.history_pos')}</th>
                    <th className="text-left py-2 pr-4 text-xs uppercase tracking-widest text-dim font-normal" title={t('profile.wpm_long')}>{t('profile.history_wpm')}</th>
                    <th className="text-left py-2 pr-4 text-xs uppercase tracking-widest text-dim font-normal" title={t('profile.accuracy')}>{t('profile.accuracy_short')}.</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr
                      key={entry.match.id}
                      onClick={() => setPlayers(entry.match.matchResult)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setPlayers(entry.match.matchResult);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      className="border-b border-dim/40 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="py-2 pr-4">
                        <Text
                          size="sm"
                          variant="muted"
                          as="span"
                          title={
                            entry.finishedAt ? new Date(entry.finishedAt).toLocaleString("fr-CA", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                }) : "—"}>
                            {entry.finishedAt ? new Date(entry.finishedAt).toLocaleDateString("fr-CA") : "—"}
                        </Text>
                      </td>
                      <td className="py-2 pr-4">
                        <Text size="sm" as="span" >{entry.position ?? "—"}</Text><Text size="sm" as="span" variant="dim">/{entry.nbPlayers + entry.nbBots}</Text>
                      </td>
                      <td className="py-2 pr-4">
                        <Text size="sm" as="span">{entry.wpm != null ? `${Math.round(entry.wpm)}` : "—"}</Text>
                      </td>
                      <td className="py-2 pr-4">
                        <Text size="sm" as="span">{entry.wpm != null ? `${Math.round(entry.accuracy)}` : "—"}%</Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <Pagination
                className="mt-4"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </Container>

      <Modal
        isOpen={players !== null}
        onClose={() => setPlayers(null)}
        title={t('profile.history_players')}
      >
        <div className="flex flex-col">
          {[...(players ?? [])].sort((a, b) => (a.position ?? 99) - (b.position ?? 99)).map((p, i) => {
            const isMe = p.user.username === me?.username;
            return (
              <div key={i} className={`flex items-center justify-between border-b border-dim/40 py-2 px-2 last:border-0 ${isMe ? "bg-muted/40 text-accent" : ""}`}>
                <Link
                  to={`/profile/${p.user.username}`}
                  className="flex items-center gap-3 hover:opacity-75 transition-opacity"
                >
                  <Text size="sm" variant="muted" as="span">#{p.position ?? "—"}</Text>
                  <Avatar username={p.user.username} src={p.user.avatarUrl} size="sm" />
                  <Text size="sm" as="span">{p.user.username}</Text>
                </Link>
                <Text size="sm" as="span">{p.wpm != null ? `${Math.round(p.wpm)} WPM` : "—"}</Text>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
