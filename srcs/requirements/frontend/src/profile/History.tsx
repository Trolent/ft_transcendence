import { Container, Text } from "@/components";
import type { HistoryEntry } from "@/api/users";

interface HistoryProps {
  history: HistoryEntry[];
}

export default function History({ history }: HistoryProps) {
  return (
    <Container label="history">
      {history.length === 0 ? (
        <Text variant="muted">No game played.</Text>
      ) : (
        <div className="flex flex-col gap-2">
          {history.map((entry) => (
            <div key={entry.match.id} className="flex justify-between text-sm">
              <Text size="sm" variant="muted">
                {entry.finishedAt
                  ? new Date(entry.finishedAt).toLocaleDateString("fr-CA")
                  : "—"}
              </Text>
              <Text size="sm">{entry.wpm != null ? `${Math.round(entry.wpm)} WPM` : "—"}</Text>
              <Text size="sm">{entry.accuracy != null ? `${Math.round(entry.accuracy)}%` : "—"}</Text>
              <Text size="sm" variant="muted">#{entry.position ?? "—"}</Text>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
