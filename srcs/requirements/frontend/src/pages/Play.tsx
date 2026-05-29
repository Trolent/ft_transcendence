import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Btn, PageLayout, Alert } from "@/components";
import { GameArena } from "@/features/game";
import { useRaceSocket } from "@/hooks/useRaceSocket";

type Mode = "menu" | "practice" | "multiplayer";
type PracticePhase = "countdown" | "go" | "racing";

export default function Play() {
  const { t } = useTranslation('pages');
  const [mode, setMode] = useState<Mode>("menu");
  const [gameKey, setGameKey] = useState(0);

  // --- practice (offline, single-player) ---
  const [pPhase, setPPhase] = useState<PracticePhase>("countdown");
  const [pCountdown, setPCountdown] = useState(5);

  // --- multiplayer (socket-driven) ---
  const race = useRaceSocket();

  // ---- practice countdown clock ----
  useEffect(() => {
    if (mode !== "practice") return;
    if (pPhase === "countdown") {
      if (pCountdown === 1) {
        const time = setTimeout(() => setPPhase("go"), 1000);
        return () => clearTimeout(time);
      }
      const time = setTimeout(() => setPCountdown((c) => c - 1), 1000);
      return () => clearTimeout(time);
    }
    if (pPhase === "go") {
      const time = setTimeout(() => setPPhase("racing"), 700);
      return () => clearTimeout(time);
    }
  }, [mode, pPhase, pCountdown]);

  // ---- multiplayer countdown ticker (epoch ms -> seconds remaining) ----
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (race.phase !== "countdown" || race.countdownEndsAt == null) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [race.phase, race.countdownEndsAt]);

  const racerList = useMemo(
    () => Object.values(race.racers),
    [race.racers],
  );

  // ===== Menu =====
  const enterRace = () => {
    setMode("multiplayer");
    race.joinQueue();
  };

  const enterPractice = () => {
    setMode("practice");
    setPPhase("racing");
  };

  const backToMenu = () => {
    if (mode === "multiplayer") race.leaveQueue();
    setMode("menu");
  };

  if (mode === "menu") {
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

  // ===== Practice =====
  if (mode === "practice") {
    const overlay =
      pPhase === "countdown" ? String(pCountdown) :
      pPhase === "go"        ? "GO!"              :
      null;

    const replay = () => {
      setGameKey((k) => k + 1);
      setPPhase("racing");
    };

    return (
      <div className="w-full flex flex-col items-center gap-3">
        <div className="w-full max-w-3xl px-2 sm:px-4 flex justify-start">
          <Btn size="sm" variant="ghost" onClick={backToMenu}>{t('play.main_menu')}</Btn>
        </div>
        <GameArena key={gameKey} overlay={overlay} onReplay={replay} practice />
      </div>
    );
  }

  // ===== Multiplayer =====
  const topBar = (label: string, onClick: () => void) => (
    <div className="w-full max-w-3xl px-2 sm:px-4 flex justify-start">
      <Btn size="sm" variant="ghost" onClick={onClick}>{label}</Btn>
    </div>
  );

  const leftBanner = race.leftNotice && (
    <div className="w-full max-w-3xl px-2 sm:px-4">
      <Alert variant={race.leftNotice.cancelled ? "error" : "info"}>
        {race.leftNotice.cancelled
          ? t('play.race_voided')
          : t('play.player_left', { name: race.leftNotice.username })}
      </Alert>
    </div>
  );

  // Server refused the join (e.g. this account is already racing in another
  // tab). Show why and offer a way back; don't sit on the joining screen.
  if (race.rejected) {
    return (
      <div className="w-full flex flex-col items-center gap-3">
        {topBar(t('play.main_menu'), backToMenu)}
        <div className="w-full max-w-3xl px-2 sm:px-4">
          <Alert variant="error">
            {race.rejected === "duplicate_session"
              ? t('play.already_in_game')
              : t('play.join_failed')}
          </Alert>
        </div>
      </div>
    );
  }

  // Still connecting / no lobby snapshot yet: brief joining screen.
  if (race.phase === "idle" || race.matchText == null) {
    return (
      <div className="w-full flex flex-col items-center gap-3">
        {topBar(t('play.cancel'), backToMenu)}
        {leftBanner}
        <PageLayout centerY>
          <p className="text-dim font-mono text-sm">{t('play.connecting')}</p>
        </PageLayout>
      </div>
    );
  }

  // One play area for waiting -> countdown -> racing -> finished. The passage
  // and tracks show immediately; players/bots populate as they join; typing
  // stays disabled until the server starts the race.
  const secondsLeft =
    race.phase === "countdown" && race.countdownEndsAt != null
      ? Math.max(0, Math.ceil((race.countdownEndsAt - now) / 1000))
      : null;

  const status =
    race.phase === "waiting"   ? t('play.waiting_for_players') :
    race.phase === "countdown" ? t('play.starting_in', { n: secondsLeft ?? 0 }) :
    null;

  const preRace = race.phase === "waiting" || race.phase === "countdown";
  const replay = () => {
    setGameKey((k) => k + 1);
    race.joinQueue();
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {topBar(preRace ? t('play.cancel') : t('play.main_menu'), backToMenu)}
      {leftBanner}
      <GameArena
        key={gameKey}
        multiplayer
        started={race.phase === "racing"}
        status={status}
        serverText={race.matchText}
        racers={racerList}
        youPid={race.you}
        results={race.results}
        playerCount={race.playerCount}
        myPosition={race.myPosition}
        onProgress={race.sendProgress}
        onReplay={replay}
      />
    </div>
  );
}
