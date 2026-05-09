import React from "react";

type Props = {
  lane?: number;
  progress?: number; // 0..1
};

export default function Car({ lane = 1, progress = 0 }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)));
  const left = `${pct}%`;

  return (
    <div className="absolute top-[10px] sm:top-[6px]" style={{ left, transform: `translateX(-${pct}%)`, transition: "left 220ms linear, transform 220ms linear" }}>
      <svg className="w-10 sm:w-14" viewBox="0 0 56 28" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="2" y="6" width="42" height="14" rx="3" fill="#10b981" />
        <rect x="8" y="2" width="18" height="8" rx="2" fill="#065f46" />
        <circle cx="16" cy="24" r="3" fill="#0f172a" />
        <circle cx="36" cy="24" r="3" fill="#0f172a" />
      </svg>
    </div>
  );
}
