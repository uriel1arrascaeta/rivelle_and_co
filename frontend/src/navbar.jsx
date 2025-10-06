import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ page }) {
  const isHomePage = page === 'home';

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            {isHomePage ? 'HomeOS' : 'Blog'}
          </Link>
          {isHomePage ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Link to="/login" className="bg-transparent text-indigo-600 font-semibold py-2 px-4 text-sm md:text-base md:px-5 rounded-full transition-all duration-300 ease-in-out hover:bg-indigo-100">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="bg-indigo-600 text-white font-semibold py-2 px-4 text-sm md:text-base md:px-5 rounded-full transition-transform duration-300 ease-in-out hover:scale-105">
                Registrarse
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <Link to="/" className="bg-transparent text-indigo-600 font-semibold py-2 px-4 text-sm md:text-base md:px-5 rounded-full transition-all duration-300 ease-in-out hover:bg-indigo-100">
                Ir al Inicio
              </Link>
              <Link to="/login" className="bg-indigo-600 text-white font-semibold py-2 px-4 text-sm md:text-base md:px-5 rounded-full transition-transform duration-300 ease-in-out hover:scale-105">
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}