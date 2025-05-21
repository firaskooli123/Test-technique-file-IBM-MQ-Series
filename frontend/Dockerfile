# Étape 1: Build de l'application Angular
FROM node:20-alpine as build

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers
COPY . .

# Build de l'application
RUN npm run build

# Étape 2: Serveur web pour servir l'application
FROM nginx:alpine

# Copie de la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers buildés depuis l'étape précédente
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Exposition du port 80
EXPOSE 80

# Démarrage de nginx
CMD ["nginx", "-g", "daemon off;"] 