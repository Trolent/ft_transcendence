# 🏁 Projet TypeRacer - Spécifications & Modules

**Stack Technique :**
- **Frontend :** React + Vite
- **Backend :** NestJS (WebSockets pour le temps réel)
- **ORM :** Prisma
- **Langues :** Anglais (EN), Français (FR), Espagnol (ES)

---

## 🏗️ Module 1 : Architecture & Backend (3 pts)
- [ ] **Frontend Framework** (1pt) : Application développée avec **React** et **Vite**.
- [ ] **Backend Framework** (1pt) : Serveur robuste sous **NestJS**.
- [ ] **ORM** (1pt) : Gestion de la base de données avec **Prisma**.

## 👤 Module 2 : Gestion des Utilisateurs & Auth (4 pts)
- [ ] **Authentification Standard** (2pts) :
    - Gestion du profil et upload d'avatar.
    - Système d'amis et affichage du statut (en ligne/hors ligne).
    - Page de profil publique.
- [ ] **Authentification OAuth 2.0** (1pt) : Connexion via Google, GitHub ou 42.
- [ ] **Statistiques TypeRacer** (1pt) :
    - Tracking des performances (Mots par minute - WPM, précision).
    - Historique des courses 1v1.
    - Système de paliers et classement général (Leaderboard).

## 💬 Module 3 : Interaction & Temps Réel (4 pts)
- [ ] **Moteur Temps Réel (WebSockets via NestJS)** (2pts) :
    - Synchronisation instantanée de la progression des joueurs.
    - Gestion fluide des entrées/sorties de salon de jeu.
- [ ] **Système d'Interaction** (2pts) :
    - Chat en direct (envoi/réception).
    - Consultation des stats des autres joueurs.
    - Gestion de la liste d'amis (ajout/suppression).

## 🎮 Module 4 : Expérience de Jeu - TypeRacer (6 pts)
- [ ] **Jeu de dactylographie complet** (2pts) : Mode multijoueur avec validation des mots en temps réel.
- [ ] **Mode Remote (Distance)** (2pts) :
    - Compensation de la latence pour l'affichage de la progression.
    - Logique de reconnexion automatique en cours de partie.
- [ ] **Mode Multi-joueurs (> 2)** (2pts) : Courses de vitesse supportant 3 joueurs ou plus simultanément.

## 🎨 Module 5 : UI/UX & Accessibilité (4 pts)
- [ ] **Design System Custom** (1pt) : Création de 10 composants React réutilisables, charte graphique propre.
- [ ] **Recherche & Filtrage** (1pt) : Recherche de joueurs ou de parties avec filtres et pagination.
- [ ] **Internationalisation (i18n)** (1pt) : Support complet **Anglais, Français, Espagnol** avec sélecteur.
- [ ] **Compatibilité Navigateurs** (1pt) : Optimisation pour Chrome, Firefox et Safari/Edge.

---

### 📊 Objectif Total : 21 pts