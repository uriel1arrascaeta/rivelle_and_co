import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer', // Rol por defecto
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

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

      // Después de registrar, hacemos login para obtener los datos del usuario
      const loginResponse = await fetch('http://127.0.0.1:8000/api/v1/accounts/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
        }),
      });

      if (!loginResponse.ok) {
        throw new Error('Error al iniciar sesión después del registro.');
      }

      const loginData = await loginResponse.json();
      login(loginData.token, { role: loginData.role, first_name: loginData.first_name });
      
      // Redirigir según el rol
      if (loginData.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/profile');
      }

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
            
            <div className="mt-4">
              <label className="block text-gray-700">Selecciona tu rol:</label>
              <div className="mt-2 space-y-2">
                <label className="inline-flex items-center">
                  <input type="radio" name="role" value="buyer" checked={formData.role === 'buyer'} onChange={handleChange} className="form-radio" />
                  <span className="ml-2">Comprador</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input type="radio" name="role" value="agent" checked={formData.role === 'agent'} onChange={handleChange} className="form-radio" />
                  <span className="ml-2">Corredor Inmobiliario</span>
                </label>
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <button type="submit" className="bg-white border border-gray-300 text-sm font-semibold py-2 px-6 rounded-md text-gray-700 hover:bg-gray-50">Registrarse</button>
              <Link to="/" className="text-sm text-gray-600 hover:underline">Volver al inicio</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}