*This project has been created as part of the 42 curriculum by akdovlet, kpires, jbergero, trolland and axbaudri*

# Typerun
42's transcendence project

## Description

The goal of Transcendence is to create a web application by working as a team. In this project, we made a game called Typerun, where the goal is to type the displayed words as fast as possible until the end of the text. The application supports user authentification, signal management and language change.

## Instructions

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Setup

1. Clone the repository
2. Copy the environment file and fill in your values:
   ```bash
   cp srcs/.env.example srcs/.env
   ```
3. Generate SSL certificates:
   ```bash
   sh nginx/generate-certs.sh
   ```

### Run

```bash
docker compose up --build
```

### Services

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| Database | localhost:5432 |

### Stop

```bash
docker compose down
```

## Resources

make if/else structure in Typescript : https://stackoverflow.com/questions/38810843/how-can-i-write-an-else-if-structure-using-react-jsx-the-ternary-is-not-expr

## Team Information

akdovlet : Backend developper
kpires : Technical Lead
jbergero : Frontend developper, Pull Request reviewer
trolland : Product Manager
axbaudri : Frontend developper

## Project Management

Used tools for project management : Trello
The meetings took place in a Discord channel.

## Technical Stack

Frontend : React, Vite and Tailwind CSS
Backend : NestJS and Websockets
Database : PostgreSQL and Prisma
Infrastructure : Docker (Containers : Backend, Frontend, Nginx and PostgreSQL)

## Features List

Typerun is a real-time multiplayer **typing race** game: players type a displayed text as fast as possible, represented by a car racing down a track.

### Game (core)

- Real-time typing race: type the displayed text/quote, live progress tracking
- Car-racing visuals: race track, one car per player, HUD with WPM and progress
- Multiplayer up to 5 players on separate computers, synced over WebSockets
- Matchmaking / lobby: join queue, wait for other players (~5s), pre-race countdown (~10s), rejoin lock
- Adaptive bots: bots are added when a player is alone; their speed adapts to players' average WPM (with jitter), with a 30–60 WPM fallback
- Performance metrics: WPM (max 250), finishing position, player/bot count
- Anti-cheat / rate-limiting: minimum race duration, minimum chars/sec, minimum interval between progress messages
- Built-in bank of quotes for race texts

### Authentication & accounts

- Registration (username, email, hashed password)
- Login with identifier + password (JWT)
- OAuth 2.0 sign-in via 42
- Logout and current-user (`me`) endpoint
- Rate-limiting (throttling) on auth routes
- Frontend protected/guest routes

### Profile & user settings

- Public profile by username with editable bio
- Uploadable avatar (stored via Cloudinary)
- Settings: change email, password and language
- Player statistics (WPM, etc.)
- Match history
- Paginated user search (advanced search)

### Friends system

- Send / accept / decline friend requests
- View friends list, received and sent requests
- Remove a friend
- Block / unblock users, blocked list
- Check relationship with another user

### Chat

- Real-time private messaging between users (WebSockets)
- Conversation list and new-conversation creation
- New-message notifications
- Tied to user blocking

### Real-time presence

- User status (ONLINE / IN_GAME / OFFLINE) broadcast over WebSockets

### Leaderboard

- Player ranking (by average WPM)
- Pagination, search by name, asc/desc sorting, minimum-level filter

### Gamification — Achievements

- 10 unlockable achievements: First Race 🏁, First Win 🏆, Getting Fast (50 WPM) ⚡, Speed Typist (80) 🔥, Century (100) 💯, Type Master (150) 🚀, Regular (10 races) 🎮, Veteran (50) 🎖️, Podium Hunter 🥇, Social (first friend) 🤝

### Internationalization

- 3 languages: English, French and Spanish

### UI / Design system

- Custom reusable components (Btn, Input, Modal, Avatar, Pagination, Sidebar, Card, Alert, etc.)
- MatrixRain visual effect, responsive layout, multi-browser support
- Terms and Privacy pages

### Technical / infrastructure

- Swagger REST API docs and AsyncAPI WebSocket event docs
- Global rate-limiting via Throttler

## Modules

### Minor modules

- Frontend framawork
- Backend framework
- ORM for the database
- Custom design system with reusable components
- Advanced search
- Support for multiple language (English, French and Spanish)
- Support for additionnal browsers
- Game stats and match history
- Remote authentication with OAuth2.0
- Gamification system to reward users
- Minor custom module and swagger api documentation

### Major modules

- Real-time features with WebSockets
- Interaction between users
- Standard user management and authentication
- Players on separate computers in real-time
- Complete web-based game where users can play against each other
- Game with more than 2 players