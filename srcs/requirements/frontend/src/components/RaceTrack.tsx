import React, { useState } from "react";
import Car, { CAR_COUNT } from "./Car";

const LANES = [1, 2, 3];

function randomUniqueVariants(count: number): number[] {
  const pool = Array.from({ length: CAR_COUNT }, (_, i) => i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export default function RaceTrack() {
  const [variants] = useState<number[]>(() => randomUniqueVariants(LANES.length));

  return (
    <div className="w-full">
      {LANES.map((lane, idx) => (
        <div key={lane} className="flex items-center h-14 mb-3">
          <div className="w-16 sm:w-28 text-right pr-3 sm:pr-4 text-sm text-dim truncate">Player {lane}</div>

          <div className="flex-1 relative">
            <div className="bg-black/30 h-10 rounded-md relative overflow-hidden">
              <Car progress={0} variant={variants[idx]} />
            </div>
          </div>

          <div className="w-14 sm:w-20 pl-2 sm:pl-3 text-xs sm:text-sm font-mono text-default text-right truncate">
            0 WPM
          </div>
        </div>
      ))}
    </div>
  );
}
