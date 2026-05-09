import { useState, useEffect } from "react";
import { Btn, GameArena } from "../components";

type Phase = "lobby" | "countdown" | "go" | "racing";

export default function Play() {
  const [phase, setPhase] = useState<Phase>("lobby");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (phase === "countdown") {
      if (countdown === 1) {
        const t = setTimeout(() => setPhase("go"), 1000);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setCountdown((c: number) => c - 1), 1000);
      return () => clearTimeout(t);
    }
    if (phase === "go") {
      const t = setTimeout(() => setPhase("racing"), 700);
      return () => clearTimeout(t);
    }
  }, [phase, countdown]);

  const enterRace = () => {
    setCountdown(8);
    setPhase("countdown");
  };

  if (phase === "lobby") {
    return (
      <div className="flex flex-col items-center gap-8 p-6">
        <div className="text-center flex flex-col gap-3">
          <h1 className="text-3xl sm:text-5xl font-bold font-mono tracking-widest uppercase text-default">
            Ready to Race?
          </h1>
          <p className="text-dim font-mono text-sm">
            Type faster than your opponents to cross the finish line.
          </p>
        </div>
        <Btn size="lg" onClick={enterRace}>Enter Race</Btn>
      </div>
    );
  }

  const overlay =
    phase === "countdown" ? String(countdown) :
    phase === "go"        ? "GO!"             :
    null;

  return <GameArena overlay={overlay} />;
}
