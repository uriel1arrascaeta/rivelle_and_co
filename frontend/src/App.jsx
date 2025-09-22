import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PostList from './PostList';
import PostDetail from './PostDetail';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Inicio</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post/:slug" element={<PostDetail />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
