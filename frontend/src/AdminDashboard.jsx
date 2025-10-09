import React from 'react';
import Navbar from './Navbar';

export default function AdminDashboard() {
  return (
    <div className="bg-white min-h-screen antialiased">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Panel de Administrador</h1>
          <p className="text-lg text-gray-600 mt-4">
            Bienvenido, admin. Desde aquí puedes gestionar usuarios y la plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}