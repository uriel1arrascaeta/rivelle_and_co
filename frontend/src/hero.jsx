import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <main className="bg-white">
      <div className="container mx-auto px-4 py-24 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
          Transformando la forma de comprar y vender inmuebles
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          La herramienta que conecta corredores con compradores.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/register" className="w-full sm:w-auto bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full transition-transform duration-300 ease-in-out hover:scale-105">
            Prueba HomeOS
          </Link>
          <Link to="/blog" className="w-full sm:w-auto bg-transparent text-indigo-600 font-semibold py-3 px-8 border border-indigo-600 rounded-full transition-all duration-300 ease-in-out hover:bg-indigo-600 hover:text-white">
            Explora HomeOS
          </Link>
        </div>
      </div>
    </main>
  );
}