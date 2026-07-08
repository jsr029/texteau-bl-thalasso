export default function BonList({ bons, onDelete, onGeneratePDF }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      {bons.length === 0 ? (
        <p className="p-12 text-center text-gray-500">Aucun bon enregistré pour le moment.</p>
      ) : (
        <div className="divide-y">
          {bons.map(bon => (
            <div key={bon._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50">
              <div>
                <div className="font-semibold text-lg">{bon.numero}</div>
                <div className="text-sm text-gray-500">{bon.date}</div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => onGeneratePDF(bon.quantites)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  📄 PDF
                </button>
                <button 
                  onClick={() => onDelete(bon._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  🗑 Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}