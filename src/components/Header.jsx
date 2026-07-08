import logo from '/logo.png';

export default function Header({ user, onLogout, menuOpen, setMenuOpen }) {
  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <div className="font-bold text-2xl text-gray-900">Text'eau</div>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-3xl">
          ☰
        </button>

        <div className="hidden md:flex items-center gap-6">
          <span className="text-gray-600">{user?.email}</span>
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition">
            Déconnexion
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">
          <div className="text-gray-600">{user?.email}</div>
          <button onClick={onLogout} className="w-full text-left text-red-600 py-2">Déconnexion</button>
        </div>
      )}
    </header>
  );
}