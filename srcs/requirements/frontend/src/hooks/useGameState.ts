import { useState, useEffect, useRef } from "react";
import { pickRandomQuote } from "../quotes";

function correctPrefixLength(typed: string, word: string): number {
  let i = 0;
  while (i < typed.length && typed[i] === word[i]) i++;
  return i;
}

// Allow ~30 WPM (2.5 chars/sec) to finish, minimum 20 s
function calcMaxTime(passageLength: number): number {
  return Math.max(20, Math.ceil(passageLength / 2.5));
}

export function useGameState(active: boolean, forcedEnd = false, practice = false, initialText?: string) {
  const [passage] = useState<string>(() => initialText ?? pickRandomQuote());
  const words = passage.split(" ");
  const maxTime = calcMaxTime(passage.length);

  const [wordIndex, setWordIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [completedChars, setCompletedChars] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [lockedWpm, setLockedWpm] = useState<number | null>(null);
  const [lockedElapsed, setLockedElapsed] = useState<number | null>(null);
  const startedAt = useRef<number | null>(null);

  const currentWord = words[wordIndex] ?? "";
  const correctInCurrent = correctPrefixLength(typed, currentWord);
  const totalCorrect = completedChars + correctInCurrent;
  const progress = passage.length > 0 ? totalCorrect / passage.length : 0;
  const finished = wordIndex >= words.length;
  const timedOut = !practice && active && elapsed >= maxTime && !finished;
  const playerDone = finished || forcedEnd || timedOut;
  const raceOver = forcedEnd || timedOut;
  const timeLeft = Math.max(0, maxTime - elapsed);
  const minutes = elapsed / 60;
  const wpm = lockedWpm ?? (minutes > 0 ? Math.round(totalCorrect / 5 / minutes) : 0);
  const accuracy = totalTyped > 0
    ? Math.min(100, Math.round((completedChars / totalTyped) * 100))
    : 0;

  const handleType = (newValue: string) => {
    if (newValue.length > typed.length) {
      setTotalTyped((t: number) => t + (newValue.length - typed.length));
    }
    setTyped(newValue);
  };

  const completeWord = () => {
    const isLast = wordIndex === words.length - 1;
    setCompletedChars((c: number) => c + currentWord.length + (isLast ? 0 : 1));
    setWordIndex((i: number) => i + 1);
    setTyped("");
    if (!isLast) setTotalTyped((t: number) => t + 1);
  };

  // Lock WPM and elapsed when the race is over
  useEffect(() => {
    if (playerDone && lockedWpm === null) {
      setLockedWpm(minutes > 0 ? Math.round(totalCorrect / 5 / minutes) : 0);
      setLockedElapsed(elapsed);
    }
  }, [playerDone, lockedWpm, totalCorrect, minutes, elapsed]);

  useEffect(() => {
    if (active && startedAt.current === null) {
      startedAt.current = Date.now();
    }
  }, [active]);

  useEffect(() => {
    if (!active || raceOver) return;
    const id = setInterval(() => {
      if (startedAt.current !== null) {
        setElapsed(Math.floor((Date.now() - startedAt.current) / 1000));
      }
    }, 500);
    return () => clearInterval(id);
  }, [active, raceOver]);

  return {
    passage, words, wordIndex, typed,
    handleType, completeWord,
    elapsed, timeLeft, wpm, progress, finished, playerDone,
    finishTime: lockedElapsed,
    accuracy,
    totalCorrect,
  };
}
