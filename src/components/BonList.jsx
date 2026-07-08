export default function BonList({ bons, onDelete, onGeneratePDF, onViewBon }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      {bons.length === 0 ? (
        <p className="p-12 text-center text-gray-500">Aucun bon enregistré pour le moment.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {bons.map((bon) => (
            <div 
              key={bon._id} 
              className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition"
            >
              <div className="flex-1">
                <div className="font-semibold text-lg text-gray-900">{bon.numero}</div>
                <div className="text-sm text-gray-500 mt-1">{bon.date}</div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => onViewBon(bon)}
                  className="px-5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-2xl text-sm font-medium transition flex items-center gap-2"
                >
                  👁 Voir / Modifier
                </button>
                
                <button 
                  onClick={() => onGeneratePDF(bon)}
                  className="px-5 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-2xl text-sm font-medium transition flex items-center gap-2"
                >
                  📄 PDF
                </button>

                <button 
                  onClick={() => onDelete(bon._id)}
                  className="px-5 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-2xl text-sm font-medium transition"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}