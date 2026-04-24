# 🧩 Infrastructure Technique - Projet TypeRacer

L'ensemble de l'application est orchestré via **Docker Compose**. L'infrastructure est isolée dans un réseau virtuel interne où seul le point d'entrée (Nginx) communique avec l'extérieur.

---

## 1. Reverse Proxy & Serveur Web (Nginx)
C'est la couche de sécurité et d'aiguillage de l'infrastructure.
* **Rôle :** Terminaison des requêtes et routage.
* **Ports exposés :** `80` (HTTP) et `443` (HTTPS).
* **Configuration de routage :**
  * `/` : Sert les fichiers statiques du Frontend (générés par Vite).
  * `/api` : Redirige vers le Backend (NestJS) sur le port interne `3000`.
  * `/socket.io` : Gère l'**Upgrade de protocole** (HTTP vers WebSocket) pour maintenir la connexion bidirectionnelle vers le Backend.
* **Avantage :** Centralise les certificats SSL et résout nativement les problèmes de CORS en présentant une origine unique au navigateur.

## 2. Le Backend (NestJS)
Le moteur logique de l'application.
* **Runtime :** Node.js (Image Docker Alpine pour la légèreté).
* **Ports internes :** `3000` (non exposé à l'hôte).
* **Composants critiques :**
  * **Gateways (Socket.io) :** Gère les salles de jeu (Rooms), la synchronisation en temps réel et le chat.
  * **Prisma Client :** Communique avec la base de données via le protocole `postgresql://`.
  * **Passport.js :** Middleware gérant l'authentification JWT et les stratégies OAuth.

## 3. Le Frontend (React + Vite + Tailwind)
L'interface utilisateur et client de l'application.
* **Mode Développement :** Un conteneur fait tourner le serveur Vite avec **HMR (Hot Module Replacement)** via un volume lié au code source local.
* **Mode Production :** Utilisation d'un "Multi-stage build". Le code est compilé, et seuls les fichiers statiques optimisés (HTML/JS/CSS) sont conservés et servis par le conteneur Nginx.
* **Communication :** Effectue des appels API standards vers `/api` et maintient une connexion WebSocket via `/socket.io`.

## 4. La Base de Données (PostgreSQL)
Le stockage persistant, robuste et relationnel.
* **Image :** `postgres:latest` (ou version spécifique LTS).
* **Port interne :** `5432` (strictement fermé à l'extérieur).
* **Sécurité :** Aucun port exposé sur l'hôte physique. Seul le conteneur Backend y a accès via le réseau Docker.

---

## 🌐 Gestion du Réseau (Docker Network)
Tous les conteneurs sont connectés à un réseau interne exclusif de type **Bridge** (ex: `typeracer-network`).
* **DNS Interne Docker :** Les conteneurs communiquent entre eux via le nom de leur service. (Le Backend contacte la DB via l'adresse `db:5432`).
* **Isolation :** La base de données et le backend sont invisibles depuis l'Internet public, réduisant drastiquement les vecteurs d'attaque.

## 🛠️ Gestion du Stockage (Docker Volumes)
Pour garantir la persistance des données et fluidifier le développement :
1. **`pg_data` (Named Volume) :** Monté sur `/var/lib/postgresql/data`. Indispensable pour ne pas perdre les comptes utilisateurs, les statistiques et les historiques lors d'un redémarrage du conteneur DB.
2. **`node_modules` (Anonymous Volume) :** Isole les dépendances installées dans le conteneur Linux de celles du système hôte.
3. **Code Source (Bind Mount) :** Utilisé uniquement en mode développement pour refléter les modifications de code en temps réel sans reconstruire l'image.

## 🔑 Variables d'Environnement (.env)
Un fichier `.env` unique ou scindé par service centralise la configuration :
* **Base de données :** User, Password, DB Name, URL Prisma.
* **Sécurité :** Secret JWT, clés API OAuth (Google, GitHub, 42).
* **Routage :** URL de base de l'application pour la redirection post-authentification.