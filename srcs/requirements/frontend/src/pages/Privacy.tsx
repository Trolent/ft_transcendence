import { Heading, Text } from "../components";
import { PageLayout } from "../layout";

export default function Privacy() {
  return (
    <PageLayout>
      <Heading level={2}>Privacy</Heading>
      <Text variant="dim">Nous utilisons les services PostgreSQL et Prisma pour collecter vos données qui sont les suivants : nom d'utilisateur et adresse e-mail.</Text>
    </PageLayout>
  );
}
