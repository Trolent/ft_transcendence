import { type InputHTMLAttributes, forwardRef } from "react";

type InputVariant = "default" | "ghost";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  label?: string;
  error?: string;
}

const variantClasses: Record<InputVariant, string> = {
  default:
    "bg-terminal-bg border border-terminal-border-dim text-terminal-text " +
    "placeholder-terminal-text-muted " +
    "focus:outline-none focus:border-terminal-green focus:shadow-[0_0_8px_0_rgba(0,255,65,0.25)]",

  ghost:
    "bg-transparent border-b border-terminal-border-dim text-terminal-text " +
    "placeholder-terminal-text-muted " +
    "focus:outline-none focus:border-terminal-green",
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant = "default", label, error, className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1 font-mono w-full">
      {label && (
        <label className="text-xs uppercase tracking-widest text-terminal-green-dim">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <span className="absolute left-3 text-terminal-green select-none pointer-events-none opacity-70">
          &gt;
        </span>
        <input
          ref={ref}
          className={[
            "w-full pl-7 pr-3 py-2 text-sm transition-colors duration-100 caret-terminal-green",
            variantClasses[variant],
            error ? "border-terminal-red focus:border-terminal-red focus:shadow-[0_0_8px_0_rgba(255,49,49,0.25)]" : "",
            className,
          ].join(" ")}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-terminal-red tracking-wide">
          ! {error}
        </span>
      )}
    </div>
  );
});

export default Input;
