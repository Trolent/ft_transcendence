import { useState } from "react";
import { useTranslation } from "react-i18next";
import RaceTrack from "./RaceTrack";
import HUD from "./HUD";
import TypingInput from "./TypingInput";
import { Btn, Container, StatCard, StatItem, StatDivider } from "@/components";
import { useGameState } from "@/hooks/useGameState";

function formatTime(s: number): string {
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

type Props = {
  overlay?: string | null;
  onReplay?: () => void;
  practice?: boolean;
};

export default function GameArena({ overlay, onReplay, practice = false }: Props) {
  const { t } = useTranslation('pages');
  const active = overlay == null;
  const [finishOrder, setFinishOrder] = useState<number[]>([]);

  const totalPlayers = practice ? 1 : 3;
  const allDone = finishOrder.length === totalPlayers;

  const {
    passage, words, wordIndex, typed,
    handleType, completeWord,
    elapsed, timeLeft, wpm, progress, playerDone,
    finishTime,
  } = useGameState(active, allDone, practice);

  const effectiveFinish = playerDone;
  const playerPlace = finishOrder.indexOf(0);
  const ordinals = t('play.ordinals', { returnObjects: true }) as string[];

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl px-2 sm:px-4">
        <Container variant="panel" className="mx-auto">
          <div className="flex flex-col gap-6">
            <HUD timeLeft={timeLeft} wpm={wpm} practice={practice} />
            <RaceTrack
              playerProgress={progress}
              playerWpm={wpm}
              elapsed={elapsed}
              active={active}
              passageLength={passage.length}
              practice={practice}
              onFinishOrderChange={setFinishOrder}
            />
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
                <StatCard label={t('play.results_label')}>
                  <StatItem label={t('play.stat_wpm')}      value={wpm} accent />
                  <StatDivider />
                  <StatItem label={t('play.stat_time')}     value={formatTime(finishTime ?? elapsed)} />
                  {!practice && (
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
