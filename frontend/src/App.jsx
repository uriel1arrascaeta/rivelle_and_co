import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hacemos la petición a la API de Django para obtener los productos
    fetch('http://127.0.0.1:8000/api/products/')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error("Hubo un error al obtener los productos:", error);
        setError("No se pudieron cargar los productos. Asegúrate de que el servidor de Django esté corriendo y la configuración de CORS sea correcta.");
      });
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez

  return (
    <>
      <h1>Lista de Productos desde Django</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="card">
        {products.length > 0 ? (
          <ul>
            {products.map(product => (
              <li key={product.id}>{product.name} - ${product.price}</li>
            ))}
          </ul>
        ) : (
          !error && <p>Cargando productos...</p>
        )}
      </div>
    </>
  );
}

export default App;
