import { Container, Text } from "@/components";
import type { UserAchievement } from "@/api/users.api";
import { useTranslation } from 'react-i18next';

type Props = {
  achievements: UserAchievement[];
};

export default function Achievements({ achievements }: Props) {
      const { t } = useTranslation(['pages']);
  return (
    <Container label={t('profile.achievements')}>
      {achievements.length === 0 ? (
        <Text variant="muted">{t('profile.no_achievements')}</Text>
      ) : (
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {achievements.map(({ achievement }) => (
          <li
            key={achievement.key}
            className="flex flex-col gap-1 border border-dim p-3"
          >
            <span className="text-2xl">{achievement.icon}</span>
            <span className="text-xs font-bold text-default uppercase tracking-wide">{achievement.label}</span>
            <span className="text-xs text-dim">{achievement.description}</span>
          </li>
        ))}
      </ul>
      )}
    </Container>
  );
}
