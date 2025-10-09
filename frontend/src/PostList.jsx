// c:\Users\hurie\OneDrive\Escritorio\rivelle_and_co\frontend\src\PostList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

// Es buena práctica tener la URL de la API en una variable de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1/blog';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts/`);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError("No se pudieron cargar los posts. Asegúrate de que el servidor de Django esté corriendo y la configuración de CORS sea correcta.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <p>Cargando posts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="bg-white antialiased">
      <Navbar /> {/* Esto mostrará la versión del blog por defecto */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">Nuestro Blog</h1>
        {posts.length === 0 && !loading && <p className="text-center text-gray-500">No hay posts todavía. ¡Crea el primero!</p>}
        <div className="flex flex-col items-center gap-12">
          {posts.map(post => (
            <article key={post.id} className="w-full bg-white border border-gray-200 rounded-none sm:rounded-lg overflow-hidden max-w-xl">
              {/* Encabezado del Post */}
              <div className="flex items-center p-3 border-b border-gray-200">
                <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0"></div>
                <p className="font-semibold text-sm text-gray-800 ml-3">{post.author}</p>
              </div>

              {/* Imagen */}
              {post.image && (
                <Link to={`/post/${post.slug}`}>
                  <img src={post.image} alt={post.title} className="w-full h-auto max-h-[75vh] object-cover bg-gray-100" />
                </Link>
              )}

              {/* Barra de Acciones */}
              <div className="flex items-center justify-between p-3">
                <div className="flex gap-4">
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Título y Fecha */}
              <div className="px-4 pb-4">
                <Link to={`/post/${post.slug}`} className="hover:underline">
                  <p className="text-gray-800"><span className="font-semibold">{post.author}</span> {post.title}</p>
                </Link>
                <p className="text-xs text-gray-400 uppercase mt-2">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostList;
