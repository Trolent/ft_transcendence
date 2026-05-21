import { Heading, Text, Label, Btn } from "../components";
import Container from "../components/Container";
import { PageLayout } from "../layout";
import { useState } from "react";

export default function Settings() {
  const [editing, setEditing] = useState(false);
  //temp
  let [bio, setBio] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");

  return (
    <PageLayout maxWidth="max-w-lg">
      <Heading level={3} className="mt-10 sm:mt-0 sm:text-2xl sm:tracking-[0.2em]">SETTINGS</Heading>
      <Container variant="panel" label="Edit bio" className="mt-3 flex-col">
        <Container variant="terminal" onClick={() => setEditing(true)} className="mt-3">
          {editing
            ? (
            <Container variant="default" className="flex flex-col gap-2 w-full border-none">
              <textarea 
                autoFocus
                className="w-full bg-transparent outline-none resize-none"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </Container>
            ) : (
            <Text>{bio || "DEFAULT_BIO"}</Text>
          )}
        </Container>
          {editing && (
            <Container variant="panel" className="pb-0 flex justify-end w-full items-bottom border-none">
              <Btn size="sm" variant="primary" onClick={(e) => {
                e.stopPropagation();
                setEditing(false);
              }}>
                Save
              </Btn>
            </Container>
          )}
      </Container>

      <Container variant="panel" className="mt-3 flex w-full hover:opacity-80">
        <Label>Manage account</Label>
      </Container>

      <Container variant="panel" className="mt-3 flex items-center justify-between w-full gap-4 p-4 hover:opacity-80">
        <Label>Game mode</Label>
        <Btn size="sm" variant="primary">Normal</Btn>
      </Container>

      <Container variant="panel" className="mt-3 flex w-full hover:opacity-80 flex items-center justify-between w-full gap-4 p-4">
        <Label>Language</Label>
        <select className="bg-black border border-default text-default font-mono text-sm px-2 py-1 outline-none cursor-pointer">
            <option value="English">English</option>
            <option value="Français">Français</option>
            <option value="Español">Español</option>
          </select>
      </Container>

      <Container variant="danger" className="mt-6 flex w-fit hover:opacity-80 py-2">
        <Label>
          <div className="text-danger">Delete account</div>
        </Label>
      </Container>
    </PageLayout>
  );
}
