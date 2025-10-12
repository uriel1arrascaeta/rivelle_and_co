import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

export default function AdminDashboard() {
  const [pendingAgents, setPendingAgents] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        // Hacemos las dos peticiones en paralelo para mayor eficiencia.
        const [pendingResponse, allUsersResponse] = await Promise.all([
          fetch(`${API_URL}/accounts/admin/pending-agents/`, {
            headers: { 'Authorization': `Token ${token}` },
          }),
          fetch(`${API_URL}/accounts/admin/all-users/`, {
            headers: { 'Authorization': `Token ${token}` },
          })
        ]);

        if (!pendingResponse.ok) throw new Error('No se pudieron cargar las solicitudes pendientes.');
        if (!allUsersResponse.ok) throw new Error('No se pudo cargar la lista de usuarios.');

        const pendingData = await pendingResponse.json();
        const allUsersData = await allUsersResponse.json();

        setPendingAgents(pendingData);
        setAllUsers(allUsersData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleApproval = async (userId, action) => {
    try {
      const response = await fetch(`${API_URL}/accounts/admin/agents/${userId}/approval/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) throw new Error(`Error al ${action === 'approve' ? 'aprobar' : 'rechazar'}.`);
      // Actualiza la lista en la UI para quitar al agente procesado.
      setPendingAgents(pendingAgents.filter(agent => agent.user.id !== userId));
      // Si se aprueba, lo movemos a la lista de todos los usuarios (o la recargamos)
      // Por simplicidad, por ahora solo lo quitamos de pendientes.
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white min-h-screen antialiased">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Panel de Administrador</h1>
          <p className="text-lg text-gray-600 mt-4">
            Bienvenido, admin. Desde aquí puedes gestionar usuarios y la plataforma.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Solicitudes de Corredores Pendientes</h2>
          {loading && <p>Cargando solicitudes...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-4">
            {pendingAgents.map(agent => (
              <div key={agent.user.id} className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold">{agent.user.first_name}</p>
                  <p className="text-sm text-gray-500">{agent.user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApproval(agent.user.id, 'approve')} className="bg-white border border-gray-300 text-green-600 text-sm font-semibold py-1 px-3 rounded-md hover:bg-gray-50">Aprobar</button>
                  <button onClick={() => handleApproval(agent.user.id, 'reject')} className="bg-white border border-gray-300 text-red-600 text-sm font-semibold py-1 px-3 rounded-md hover:bg-gray-50">Rechazar</button>
                </div>
              </div>
            ))}
            {!loading && pendingAgents.length === 0 && <p className="text-gray-500">No hay solicitudes pendientes.</p>}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Todos los Usuarios Registrados</h2>
          <div className="space-y-4">
            {allUsers.map(profile => (
              <div key={profile.user.id} className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold">{profile.user.first_name} <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${profile.role === 'admin' ? 'bg-blue-200 text-blue-800' : profile.role === 'agent' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>{profile.role}</span></p>
                  <p className="text-sm text-gray-500">{profile.user.email}</p>
                </div>
                <div>
                  <button className="bg-white border border-gray-300 text-red-600 text-sm font-semibold py-1 px-3 rounded-md hover:bg-gray-50">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            {!loading && allUsers.length === 0 && <p className="text-gray-500">No hay usuarios registrados.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}