import React, { useState } from "react";
import RaceTrack from "./RaceTrack";
import HUD from "./HUD";
import TypingInput from "./TypingInput";
import Container from "../components/Container";
import Btn from "../components/Btn";
import { StatCard, StatItem, StatDivider } from "../components/StatCard";
import { useGameState } from "../hooks/useGameState";

const ORDINALS = ["1st", "2nd", "3rd"];
const TOTAL_PLAYERS = 3;

function formatTime(s: number): string {
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

type Props = {
  overlay?: string | null;
  onReplay?: () => void;
};

export default function GameArena({ overlay, onReplay }: Props) {
  const active = overlay == null;
  const [finishOrder, setFinishOrder] = useState<number[]>([]);

  // All bots done but player hasn't finished — auto end in last place
  const allOthersFinished =
    !finishOrder.includes(0) &&
    finishOrder.filter((i: number) => i !== 0).length === TOTAL_PLAYERS - 1;

  // Everyone (including player) finished — stop the timer
  const allDone = finishOrder.length === TOTAL_PLAYERS;

  const {
    passage, words, wordIndex, typed,
    handleType, completeWord,
    elapsed, timeLeft, wpm, progress, finished, playerDone,
    finishTime, accuracy,
  } = useGameState(active, allOthersFinished || allDone);

  const effectiveFinish = playerDone;
  const playerPlace = allOthersFinished && !finished
    ? TOTAL_PLAYERS - 1          // forced last
    : finishOrder.indexOf(0);    // actual position (0-indexed)

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl px-2 sm:px-4">
        <Container variant="panel" className="mx-auto">
          <div className="flex flex-col gap-6">
            <HUD timeLeft={timeLeft} wpm={wpm} />
            <RaceTrack
              playerProgress={progress}
              playerWpm={wpm}
              elapsed={elapsed}
              active={active}
              passageLength={passage.length}
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
                  <StatDivider />
                  <StatItem
                    label="Position"
                    value={playerPlace >= 0 ? ORDINALS[playerPlace] : "—"}
                  />
                </StatCard>
                <div className="flex justify-center">
                  <Btn onClick={onReplay}>Race Again</Btn>
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
