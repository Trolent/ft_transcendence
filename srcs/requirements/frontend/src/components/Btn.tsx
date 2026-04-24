import { type ButtonHTMLAttributes } from "react";

type BtnVariant = "primary" | "secondary" | "ghost" | "danger";
type BtnSize    = "sm" | "md" | "lg";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
}

const variantClasses: Record<BtnVariant, string> = {
  primary:
    "bg-terminal-green text-terminal-void border border-terminal-green " +
    "hover:bg-terminal-green-glow hover:border-terminal-green-glow " +
    "active:bg-terminal-green-dim " +
    "disabled:bg-terminal-green-deep disabled:text-terminal-text-muted disabled:border-terminal-green-deep disabled:cursor-not-allowed",

  secondary:
    "bg-transparent text-terminal-green border border-terminal-green " +
    "hover:bg-terminal-surface " +
    "active:bg-terminal-raised " +
    "disabled:text-terminal-text-muted disabled:border-terminal-border-dim disabled:cursor-not-allowed",

  ghost:
    "bg-transparent text-terminal-green border border-transparent " +
    "hover:border-terminal-border-dim hover:bg-terminal-surface " +
    "active:bg-terminal-raised " +
    "disabled:text-terminal-text-muted disabled:cursor-not-allowed",

  danger:
    "bg-transparent text-terminal-red border border-terminal-red " +
    "hover:bg-terminal-red hover:text-terminal-void " +
    "active:opacity-80 " +
    "disabled:opacity-30 disabled:cursor-not-allowed",
};

const sizeClasses: Record<BtnSize, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-5 py-2 text-sm",
  lg: "px-8 py-3 text-base",
};

export default function Btn({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: BtnProps) {
  return (
    <button
      className={[
        "font-mono uppercase tracking-widest cursor-pointer transition-colors duration-100",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
