*This project has been created as part of the 42 curriculum by akdovlet, axbaudri, jbergero, kpires, trolland.*

# Typerun

## Description

Multiplayer real-time typing game built for the 42 group project ft_transcendence: full-stack web application using React, NestJS, PostgreSQL, Tailwind CSS, and Docker.

## Features

* **Game:** singleplayer and multiplayer (2+ players), bots, matchmaking, anti-cheat
* **Friends:** send, accept, and decline friend requests; view friends list
* **Chat:** real-time direct messaging via WebSocket, with history and notifications
* **Leaderboard:** sortable and filterable rankings with pagination
* **Profile:** avatar, bio, statistics, achievements, match history
* **Settings:** change password, email, and default language
* **Status:** real-time status

## Technical Stack

Written in TypeScript.

* **Frontend:** Vite, React
* **Backend:** NestJS
* **ORM:** Prisma
* **Database:** PostgreSQL
* **Reverse proxy:** Nginx
* **Containerization:** Docker, Docker Compose

## Instructions

### Prerequisites

* Docker
* Docker Compose

### Quick Start

Copy `srcs/.env.example` to `srcs/.env` and fill in the values before running any make command.

#### Development

```bash
make dev # build and start containers in dev mode
```

Go to [http://localhost:5173/](http://localhost:5173/)

#### Production

```bash
make # build and start containers
```

The domain is set via `DOMAIN` in `srcs/.env`. Go to `https://$DOMAIN` and accept the self-signed certificate.

#### Cloudflare

Exposes the app publicly via Cloudflare Tunnel.

```bash
make invade-the-web # expose publicly via cloudflare
```

The URL is set via `CLOUDFLARE_DOMAIN` in `srcs/.env`. Go to `https://$CLOUDFLARE_DOMAIN`.


### Commands

| **Command**            | **Description**                        |
|------------------------|----------------------------------------|
| make / make up         | Build and start in production mode     |
| make dev               | Start in development mode              |
| make invade-the-web    | Start in cloud mode                    |
| make down              | Stop all containers                    |
| make re                | Rebuild in production mode             |
| make re-dev            | Rebuild in development mode            |
| make re-invade-the-web | Rebuild in cloud mode                  |
| make seed              | Seed the database with sample data     |
| make seedstress        | Seed with a large data sample          |
| make seedclean         | Remove seed data                       |
| make clean             | Clean build artifacts                  |
| make fclean            | Full clean                             |
| make logs              | Show container logs                    |
| make ps                | List container statuses                |
| make hosts             | Add 127.0.0.1 $DOMAIN to /etc/hosts    |
| make trust-cert        | Trust the self-signed certificate      |

## Modules

### Web

| Module | Type | Points | Implementation | Contributors |
|--------|------|--------|----------------|--------------|
| Frontend Framework (React) | Minor | 1 | SPA with React, Vite, TypeScript, Tailwind and react-router | jbergero |
| Backend Framework (NestJS) | Minor | 1 | REST API, authentication, validation, WebSocket gateways | kpires |
| Real-time Communication (WebSockets) | Major | 2 | Used for chat, matchmaking, game synchronization and status | akdovlet, jbergero, kpires |
| User Interaction System | Major | 2 | Friends system, chat, profiles, status | jbergero, kpires |
| ORM | Minor | 1 | Type-safe database schema and migrations using Prisma | kpires |
| Design System | Minor | 1 | Reusable UI components (Alert, Avatar, Btn, Container, Heading, Label, Input, TextArea, Text, List, Modal, Pagination, AuthForm...) built with Tailwind | jbergero |
| Advanced Search | Minor | 1 | Paginated search with filters | trolland |

**Web subtotal: 9 points**

### Accessibility & Internationalization

| Module | Type | Points | Implementation | Contributors |
|--------|------|--------|----------------|--------------|
| Internationalization (EN/FR/ES) | Minor | 1 | Full i18n support across frontend and backend | kpires |
| Additional Browser Support | Minor | 1 | Tested on Chromium, Safari and Firefox browsers, made fixes for MacOS (scrollbar) | Team |

**Accessibility & Internationalization subtotal: 2 points**

### User Management

| Module | Type | Points | Implementation | Contributors |
|--------|------|--------|----------------|--------------|
| Standard User Management | Major | 2 | Authentication, account settings, password management | kpires, jbergero, axbaudri |
| OAuth 42 Authentication | Minor | 1 | OAuth 2.0 login with 42 provider | kpires |
| Game Statistics & Match History | Minor | 1 | WPM tracking, accuracy, match history | jbergero, kpires, akdovlet |

**User Management subtotal: 4 points**

### Gaming & Experience

| Module | Type | Points | Implementation | Contributors |
|--------|------|--------|----------------|--------------|
| Web-Based Game | Major | 2 | Real-time typing game with matchmaking | akdovlet |
| Multiplayer (>2 Players) | Major | 2 | Multi-user synchronized races | akdovlet |
| Gamification System | Minor | 1 | Achievement system and progression tracking | jbergero, kpires |

**Gaming & Experience subtotal: 5 points**

### Modules of choice

| Module | Type | Points | Implementation | Contributors |
|--------|------|--------|----------------|--------------|
| Anti-Cheat System | Major | 2 | Server-side validation of game actions | akdovlet |
| Public Web Access via Cloudflare Tunnel | Minor | 1 | Securely exposes the application through a public domain with HTTPS without requiring port forwarding | trolland |

**Custom subtotal: 3 points**

### Final Total

| Category | Points |
|----------|--------|
| Web | 9 |
| Accessibility & Internationalization | 2 |
| User Management | 4 |
| Gaming & Experience | 5 |
| Modules of choice | 3 |

**TOTAL: 23 points**

## Individual Contributions

### axbaudri

> **Frontend developer**

* Settings page (form, api call): e-mail, password change, default language
* Redact privacy and terms page content
* Footer
* UX testing

### akdovlet

> **Full-stack developer**

* Game engine
* Game component design
* Bots with randomized WPM
* Multiplayer matchmaking and game logic
* Server-side anti-cheat

### jbergero

> **Full-stack developer, Product Owner (PO)**

* Bootstrap frontend (React, Vite, Tailwind), set up router
* Design system: reusable components (Alert, Avatar, Btn, Container, Heading, Label, Input, TextArea, Text, List, Modal, Pagination, AuthForm...), color palette and layout components
* Auth: implement auth (context, forms, hook, api calls) on the frontend
* Profile, friends system: implement both features on the frontend (api calls, buttons, pages, components...)
* Achievements: full frontend implementation, backend fixes
* Status system: WebSocket frontend, backend fixes, context and hook
* Chat: WebSocket frontend implementation, UI/UX, basic notification system for new messages using WebSocket
* GitHub: CI actions setup, PR reviews, merges, conflict resolution
* Internationalization (i18n): create and edit some translation keys
* Database: made 2 migrations and small schema edits
* Miscellaneous backend fixes and small features

### kpires

> **Full-stack developer, Technical Lead / Architect**

* Backend bootstrap (NestJS), JWT authentication, throttle rate limit, and security (Helmet, CORS, npm patches)
* DB creation, Prisma setup with migrations and schema edits
* Core REST API endpoints: auth, users, friends, leaderboard, settings, and achievements (with auto-unlock)
* Complete OAuth 42 implementation with backup password support
* WebSocket backend implementation for chat, status, and base game backend (with WS hardening and reconnection)
* API documentation (Swagger UI and AsyncAPI viewer)
* Avatar upload integration via Cloudinary
* Docker environment setup (dev/prod) and shell deployment scripts
* Internationalization (i18n) setup and complete frontend translations (EN/FR/ES)
* Frontend UI/UX: responsive design fixes, navbar redesign, matrix rain home page, chat improvements, and blocking mobile devices on game pages
* Frontend features: Leaderboard redesign, profile page (history table), and conditional settings UI (oauth password)
* GitHub: PR and issue reviews

### trolland

> **Full-stack developer, Project Manager (PM)**

* Discord and GitHub automation setup
* Initial project setup
* DevOps: Docker environment setup (dev/prod) and shell deployment scripts
* Cloudflare Tunnel integration for public access
* Database seed system
* Reusable paginated search bar with filters
* Miscellaneous fixes
* GitHub: PR and issue reviews

## Ressources

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [React documentation](https://react.dev/)
- [Vite documentation](https://vite.dev/)
- [devhints.io cheatsheets](https://devhints.io/)
- [quickref.ME cheatsheets](https://quickref.me/)
- [w3schools](https://www.w3schools.com/)
- [patterncraft](https://patterncraft.fun/) for CSS background
- [tailwind CSS documentation](https://tailwindcss.com/docs/)

**AI usage**

- explain concepts
- bug fixes
- repetitive tasks
- redact internal documentation (dev wiki)

## Database Schema

#### User

| **Field**             | **Type**                        |
|-----------------------|---------------------------------|
| id                    | Integer PK                      |
| username              | String, unique                   |
| email                 | String, unique                   |
| passwordHash          | String?                         |
| avatarUrl             | String?                         |
| bio                   | String?                         |
| language              | Enum (EN, FR, ES)               |
| status                | Enum (ONLINE, IN_GAME, OFFLINE) |
| createdAt / updatedAt | DateTime                        |

#### OAuthAccount

| **Field**  | **Type**   |
|------------|------------|
| id         | Integer PK |
| provider   |            |
| providerId |            |
| userId     | FK → User  |

#### Achievement

| **Field**   | **Type**      |
|-------------|---------------|
| id          | Integer PK    |
| key         | String, unique |
| label       | String        |
| description | String        |
| icon        | String?       |

#### UserAchievement

| **Field**     | **Type**                          |
|---------------|-----------------------------------|
| id            | Integer PK                        |
| userId        | FK → User (cascade delete)        |
| achievementId | FK → Achievement (cascade delete) |
| unlockedAt    | DateTime                          |

#### Friendship

| **Field**   | **Type**   |
|-------------|------------|
| id          | Integer PK |
| initiatorId | FK → User  |
| receiverId  | FK → User  |
| status      |            |
| createdAt   | DateTime   |

#### Message

| **Field**  | **Type**                   |
|------------|----------------------------|
| id         | Integer PK                 |
| content    | String                     |
| senderId   | FK → User (cascade delete) |
| receiverId | FK → User (cascade delete) |
| sentAt     | DateTime                   |

#### Match

| **Field**   | **Type**                                         |
|-------------|--------------------------------------------------|
| id          | Integer PK                                       |
| textSnippet | String                                           |
| startedAt   | DateTime                                         |
| endedAt     | DateTime?                                        |
| status      | Enum (WAITING, IN_PROGRESS, FINISHED, CANCELLED) |

#### MatchResult

| **Field**  | **Type**                    |
|------------|-----------------------------|
| id         | Integer PK                  |
| matchId    | FK → Match (cascade delete) |
| userId     | FK → User (cascade delete)  |
| wpm        | Float?                      |
| accuracy   | Float?                      |
| nbPlayers  | Int?                        |
| nbBots     | Int?                        |
| position   | Int?                        |
| finishedAt | DateTime?                   |
