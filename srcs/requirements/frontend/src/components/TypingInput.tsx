import React, { useRef, useEffect } from "react";
import Input from "./Input";

type Props = {
  active?: boolean;
  finished?: boolean;
  words?: string[];
  wordIndex?: number;
  typed?: string;
  onType?: (value: string) => void;
  onCompleteWord?: () => void;
};

export default function TypingInput({
  active, finished,
  words = [], wordIndex = 0,
  typed = "", onType, onCompleteWord,
}: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const currentWord = words[wordIndex] ?? "";
  const isLastWord = wordIndex === words.length - 1;

  useEffect(() => {
    if (active) ref.current?.focus();
  }, [active]);

  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === " ") {
      e.preventDefault();
      if (typed === currentWord && !isLastWord) onCompleteWord?.();
    }
    if (e.key === "Backspace" && typed === "") e.preventDefault();
  };

  const nextWord = words[wordIndex + 1] ?? "";
  const maxInputLength = currentWord.length + nextWord.length + 4;

  const handleChange = ({ target }: { target: HTMLInputElement }) => {
    const value = target.value.slice(0, maxInputLength);
    onType?.(value);
    if (isLastWord && value === currentWord) onCompleteWord?.();
  };

  // Build passage as a flat string and compute cursor position absolutely
  const passage = words.join(" ");
  const charOffset = words.slice(0, wordIndex).reduce((acc, w) => acc + w.length + 1, 0);
  const absoluteCursor = charOffset + typed.length;

  // Find the first error within the current word
  let firstError = typed.length;
  for (let i = 0; i < typed.length; i++) {
    if (i >= currentWord.length || typed[i] !== currentWord[i]) { firstError = i; break; }
  }
  const hasError = firstError < typed.length;
  const overflow = typed.length > currentWord.length;
  const redStart = charOffset + (hasError && firstError < currentWord.length ? firstError : currentWord.length);
  const cursorIsError = hasError || overflow;

  const charNodes: React.ReactNode[] = passage.split("").map((char, i) => {
    let cls: string;
    if (i < charOffset) {
      cls = "text-default";
    } else if (!finished && i === absoluteCursor) {
      cls = `text-dim underline ${cursorIsError ? "decoration-red-400" : "decoration-default"}`;
    } else if (i < absoluteCursor) {
      cls = i >= redStart ? "bg-red-500/40 text-dim" : "text-default";
    } else {
      cls = "text-dim";
    }
    return <span key={i} className={cls}>{char}</span>;
  });

  // Trailing cursor when absoluteCursor is past the end of the passage
  if (!finished && absoluteCursor >= passage.length) {
    charNodes.push(
      <span key="trail" className={`text-dim underline ${cursorIsError ? "decoration-red-400" : "decoration-default"}`}>&nbsp;</span>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {words.length > 0 && (
        <div className="font-mono text-sm leading-relaxed p-3 bg-black/20 border border-dim rounded select-none" onCopy={(e) => e.preventDefault()}>
          {charNodes}
        </div>
      )}
      {!finished && (
        <Input
          ref={ref}
          placeholder={active ? "Type here..." : "Waiting for race to start..."}
          disabled={!active}
          value={typed}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onPaste={(e) => e.preventDefault()}
        />
      )}
    </div>
  );
}
