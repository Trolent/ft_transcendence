import React from "react";
import Car from "./Car";

export default function RaceTrack() {
  const lanes = [1, 2, 3];

  return (
    <div className="w-full">
      {lanes.map((lane) => (
        <div key={lane} className="flex items-center h-14 mb-3">
          <div className="w-16 sm:w-28 text-right pr-3 sm:pr-4 text-sm text-dim truncate">Player {lane}</div>

          <div className="flex-1 relative">
            <div className="bg-black/30 h-10 rounded-md relative overflow-hidden">
              {/* start all cars at the starting line (progress 0) */}
              <Car lane={lane} progress={0} />
            </div>
          </div>

          {/* WPM badge placed outside the race track to the right */}
          <div className="w-14 sm:w-20 pl-2 sm:pl-3 text-xs sm:text-sm font-mono text-default text-right truncate">
            0 WPM
          </div>
        </div>
      ))}
    </div>
  );
}
