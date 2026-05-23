import { useTranslation } from "react-i18next";
import { StatCard, StatItem, StatDivider } from "@/components";
import type { UserStats } from "@/api/users";

interface StatsProps {
  stats: UserStats;
}

export default function Stats({ stats }: StatsProps) {
  const { t } = useTranslation('pages');

  return (
    <StatCard label={t('profile.stats_label')}>
      <StatItem label={t('profile.stat_rank')}    value={`#${stats.rank}`} accent />
      <StatDivider />
      <StatItem label={t('profile.stat_avg_wpm')} value={String(stats.avgWpm)} />
      <StatDivider />
      <StatItem label={t('profile.stat_level')}   value={String(stats.level)} />
      <StatDivider />
      <StatItem label={t('profile.stat_played')}  value={String(stats.gamesPlayed)} />
    </StatCard>
  );
}
