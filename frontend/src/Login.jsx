import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // El backend de DRF espera 'username' y 'password'
        body: JSON.stringify({
          username: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.non_field_errors ? errorData.non_field_errors.join(', ') : 'Email o contraseña incorrectos.';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      login(data.token, { role: data.role, first_name: data.first_name }); // Guardamos token y datos de usuario
      
      // Redirigir según el rol del usuario
      if (data.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        // Para 'agent' y 'buyer'
        navigate('/profile');
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center">Iniciar Sesión</h3>
        {error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600" />
            <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600" />
            <div className="flex items-baseline justify-between">
              <button type="submit" className="bg-white border border-gray-300 text-sm font-semibold py-2 px-6 rounded-md text-gray-700 hover:bg-gray-50">Iniciar Sesión</button>
              <Link to="/" className="text-sm text-gray-600 hover:underline">Volver al inicio</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}