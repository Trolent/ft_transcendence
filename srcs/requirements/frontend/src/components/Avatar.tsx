/*

Examples:

<Avatar username="username" />
<Avatar username="username" src={monImage} size="lg" />

Sizes:

- sm (32px)
- md (48px, default)
- lg (64px)
- xl (96px)

*/

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  username: string;
  src?: string | null;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-lg",
  lg: "w-16 h-16 text-2xl",
  xl: "w-24 h-24 text-4xl",
};

export function Avatar({ username, src, size = "md", className = "" }: AvatarProps) {
  const initial = username.charAt(0).toUpperCase();

  return (
    <div
      className={[
        "shrink-0 border-2 border-default overflow-hidden",
        "flex items-center justify-center font-mono font-bold",
        "text-default bg-black",
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {src ? (
        <img
          src={src}
          alt={username}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}
