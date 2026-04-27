# Components (Reusable)

Cette documentation décrit les composants réutilisables dans `src/components`.

## Import

```tsx
import {
  Alert,
  AuthForm,
  Avatar,
  Btn,
  Container,
  Heading,
  Input,
  Label,
  List,
  StatCard,
  StatItem,
  StatDivider,
  Text,
} from "./components";
```

## Alert

Affiche un message d'information, succès, warning ou erreur.

### Props

- `variant?: "info" | "success" | "warning" | "error"` (default: `"info"`)
- `tag?: string` (remplace le tag affiché: `INFO`, `OK`, etc.)
- `hidable?: boolean` (default: `false`, affiche un bouton `Close`)
- `onHide?: () => void` (appelé quand l'utilisateur ferme l'alerte)
- Toutes les props HTML d'un `div` (ex: `className`, `id`, `data-*`)

### Exemple

```tsx
<Alert variant="success">Profil mis a jour.</Alert>
<Alert variant="error" hidable onHide={() => console.log("hidden")}>
  Une erreur est survenue
</Alert>
```

## AuthForm

Formulaire d'authentification complet (email + password).

### Props

- `mode?: "login" | "register"` (default: `"login"`)
- `error?: string` (erreur externe affichee dans une `Alert`)
- `onSubmit?: (data: { email: string; password: string }) => void`

### Comportement

- Validation locale:
- email et mot de passe requis
- format email valide
- Affiche une erreur locale si la validation echoue

### Exemple

```tsx
<AuthForm
  mode="register"
  onSubmit={({ email, password }) => {
    console.log(email, password);
  }}
/>
```

## Avatar

Affiche une image de profil ou l'initiale du username.

### Props

- `username: string` (obligatoire)
- `src?: string | null` (image)
- `size?: "sm" | "md" | "lg" | "xl"` (default: `"md"`)
- `className?: string`

### Tailles

- `sm`: 32px
- `md`: 48px
- `lg`: 64px
- `xl`: 96px

### Exemple

```tsx
<Avatar username="jerome" />
<Avatar username="jerome" src="/avatar.jpg" size="lg" />
```

## Btn

Bouton reutilisable avec variantes et tailles.

### Props

- `variant?: "primary" | "secondary" | "ghost" | "danger"` (default: `"primary"`)
- `size?: "sm" | "md" | "lg"` (default: `"md"`)
- Toutes les props HTML d'un `button` (`type`, `disabled`, `onClick`, `className`, etc.)

### Exemple

```tsx
<Btn variant="primary">Valider</Btn>
<Btn variant="secondary" size="sm">Annuler</Btn>
<Btn variant="danger" disabled>Supprimer</Btn>
```

## Container

Bloc visuel reutilisable avec variantes de style et label optionnel.

### Props

- `variant?: "default" | "panel" | "terminal"` (default: `"default"`)
- `label?: string` (petit tag en haut du container)
- Toutes les props HTML d'un `div`

### Exemple

```tsx
<Container variant="panel" label="stats">
  <Text>Contenu</Text>
</Container>
```

## Heading

Titre reutilisable (`h1` a `h4`) avec style terminal.

### Props

- `level?: 1 | 2 | 3 | 4` (default: `1`)
- Toutes les props HTML d'un titre (`className`, etc.)

### Exemple

```tsx
<Heading level={1}>Leaderboard</Heading>
<Heading level={3}>Section</Heading>
```

## Input

Champ texte reutilisable avec variantes et gestion d'erreur visuelle.

### Props

- `variant?: "default" | "ghost"` (default: `"default"`)
- `label?: string` (label integre au composant)
- `error?: string` (message d'erreur affiche sous l'input)
- Toutes les props HTML d'un `input` (`type`, `value`, `onChange`, `placeholder`, `disabled`, etc.)

### Exemple

```tsx
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<Input label="Password" type="password" error="Champ obligatoire" />
```

## Label

Label texte simple pour associer un libelle a un champ.

### Props

- `htmlFor?: string`
- Toutes les props HTML d'un `span`/`label` (`className`, etc.)

### Exemple

```tsx
<Label htmlFor="email">Email</Label>
```

## List

Liste generique pour afficher un tableau d'elements avec un rendu personnalise.

### Props

- `items: T[]` (chaque item doit contenir `id: string | number`)
- `renderItem: (item: T, index: number) => React.ReactNode`
- `className?: string`

### Notes

- Chaque element est encapsule automatiquement dans un `Container`.

### Exemple

```tsx
type User = { id: number; name: string; score: number };

const users: User[] = [
  { id: 1, name: "Ada", score: 1200 },
  { id: 2, name: "Linus", score: 980 },
];

<List
  items={users}
  renderItem={(user) => (
    <div className="flex justify-between">
      <span>{user.name}</span>
      <span>{user.score}</span>
    </div>
  )}
/>
```

## StatCard / StatItem / StatDivider

Composants pour afficher des statistiques en bloc.

### StatCard Props

- `label?: string`
- `children: ReactNode`

### StatItem Props

- `label: string`
- `value: string | number`
- `accent?: boolean` (met la valeur en couleur accent)

### StatDivider

- Pas de props

### Exemple

```tsx
<StatCard label="statistics">
  <StatItem label="Rank" value="#42" accent />
  <StatDivider />
  <StatItem label="Avg WPM" value="98" />
  <StatDivider />
  <StatItem label="Played" value="26" />
</StatCard>
```

## Text

Texte reutilisable avec variantes visuelles, tailles et balise HTML personnalisable.

### Props

- `variant?: "default" | "dim" | "muted" | "accent" | "error" | "prompt"` (default: `"default"`)
- `size?: "xs" | "sm" | "base"` (default: `"sm"`)
- `as?: "p" | "span" | "label" | "li"` (default: `"p"`)
- Toutes les props HTML standard de l'element rendu

### Exemple

```tsx
<Text>Texte par defaut</Text>
<Text variant="muted" size="xs">Texte secondaire</Text>
<Text as="span" variant="accent">Accent</Text>
<Text variant="prompt">Commande prete</Text>
```

## Bonnes pratiques

- Preferer l'import depuis `src/components/index.ts`.
- Utiliser `className` pour des ajustements ponctuels sans dupliquer les composants.
- Garder ces composants "presentational" et mettre la logique metier dans les pages/features.
