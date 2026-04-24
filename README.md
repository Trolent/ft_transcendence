# Typerun
42's transcendence project

## Instructions

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Setup

1. Clone the repository
2. Copy the environment file and fill in your values:
   ```bash
   cp .env.example .env
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
