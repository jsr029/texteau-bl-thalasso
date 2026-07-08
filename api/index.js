import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

let User, Bon;

// Connexion MongoDB (réutilisée)
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI);
};

// Modèles
const getUserModel = () => {
  if (User) return User;
  User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String
  }));
  return User;
};

const getBonModel = () => {
  if (Bon) return Bon;
  Bon = mongoose.models.Bon || mongoose.model('Bon', new mongoose.Schema({
    numero: String,
    date: String,
    quantites: Object,
    createdAt: { type: Date, default: Date.now }
  }));
  return Bon;
};

export default async function handler(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await connectDB();

    if (pathname === '/api/login' && req.method === 'POST') {
      const { email, password } = req.body;
      const UserModel = getUserModel();
      const user = await UserModel.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Identifiants incorrects" });
      }

      const token = jwt.sign({ id: user._id, email }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({ token, user: { email: user.email } });
    }

    if (pathname === '/api/bons' && req.method === 'POST') {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: "Non autorisé" });

      jwt.verify(token, JWT_SECRET);

      const { quantites } = req.body;
      const BonModel = getBonModel();
      const bon = await BonModel.create({
        numero: 'BL-' + Date.now().toString().slice(-6),
        date: new Date().toLocaleDateString('fr-FR'),
        quantites
      });

      return res.status(200).json({ success: true, bon });
    }

    return res.status(404).json({ error: 'Route non trouvée' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}