import { type HTMLAttributes } from "react";

/*

Examples:

<Container variant="default" label="default">
  <Text variant="muted">variant default</Text>
</Container>
<Container variant="panel" label="panel">
  <Text variant="dim">variant panel</Text>
</Container>
<Container variant="terminal" label="terminal">
  <Text variant="prompt">variant terminal</Text>
</Container>

*/

type ContainerVariant = "default" | "panel" | "terminal";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ContainerVariant;
  label?: string;
}

const variantClasses: Record<ContainerVariant, string> = {
  default:
    "bg-terminal-bg border border-terminal-border-dim",

  panel:
    "bg-terminal-surface border border-terminal-green",

  terminal:
    "bg-terminal-void border border-terminal-green " +
    "shadow-[0_0_12px_0_rgba(0,255,65,0.15)]",
};

export default function Container({
  variant = "default",
  label,
  className = "",
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={[
        "relative font-mono p-4",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {label && (
        <span className="absolute -top-px left-3 -translate-y-1/2 bg-terminal-bg px-1 text-xs text-terminal-green-dim uppercase tracking-widest">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
