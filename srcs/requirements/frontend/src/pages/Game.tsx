import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Btn, PageLayout, Alert, Modal } from "@/components";
import { useTouchDevice } from "@/hooks/useTouchDevice";
import { GameArena } from "@/features/game";
import { useRaceSocket } from "@/hooks/useRaceSocket";

type Mode = "practice" | "multiplayer";
type PracticePhase = "countdown" | "go" | "racing";

export default function Game() {
  const { t } = useTranslation('pages');
  const navigate = useNavigate();
  const location = useLocation();
  const { mode: modeParam } = useParams<{ mode: string }>();
  const mode: Mode = modeParam === "practice" ? "practice" : "multiplayer";
  const [gameKey, setGameKey] = useState(0);
  const isTouch = useTouchDevice();

  const [pPhase, setPPhase] = useState<PracticePhase>("racing");
  const [pCountdown, setPCountdown] = useState(5);

  const race = useRaceSocket();

  useEffect(() => {
    if (mode !== "multiplayer") {
      return;
    }
    if (!(location.state as { fromApp?: boolean } | null)?.fromApp) {
      navigate("/");
      return;
    }
    navigate(location.pathname, { replace: true });
    if (!isTouch) {
      race.joinQueue();
    }
  }, [mode, race.joinQueue, isTouch]);

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

  if (isTouch) {
    return (
      <Modal isOpen onClose={() => navigate('/')} title={t('play.mobile_title')}>
        <p className="font-mono text-sm text-dim">{t('play.mobile_message')}</p>
      </Modal>
    );
  }

  const backToMenu = () => {
    if (mode === "multiplayer") race.leaveQueue();
    navigate('/');
  };

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

  const topBar = (label: string, onClick: () => void) => (
    <div className="w-full max-w-3xl px-2 sm:px-4 flex justify-start">
      <Btn size="sm" variant="ghost" onClick={onClick}>{label}</Btn>
    </div>
  );

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

  if (race.disconnected) {
    return (
      <div className="w-full flex flex-col items-center gap-3">
        {topBar(t('play.main_menu'), backToMenu)}
        <div className="w-full max-w-3xl px-2 sm:px-4 flex flex-col gap-4">
          <Alert variant="error">{t('play.disconnected')}</Alert>
          <div className="flex justify-center">
            <Btn onClick={() => { setGameKey((k) => k + 1); race.joinQueue(); }}>
              {t('play.race_again')}
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  if (race.phase === "idle" || race.matchText == null) {
    return (
      <div className="w-full flex flex-col items-center gap-3">
        {topBar(t('play.cancel'), backToMenu)}
          <PageLayout centerY>
          <p className="text-dim font-mono text-sm">{t('play.connecting')}</p>
        </PageLayout>
      </div>
    );
  }

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
      <GameArena
        key={gameKey}
        multiplayer
        started={race.phase === "racing"}
        status={status}
        serverText={race.matchText}
        racers={racerList}
        youPid={race.you}
        liveFinishOrder={race.finishOrder}
        results={race.results}
        playerCount={race.playerCount}
        myPosition={race.myPosition}
        onProgress={race.sendProgress}
        onReplay={replay}
      />
    </div>
  );
}
