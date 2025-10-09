import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [image, setImage] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleExtraImagesChange = (e) => {
    setExtraImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión para crear un post.');
      return;
    }

    const postData = new FormData();
    postData.append('title', formData.title);
    postData.append('content', formData.content);
    if (image) {
      postData.append('image', image);
    }
    for (const img of extraImages) {
      postData.append('uploaded_images', img);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/blog/posts/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`, // <-- Enviamos el token de autenticación
        },
        body: postData, // Usamos FormData para enviar archivos
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al crear el post.');
      }

      // Si todo sale bien, lo redirigimos al blog para que vea su nuevo post
      navigate('/blog');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">Crear Nuevo Post</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">{error}</div>}
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal</label>
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} required className="w-full px-4 py-2 mb-4 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes Adicionales (opcional)</label>
          <input type="file" name="extra_images" accept="image/*" multiple onChange={handleExtraImagesChange} className="w-full px-4 py-2 mb-4 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          <input type="text" name="title" placeholder="Título del post" onChange={handleChange} required className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600" />
          <textarea name="content" placeholder="Contenido del post..." onChange={handleChange} required rows="10" className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"></textarea>
          <button type="submit" className="w-full px-6 py-3 text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">Publicar Post</button>
        </form>
      </div>
    </div>
  );
}