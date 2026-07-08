// Fonction pour voir / éditer un bon existant
const viewAndEditBon = (bon) => {
  setQuantites(bon.quantites);   // Charge les quantités dans le formulaire
  setMessage(`Bon ${bon.numero} chargé pour modification`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Dans le return, passe onViewBon à BonList
<BonList 
  bons={bons} 
  onDelete={deleteBon} 
  onGeneratePDF={generatePDF}
  onViewBon={viewAndEditBon} 
/>