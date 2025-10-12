import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Login() {
  // 'useState' para guardar los datos del formulario (email y contraseña).
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // 'useState' para guardar y mostrar mensajes de error.
  const [error, setError] = useState(null);
  // Hook para redirigir al usuario después de un login exitoso.
  const navigate = useNavigate();
  // Obtenemos la función 'login' de nuestro contexto de autenticación.
  const { login } = useAuth();

  // Función que se ejecuta cada vez que el usuario escribe en un campo del formulario.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función que se ejecuta cuando el usuario envía el formulario.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Hacemos una petición POST a la API de login con los datos del formulario.
      const response = await fetch('http://127.0.0.1:8000/api/v1/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // El backend espera 'username' y 'password', y nuestro 'username' es el email.
        body: JSON.stringify({
          username: formData.email,
          password: formData.password
        }),
      });

      // Si la respuesta no es exitosa (ej. 400 Bad Request), procesamos el error.
      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = 'Email o contraseña incorrectos.';
        if (errorData.non_field_errors) {
            const errorString = errorData.non_field_errors.join(', ');
            errorMessage = errorString;
        }
        // Mensaje específico para cuentas de corredor pendientes de aprobación.
        if (errorData.non_field_errors && errorData.non_field_errors.includes('User account is disabled.')) {
          errorMessage = 'Tu cuenta de corredor está pendiente de aprobación por un administrador.';
        }
        throw new Error(errorMessage);
      }

      // Si la respuesta es exitosa, obtenemos los datos (token, rol, etc.).
      const data = await response.json();
      // Llamamos a la función 'login' del contexto para guardar la sesión.
      login(data.token, { role: data.role, first_name: data.first_name }); // Guardamos token y datos de usuario
      
      // Redirige al usuario a la página correcta según su rol.
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
        {/* Muestra el mensaje de error si existe. */}
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