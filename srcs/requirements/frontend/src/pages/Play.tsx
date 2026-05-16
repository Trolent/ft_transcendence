import { useState, useEffect } from "react";
import { Btn } from "@/components";
import { GameArena } from "@/game";
import { PageLayout } from "@/layout";

type Phase = "lobby" | "countdown" | "go" | "racing";

export default function Play() {
  const [phase, setPhase] = useState<Phase>("lobby");
  const [countdown, setCountdown] = useState(10);
  const [gameKey, setGameKey] = useState(0);

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
    setCountdown(5);
    setPhase("countdown");
  };

  if (phase === "lobby") {
    return (
      <PageLayout centerY>
        <div className="flex flex-col items-center gap-8">
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
      </PageLayout>
    );
  }

  const overlay =
    phase === "countdown" ? String(countdown) :
    phase === "go"        ? "GO!"             :
    null;

  const replay = () => {
    setGameKey((k: number) => k + 1);
    setCountdown(5);
    setPhase("countdown");
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="w-full max-w-3xl px-2 sm:px-4 flex justify-start">
        <Btn size="sm" variant="ghost" onClick={() => setPhase("lobby")}>← Main Menu</Btn>
      </div>
      <GameArena key={gameKey} overlay={overlay} onReplay={replay} />
    </div>
  );
}
