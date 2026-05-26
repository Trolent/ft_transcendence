import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Car, { CAR_COUNT } from "./Car";

const LANES = [0, 1, 2];
const SEGMENT_DURATION = 2;

type Waypoint = { t: number; p: number };

function randomUniqueVariants(count: number): number[]
{
  const pool = Array.from({ length: CAR_COUNT }, (_, i) => i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

function buildCurve(targetWpm: number, passageLength: number): Waypoint[]
{
  const charsPerSec = (targetWpm * 5) / 60;
  const curve: Waypoint[] = [{ t: 0, p: 0 }];
  let chars = 0;
  while (chars < passageLength) {
    const multiplier = 0.6 + Math.random() * 0.8;
    chars += charsPerSec * SEGMENT_DURATION * multiplier;
    const t = curve[curve.length - 1].t + SEGMENT_DURATION;
    const p = Math.min(1, chars / passageLength);
    curve.push({ t, p });
    if (p >= 1) break;
  }
  return curve;
}

function interpolate(curve: Waypoint[], elapsed: number): number
{
  if (elapsed <= 0) return 0;
  const last = curve[curve.length - 1];
  if (elapsed >= last.t) return last.p;
  for (let i = 1; i < curve.length; i++) {
    if (elapsed <= curve[i].t) {
      const a = curve[i - 1], b = curve[i];
      return a.p + ((elapsed - a.t) / (b.t - a.t)) * (b.p - a.p);
    }
  }
  return 1;
}

function segmentWpm(curve: Waypoint[], elapsed: number, passageLength: number): number
{
  for (let i = 1; i < curve.length; i++) {
    if (elapsed <= curve[i].t) {
      const a = curve[i - 1], b = curve[i];
      const charsPerSec = ((b.p - a.p) * passageLength) / (b.t - a.t);
      return Math.round((charsPerSec * 60) / 5);
    }
  }
  return 0;
}

function finishedWpm(curve: Waypoint[], passageLength: number): number
{
  const t = curve[curve.length - 1].t;
  return t > 0 ? Math.round((passageLength / 5) / (t / 60)) : 0;
}

type Props =
{
  playerProgress: number;
  playerWpm: number;
  elapsed: number;
  active: boolean;
  passageLength: number;
  practice?: boolean;
  onFinishOrderChange?: (order: number[]) => void;
};

export default function RaceTrack(
{
  playerProgress, playerWpm,
  elapsed, active, passageLength, practice = false, onFinishOrderChange,
}: Props) {
  const lanes = practice ? [0] : LANES;
  const [variants] = useState<number[]>(() => randomUniqueVariants(LANES.length));
  const [botTargetWpms] = useState<number[]>(() => [1, 2].map(() => Math.round(40 + Math.random() * 40)));
  const [botCurves] = useState<Waypoint[][]>(() =>
    botTargetWpms.map((wpm: number) => buildCurve(wpm, passageLength))
  );
  const [finishOrder, setFinishOrder] = useState<number[]>([]);

  const progressForLane = (idx: number): number => {
    if (idx === 0) return playerProgress;
    return active ? interpolate(botCurves[idx - 1], elapsed) : 0;
  };

  const wpmForLane = (idx: number): number => {
    if (idx === 0) return playerWpm;
    if (!active || elapsed < 1) return 0;
    if (progressForLane(idx) >= 1) return finishedWpm(botCurves[idx - 1], passageLength);
    return segmentWpm(botCurves[idx - 1], elapsed, passageLength);
  };

  // Track finish order
  useEffect(() => {
    if (!active) return;
    setFinishOrder((prev: number[]) => {
      const next = [...prev];
      lanes.forEach(idx => {
        const p = idx === 0 ? playerProgress : interpolate(botCurves[idx - 1], elapsed);
        if (p >= 1 && !next.includes(idx)) next.push(idx);
      });
      return next.length === prev.length ? prev : next;
    });
  }, [elapsed, playerProgress, active]);

  useEffect(() => {
    onFinishOrderChange?.(finishOrder);
  }, [finishOrder]);

  const { t } = useTranslation('pages');
  const ordinals = t('play.ordinals', { returnObjects: true }) as string[];
  const label = (idx: number) => idx === 0 ? t('play.you') : t('play.player', { n: idx + 1 });
  const place = (idx: number) => {
    const i = finishOrder.indexOf(idx);
    return i >= 0 ? (ordinals[i] ?? null) : null;
  };

  return (
    <div className="w-full">
      {lanes.map(idx => (
        <div key={idx} className="flex items-center h-14 mb-3">
          <div className="w-16 sm:w-28 text-right pr-3 sm:pr-4 text-sm text-dim truncate">
            {label(idx)}
          </div>

          <div className="flex-1 relative">
            <div className="bg-black/30 h-10 rounded-md relative overflow-hidden">
              <Car progress={progressForLane(idx)} variant={variants[idx]} />
            </div>
          </div>

          <div className="w-14 sm:w-20 pl-2 sm:pl-3 font-mono text-right flex flex-col items-end">
            {place(idx) && (
              <span className="text-xs text-dim uppercase tracking-widest">{place(idx)}</span>
            )}
            <span className="text-xs sm:text-sm text-default">{wpmForLane(idx)} WPM</span>
          </div>
        </div>
      ))}
    </div>
  );
}
