import React from "react";

type Props = {
  timeLeft: number;
  wpm: number;
};

export default function HUD({ timeLeft, wpm }: Props) {
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between text-sm font-mono text-dim">
      <div className="truncate">Time: <span className="text-default">{mm}:{ss}</span></div>
      <div className="truncate">WPM: <span className="text-default">{wpm}</span></div>
    </div>
  );
}
