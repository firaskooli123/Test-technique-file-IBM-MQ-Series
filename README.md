# Application de Gestion des Messages IBM MQ Series

## Description
Cette application permet de gérer les messages IBM MQ Series, les partenaires et l'authentification des utilisateurs. Elle est composée d'un backend Node.js et d'un frontend Angular.

## Architecture Technique

### Backend (Node.js)
- **Framework**: Express.js
- **Base de données**: SQLite
- **ORM**: Sequelize
- **Authentification**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Tests**: Jest

#### Structure du Backend
```
backend/
├── src/
│   ├── config/         # Configuration de l'application
│   ├── controllers/    # Contrôleurs des routes
│   ├── database/       # Configuration et migrations de la base de données
│   ├── middleware/     # Middleware Express
│   ├── models/         # Modèles Sequelize
│   ├── routes/         # Définition des routes
│   ├── services/       # Logique métier
│   └── utils/          # Utilitaires
```

### Frontend (Angular)
- **Framework**: Angular 17
- **UI Framework**: Angular Material
- **State Management**: Services Angular
- **Routing**: Angular Router
- **HTTP Client**: Angular HttpClient

#### Structure du Frontend
```
frontend/
├── src/
│   ├── app/
│   │   ├── core/           # Services et intercepteurs globaux
│   │   ├── features/       # Modules fonctionnels
│   │   │   ├── auth/       # Authentification
│   │   │   ├── messages/   # Gestion des messages
│   │   │   └── partners/   # Gestion des partenaires
│   │   └── shared/         # Composants et services partagés
│   └── assets/             # Ressources statiques
```

## Fonctionnalités

### Authentification
- Protection des routes

### Messages
- Liste paginée des messages
- Détails d'un message
- Statut des messages (pending, sent, failed)
- Filtrage par partenaire et statut

### Partenaires
- Liste paginée des partenaires
- Création/Modification/Suppression
- Types de partenaires (sender, receiver)
- Configuration des files d'attente

## Installation

### Prérequis
- Node.js (v20+)
- SQLite3
- Angular CLI (v17+)

### Backend
```bash
cd backend
npm install      # Charge les données initiales
npm start
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env  # Configurez vos variables d'environnement
ng serve
```

## Configuration

### Variables d'Environnement Frontend
```env
# API
API_URL=http://localhost:3000/api
```

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion

### Messages
- `GET /api/messages` - Liste des messages
- `GET /api/messages/:id` - Détails d'un message
- `POST /api/messages` - Création d'un message
- `PUT /api/messages/:id` - Mise à jour d'un message
- `DELETE /api/messages/:id` - Suppression d'un message

### Partenaires
- `GET /api/partners` - Liste des partenaires
- `GET /api/partners/:id` - Détails d'un partenaire
- `POST /api/partners` - Création d'un partenaire
- `PUT /api/partners/:id` - Mise à jour d'un partenaire
- `DELETE /api/partners/:id` - Suppression d'un partenaire

## Modèles de Données

### Message
```typescript
interface Message {
  id: number;
  content: string;
  partner_id: number;
  queue_name: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
  updated_at: string;
}
```

### Partner
```typescript
interface Partner {
  id: number;
  alias: string;
  type: 'sender' | 'receiver';
  direction: 'inbound' | 'outbound';
  processed_flow_type: 'file' | 'message';
  queue_name: string;
  created_at: string;
  updated_at: string;
}
```

### User
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}
```

## Sécurité
- Authentification JWT
- Protection CSRF
- Validation des entrées
- Gestion des erreurs
- Logging des actions

## Déploiement
- Backend : Docker + Node.js
- Frontend : Nginx
- Base de données : SQLite
- IBM MQ : IBM MQ Server

## Maintenance
- Logs : Winston