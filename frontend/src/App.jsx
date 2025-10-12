import { Routes, Route } from 'react-router-dom';
import './App.css';
import PostList from './PostList';
import Home from './home.jsx';
import PostDetail from './PostDetail';
import Register from './Register.jsx';
import Login from './Login.jsx';
import CreatePost from './CreatePost.jsx';
import ScheduleAppointment from './ScheduleAppointment.jsx';
import EditPost from './EditPost.jsx';
import EditProfilePage from './EditProfilePage.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import SellerProfile from './SellerProfile.jsx';

function App() {
  return (
    // Contenedor principal de la aplicación.
    <div className="app-container">
      <main>
        {/* El componente 'Routes' envuelve todas las definiciones de rutas. */}
        <Routes>
          {/* Cada 'Route' mapea una URL ('path') a un componente específico ('element'). */}
          
          {/* Ruta para la página de inicio. */}
          <Route path="/" element={<Home />} />
          {/* Rutas para el registro e inicio de sesión. */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Ruta para la página de agendar citas. */}
          <Route path="/schedule" element={<ScheduleAppointment />} />
          {/* Ruta para editar un post. ':slug' es un parámetro dinámico. */}
          <Route path="/edit-post/:slug" element={<EditPost />} />
          {/* Ruta para editar el perfil del usuario. */}
            <Route path="/edit-profile" element={<EditProfilePage />} />
          {/* Ruta para el panel de control del administrador. */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* Ruta para crear un nuevo post. */}
          <Route path="/create-post" element={<CreatePost />} />
          {/* Ruta para el perfil del usuario (corredor o comprador). */}
          <Route path="/profile" element={<SellerProfile />} />
          {/* Ruta para el blog (lista de posts). */}
          <Route path="/blog" element={<PostList />} />
          {/* Ruta para ver el detalle de un post específico. */}
          <Route path="/post/:slug" element={<PostDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
