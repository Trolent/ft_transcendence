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