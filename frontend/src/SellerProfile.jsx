import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function SellerProfile() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { user, token } = useAuth(); // Usamos el usuario del contexto

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!token) {
        setError('Debes iniciar sesión para ver esta página.');
        setLoading(false);
        return;
      }

      try {
        // 1. Cargar la imagen de perfil
        const profileResponse = await fetch(`${API_URL}/accounts/profile/`, {
          headers: { 'Authorization': `Token ${token}` },
        });
        if (!profileResponse.ok) throw new Error('No se pudo cargar el perfil.');
        const profileData = await profileResponse.json();
        // Combinamos la información del contexto (rol, nombre) con la de la API (avatar)
        setProfile({ ...user, avatar: profileData.avatar });

        // 2. Basado en el rol del usuario del contexto, obtener las publicaciones
        const postsEndpoint = user.role === 'buyer' ? 'liked-posts' : 'my-posts';
        const postsResponse = await fetch(`${API_URL}/blog/${postsEndpoint}/`, {
          headers: { 'Authorization': `Token ${token}` },
        });
        if (!postsResponse.ok) throw new Error('No se pudieron cargar las publicaciones.');
        const postsData = await postsResponse.json();
        setPosts(postsData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // El array de dependencias vacío asegura que se ejecute solo una vez
  }, [token, user]); // Se ejecuta si el token o el usuario cambian

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch(`${API_URL}/accounts/profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar la foto de perfil.');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile); // Actualiza el estado para mostrar la nueva foto
    } catch (err) {
      setError(err.message);
    }
  };

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
      const response = await fetch(`${API_URL}/blog/posts/${slug}/`, {
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
    <div className="bg-white min-h-screen antialiased">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Encabezado del Perfil */}
        {profile && (
          <header className="flex flex-col sm:flex-row items-center gap-8 mb-12 pb-8 border-b border-gray-200">
            <div onClick={handleAvatarClick} className="w-36 h-36 rounded-full flex-shrink-0 cursor-pointer overflow-hidden border border-gray-200">
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            </div>
            <div className="flex-grow text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                <h1 className="text-2xl font-light text-gray-700">{profile.first_name}</h1>
              <Link to="/edit-profile" className="bg-white border border-gray-300 text-sm font-semibold py-1 px-4 rounded-md text-gray-700 hover:bg-gray-50">
                  Editar Perfil
              </Link>
              </div>
            <p className="text-gray-600 mb-4">
              {profile.role === 'buyer' ? 'Explora y guarda tus propiedades favoritas.' : '¡Bienvenido! Desde aquí podrás gestionar tus propiedades.'}
            </p>
            {profile.role !== 'buyer' && (
              <div className="flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-4">
                <Link to="/create-post" className="w-full sm:w-auto bg-white text-gray-700 font-semibold py-2 px-6 rounded-md border border-gray-300 hover:bg-gray-50">
                    Subir un nuevo post
                  </Link>
                <Link to="/schedule" className="w-full sm:w-auto bg-white text-gray-700 font-semibold py-2 px-6 rounded-md border border-gray-300 hover:bg-gray-50">
                    Agendar una cita
                  </Link>
              </div>
            )}
            </div>
          </header>
        )}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {profile?.role === 'buyer' ? 'Mis Favoritos' : 'Mis Publicaciones'}
        </h2>
        {loading && <p>Cargando tus posts...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {posts.map(post => (
            <div key={post.id} className="relative group aspect-square">
              <Link to={`/post/${post.slug}`}>
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </Link>
              {profile?.role !== 'buyer' && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                  <Link to={`/edit-post/${post.slug}`} className="text-white bg-gray-800 bg-opacity-70 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <button onClick={() => handleDelete(post.slug)} className="text-white bg-gray-800 bg-opacity-70 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
          {!loading && posts.length === 0 && <p className="text-gray-500">Aún no has creado ninguna publicación.</p>}
        </div>
      </div>
    </div>
  );
}