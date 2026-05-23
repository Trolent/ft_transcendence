import { useState, useEffect } from "react";
import { Btn } from "@/components";
import { GameArena } from "@/game";
import { PageLayout } from "@/layout";
import { useTranslation } from "react-i18next";

type Phase = "lobby" | "countdown" | "go" | "racing";

export default function Play() {
  const { t } = useTranslation('pages');
  const [phase, setPhase] = useState<Phase>("lobby");
  const [countdown, setCountdown] = useState(10);
  const [gameKey, setGameKey] = useState(0);
  const [practice, setPractice] = useState(false);

  useEffect(() => {
    if (phase === "countdown") {
      if (countdown === 1) {
        const time = setTimeout(() => setPhase("go"), 1000);
        return () => clearTimeout(time);
      }
      const time = setTimeout(() => setCountdown((c: number) => c - 1), 1000);
      return () => clearTimeout(time);
    }
    if (phase === "go") {
      const time = setTimeout(() => setPhase("racing"), 700);
      return () => clearTimeout(time);
    }
  }, [phase, countdown]);

  const enterRace = () => {
    setPractice(false);
    setCountdown(5);
    setPhase("countdown");
  };

  const enterPractice = () => {
    setPractice(true);
    setPhase("racing");
  };

  if (phase === "lobby") {
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
            <Btn size="lg" onClick={enterRace}>{t('play.enter_race')}</Btn>
            <Btn size="lg" variant="secondary" onClick={enterPractice}>{t('play.practice_mode')}</Btn>
          </div>
        </div>
      </PageLayout>
    );
  }

  const overlay =
    phase === "countdown" ? String(countdown) :
    phase === "go"        ? "GO!"             :
    null;

  const replay = () => {
    setGameKey((k: number) => k + 1);
    if (practice) {
      setPhase("racing");
    } else {
      setCountdown(5);
      setPhase("countdown");
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="w-full max-w-3xl px-2 sm:px-4 flex justify-start">
        <Btn size="sm" variant="ghost" onClick={() => setPhase("lobby")}>{t('play.main_menu')}</Btn>
      </div>
      <GameArena key={gameKey} overlay={overlay} onReplay={replay} practice={practice} />
    </div>
  );
}
