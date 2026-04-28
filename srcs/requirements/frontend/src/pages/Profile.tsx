import { useParams } from "react-router-dom";

import { Btn, Container, Heading, Text, Avatar } from "../components";
import { PageLayout } from "../layout";
import { StatCard, StatItem, StatDivider } from "../components";
//import bobImg from "../assets/bob.png";

export default function Profile() {
  {/* TODO juste pour le test */}
  const { username } = useParams<{ username?: string }>();
  const displayName = username ?? "username";

  return (
    <PageLayout maxWidth="max-w-lg">
      <div className="flex flex-col gap-6">

        <div className="flex flex-col sm:flex-row items-start gap-5">
          <Avatar username={displayName} size="xl" />
          {/*<Avatar username="username" src={bobImg} size="xl" />*/}

          <div className="flex flex-col gap-4 flex-1">
            <div>
              <Heading level={1}>{displayName}</Heading>
              <Text variant="muted" size="xs">created on 2026/01/01</Text>
            </div>
            <div className="flex flex-wrap gap-2">
              <Btn size="sm" variant="primary">+ Add friend</Btn>
              <Btn size="sm" variant="secondary">Message</Btn>
              <Btn size="sm" variant="danger">- Remove friend</Btn>
            </div>
          </div>
        </div>

        <Container label="bio" variant="panel">
          <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
        </Container>

        <StatCard label="statistics">
          <StatItem label="Rank" value="#42" accent/>
          <StatDivider />
          <StatItem label="Avg WPM" value="98"/>
          <StatDivider />
          <StatItem label="Level" value="13"/>
          <StatDivider />
          <StatItem label="played" value="26"/>
        </StatCard>

        <Container label="history">
          <Text variant="muted">No game played.</Text>
        </Container>

      </div>
    </PageLayout>
  );
}
