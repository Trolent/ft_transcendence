import { useState } from "react";
import { Alert, Btn, Container, Heading, Input, Label, Text } from "../components";
import { PageLayout } from "../layout";

export default function Demo() {
  const [value, setValue] = useState("");

  return (
    <PageLayout>
        {/* Headings */}
        <Container label="Headings">
          <div className="flex flex-col gap-3">
            <Heading level={1}>Heading h1</Heading>
            <Heading level={2}>Heading h2</Heading>
            <Heading level={3}>Heading h3</Heading>
            <Heading level={4}>Heading h4</Heading>
          </div>
        </Container>

        {/* Texts + Label */}
        <Container label="Texts">
          <div className="flex flex-col gap-2">
            <Text variant="default">default</Text>
            <Text variant="dim">dim</Text>
            <Text variant="muted">muted</Text>
            <Text variant="accent">accent</Text>
            <Text variant="error">error</Text>
            <Text variant="prompt">prompt</Text>
            <Text size="xs">Extra small</Text>
            <Text size="sm">small</Text>
            <Label>Label</Label>
          </div>
        </Container>

        {/* Buttons */}
        <Container label="Buttons">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-start gap-3">
              <Btn variant="primary">primary</Btn>
              <Btn variant="secondary">secondary</Btn>
              <Btn variant="ghost">ghost</Btn>
              <Btn variant="danger">danger</Btn>
            </div>
            <div className="flex flex-wrap items-start gap-3">
              <Btn size="sm">small</Btn>
              <Btn size="md">medium</Btn>
              <Btn size="lg">large</Btn>
            </div>
            <div className="flex flex-wrap items-start gap-3">
              <Btn variant="primary" disabled>disabled primary</Btn>
              <Btn variant="secondary" disabled>disabled secondary</Btn>
              <Btn variant="danger" disabled>disabled danger</Btn>
            </div>
          </div>
        </Container>

        {/* Input */}
        <Container label="Input">
          <div className="flex flex-col gap-4 max-w-sm">
            <Input
              label="Default"
              placeholder="type something here"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Input
              variant="ghost"
              label="Ghost"
              placeholder="ghost"
            />
            <Input
              label="error"
              placeholder="error"
              defaultValue="error"
              error="This field is required"
            />
            <Input label="Disabled" placeholder="disabled" disabled />
          </div>
        </Container>

        {/* Alerts */}
        <Container label="Alerts">
          <div className="flex flex-col gap-3">
            <Alert variant="info">An information</Alert>
            <Alert variant="success">Congratulations!</Alert>
            <Alert variant="warning">Be careful!</Alert>
            <Alert variant="error">It's broken!</Alert>
            <Alert variant="info" hidable>Can be hidden</Alert>
            <Alert variant="success" tag="CUSTOM">Custom tag.</Alert>
          </div>
        </Container>

        {/* Containers */}
        <Container label="Containers">
          <div className="flex flex-col gap-6">
            <Container variant="default" label="default">
              <Text variant="muted">variant default</Text>
            </Container>
            <Container variant="panel" label="panel">
              <Text variant="dim">variant panel</Text>
            </Container>
            <Container variant="terminal" label="terminal">
              <Text variant="prompt">variant terminal</Text>
            </Container>
          </div>
        </Container>

    </PageLayout>
  );
}

