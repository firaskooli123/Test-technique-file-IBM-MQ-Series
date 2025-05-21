FROM node:18-slim

WORKDIR /usr/src/app

# Installation des dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Création des répertoires nécessaires
RUN mkdir -p logs data

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"] 