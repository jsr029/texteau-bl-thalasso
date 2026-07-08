import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function UserManagement({ token }) {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '' });

  const loadUsers = async () => {
    // À implémenter côté API si besoin
    console.log("Chargement des utilisateurs (à implémenter)");
  };

  const createUser = async () => {
    // À implémenter
    alert("Création d'utilisateur (à implémenter côté API)");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gestion des Utilisateurs</h1>
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-xl font-semibold mb-6">Ajouter un utilisateur</h2>
        {/* Formulaire création */}
        <button onClick={createUser} className="bg-green-600 text-white px-8 py-3 rounded-2xl">Créer Utilisateur</button>
      </div>
    </div>
  );
}