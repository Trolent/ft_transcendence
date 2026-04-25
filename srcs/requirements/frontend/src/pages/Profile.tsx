import { Btn, Container, Heading, Text } from "../components";
import { PageLayout } from "../layout";

export default function Profile() {
  return (
    <PageLayout>
      <Heading>Username</Heading>
      <Btn>+ Add as friend</Btn>
      <Btn>- Remove friend</Btn>

      <Text>Bio</Text>

      Leaderboard rank ?
      Average WPM ?
      Account created on ??
      Level??


      <Container label="history"></Container>

    </PageLayout>
  );
}
