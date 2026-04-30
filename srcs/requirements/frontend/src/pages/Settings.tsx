//import { useState } from "react";
import { useAuth } from "../auth";
import { Btn, Heading, Text } from "../components";
import { PageLayout } from "../layout";

export default function Settings() {
    const { logout } = useAuth();
  //const [value, setValue] = useState("");

  return (
    <PageLayout>
      <Heading level={2}>Settings</Heading>
      <Text>This page is protected!!</Text>
      <Btn variant="danger" onClick={logout}>Logout</Btn>
    </PageLayout>
  );
}

