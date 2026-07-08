import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function UserManagement({ token }) {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '' });
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async () => {
    try {
      await axios.post(`${API_URL}/api/users`, newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Utilisateur créé avec succès');
      setNewUser({ email: '', password: '', name: '' });
      loadUsers();
    } catch (e) {
      setMessage('Erreur lors de la création');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await axios.delete(`${API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadUsers();
      setMessage('Utilisateur supprimé');
    } catch (e) {
      setMessage('Erreur suppression');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gestion des Utilisateurs</h1>

      <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
        <h2 className="text-xl font-semibold mb-6">Ajouter un utilisateur</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Nom" 
            value={newUser.name} 
            onChange={e => setNewUser({...newUser, name: e.target.value})}
            className="border rounded-2xl px-5 py-4"
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={newUser.email} 
            onChange={e => setNewUser({...newUser, email: e.target.value})}
            className="border rounded-2xl px-5 py-4"
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={newUser.password} 
            onChange={e => setNewUser({...newUser, password: e.target.value})}
            className="border rounded-2xl px-5 py-4"
          />
        </div>
        <button onClick={createUser} className="mt-6 bg-green-600 text-white px-8 py-3 rounded-2xl">Créer Utilisateur</button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Liste des Utilisateurs</h2>
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {users.map(u => (
          <div key={u._id} className="p-6 flex justify-between items-center border-b">
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-sm text-gray-500">{u.email}</div>
            </div>
            <button onClick={() => deleteUser(u._id)} className="text-red-600">Supprimer</button>
          </div>
        ))}
      </div>

      {message && <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-2xl">{message}</div>}
    </div>
  );
}