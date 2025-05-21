const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const messageRoutes = require('./routes/message.routes');
const partnerRoutes = require('./routes/partner.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes des messages
app.use('/api/messages', messageRoutes);

// Routes des partenaires
app.use('/api/partners', partnerRoutes);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue' });
});

module.exports = app;