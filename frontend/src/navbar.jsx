import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="text-2xl font-bold text-gray-800">
            HomeOS
          </a>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="bg-indigo-600 text-white font-semibold py-2 px-4 text-sm md:text-base md:px-5 rounded-full transition-transform duration-300 ease-in-out hover:scale-105">
              Prueba HomeOS
            </button>
            <button className="bg-transparent text-indigo-600 font-semibold py-2 px-4 text-sm md:text-base md:px-5 border border-indigo-600 rounded-full transition-all duration-300 ease-in-out hover:bg-indigo-600 hover:text-white">
              Explora HomeOS
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}