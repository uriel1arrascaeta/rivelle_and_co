import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1/blog';

export default function EditPost() {
  const { slug } = useParams();
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_URL}/posts/${slug}/`);
        if (!response.ok) throw new Error('No se pudo cargar el post.');
        const data = await response.json();
        setFormData({ title: data.title, content: data.content });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión para editar un post.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/posts/${slug}/`, {
        method: 'PATCH', // Usamos PATCH para actualizaciones parciales
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar el post.');
      }

      navigate('/profile'); // Redirige de vuelta al perfil

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Cargando post para editar...</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">Editar Post</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">{error}</div>}
          <input
            type="text" name="title" value={formData.title}
            onChange={handleChange} required
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <textarea
            name="content" value={formData.content}
            onChange={handleChange} required rows="10"
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          ></textarea>
          <button type="submit" className="w-full px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}