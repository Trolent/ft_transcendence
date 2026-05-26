import { Heading, Text, PageLayout } from "@/components";

export default function Privacy() {
  return (
    <PageLayout>
      <Heading level={2}>Privacy</Heading>
      <Text variant="dim">Nous utilisons les services PostgreSQL et Prisma pour collecter vos données qui sont les suivants : nom d'utilisateur et adresse e-mail.</Text>
    </PageLayout>
  );
}
