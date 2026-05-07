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
            <label className="flex justify-between items-center">
              <Text>Game mode</Text>
              <button /*onClick=""*/ className="bg-black border border-default px-4">Normal</button>
            </label>
          </Container>
        </div>
        <div className="mt-3 flex-col hover:opacity-80">
          <Container variant="panel">
            <label className="flex justify-between items-center">
              <Text>Language</Text>
              <select className="bg-black border border-default text-default font-mono text-sm px-2 py-1 outline-none cursor-pointer">
                <option value="English">English</option>
                <option value="Français">Français</option>
              </select>
            </label>
          </Container>
        </div>
    </PageLayout>
  );
}
