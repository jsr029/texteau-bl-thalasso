import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const BonSchema = new mongoose.Schema({
  numero: String,
  date: String,
  quantites: Object,
  createdAt: { type: Date, default: Date.now }
});

let Bon;
try {
  Bon = mongoose.model('Bon');
} catch {
  Bon = mongoose.model('Bon', BonSchema);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Non autorisé" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    await mongoose.connect(MONGODB_URI);

    const { quantites } = req.body;
    const bon = await Bon.create({
      numero: 'BL-' + Date.now().toString().slice(-6),
      date: new Date().toLocaleDateString('fr-FR'),
      quantites
    });

    res.status(200).json({ success: true, bon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}