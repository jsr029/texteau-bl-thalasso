import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

let User, Bon;

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI);
};

const getUserModel = () => {
  if (User) return User;
  User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: String,
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
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await connectDB();
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    // Login
    if (pathname === '/api/login' && req.method === 'POST') {
      const { email, password } = req.body;
      const UserModel = getUserModel();
      const user = await UserModel.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Identifiants incorrects" });
      }

      const token = jwt.sign({ id: user._id, email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { email: user.email } });
    }

    // Bons CRUD
    if (pathname.startsWith('/api/bons')) {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: "Non autorisé" });
      jwt.verify(token, JWT_SECRET);

      const BonModel = getBonModel();

      if (req.method === 'POST') {
        const { quantites } = req.body;
        const bon = await BonModel.create({
          numero: 'BL-' + Date.now().toString().slice(-6),
          date: new Date().toLocaleDateString('fr-FR'),
          quantites
        });
        return res.json({ success: true, bon });
      }

      if (req.method === 'GET') {
        const bons = await BonModel.find().sort({ createdAt: -1 });
        return res.json(bons);
      }

      if (req.method === 'DELETE') {
        const id = pathname.split('/').pop();
        await BonModel.findByIdAndDelete(id);
        return res.json({ success: true });
      }
    }

    return res.status(404).json({ error: 'Route non trouvée' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}