import { useState, useEffect } from 'react';
import Header from './Header';
import BonList from './BonList';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import logo from '/logo.png';   // Chemin absolu

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Dashboard() {
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [token] = useState(localStorage.getItem('token'));
  const [bons, setBons] = useState([]);
  const [quantites, setQuantites] = useState({
    serv_blanches: 0, serv_beiges: 0, draps: 0, tapis: 0,
    oshis: 0, peignoir_t1: 0, peignoir_t2: 0, peignoir_t3: 0, peignoir_t4: 0
  });
  const [message, setMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const loadBons = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/bons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBons(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadBons();
  }, []);

  const handleChange = (e) => {
    setQuantites(prev => ({ ...prev, [e.target.name]: parseInt(e.target.value) || 0 }));
  };

  // Date du lendemain
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toLocaleDateString('fr-FR');

  const generatePDF = (data = quantites) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const numero = 'BL-' + Date.now().toString().slice(-6);

    // Logo + En-tête gauche
    doc.addImage(logo, 'PNG', 15, 10, 75, 48);

    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text("LE NETTOYAGE NATURE", 18, 65);
    doc.text("4 Rue Pierre Idrac", 18, 72);
    doc.text("29900 Concarneau", 18, 79);
    doc.text("Tél : 02 98 10 46 29", 18, 86);

    // Titre
    doc.setFontSize(22);
    doc.setTextColor(0, 48, 87);
    doc.text("BON DE LIVRAISON", pageWidth - 20, 35, { align: "right" });

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`N° ${numero}`, pageWidth - 20, 46, { align: "right" });
    doc.text(`Date : ${dateStr}`, pageWidth - 20, 53, { align: "right" });

    // Client
    doc.setFontSize(13);
    doc.text("THALASSO CONCARNEAU", pageWidth - 20, 72, { align: "right" });
    doc.setFontSize(10);
    doc.text("36 Rue des Sables Blancs", pageWidth - 20, 79, { align: "right" });
    doc.text("29900 Concarneau", pageWidth - 20, 86, { align: "right" });

    // Tableau
    const tableData = Object.entries(data)
      .filter(([, qty]) => qty > 0)
      .map(([key, qty]) => [
        key.replace(/_/g, ' ').replace('peignoir', 'Peignoir'),
        qty
      ]);

    autoTable(doc, {
      startY: 105,
      head: [["Article", "Quantité"]],
      body: tableData,
      theme: 'striped',
      styles: { fontSize: 11, cellPadding: 8 },
      headStyles: { fillColor: [0, 48, 87], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 15, right: 15 }
    });

    doc.setFontSize(13);
    doc.text("Merci pour votre confiance !", pageWidth / 2, 265, { align: "center" });

    doc.save(`bon_livraison_${numero}.pdf`);
  };

  const saveAndGenerate = async () => {
    try {
      await axios.post(`${API_URL}/api/bons`, { quantites }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Bon enregistré et PDF généré');
      loadBons();
      generatePDF();
    } catch (e) {
      setMessage('Erreur lors de la sauvegarde');
    }
  };

  const deleteBon = async (id) => {
    if (!confirm('Supprimer ce bon ?')) return;
    try {
      await axios.delete(`${API_URL}/api/bons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadBons();
      setMessage('Bon supprimé');
    } catch (e) {
      setMessage('Erreur suppression');
    }
  };

  const viewAndEditBon = (bon) => {
    setQuantites(bon.quantites);
    setMessage(`Bon ${bon.numero} chargé pour modification`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center mb-10">Nouveau Bon de Livraison</h1>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(quantites).map(key => (
              <div key={key}>
                <label className="block text-sm font-medium mb-2 capitalize">
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

          <button 
            onClick={saveAndGenerate}
            className="mt-10 w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-semibold text-lg transition"
          >
            💾 Enregistrer + Générer PDF
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6">Historique des Bons</h2>
        <BonList 
          bons={bons} 
          onDelete={deleteBon} 
          onGeneratePDF={generatePDF}
          onViewBon={viewAndEditBon} 
        />

        {message && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-3 rounded-2xl shadow-lg z-50">
            {message}
          </div>
        )}
      </main>
    </div>
  );
}