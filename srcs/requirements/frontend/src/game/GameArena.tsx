import React, { useState } from "react";
import RaceTrack from "./RaceTrack";
import HUD from "./HUD";
import TypingInput from "./TypingInput";
import Container from "../components/Container";
import Btn from "../components/Btn";
import { StatCard, StatItem, StatDivider } from "../components/StatCard";
import { useGameState } from "../hooks/useGameState";

const ORDINALS = ["1st", "2nd", "3rd"];

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
  const active = overlay == null;
  const [finishOrder, setFinishOrder] = useState<number[]>([]);

  const totalPlayers = practice ? 1 : 3;
  const allDone = finishOrder.length === totalPlayers;

  const {
    passage, words, wordIndex, typed,
    handleType, completeWord,
    elapsed, timeLeft, wpm, progress, playerDone,
    finishTime, accuracy,
  } = useGameState(active, allDone, practice);

  const effectiveFinish = playerDone;
  const playerPlace = finishOrder.indexOf(0);

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
                <StatCard label="results">
                  <StatItem label="WPM" value={wpm} accent />
                  <StatDivider />
                  <StatItem label="Time" value={formatTime(finishTime ?? elapsed)} />
                  <StatDivider />
                  <StatItem label="Accuracy" value={`${accuracy}%`} />
                  {!practice && (
                    <>
                      <StatDivider />
                      <StatItem
                        label="Position"
                        value={playerPlace >= 0 ? ORDINALS[playerPlace] : "—"}
                      />
                    </>
                  )}
                </StatCard>
                <div className="flex justify-center">
                  <Btn onClick={onReplay}>{practice ? "Try Again" : "Race Again"}</Btn>
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
