import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function EditProfilePage() {
  const [formData, setFormData] = useState({ first_name: '', email: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/accounts/profile/`, {
          headers: { 'Authorization': `Token ${token}` },
        });
        if (!response.ok) throw new Error('No se pudo cargar el perfil.');
        const data = await response.json();
        setFormData({ first_name: data.user.first_name, email: data.user.email });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_URL}/accounts/profile/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar el perfil.');
      }

      navigate('/profile');

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">Editar Perfil</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">{error}</div>}
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleChange} required className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600" />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600" />
          </div>
          <button type="submit" className="w-full px-6 py-3 text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
}