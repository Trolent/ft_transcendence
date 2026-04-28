import { type InputHTMLAttributes, forwardRef } from "react";

/*

Examples:

<Input label="Default" placeholder="type something here" value="value"/>
<Input variant="ghost" label="Ghost" placeholder="ghost" />
<Input label="error" placeholder="error" defaultValue="error" error="This field is required"/>
<Input label="Disabled" placeholder="disabled" disabled />

*/

type InputVariant = "default" | "ghost";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  label?: string;
  error?: string;
}

const variantClasses: Record<InputVariant, string> = {
  default:
    "bg-black border border-dim text-default " +
    "placeholder-muted " +
    "focus:outline-none focus:border-default focus:shadow-[0_0_8px_0_rgba(0,255,65,0.25)]",

  ghost:
    "bg-transparent border-b border-dim text-default " +
    "placeholder-muted " +
    "focus:outline-none focus:border-default",
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant = "default", label, error, className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1 font-mono w-full">
      {label && (
        <label className="text-xs uppercase tracking-widest text-dim">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <span className="absolute left-3 text-default select-none pointer-events-none opacity-70">
          &gt;
        </span>
        <input
          ref={ref}
          className={[
            "w-full pl-7 pr-3 py-2 text-sm transition-colors duration-100 caret-default",
            variantClasses[variant],
            error ? "border-danger focus:border-danger focus:shadow-[0_0_8px_0_rgba(255,49,49,0.25)]" : "",
            className,
          ].join(" ")}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-danger tracking-wide">
          ! {error}
        </span>
      )}
    </div>
  );
});

export default Input;
