import { Container, Text } from "@/components";
import type { UserAchievement } from "@/api/users.api";
import { useTranslation } from 'react-i18next';

type Props = {
  achievements: UserAchievement[];
};

export default function Achievements({ achievements }: Props) {
  const { t } = useTranslation(['pages', 'achievements']);
  return (
    <Container label={t('profile.achievements')}>
      {achievements.length === 0 ? (
        <Text variant="muted">{t('profile.no_achievements')}</Text>
      ) : (
      <ul className="grid grid-cols-2 gap-2">
        {achievements.map(({ achievement, unlockedAt }) => {
          const locked = unlockedAt === null;
          return (
            <li
              key={achievement.key}
              className={`flex flex-col gap-1 border border-dim p-3 transition-opacity${locked ? ' opacity-40 grayscale' : ''}`}
            >
              <span className="text-2xl">{locked ? '🔒' : achievement.icon}</span>
              <span className="text-xs font-bold text-default uppercase tracking-wide">
                {t(`${achievement.key}.label`, { ns: 'achievements', defaultValue: achievement.label })}
              </span>
              <span className="text-xs text-dim">
                {t(`${achievement.key}.description`, { ns: 'achievements', defaultValue: achievement.description })}
              </span>
            </li>
          );
        })}
      </ul>
      )}
    </Container>
  );
}
