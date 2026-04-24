# 🗄️ Base de Données - PostgreSQL & Prisma

## Relations entre tables

- **User** → OAuthAccount (1 → N)
- **User** → Friendship (N:N via initiator/receiver)
- **User** → Message (1 sender → N messages)
- **User** → MatchResult (N:N via MatchResult)
- **Match** → MatchResult (1 → N)
- **User** → UserAchievement (N:N via UserAchievement)
- **Achievement** → UserAchievement (1 → N)

---

## Tables

### `User`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | Integer | PK, auto-incrémenté | Identifiant unique |
| username | String | Unique, obligatoire | Nom d'utilisateur |
| email | String | Unique, obligatoire | Adresse email |
| passwordHash | String | Nullable | Null si connexion OAuth uniquement |
| avatarUrl | String | Nullable | URL de l'avatar uploadé |
| language | Enum (EN, FR, ES) | Défaut : EN | Langue préférée |
| status | Enum (ONLINE, IN_GAME, OFFLINE) | Défaut : OFFLINE | Statut en temps réel |
| createdAt | DateTime | Auto : now() | Date de création du compte |
| updatedAt | DateTime | Auto : mise à jour | Date de dernière modification |

---

### `OAuthAccount`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | Integer | PK, auto-incrémenté | Identifiant unique |
| provider | String | Obligatoire | Fournisseur OAuth : "google", "github" ou "42" |
| providerId | String | Obligatoire | ID retourné par le fournisseur OAuth |
| userId | Integer | FK → User.id (Cascade) | Lien vers l'utilisateur |

> Contrainte d'unicité : (provider + providerId) — un compte OAuth unique par fournisseur.

---

### `Friendship`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | Integer | PK, auto-incrémenté | Identifiant unique |
| initiatorId | Integer | FK → User.id (Cascade) | Utilisateur qui envoie la demande |
| receiverId | Integer | FK → User.id (Cascade) | Utilisateur qui reçoit la demande |
| status | Enum (PENDING, ACCEPTED, BLOCKED) | Défaut : PENDING | État de la relation |
| createdAt | DateTime | Auto : now() | Date de la demande |

> Contrainte d'unicité : (initiatorId + receiverId) — évite les doublons.

---

### `Message`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | Integer | PK, auto-incrémenté | Identifiant unique |
| content | String | Obligatoire | Contenu du message |
| senderId | Integer | FK → User.id (Cascade) | Expéditeur |
| receiverId | Integer | Obligatoire | Destinataire |
| sentAt | DateTime | Auto : now() | Date d'envoi |

---

### `Match`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | Integer | PK, auto-incrémenté | Identifiant unique |
| textSnippet | String | Obligatoire | Texte à taper pendant la course |
| startedAt | DateTime | Auto : now() | Date de début |
| endedAt | DateTime | Nullable | Date de fin (null si en cours) |
| status | Enum (WAITING, IN_PROGRESS, FINISHED, CANCELLED) | Défaut : WAITING | État de la partie |

---

### `MatchResult`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | Integer | PK, auto-incrémenté | Identifiant unique |
| matchId | Integer | FK → Match.id (Cascade) | Lien vers la partie |
| userId | Integer | FK → User.id (Cascade) | Lien vers le joueur |
| wpm | Float | Nullable | Mots par minute — calculé côté serveur |
| accuracy | Float | Nullable | Précision en % — calculée côté serveur |
| position | Integer | Nullable | Classement final dans la course |
| finishedAt | DateTime | Nullable | Moment où le joueur a terminé |

> Contrainte d'unicité : (matchId + userId) — un seul résultat par joueur par match.

---

### `Achievement`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | Integer | PK, auto-incrémenté | Identifiant unique |
| key | String | Unique, obligatoire | Clé technique ex: "FIRST_WIN", "SPEED_DEMON" |
| label | String | Obligatoire | Nom affiché |
| description | String | Obligatoire | Description du succès |
| iconUrl | String | Nullable | URL de l'icône |

---

### `UserAchievement`
| Champ | Type | Contrainte | Description |
|---|---|---|---|
| id | Integer | PK, auto-incrémenté | Identifiant unique |
| userId | Integer | FK → User.id (Cascade) | Lien vers le joueur |
| achievementId | Integer | FK → Achievement.id (Cascade) | Lien vers le succès |
| unlockedAt | DateTime | Auto : now() | Date de débloquage |

> Contrainte d'unicité : (userId + achievementId) — un succès débloqué une seule fois.

---

## Notes importantes

- Le host de la base de données dans l'URL de connexion est `postgresql` (nom du service Docker), pas `localhost`.
- `wpm` et `accuracy` dans `MatchResult` ne sont **jamais envoyés par le client** — ils sont calculés et écrits uniquement par le serveur (anti-triche).
- Le leaderboard est calculé dynamiquement depuis `MatchResult` (tri par `wpm` moyen) — pas de table dédiée nécessaire.
- Le classement d'un joueur est son `position` moyen ou son `wpm` moyen sur l'ensemble de ses `MatchResult`.
