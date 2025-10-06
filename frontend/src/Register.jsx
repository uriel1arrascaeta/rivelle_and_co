import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/accounts/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Formatear el error para que sea legible
        const errorMessage = Object.entries(errorData).map(([key, value]) => `${key}: ${value.join(', ')}`).join('\n');
        throw new Error(errorMessage || 'Error en el registro');
      }

      const data = await response.json();
      // Guardar el token para futuras peticiones autenticadas
      localStorage.setItem('token', data.token);
      
      // Redirigir al perfil del vendedor
      navigate('/profile');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center">Crea una cuenta</h3>
        {error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <input type="text" name="name" placeholder="Nombre" onChange={handleChange} required className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600" />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600" />
            <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600" />
            <div className="flex items-baseline justify-between">
              <button type="submit" className="px-6 py-2 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-900">Registrarse</button>
              <Link to="/" className="text-sm text-indigo-600 hover:underline">Volver al inicio</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}