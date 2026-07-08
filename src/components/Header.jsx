import logo from '/logo.png';

export default function Header({ user, onLogout, menuOpen, setMenuOpen, currentPage, setCurrentPage }) {
  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <div className="font-bold text-2xl">Text'eau</div>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-4xl">☰</button>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => setCurrentPage('bons')} className={`font-medium ${currentPage === 'bons' ? 'text-blue-600' : ''}`}>Bons</button>
          <button onClick={() => setCurrentPage('users')} className={`font-medium ${currentPage === 'users' ? 'text-blue-600' : ''}`}>Utilisateurs</button>
          <span>{user.email}</span>
          <button onClick={onLogout} className="bg-red-500 text-white px-5 py-2 rounded-xl">Déconnexion</button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t p-6 space-y-4">
          <button onClick={() => { setCurrentPage('bons'); setMenuOpen(false); }} className="block w-full text-left py-3">Gestion des Bons</button>
          <button onClick={() => { setCurrentPage('users'); setMenuOpen(false); }} className="block w-full text-left py-3">Gestion des Utilisateurs</button>
          <button onClick={onLogout} className="block w-full text-left py-3 text-red-600">Déconnexion</button>
        </div>
      )}
    </header>
  );
}