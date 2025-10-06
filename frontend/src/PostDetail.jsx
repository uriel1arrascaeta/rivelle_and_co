// c:\Users\hurie\OneDrive\Escritorio\rivelle_and_co\frontend\src\PostDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1/blog';

function PostDetail() {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams(); // Obtenemos el 'slug' de la URL

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API_URL}/posts/${slug}/`);
        if (!response.ok) throw new Error('Post no encontrado');
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <p>Cargando post...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return null;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <article className="max-w-xl w-full bg-white border border-gray-200 rounded-lg shadow-md">
          {/* Encabezado del Post */}
          <div className="flex items-center p-4 border-b">
            <p className="font-semibold text-gray-800">{post.author}</p>
          </div>

          {/* Imagen Principal */}
          {post.image && <img src={post.image} alt={post.title} className="w-full h-auto max-h-[60vh] object-contain bg-black" />}

          {/* Contenido del Post */}
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
            <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: post.content }} />
            <p className="text-xs text-gray-400 mt-4 uppercase">{new Date(post.created_at).toLocaleDateString()}</p>
          </div>

          {/* Galería de Imágenes Adicionales */}
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-3 gap-1 p-1">
              {post.images.map(img => <img key={img.id} src={img.image} alt="Galería" className="w-full h-32 object-cover" />)}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

export default PostDetail;
