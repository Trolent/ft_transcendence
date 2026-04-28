import { type ButtonHTMLAttributes } from "react";

/*

Examples:

// Colors
<Btn variant="primary">primary</Btn>
<Btn variant="secondary">secondary</Btn>
<Btn variant="ghost">ghost</Btn>
<Btn variant="danger">danger</Btn>

// Size
<Btn size="sm">small</Btn>
<Btn size="md">medium</Btn>
<Btn size="lg">large</Btn>

// disabled
<Btn variant="primary" disabled>disabled primary</Btn>
<Btn variant="secondary" disabled>disabled secondary</Btn>
<Btn variant="danger" disabled>disabled danger</Btn>

*/

type BtnVariant = "primary" | "secondary" | "ghost" | "danger";
type BtnSize    = "sm" | "md" | "lg";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
}

const variantClasses: Record<BtnVariant, string> = {
  primary:
    "bg-default text-black border border-default " +
    "hover:bg-glow hover:border-glow " +
    "active:bg-dim " +
    "disabled:bg-muted disabled:text-muted disabled:border-muted disabled:cursor-not-allowed",

  secondary:
    "bg-transparent text-default border border-default " +
    "hover:bg-muted " +
    "active:bg-dim " +
    "disabled:text-muted disabled:border-dim disabled:cursor-not-allowed",

  ghost:
    "bg-transparent text-default border border-transparent " +
    "hover:border-dim hover:bg-muted " +
    "active:bg-dim " +
    "disabled:text-muted disabled:cursor-not-allowed",

  danger:
    "bg-transparent text-danger border border-danger " +
    "hover:bg-danger hover:text-black " +
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
