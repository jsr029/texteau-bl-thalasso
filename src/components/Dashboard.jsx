import { useState, useEffect } from 'react';
import Header from './Header';
import BonForm from './BonForm';
import BonList from './BonList';
import UserManagement from './UserManagement';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import logo from '/logo.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Dashboard() {
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [token] = useState(localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('bons');
  const [menuOpen, setMenuOpen] = useState(false);

  // Bons
  const [bons, setBons] = useState([]);
  const [quantites, setQuantites] = useState({
    serv_blanches: 0, serv_beiges: 0, draps: 0, tapis: 0,
    oshis: 0, peignoir_t1: 0, peignoir_t2: 0, peignoir_t3: 0, peignoir_t4: 0
  });

  const loadBons = async () => {
    const res = await axios.get(`${API_URL}/api/bons`, { headers: { Authorization: `Bearer ${token}` } });
    setBons(res.data);
  };

  useEffect(() => {
    loadBons();
  }, []);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const generatePDF = (data = quantites) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const numero = 'BL-' + Date.now().toString().slice(-6);

    doc.addImage(logo, 'PNG', 15, 10, 75, 48);
    // ... (le reste de ta fonction PDF)

    doc.save(`bon_livraison_${numero}.pdf`);
  };

  const saveAndGenerate = async () => {
    try {
      await axios.post(`${API_URL}/api/bons`, { quantites }, { headers: { Authorization: `Bearer ${token}` } });
      loadBons();
      generatePDF();
    } catch (e) {
      alert('Erreur sauvegarde');
    }
  };

  const deleteBon = async (id) => {
    if (!confirm('Supprimer ?')) return;
    await axios.delete(`${API_URL}/api/bons/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    loadBons();
  };

  const viewBon = (bon) => {
    setQuantites(bon.quantites);
    setCurrentPage('bons');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onLogout={() => window.location.href = '/login'} 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {currentPage === 'bons' && (
          <>
            <h1 className="text-4xl font-bold text-center mb-10">Gestion des Bons</h1>
            <BonForm quantites={quantites} setQuantites={setQuantites} onSave={saveAndGenerate} />
            <h2 className="text-2xl font-bold mb-6 mt-12">Historique</h2>
            <BonList bons={bons} onDelete={deleteBon} onGeneratePDF={generatePDF} onViewBon={viewBon} />
          </>
        )}

        {currentPage === 'users' && <UserManagement token={token} />}
      </main>
    </div>
  );
}