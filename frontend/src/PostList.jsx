// c:\Users\hurie\OneDrive\Escritorio\rivelle_and_co\frontend\src\PostList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    <div>
      <h1>Nuestro Blog</h1>
      {posts.length === 0 && <p>No hay posts todavía. ¡Crea algunos en el panel de admin de Django!</p>}
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link to={`/post/${post.slug}`}>
              <h2>{post.title}</h2>
            </Link>
            <p>Por: {post.author} - {new Date(post.created_at).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;
