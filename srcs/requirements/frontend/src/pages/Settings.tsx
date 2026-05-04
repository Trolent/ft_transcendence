import { Heading, Text } from "../components";
import Container from "../components/Container";
import { PageLayout } from "../layout";

export default function Settings() {
  return (
    <PageLayout maxWidth="max-w-lg">
      <Heading level={2}>SETTINGS</Heading>
        <div className="mt-3 flex-col hover:opacity-80">
          <Container variant="panel">
            <Text>Edit bio</Text>
            <div class="edit-bio">
              <Container variant="default">
              Bonjour
            </Container>
            </div>
          </Container>
        </div>
        <div className="mt-3 flex-col hover:opacity-80">
          <Container variant="panel">
            <Text>Game mode</Text>
          </Container>
        </div>
        <div className="mt-3 flex-col hover:opacity-80">
          <Container variant="panel">
            <Text>Language</Text>
          </Container>
        </div>
    </PageLayout>
  );
}
