export default function BonList({ bons, onDelete, onViewPDF, onEditBon }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      {bons.length === 0 ? (
        <p className="p-12 text-center text-gray-500">Aucun bon enregistré.</p>
      ) : (
        <div className="divide-y">
          {bons.map(bon => (
            <div key={bon._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50">
              <div>
                <div className="font-semibold text-lg">{bon.numero}</div>
                <div className="text-sm text-gray-500">{bon.date}</div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button 
                  onClick={() => onViewPDF(bon)}
                  className="px-5 py-2 bg-blue-100 text-blue-700 rounded-2xl hover:bg-blue-200 transition text-sm font-medium"
                >
                  👁 Voir PDF
                </button>
                <button 
                  onClick={() => onEditBon(bon)}
                  className="px-5 py-2 bg-amber-100 text-amber-700 rounded-2xl hover:bg-amber-200 transition text-sm font-medium"
                >
                  ✏️ Modifier
                </button>
                <button 
                  onClick={() => onDelete(bon._id)}
                  className="px-5 py-2 bg-red-100 text-red-700 rounded-2xl hover:bg-red-200 transition text-sm font-medium"
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