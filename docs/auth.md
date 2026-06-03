# Auth

## Stack
- NestJS
- Prisma (PostgreSQL)
- bcrypt
- JWT (`passport-jwt`)
- `@nestjs/throttler`

## Flow

### Register `POST /api/auth/register`

`Client -> ValidationPipe (RegisterDto) -> AuthController -> AuthService -> UsersService -> Prisma`

1. Validate request body (`email` format, `password` min 8 chars).
2. Check `email` and `username` uniqueness.
3. Hash password with bcrypt (rounds = 10).
4. Insert user in DB (`passwordHash` is never returned).

### Login `POST /api/auth/login`

`Client -> ValidationPipe (LoginDto) -> AuthController -> AuthService -> UsersService -> Prisma`

1. Fetch user with hash (`findByEmail(email, true)`).
2. Verify password with `bcrypt.compare()`.
3. If valid, generate a JWT with minimal payload `{ sub: userId }`.
4. Response: `{ access_token: "..." }`.

### Protected Routes

`Authorization: Bearer <token> -> JwtAuthGuard -> JwtStrategy.validate() -> UsersService.findById() -> Controller (@CurrentUser)`

User is reloaded from the DB on every request.

## Security

### Passwords
- Stored as bcrypt hashes (irreversible).
- `passwordHash` is excluded from API responses.
- Hash is included only for login (`findByEmail(email, true)`).

### JWT
- Minimal payload: `{ sub: userId }`.
- Signed with `JWT_SECRET`.
- Expiration via `JWT_SECRET_EXP` (default: `24h`).
- If the account is deleted, the token becomes unusable (DB check on every request).

### Rate limiting
- `auth` profile: `5 req/min` per IP on `/register` and `/login`.
- `api` profile: `60 req/min` per IP on protected routes.
- Constants: `src/common/throttle.constants.ts`.

### Input validation
- Global `ValidationPipe({ whitelist: true })`.
- `RegisterDto`: `username`, `email`, `password (min 8)`.
- `LoginDto`: `email`, `password`.
- i18n error keys: `USER_ALREADY_EXISTS`, `INVALID_CREDENTIALS`.

### SQL injection
- Prisma uses parameterized queries.
- Avoid `$queryRaw` with unsanitized user input.

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | URL PostgreSQL | `postgresql://user:pass@postgresql:5432/db` |
| `JWT_SECRET` | Secret key used to sign JWTs | long random string |
| `JWT_SECRET_EXP` | Token lifetime | `24h` |
