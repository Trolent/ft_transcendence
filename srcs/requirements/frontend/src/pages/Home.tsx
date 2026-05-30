import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Btn, PageLayout } from "@/components";

export default function Home() {
  const { t } = useTranslation('pages');
  const navigate = useNavigate();

  return (
    <PageLayout centerY>
      <div className="flex flex-col items-center gap-8">
        <div className="text-center flex flex-col gap-3">
          <h1 className="text-3xl sm:text-5xl font-bold font-mono tracking-widest uppercase text-default">
            {t('play.ready_to_race')}
          </h1>
          <p className="text-dim font-mono text-sm">
            {t('play.race_description')}
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Btn size="lg" onClick={() => navigate('/play/multiplayer')}>
            {t('play.enter_race')}
          </Btn>
          <Btn size="lg" variant="secondary" onClick={() => navigate('/play/practice')}>
            {t('play.practice_mode')}
          </Btn>
        </div>
      </div>
    </PageLayout>
  );
}
