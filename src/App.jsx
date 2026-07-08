import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import logo from '/logo.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(storedUser);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login setToken={setToken} setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Dashboard user={user} onLogout={handleLogout} token={token} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function Login({ setToken, setUser }) {
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
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-[420px]">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Text'eau" className="h-20 w-auto" />
        </div>
        
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">Créer un BL</h1>
        <p className="text-center text-gray-600 mb-8">pour la Thalasso</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            required 
          />
          
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            required 
          />

          {error && <p className="text-red-500 text-center font-medium py-2">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 rounded-2xl text-lg transition"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-8">
          admin@texteau.fr / password
        </p>
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout, token }) {
  const [quantites, setQuantites] = useState({
    serv_blanches: 0, serv_beiges: 0, draps: 0, tapis: 0,
    oshis: 0, peignoir_t1: 0, peignoir_t2: 0, peignoir_t3: 0, peignoir_t4: 0
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setQuantites(prev => ({ ...prev, [e.target.name]: parseInt(e.target.value) || 0 }));
  };

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const date = new Date().toLocaleDateString('fr-FR');
    const numero = 'BL-' + Date.now().toString().slice(-6);

    // Logo + En-tête gauche
    doc.addImage(logo, 'PNG', 15, 10, 75, 25);

    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text("4 Rue Pierre Idrac", 18, 35);
    doc.text("29900 Concarneau", 18, 42);
    doc.text("Tél : 02 98 10 46 29", 18, 49);

    // Titre + infos
    doc.setFontSize(22);
    doc.setTextColor(0, 48, 87);
    doc.text("BON DE LIVRAISON", pageWidth - 20, 35, { align: "right" });

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`N° ${numero}`, pageWidth - 20, 46, { align: "right" });
    doc.text(`Date : ${date}`, pageWidth - 20, 53, { align: "right" });

    // Client
    doc.setFontSize(13);
    doc.text("THALASSO CONCARNEAU", pageWidth - 20, 55, { align: "right" });
    doc.setFontSize(10);
    doc.text("36 Rue des Sables Blancs", pageWidth - 20, 62, { align: "right" });
    doc.text("29900 Concarneau", pageWidth - 20, 69, { align: "right" });

    // Tableau
    const tableData = Object.entries(quantites)
      .filter(([, qty]) => qty > 0)
      .map(([key, qty]) => [
        key.replace(/_/g, ' ').replace('peignoir', 'Peignoir'),
        qty
      ]);

    autoTable(doc, {
      startY: 75,
      head: [["Article", "Quantité"]],
      body: tableData,
      theme: 'striped',
      styles: { fontSize: 11, cellPadding: 3 },
      headStyles: { fillColor: [0, 48, 87], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 15, right: 15 }
    });

    doc.setFontSize(13);
    doc.text("Merci pour votre confiance !", pageWidth / 2, 265, { align: "center" });

    doc.save(`bon_livraison_${numero}.pdf`);
    setMessage('✅ PDF généré avec succès');
  };

  const saveBon = async () => {
    try {
      await axios.post(`${API_URL}/api/bons`, { quantites }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Bon enregistré dans la base');
    } catch (e) {
      setMessage('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
            <div className="font-bold text-xl">Text'eau</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
            <button 
              onClick={onLogout} 
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center mb-10">Nouveau Bon de Livraison</h1>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(quantites).map(key => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {key.replace(/_/g, ' ').replace('peignoir', 'Peignoir ')}
                </label>
                <input
                  type="number"
                  name={key}
                  value={quantites[key]}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <button onClick={generatePDF} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-semibold text-lg transition">
              📄 Générer le PDF
            </button>
            <button onClick={saveBon} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-semibold text-lg transition">
              💾 Sauvegarder
            </button>
          </div>

          {message && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-center">
              {message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;