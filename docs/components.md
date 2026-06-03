# Reusable Components

### Btn
- Props:
  - `as?`
  - `variant?`: `primary | secondary | ghost | danger`
  - `size?`: `sm | md | lg`
  - `className?`
  - Native element props
- Example:
```tsx
<Btn variant="primary" size="md">Click me</Btn>
```

### Container
- Props:
  - `variant?`: `default | panel | terminal`
  - `label?`
  - `className?`
  - Native div props
- Example:
```tsx
<Container variant="panel" label="Info">
  <Text>Content here</Text>
</Container>
```

### Input
- Props:
  - `variant?`: `default | ghost`
  - `label?`
  - `error?`
  - `className?`
  - Native input props
- Example:
```tsx
<Input label="Username" placeholder="Enter username" />
```

### Alert
- Props:
  - `variant?`: `info | success | warning | error`
  - `tag?`
  - `hidable?`
  - `onHide?`
  - `className?`
  - Native div props
- Example:
```tsx
<Alert variant="success">Operation successful!</Alert>
```

### Heading
- Props:
  - `level?`: `1 | 2 | 3 | 4 | 5`
  - `className?`
  - Native heading props
- Example:
```tsx
<Heading level={1}>Main Title</Heading>
```

### Text
- Props:
  - `variant?`: `default | dim | muted | accent | error | prompt`
  - `size?`: `xs | sm | base`
  - `as?`
  - `className?`
  - Native element props
- Example:
```tsx
<Text variant="default" size="sm">Some text</Text>
```

### Label
- Props:
  - `htmlFor?`
  - `className?`
  - Native span/label props
- Example:
```tsx
<Label htmlFor="field">Field Label</Label>
```

### AuthForm
- Props:
  - `mode?`: `login | register`
  - `error?`
  - `loading?`
  - `onSubmit?`
- Example:
```tsx
<AuthForm mode="login" onSubmit={(data) => handleAuth(data)} />
```

### List
- Props:
  - `items`
  - `renderItem`
  - `className?`
  - `containerVariant?`
  - `getItemClassName?`
- Example:
```tsx
<List items={users} renderItem={(user) => <div>{user.name}</div>} />
```

### StatCard
- Props:
  - `label?`
  - `children`
  - `variant?`
- Example:
```tsx
<StatCard label="Statistics">
  <StatItem label="Rank" value="#42" accent />
  <StatDivider />
  <StatItem label="Score" value="100" />
</StatCard>
```

### StatItem
- Props:
  - `label`
  - `value`
  - `accent?`
- Example:
```tsx
<StatItem label="Wins" value="42" />
```

### Avatar
- Props:
  - `username`
  - `src?`
  - `size?`: `sm | md | lg | xl`
  - `className?`
- Example:
```tsx
<Avatar username="john" size="md" />
```

### TextArea
- Props:
  - `variant?`: `default | ghost`
  - `label?`
  - `error?`
  - `className?`
  - `rows?`
  - Native textarea props
- Example:
```tsx
<TextArea label="Message" placeholder="Type here" rows={4} />
```

### Pagination
- Props:
  - `currentPage`
  - `totalPages`
  - `onPageChange`
  - `className?`
  - Native div props
- Example:
```tsx
<Pagination currentPage={1} totalPages={5} onPageChange={(page) => setPage(page)} />
```

### Status
- Props:
  - `status`: `ONLINE | IN_GAME | OFFLINE`
  - `hoverText?`
- Example:
```tsx
<Status status="ONLINE" hoverText="User is online" />
```

### LanguageSwitcher
- Props:
  - `variant?`: `navbar | settings`
- Example:
```tsx
<LanguageSwitcher variant="navbar" />
```

### Modal
- Props:
  - `isOpen`
  - `onClose`
  - `title?`
  - `className?`
  - Native div props
- Example:
```tsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm">
  <Text>Are you sure?</Text>
</Modal>
```

### FindUser
- Props:
  - `onAction`
  - `className?`
- Example:
```tsx
<FindUser onAction={(username) => addFriend(username)} />
```

### ProgressBar
- Props:
  - `value`
  - `label?`
  - `max?`
  - `color?`: `accent | dim | default | darkgreen | error | muted`
- Example:
```tsx
<ProgressBar value={75} max={100} label="Progress" />
```

### Footer
- Props:
  - none
- Example:
```tsx
<Footer />
```

### Navbar
- Props:
  - none
- Example:
```tsx
<Navbar />
```

### PageLayout
- Props:
  - `children`
  - `maxWidth?`
  - `centerY?`
- Example:
```tsx
<PageLayout maxWidth="max-w-md" centerY>
  <Heading level={1}>Title</Heading>
</PageLayout>
```

### PageWithSidebar
- Props:
  - `children`
  - `sidebar`
  - `maxWidth?`
  - `fillHeight?`
  - `sidebarFull?`
  - `centerContent?`
- Example:
```tsx
<PageWithSidebar sidebar={<Sidebar>Menu</Sidebar>}>
  <div>Main content</div>
</PageWithSidebar>
```

### Sidebar
- Props:
  - `children`
  - `variant?`: `default | panel | terminal | null`
- Example:
```tsx
<Sidebar variant="default">
  <Text>Sidebar content</Text>
</Sidebar>
```
