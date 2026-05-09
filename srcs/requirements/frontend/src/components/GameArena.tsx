import React from "react";
import RaceTrack from "./RaceTrack";
import HUD from "./HUD";
import TypingInput from "./TypingInput";
import Container from "./Container";

export default function GameArena() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl px-2 sm:px-4">
        <Container variant="panel" className="mx-auto">
          <div className="flex flex-col gap-6">
            <HUD />
            <RaceTrack />
            <TypingInput />
          </div>
        </Container>
      </div>
    </div>
  );
}
