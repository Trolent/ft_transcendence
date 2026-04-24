import { type HTMLAttributes } from "react";

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
        "relative font-mono",
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
