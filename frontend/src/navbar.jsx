import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Navbar({ page }) {
  const isHomePage = page === 'home';
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            {isHomePage ? 'HomeOS' : 'Blog'}
          </Link>
          {isLoggedIn ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Link to="/profile" className="bg-white border border-gray-300 text-sm font-semibold py-1 px-4 rounded-md text-gray-700 hover:bg-gray-50">
                Mi Perfil
              </Link>
              <button onClick={logout} className="bg-white border border-gray-300 text-sm font-semibold py-1 px-4 rounded-md text-gray-700 hover:bg-gray-50">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <Link to="/login" className="bg-white border border-gray-300 text-sm font-semibold py-1 px-4 rounded-md text-gray-700 hover:bg-gray-50">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="bg-white border border-gray-300 text-sm font-semibold py-1 px-4 rounded-md text-gray-700 hover:bg-gray-50">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}