// create-user.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/texteau';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB:', err);
    process.exit(1);
  });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

async function createUser() {
  const email = 'jsr059@gmail.com';
  const password = '1T2e3x4t@';
  const name = 'Administrateur';

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️  Utilisateur déjà existant :', email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name
    });

    console.log('🎉 Utilisateur créé avec succès !');
    console.log('Email    :', newUser.email);
    console.log('Mot de passe :', password);
    console.log('ID       :', newUser._id);

  } catch (error) {
    console.error('❌ Erreur lors de la création :', error.message);
  } finally {
    mongoose.disconnect();
  }
}

createUser();