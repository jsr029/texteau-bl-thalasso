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

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Générer PDF
  const generatePDF = (data = quantites, existingNumero = null) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const date = tomorrow.toLocaleDateString('fr-FR');
    const numero = existingNumero || 'BL-' + Date.now().toString().slice(-6);

    doc.addImage(logo, 'PNG', 15, 10, 75, 25);

    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text("4 Rue Pierre Idrac", 18, 40);
    doc.text("29900 Concarneau", 18, 47);
    doc.text("Tél : 02 98 10 46 29", 18, 54);

    doc.setFontSize(22);
    doc.setTextColor(0, 48, 87);
    doc.text("BON DE LIVRAISON", pageWidth - 20, 35, { align: "right" });

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`N° ${numero}`, pageWidth - 20, 40, { align: "right" });
    doc.text(`Date : ${date}`, pageWidth - 20, 45, { align: "right" });

    doc.setFontSize(13);
    doc.text("THALASSO CONCARNEAU", pageWidth - 20, 55, { align: "right" });
    doc.setFontSize(10);
    doc.text("36 Rue des Sables Blancs", pageWidth - 20, 62, { align: "right" });
    doc.text("29900 Concarneau", pageWidth - 20, 69, { align: "right" });

    const tableData = Object.entries(data)
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
      styles: { fontSize: 11, cellPadding: 8 },
      headStyles: { fillColor: [0, 48, 87], textColor: [255, 255, 255] },
    });

    doc.setFontSize(13);
    doc.text("Merci pour votre confiance !", pageWidth / 2, 270, { align: "center" });

    doc.save(`bon_livraison_${numero}.pdf`);
  };

  const saveAndGenerate = async () => {
    try {
      await axios.post(`${API_URL}/api/bons`, { quantites }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadBons();
      generatePDF();
    } catch (e) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const deleteBon = async (id) => {
    if (!confirm('Supprimer ce bon ?')) return;
    try {
      await axios.delete(`${API_URL}/api/bons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadBons();
    } catch (e) {
      alert('Erreur suppression');
    }
  };

  // Voir PDF dans nouvel onglet
  const viewPDF = (bon) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const date = tomorrow.toLocaleDateString('fr-FR');
    const numero = bon.numero;

    doc.addImage(logo, 'PNG', 15, 10, 75, 25);

    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text("4 Rue Pierre Idrac", 18, 40);
    doc.text("29900 Concarneau", 18, 47);
    doc.text("Tél : 02 98 10 46 29", 18, 54);

    doc.setFontSize(22);
    doc.setTextColor(0, 48, 87);
    doc.text("BON DE LIVRAISON", pageWidth - 20, 35, { align: "right" });

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`N° ${numero}`, pageWidth - 20, 40, { align: "right" });
    doc.text(`Date : ${date}`, pageWidth - 20, 45, { align: "right" });

    doc.setFontSize(13);
    doc.text("THALASSO CONCARNEAU", pageWidth - 20, 55, { align: "right" });
    doc.setFontSize(10);
    doc.text("36 Rue des Sables Blancs", pageWidth - 20, 62, { align: "right" });
    doc.text("29900 Concarneau", pageWidth - 20, 69, { align: "right" });

    const tableData = Object.entries(bon.quantites)
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
      styles: { fontSize: 11, cellPadding: 8 },
      headStyles: { fillColor: [0, 48, 87], textColor: [255, 255, 255] },
    });

    doc.setFontSize(13);
    doc.text("Merci pour votre confiance !", pageWidth / 2, 270, { align: "center" });

    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  };

  // Modifier un bon
  const editBon = (bon) => {
    setQuantites(bon.quantites);
    setCurrentPage('bons');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onLogout={handleLogout} 
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
            <h2 className="text-2xl font-bold mb-6 mt-12">Historique des Bons</h2>
            <BonList 
              bons={bons} 
              onDelete={deleteBon} 
              onViewPDF={viewPDF}
              onEditBon={editBon} 
            />
          </>
        )}

        {currentPage === 'users' && <UserManagement token={token} />}
      </main>
    </div>
  );
}