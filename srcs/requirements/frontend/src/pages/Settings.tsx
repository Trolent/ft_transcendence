import { Heading, Text } from "../components";
import Container from "../components/Container";
import { PageLayout } from "../layout";
import { useContext, useState } from "react";
import { BioContext } from "../App";

export default function Settings() {
  const { bio, setBio } = useContext(BioContext);
  const [editing, setEditing] = useState(false);

  return (
    <PageLayout maxWidth="max-w-lg">
      <Heading level={2}>SETTINGS</Heading>
        <div className="mt-3 flex-col hover:opacity-80">
          <Container variant="panel">
            <Text>Edit bio</Text>
            <div className="edit-bio">
              <Container variant="terminal" onClick={() => setEditing(true)}>
                {editing
                  ? <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
                  : <Text>{bio}</Text>
                }
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
            <label>
              <Text>Language</Text> {' '}
              <select>
                <option value="Français">Français</option>
                <option value="English">English</option>
              </select>
            </label>
          </Container>
        </div>
    </PageLayout>
  );
}
