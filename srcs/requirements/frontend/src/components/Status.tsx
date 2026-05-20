interface StatusProps {
  status: string; // ONLINE, IN_GAME, OFFLINE
}

export function Status({ status }: StatusProps) {
  const colors: Record<string, string> = {
    ONLINE: "bg-green-500",
    IN_GAME: "bg-yellow-500",
    OFFLINE: "bg-gray-500",
  };

  return (
    <span className={`inline-block w-3 h-3 rounded-full align-middle ${colors[status] || colors.OFFLINE}`} />
  );
}