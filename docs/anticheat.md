# 🛡️ Anti-Triche — Course Multijoueur

## 📋 Contexte

Les événements WebSocket `player_progress` sont entièrement contrôlés par le client.
Sans validation côté serveur, un joueur malveillant peut envoyer `chars = longueur_du_texte`
dès le premier message et remporter la course instantanément — obtenant la position 1
même avec un WPM nul en base de données.

L'anti-triche est implémenté **uniquement côté serveur**. Le frontend ne participe pas
à la validation : tout ce qu'un client envoie peut être falsifié (DevTools, proxy,
script externe), donc le serveur est la seule source de vérité.

---

## 🔒 Couches de protection

Les cinq couches s'appliquent dans l'ordre suivant à chaque message `player_progress` :

```
Socket client
    │  player_progress { chars, … }
    ▼
GameGateway.handleProgress()
    ├─ 1. ValidationPipe        ← rejette les valeurs non-entières ou négatives
    ├─ 2. Limiteur de débit     ← ignore si < PROGRESS_MIN_INTERVAL_MS depuis le dernier message accepté
    └─ GameService.updateProgress()
           ├─ 3. Vérification monotone  ← ignore si chars < p.chars (recul interdit)
           ├─ 4. Plafond de vitesse     ← limite à ce que MAX_WPM permet en temps écoulé
           └─ 5. Plafond absolu         ← limite à la longueur du texte
               → diffusion race_update
```

---

## ⚙️ Détail de chaque couche

### 1. Validation du payload — DTO (Data Transfer Object)

**Fichier :** `src/game/dto/player-progress.dto.ts`

```ts
export class PlayerProgressDto {
  @IsInt()
  @Min(0)
  chars: number;
}
```

Appliqué via `@UsePipes(new ValidationPipe({ whitelist: true }))` sur le handler.

