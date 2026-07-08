export default function BonList({ bons, onDelete, onGeneratePDF, onViewBon }) {
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
              <div className="flex gap-3">
                <button onClick={() => onViewBon(bon)} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200">👁 Voir</button>
                <button onClick={() => onGeneratePDF(bon.quantites)} className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200">📄 PDF</button>
                <button onClick={() => onDelete(bon._id)} className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200">🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}