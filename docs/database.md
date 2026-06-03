# Database Schema

**PK**: Primary Key – **FK**: Foreign Key – **Cascade delete**: record is automatically deleted when the referenced record is deleted.

### User

| **Field**             | **Type**                        |
|-----------------------|---------------------------------|
| id                    | Integer PK                      |
| username              | String, unique                  |
| email                 | String, unique                  |
| passwordHash          | String?                         |
| avatarUrl             | String?                         |
| bio                   | String?                         |
| language              | Enum (EN, FR, ES)               |
| status                | Enum (ONLINE, IN_GAME, OFFLINE) |
| createdAt / updatedAt | DateTime                        |

### OAuthAccount

| **Field**  | **Type**   |
|------------|------------|
| id         | Integer PK                          |
| provider   | Enum (QuaranteDeux)                 |
| providerId | String                              |
| userId     | FK → User (cascade delete)          |

### Achievement

| **Field**   | **Type**       |
|-------------|----------------|
| id          | Integer PK     |
| key         | String, unique |
| label       | String         |
| description | String         |
| icon        | String?        |

### UserAchievement

| **Field**     | **Type**                          |
|---------------|-----------------------------------|
| id            | Integer PK                        |
| userId        | FK → User (cascade delete)        |
| achievementId | FK → Achievement (cascade delete) |
| unlockedAt    | DateTime                          |

### Friendship

| **Field**   | **Type**                                |
|-------------|-----------------------------------------|
| id          | Integer PK                              |
| initiatorId | FK → User (cascade delete)              |
| receiverId  | FK → User (cascade delete)              |
| status      | Enum (PENDING, ACCEPTED, BLOCKED)       |
| createdAt   | DateTime                                |

### Message

| **Field**  | **Type**                   |
|------------|----------------------------|
| id         | Integer PK                 |
| content    | String                     |
| senderId   | FK → User (cascade delete) |
| receiverId | FK → User (cascade delete) |
| sentAt     | DateTime                   |

### Match

| **Field**   | **Type**                                         |
|-------------|--------------------------------------------------|
| id          | Integer PK                                       |
| textSnippet | String                                           |
| startedAt   | DateTime                                         |
| endedAt     | DateTime?                                        |
| status      | Enum (WAITING, IN_PROGRESS, FINISHED, CANCELLED) |

### MatchResult

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
