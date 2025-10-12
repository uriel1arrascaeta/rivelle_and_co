import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// --- Proveedor de Autenticación ---
// Este componente envuelve a toda la aplicación y provee el estado de autenticación.
export const AuthProvider = ({ children }) => {
  // 'useState' para gestionar el token y los datos del usuario.
  // Se inicializan con los valores guardados en localStorage para mantener la sesión.
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  // Hook para poder redirigir al usuario programáticamente.
  const navigate = useNavigate();

  // Función para iniciar sesión.
  const login = (newToken, userData) => {
    // Guarda el token y los datos del usuario en localStorage para persistir la sesión.
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    // Actualiza el estado de la aplicación.
    setToken(newToken);
    setUser(userData);
  };

  // Función para cerrar sesión.
  const logout = () => {
    // Limpia el localStorage.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Resetea el estado.
    setToken(null);
    setUser(null);
    navigate('/login'); // Redirige al login después de cerrar sesión
  };

  // El objeto 'value' contiene todos los datos y funciones que queremos compartir.
  const value = {
    token,
    user,
    isLoggedIn: !!token && !!user,
    login,
    logout,
  };

  // El 'Provider' hace que el objeto 'value' esté disponible para todos los componentes hijos.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Hook Personalizado ---
// Un atajo para que los componentes puedan acceder fácilmente al contexto de autenticación.
export const useAuth = () => {
  return useContext(AuthContext);
};