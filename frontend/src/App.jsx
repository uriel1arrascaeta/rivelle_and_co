import './App.css'
import { useState, useEffect } from 'react'

function App() {
  return (
    <>
      <h1>Vite + React</h1>
    </>
  )
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Llama a la API del backend de Django
    fetch('http://127.0.0.1:8000/api/hello/')
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
      })
      .catch(error => {
        console.error("Hubo un error al obtener los datos:", error);
      });
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez

  return (
    <div>
      <h1>Frontend con React</h1>
      <p>Mensaje del Backend: <strong>{message || "Cargando..."}</strong></p>
    </div>
  );
}

export default App
