import { useState } from 'react';
import axios from 'axios';
import logo from '../logo.png'; // Ajuste le chemin si nécessair
import dotenv from 'dotenv';
dotenv.config();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/api/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="h-20 w-auto" />
        </div>
        <h1 className="text-4xl font-bold text-center mb-2">Text'eau</h1>
        <p className="text-center text-gray-600 mb-8">Bons de Livraison</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500" required />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500" required />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <p className="text-center text-xs text-gray-500 mt-8">admin@texteau.fr / password</p>
      </div>
    </div>
  );
}