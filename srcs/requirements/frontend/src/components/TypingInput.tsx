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

function renderCurrentWord(word: string, typed: string): React.ReactNode {
  const hasError = typed.length > word.length ||
    Array.from(typed).some((c, i) => i >= word.length || c !== word[i]);

  const len = Math.max(word.length, typed.length);
  const nodes: React.ReactNode[] = [];

  for (let ci = 0; ci < len; ci++) {
    const wordChar = word[ci];
    const typedChar = typed[ci];
    const isTyped = ci < typed.length;
    const isOverflow = ci >= word.length;
    const isCursor = ci === typed.length;

    let cls: string;
    if (isTyped) {
      cls = isOverflow || typedChar !== wordChar ? "text-red-400" : "text-default";
    } else if (isCursor) {
      cls = hasError
        ? "text-dim underline decoration-red-400"
        : "text-dim underline decoration-default";
    } else {
      cls = "text-dim";
    }

    nodes.push(
      <span key={ci} className={cls}>{isOverflow ? typedChar : wordChar}</span>
    );
  }

  // Cursor sits past the end when typed reaches or exceeds word length
  if (typed.length >= word.length) {
    const overflowCls = hasError
      ? "text-red-400 underline decoration-red-400"
      : "text-dim underline decoration-default";
    nodes.push(<span key="end" className={overflowCls}>&nbsp;</span>);
  }

  return <>{nodes}</>;
}

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

  const handleChange = ({ target }: { target: HTMLInputElement }) => {
    onType?.(target.value);
    if (isLastWord && target.value === currentWord) onCompleteWord?.();
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {words.length > 0 && (
        <div className="font-mono text-sm leading-relaxed p-3 bg-black/20 border border-dim rounded select-none">
          {words.map((word, wi) => (
            <span key={wi}>
              {wi === wordIndex
                ? renderCurrentWord(word, typed)
                : <span className={wi < wordIndex ? "text-default" : "text-dim"}>{word}</span>
              }
              {wi < words.length - 1 && <span className="text-dim"> </span>}
            </span>
          ))}
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
        />
      )}
    </div>
  );
}
