import { Container, Text } from "../components";


export default function Play() {
  return (
    <div className="flex flex-1 gap-6">
      <div className="flex-1 flex flex-col gap-10">

       <Text>Hello World!</Text>

      </div>

      <aside className="w-64 shrink-0">
        <Container variant="panel" label="sidebar" className="p-4 h-full">
          <Text>The sidebar</Text>
        </Container>
      </aside>

    </div>
  );
}

