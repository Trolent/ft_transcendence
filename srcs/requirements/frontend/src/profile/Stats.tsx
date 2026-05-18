import { StatCard, StatItem, StatDivider } from "@/components";
import type { UserStats } from "@/api/users";

interface StatsProps {
  stats: UserStats;
}

export default function Stats({ stats }: StatsProps) {
  return (
    <StatCard label="statistics">
      <StatItem label="Rank" value={`#${stats.rank}`} accent />
      <StatDivider />
      <StatItem label="Avg WPM" value={String(stats.avgWpm)} />
      <StatDivider />
      <StatItem label="Level" value={String(stats.level)} />
      <StatDivider />
      <StatItem label="Played" value={String(stats.gamesPlayed)} />
    </StatCard>
  );
}
