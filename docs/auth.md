# Auth & Sécurité Backend

## Stack

- **NestJS** — framework backend
- **Prisma** — ORM PostgreSQL
- **bcrypt** — hash des mots de passe
- **JWT (passport-jwt)** — authentification sans session
- **@nestjs/throttler** — rate limiting

---

## Flux d'authentification

### Register `POST /api/auth/register`

```
Client → ValidationPipe (DTO) → AuthController → AuthService → UsersService → Prisma
```

1. `ValidationPipe` valide le body via `RegisterDto` (email valide, password ≥ 8 chars)
2. `UsersService.create()` vérifie que l'email/username n'existe pas déjà
3. Le mot de passe est hashé avec `bcrypt` (coût 10)
4. L'utilisateur est inséré en base — `passwordHash` exclu de la réponse

### Login `POST /api/auth/login`

```
Client → ValidationPipe (DTO) → AuthController → AuthService → UsersService → Prisma
```

1. `UsersService.findByEmail(email, true)` récupère le user **avec** son hash
2. `bcrypt.compare()` compare le mot de passe entré avec le hash stocké
3. Si valide → JWT signé avec `{ sub: userId }` uniquement
4. Token retourné : `{ access_token: "..." }`

### Routes protégées

```
Client (Authorization: Bearer <token>)
  → JwtAuthGuard
  → JwtStrategy.validate()  ← décode le token, récupère userId
  → UsersService.findById() ← charge le user frais depuis la BDD
  → Controller (@CurrentUser() user: SafeUser)
```

---

## Sécurité

### Mots de passe
- Hashés avec **bcrypt** (salt rounds = 10) — irréversible
- `passwordHash` jamais retourné dans les réponses API
- `findByEmail(email, false)` — hash exclu par défaut
- `findByEmail(email, true)` — hash inclus uniquement pour le login

### JWT
- Payload minimal : `{ sub: userId }` — aucune donnée sensible
- Signé avec `JWT_SECRET` (variable d'environnement)
- Expiration configurable via `JWT_SECRET_EXP` (défaut : `24h`)
- À chaque requête, le user est rechargé depuis la BDD — un compte supprimé est immédiatement invalide

### Rate Limiting
- Profil `auth` : **5 requêtes / minute** par IP — appliqué sur `/register` et `/login`
- Profil `api` : **60 requêtes / minute** par IP — appliqué sur les routes protégées
- Constantes centralisées dans `src/common/throttle.constants.ts`

### Validation des inputs
- `ValidationPipe({ whitelist: true })` global — champs non déclarés dans le DTO supprimés automatiquement
- `RegisterDto` : username (string), email (format email), password (string, min 8 chars)
- `LoginDto` : email (format email), password (string)
- Erreurs retournées en clés i18n (`USER_ALREADY_EXISTS`, `INVALID_CREDENTIALS`) — traduction côté frontend

### Injection SQL
- Protégé nativement par Prisma via requêtes paramétrées
- Ne jamais utiliser `$queryRaw` avec des données utilisateur non sanitisées

---

## Structure des fichiers

```
src/
  auth/
    auth.controller.ts     — routes : register, login, me
    auth.service.ts        — logique : register, login, validateUser
    auth.module.ts         — assemblage du module
    jwt.strategy.ts        — validation du token JWT
    jwt-auth.guard.ts      — guard pour protéger les routes
    dto/
      register.dto.ts      — validation du body register
      login.dto.ts         — validation du body login
      index.ts             — barrel file
  users/
    users.service.ts       — create, findByEmail, findById
    users.module.ts        — module exportant UsersService
  common/
    current-user.decorator.ts  — @CurrentUser() extrait req.user
    throttle.constants.ts      — constantes de rate limiting
    types.ts                   — SafeUser (user sans passwordHash)
  prisma/
    prisma.service.ts      — wrapper PrismaClient + connexion
    prisma.module.ts       — module global
```

---

## Variables d'environnement requises

| Variable | Description | Exemple |
|---|---|---|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://user:pass@postgresql:5432/db` |
| `JWT_SECRET` | Clé secrète pour signer les tokens | chaîne aléatoire longue |
| `JWT_SECRET_EXP` | Durée de vie du token | `24h` |

---

## À implémenter (prochaines branches)

- OAuth 2.0 (Google, GitHub, 42) via Passport.js
- Refresh tokens
- Endpoints profil (`PATCH /users/me`, `GET /users/:id`)
