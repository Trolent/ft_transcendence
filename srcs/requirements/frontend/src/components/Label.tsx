import { type HTMLAttributes } from "react";

interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
  htmlFor?: string;
}

export function Label({ className = "", children, htmlFor, ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={["font-mono text-xs uppercase tracking-[0.3em] text-terminal-green-dim", className].join(" ")}
      {...props}
    >
      {children}
    </label>
  );
}
