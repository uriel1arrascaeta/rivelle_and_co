// c:\Users\hurie\OneDrive\Escritorio\rivelle_and_co\frontend\src\PostDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

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
    <div className="post-detail-container">
      <article className="post-detail-article">
        <h1>{post.title}</h1>
        <p>Por: {post.author} - {new Date(post.created_at).toLocaleDateString()}</p>
        {/* Usamos dangerouslySetInnerHTML si tu contenido tiene HTML */}
        <div className="content" dangerouslySetInnerHTML={{ __html: post.content }} />
        <br />
        <Link to="/">← Volver a la lista</Link>
      </article>
    </div>
  );
}

export default PostDetail;
