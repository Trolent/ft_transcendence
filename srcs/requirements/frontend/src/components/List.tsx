import Container from "./Container";

interface ListItem {
  id: string | number;
  [key: string]: unknown;
}

interface ListProps<T extends ListItem> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function List<T extends ListItem>({
  items,
  renderItem,
  className = "",
}: ListProps<T>) {
  return (
    <ul className={["flex flex-col gap-2", className].join(" ")}>
      {items.map((item, index) => (
        <li key={item.id}>
          <Container>{renderItem(item, index)}</Container>
        </li>
      ))}
    </ul>
  );
}
