import { type HTMLAttributes } from "react";

type HeadingLevel = 1 | 2 | 3 | 4;

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
}

const headingClasses: Record<HeadingLevel, string> = {
  1: "text-3xl tracking-[0.3em] uppercase",
  2: "text-2xl tracking-[0.2em] uppercase",
  3: "text-lg  tracking-[0.15em] uppercase",
  4: "text-base tracking-widest  uppercase",
};

export function Heading({
  level = 1,
  className = "",
  children,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
  return (
    <Tag
      className={[
        "font-mono font-bold text-terminal-green",
        headingClasses[level],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}


