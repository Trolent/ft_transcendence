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

      <Container variant="panel" label="Manage account" className="mt-3 flex w-full justify-center hover:opacity-80">
        <div className="flex gap-20 text-sm">
          <Container variant="terminal" className="py-1">CHANGE EMAIL</Container>
          <Container variant="terminal" className="py-1">CHANGE PASSWORD</Container>
        </div>
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

      <button type="button" variant="danger" className="mt-6 flex border border-danger w-fit hover:opacity-80 py-2 px-4">
        <Label>
          <div className="text-danger">Delete account</div>
        </Label>
      </button>
    </PageLayout>
  );
}
