# 🏗️ Architecture Technique - Projet TypeRacer

## 🛠️ 1. Stack Technique
- **Frontend :** React + Vite (Build ultra-rapide et optimisation pour la prod) + Tailwind CSS
- **Backend :** NestJS + WebSockets (Socket.io)
- **Base de données :** PostgreSQL + Prisma ORM
- **Infrastructure :** Docker (Containers : Front, Back, DB, et Nginx)

## 🌐 2. Vue d'ensemble (High-Level)
L'application suit une architecture Client-Serveur séparée avec une communication hybride :
- **HTTP/REST** : Pour les opérations classiques (Auth OAuth/JWT, CRUD Profil, Historique).
- **WebSockets** : Pour le temps réel (Moteur de jeu, Chat en direct, Statuts en ligne).
- **Reverse Proxy (Nginx)** : Gère le routage en production (redirige `/api` et `/socket.io` vers le back, et le reste vers les fichiers statiques du front construits par Vite).

## 💻 3. Frontend (Client) - `/frontend`
- **Routage** : React Router (Accueil, Profil, Leaderboard, Salons de jeu).
- **Internationalisation** : `react-i18next` (Gestion des langues EN, FR, ES).
- **Design System** : Utilisation de Tailwind CSS pour créer nos composants réutilisables (Boutons, Modales, etc.).
- **Temps Réel** : Client `socket.io-client` connecté aux Gateways du backend.

### 🎨 Design System — Identité Visuelle

**Thème principal : Matrix / Hacker Terminal**
- Fond noir profond, texte et accents en vert phosphorescent
- Effet CRT / cathodique : légère courbure visuelle, scanlines, flicker sur les titres
- Typographie monospace (ex: `JetBrains Mono`, `Share Tech Mono`)
- Effets de glow (`box-shadow`, `text-shadow`) sur les éléments actifs
- Animations de "typing" pour les transitions et chargements

**Système de thèmes (changement de couleur)**
Le thème est piloté par des **variables CSS** définies sur `:root`. Tailwind est configuré pour utiliser ces variables. Changer de thème = modifier une seule variable `--accent` dans le store React.

| Thème | Couleur accent | Ambiance |
|---|---|---|
| Matrix (défaut) | `#00ff41` (vert vif) | Terminal classique |
| Amber | `#ffb000` (ambre) | Vieux moniteur orange |
| Cyan | `#00e5ff` (cyan) | Futuriste / cyberpunk |
| Red | `#ff3131` (rouge) | Danger / alerte |

**10 Composants React du Design System (Module 5)**
1. `Button` — variantes primary/ghost/danger avec glow
2. `Input` — style terminal avec curseur clignotant
3. `Modal` — overlay avec effet blur + bordure accent
4. `Avatar` — photo de profil avec badge de statut (Online/Offline/In-Game)
5. `ProgressBar` — barre de progression de frappe en temps réel
6. `StatCard` — carte affichant WPM, précision, etc.
7. `Leaderboard` — tableau de classement paginé
8. `Badge` — succès débloqués
9. `Toast` — notifications (succès, erreur, info)
10. `LanguageSelector` — sélecteur EN/FR/ES

## ⚙️ 4. Backend (Serveur) - `/backend`
- **Authentification** : 
  - Classique via JWT.
  - Stratégies OAuth 2.0 (Google, GitHub, 42) via Passport.js.
- **Temps Réel (Gateways NestJS)** :
  - `GameGateway` : Synchronisation des frappes, WPM, validation.
  - `ChatGateway` : Messagerie privée et/ou globale.
  - `UserGateway` : Statut en direct des joueurs (Online, In-Game, Offline).
- **Reconnexion** : Si un joueur perd sa connexion WebSocket en cours de partie, le serveur conserve son slot dans la Room pendant un délai (ex: 30s). À la reconnexion, il reçoit l'état courant de la partie et reprend sa progression.

## 🗄️ 5. Base de données & ORM (Aperçu des tables)
- **Utilisateurs & Auth** : `User` (Infos générales, langue), `OAuthAccount` (Pour lier les comptes 42/GitHub sans casser le reste).
- **Social & Chat** : `Friendship` (Système d'amis), `Message` (Historique du chat).
- **Gaming & Stats** : `Match` (La course en elle-même), `MatchResult` (Les scores individuels de chaque joueur pour une course), `Achievement` (Les succès), `UserAchievement` (Qui a débloqué quoi).

## � 6. Endpoints REST (`/api`)

### Auth
| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Inscription classique |
| POST | `/api/auth/login` | Connexion, retourne un JWT |
| GET | `/api/auth/oauth/:provider` | Redirection OAuth (google, github, 42) |
| GET | `/api/auth/oauth/:provider/callback` | Callback OAuth, retourne un JWT |

### Utilisateurs & Profil
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/users/me` | Profil de l'utilisateur connecté |
| PATCH | `/api/users/me` | Modifier son profil (username, langue) |
| POST | `/api/users/me/avatar` | Upload d'avatar (multipart/form-data) |
| GET | `/api/users/:id` | Profil public d'un joueur |
| GET | `/api/users/:id/stats` | Stats WPM, précision, historique des courses |
| GET | `/api/users/search?q=` | Recherche de joueurs par username (avec pagination) |

### Amis
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/friends` | Liste d'amis de l'utilisateur connecté |
| POST | `/api/friends/:userId` | Envoyer une demande d'ami |
| PATCH | `/api/friends/:userId` | Accepter ou bloquer une demande |
| DELETE | `/api/friends/:userId` | Supprimer un ami |

### Leaderboard
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/leaderboard` | Top joueurs triés par WPM moyen (paginé) |

### Matches
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/matches` | Historique des courses de l'utilisateur connecté |
| GET | `/api/matches/search?status=` | Recherche de parties avec filtres |

---

## 📁 7. Stockage des Avatars

- Les avatars uploadés sont stockés dans un **volume Docker nommé** (`avatars_data`) monté sur `/app/uploads` dans le container backend.
- Nginx sert ces fichiers statiques directement via la route `/uploads`.
- Cela garantit la persistance des avatars entre les redémarrages du container.

---

## 🎮 8. Flux d'une partie & Anti-Triche
1. **Lancement** : Le serveur choisit le texte et l'envoie à la Room.
2. **Progression (Heartbeat)** : Le client envoie sa position en continu, le serveur *broadcast* aux autres pour l'affichage fluide.
3. **Validation (Anti-Triche)** : 
   - Le calcul du WPM (Mots par minute) final se fait **côté serveur**, jamais côté client.
   - Le serveur vérifie que le temps de complétion est humainement possible par rapport à la longueur du texte.
4. **Fin de partie** : Dès qu'un joueur finit, son score est validé. Les autres peuvent terminer leur course (ou subir un timeout). Le serveur enregistre tous les résultats via Prisma et clôture la Room.