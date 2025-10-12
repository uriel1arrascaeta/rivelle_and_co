
import React from 'react'
import ReactDOM from 'react-dom/client'
// Importa el componente para manejar las rutas de la aplicación.
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx'
import './index.css' 
// Importa el proveedor de contexto de autenticación.
import { AuthProvider } from './AuthContext.jsx';

// 'ReactDOM.createRoot' crea la raíz de la aplicación React en el elemento con id 'root' del HTML.
ReactDOM.createRoot(document.getElementById('root')).render(
  // 'React.StrictMode' es una herramienta para destacar problemas potenciales en la aplicación.
  <React.StrictMode>
    {/* 'Router' envuelve la aplicación para habilitar el enrutamiento de páginas. */}
    <Router>
      {/* 'AuthProvider' envuelve la aplicación para que todos los componentes puedan acceder al estado de autenticación. */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)
