export default function BonForm({ quantites, setQuantites, onSave }) {
  const handleChange = (e) => {
    setQuantites(prev => ({ ...prev, [e.target.name]: parseInt(e.target.value) || 0 }));
  };

  return (
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
        onClick={onSave}
        className="mt-10 w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-semibold text-lg transition"
      >
        💾 Enregistrer + Générer PDF
      </button>
      <button 
        onClick={onReset}
        className="mt-4 mr-4 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-2xl text-sm"
        >
        Réinitialiser le formulaire
        </button>
    </div>
  );
}