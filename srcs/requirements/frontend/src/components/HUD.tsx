import React from "react";

export default function HUD() {
  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between text-sm font-mono text-dim">
      <div className="truncate">Time: <span className="text-default">00:00</span></div>
      <div className="truncate">WPM: <span className="text-default">0</span></div>
    </div>
  );
}
