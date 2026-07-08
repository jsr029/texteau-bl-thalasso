import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'https://texteau-bl-thalasso.vercel.app',
    'https://texteau-bl-thalasso-79mdr7so1-jsr029s-projects.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Servir les fichiers statiques (build React)
app.use(express.static(path.join(__dirname, 'dist')));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ MongoDB erreur:', err));

// Modèles
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String
}));

const Bon = mongoose.model('Bon', new mongoose.Schema({
  numero: String,
  date: String,
  quantites: Object,
  createdAt: { type: Date, default: Date.now }
}));

// Middleware d'authentification
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Non autorisé" });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token invalide" });
  }
};

// Routes API
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Identifiants incorrects" });
  }
  const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { email: user.email } });
});

app.post('/api/bons', authenticate, async (req, res) => {
  const { quantites } = req.body;
  const bon = await Bon.create({
    numero: 'BL-' + Date.now().toString().slice(-6),
    date: new Date().toLocaleDateString('fr-FR'),
    quantites
  });
  res.json({ success: true, bon });
});

// **Route catch-all corrigée** (important !)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});