- `@IsInt()` — rejette toute valeur non entière (`"hello"`, `3.7`, `null`, etc.)
- `@Min(0)` — rejette les valeurs négatives
- `whitelist: true` — supprime silencieusement tout champ inconnu du payload
  (ex. `accuracy` est envoyé par le client mais retiré ici ; il n'atteint jamais le service)

Si la validation échoue, le handler n'est pas exécuté. Aucune erreur n'est renvoyée
au client — le message est simplement ignoré.

**Pourquoi un DTO plutôt que des vérifications manuelles ?**

Sans DTO, il faudrait écrire chaque vérification à la main :

```ts
if (typeof payload?.chars !== 'number') return;
if (!Number.isInteger(payload.chars)) return;
if (payload.chars < 0) return;
// et ainsi de suite pour chaque champ...
```

Le DTO remplace tout ça par des règles déclaratives — on décrit ce qu'une valeur
valide *doit être*, NestJS se charge de le vérifier avant même d'appeler le handler.
Si le payload évolue (ajout d'un champ), il suffit d'ajouter un décorateur dans le DTO
plutôt que d'allonger une chaîne de `if`.

L'autre apport est `whitelist: true` : tout champ non déclaré dans le DTO est supprimé
automatiquement. Sans ça, `{ chars: 50, accuracy: 95, champInconnu: "..." }` arriverait
intact dans le service.

---

### 2. Limiteur de débit (rate limiting)

**Fichier :** `src/game/game.gateway.ts`

```ts
const now = Date.now();
const last = this.lastProgress.get(client.id) ?? 0;
if (now - last < PROGRESS_MIN_INTERVAL_MS) return;
this.lastProgress.set(client.id, now);
```

**Constante :** `PROGRESS_MIN_INTERVAL_MS = 200` ms (`src/common/game.constant.ts`)

- Un seul message `player_progress` est traité toutes les 200 ms par socket
- Les messages en excès sont silencieusement ignorés (aucune réponse d'erreur,
  pour ne pas permettre à un script de calibrer son timing)
- La Map `lastProgress` est nettoyée à la déconnexion pour éviter les fuites mémoire

**Pourquoi 200 ms ?** Le ticker de bots tourne toutes les 250 ms. Un joueur légitime
tapant rapidement reste largement dans cette fenêtre. Un script envoyant des centaines
de messages par seconde se retrouve limité à 5/s — suffisant pour empêcher le flood
sans affecter le jeu normal.

---

### 3. Vérification monotone

**Fichier :** `src/game/game.service.ts` — `updateProgress()`

```ts
if (chars < p.chars) return null;
```

`p.chars` est le nombre de caractères corrects déjà enregistrés pour ce joueur.
Si la nouvelle valeur est inférieure, le message est ignoré.

Un joueur ne peut pas reculer. Ce n'est pas un vecteur d'attaque utile en soi,
mais c'est un invariant du jeu : la progression est toujours croissante.

---

### 4. Plafond de vitesse (speed gate)

**Fichier :** `src/game/game.service.ts` — `updateProgress()`

```ts
const elapsedSec = (Date.now() - room.startedAt!) / 1000;
const maxReachable = Math.ceil(elapsedSec * (MAX_WPM * 5 / 60));
```

**Constante :** `MAX_WPM = 250` (`src/common/game.constant.ts`)

C'est la protection principale contre la victoire instantanée.

**Formule :**
- 1 "mot" en WPM = 5 caractères (standard international)
- 250 WPM = 250 × 5 = 1 250 caractères/minute = ~20,8 caractères/seconde
- Après 3 secondes : `maxReachable = ceil(3 × 20,8) = 63 caractères`

Si un client envoie `chars = 9999` après 3 secondes, la valeur acceptée est
`min(9999, longueur_texte, 63)` — soit 63. La voiture avance jusqu'à la position
correspondant à 63 caractères, pas à 100 %.

`room.startedAt` est garanti non-null à ce stade car la fonction retourne `null`
plus tôt si `!room.startedAt`.

---

### 5. Plafond absolu

**Fichier :** `src/game/game.service.ts` — `updateProgress()`

```ts
const safe = Math.min(chars, room.text.length, maxReachable);
```

Même si les couches précédentes laissaient passer quelque chose, il est impossible
de déclarer plus de caractères corrects que la longueur totale du texte.

---

### Filet de sécurité — zeroing du WPM en base

**Fichier :** `src/game/game.service.ts` — `finalizeRace()`

```ts
wpm: p.wpm > MAX_WPM ? 0 : p.wpm,
```

Si malgré tout un WPM anormalement élevé passe les cinq couches, il est enregistré
à 0 en base de données. Le joueur garde sa position dans la course mais son WPM
n'impacte pas le classement ou les statistiques.

---

## 📁 Fichiers concernés

| Fichier | Rôle |
|---|---|
| `src/common/game.constant.ts` | Constantes `MAX_WPM` et `PROGRESS_MIN_INTERVAL_MS` |
| `src/game/dto/player-progress.dto.ts` | DTO de validation du payload |
| `src/game/game.gateway.ts` | Limiteur de débit + application du DTO |
| `src/game/game.service.ts` | Vérification monotone + plafond de vitesse + plafond absolu |

---

## 🧪 Comment tester

1. Lancer l'application : `make dev`
2. Rejoindre une course multijoueur
3. Exposer temporairement le socket dans `useRaceSocket.ts` :
   ```ts
   (window as any).__gs = socket;
   ```
4. Ouvrir la console du navigateur et tester chaque couche :

| Test | Commande | Résultat attendu |
|---|---|---|
| Victoire instantanée | `__gs.emit("player_progress", { chars: 9999 })` | La voiture n'atteint pas 100 % |
| Flood de messages | `setInterval(() => __gs.emit("player_progress", { chars: 50 }), 10)` | ~5 messages/s traités, avance normale |
| Payload invalide | `__gs.emit("player_progress", { chars: -1 })` | Ignoré silencieusement |
| Type invalide | `__gs.emit("player_progress", { chars: "abc" })` | Ignoré silencieusement |
| Recul | Envoyer `chars=50` puis `chars=30` | Le second message est ignoré |
| Course légitime | Jouer normalement jusqu'à la fin | Progression, placement et WPM corrects |

5. Retirer la ligne `window.__gs` après les tests.
