import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1/blog';

export default function SellerProfile() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Debes iniciar sesión para ver tus posts.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/my-posts/`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        if (!response.ok) throw new Error('No se pudieron cargar tus posts.');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const handleDelete = async (slug) => {
    if (!window.confirm('¿Estás seguro de que quieres borrar esta publicación?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión para borrar posts.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/posts/${slug}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      if (!response.ok) throw new Error('No se pudo borrar la publicación.');
      setPosts(posts.filter(p => p.slug !== slug)); // Actualiza la UI
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white antialiased">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Perfil del Vendedor</h1>
          <p className="text-lg text-gray-600 mt-4">
          ¡Bienvenido! Desde aquí podrás gestionar tus propiedades.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/create-post" className="w-full sm:w-auto bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full transition-transform duration-300 ease-in-out hover:scale-105">
              Subir un nuevo post
            </Link>
            <Link to="/schedule" className="w-full sm:w-auto bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-full transition-transform duration-300 ease-in-out hover:scale-105">
              Agendar una cita
            </Link>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Publicaciones</h2>
        {loading && <p>Cargando tus posts...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center">
              <p className="font-semibold">{post.title}</p>
              <div>
                <Link to={`/edit-post/${post.slug}`} className="text-indigo-600 hover:underline mr-4">Editar</Link>
                <button onClick={() => handleDelete(post.slug)} className="text-red-600 hover:underline">Borrar</button>
              </div>
            </div>
          ))}
          {!loading && posts.length === 0 && <p className="text-gray-500">Aún no has creado ninguna publicación.</p>}
        </div>
      </div>
    </div>
  );
}