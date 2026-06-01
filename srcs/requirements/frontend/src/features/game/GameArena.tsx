import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import RaceTrack from "./RaceTrack";
import HUD from "./HUD";
import TypingInput from "./TypingInput";
import { Btn, Container, StatCard, StatItem, StatDivider } from "@/components";
import { useGameState } from "@/hooks/useGameState";
import type { Racer, RaceResult } from "@/hooks/useRaceSocket";

import { MIN_RACE_SECONDS, MIN_CHARS_PER_SEC } from "@backend/common/game.constant";

function formatTime(s: number): string {
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

type Props = {
  overlay?: string | null;
  onReplay?: () => void;
  practice?: boolean;
  // --- multiplayer (server-driven) ---
  multiplayer?: boolean;
  serverText?: string | null;          // race passage from lobby_update
  racers?: Racer[];                     // live participants from the server
  youPid?: string | null;              // local player's pid
  results?: RaceResult[] | null;       // final standings from race_finished
  playerCount?: number;                // denominator for "x / N"
  myPosition?: number | null;          // own placement, the instant we finish
  onProgress?: (correctChars: number, accuracy: number) => void; // report correct chars + accuracy to server
  started?: boolean;                   // typing is live only once the race starts
  status?: string | null;             // pre-race banner (waiting / countdown)
};

export default function GameArena({
  overlay, onReplay, practice = false,
  multiplayer = false, serverText, racers = [], youPid,
  results, playerCount = 0, myPosition = null, onProgress,
  started = true, status = null,
}: Props) {
  const { t } = useTranslation('pages');
  const active = started && overlay == null;

  // --- legacy / practice finish tracking (client-side fake bots) ---
  const [finishOrder, setFinishOrder] = useState<number[]>([]);
  const totalPlayers = practice ? 1 : 3;
  const allDone = finishOrder.length === totalPlayers;

  // In multiplayer the server is the source of truth for "race over": we stop
  // the local clock only once results arrive. The local engine still drives the
  // typing box + WPM + correct-char count.
  const serverFinished = multiplayer && results != null;

  // Match the server's force-finish deadline so the visible race timer agrees
  // with when the backend cuts the race off.
  const mpMaxTime =
    multiplayer && serverText
      ? Math.max(MIN_RACE_SECONDS, Math.ceil(serverText.length / MIN_CHARS_PER_SEC))
      : undefined;

  const {
    passage, words, wordIndex, typed,
    handleType, completeWord,
    elapsed, timeLeft, wpm, progress, playerDone, timedOut,
    finishTime, accuracy, totalCorrect,
  } = useGameState(
    active,
    multiplayer ? serverFinished : allDone,
    practice,
    multiplayer ? (serverText ?? undefined) : undefined,
    multiplayer ? mpMaxTime : undefined,
  );

  // Report correct-char count + accuracy to the server while racing. Send when
  // either changes, so a streak of wrong keystrokes (which drops accuracy without
  // advancing correct chars) still reaches the server. The server rate-limits.
  const lastSent = useRef<{ chars: number; accuracy: number }>({ chars: -1, accuracy: -1 });
  useEffect(() => {
    if (!multiplayer || !active) return;
    if (totalCorrect === lastSent.current.chars && accuracy === lastSent.current.accuracy) return;
    lastSent.current = { chars: totalCorrect, accuracy };
    onProgress?.(totalCorrect, accuracy);
  }, [multiplayer, active, totalCorrect, accuracy, onProgress]);

  // ---- results derivation ----
  const ordinals = t('play.ordinals', { returnObjects: true }) as string[];

  // multiplayer: place from server standings (1-based position / playerCount).
  const myResult = multiplayer && results ? results.find(r => r.pid === youPid) : undefined;
  const mpFinished = serverFinished;

  // practice/legacy: client-side place.
  const playerPlace = finishOrder.indexOf(0);

  // Finishing the passage (or running out of time) ends the race for you
  // immediately — results show at once; the server position fills in when the
  // whole race wraps up.
  const effectiveFinish = multiplayer ? (playerDone || mpFinished) : playerDone;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl px-2 sm:px-4">
        <Container variant="panel" className="mx-auto">
          <div className="flex flex-col gap-6">
            <HUD timeLeft={timeLeft} wpm={wpm} practice={practice} />
            {status && (
              <div className="text-center font-mono text-lg sm:text-xl font-bold uppercase tracking-widest text-default tabular-nums">
                {status}
              </div>
            )}
            {multiplayer ? (
              <RaceTrack
                multiplayer
                racers={racers}
                youPid={youPid}
                results={results}
                playerProgress={progress}
                playerWpm={wpm}
                elapsed={elapsed}
                active={active}
                passageLength={passage.length}
              />
            ) : (
              <RaceTrack
                playerProgress={progress}
                playerWpm={wpm}
                elapsed={elapsed}
                active={active}
                passageLength={passage.length}
                practice={practice}
                onFinishOrderChange={setFinishOrder}
              />
            )}
            <TypingInput
              active={active && !effectiveFinish}
              finished={effectiveFinish}
              words={words}
              wordIndex={wordIndex}
              typed={typed}
              onType={handleType}
              onCompleteWord={completeWord}
            />
            {effectiveFinish && (
              <div className="flex flex-col gap-4">
                {timedOut && (
                  <div className="text-center font-mono text-sm sm:text-base font-bold uppercase tracking-widest text-default">
                    {t('play.timed_out')}
                  </div>
                )}
                <StatCard label={t('play.results_label')}>
                  <StatItem label={t('play.stat_wpm')}      value={myResult ? Math.round(myResult.wpm) : wpm} accent />
                  <StatDivider />
                  <StatItem label={t('play.stat_time')}     value={formatTime(finishTime ?? elapsed)} />
                  <StatDivider />
                  <StatItem label={t('play.stat_accuracy')} value={`${accuracy}%`} />
                  {multiplayer ? (
                    <>
                      <StatDivider />
                      <StatItem
                        label={t('play.stat_position')}
                        value={(myResult?.position ?? myPosition) != null ? `${myResult?.position ?? myPosition} / ${playerCount}` : "—"}
                      />
                    </>
                  ) : !practice && (
                    <>
                      <StatDivider />
                      <StatItem
                        label={t('play.stat_position')}
                        value={playerPlace >= 0 ? (ordinals[playerPlace] ?? "—") : "—"}
                      />
                    </>
                  )}
                </StatCard>
                <div className="flex justify-center">
                  <Btn onClick={onReplay}>
                    {practice ? t('play.try_again') : t('play.race_again')}
                  </Btn>
                </div>
              </div>
            )}
          </div>
          {overlay != null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <span className="text-7xl sm:text-9xl font-bold font-mono text-default tabular-nums">
                {overlay}
              </span>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}
