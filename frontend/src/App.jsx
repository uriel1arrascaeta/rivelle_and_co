import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PostList from './PostList';
import Home from './pages/Home';
import PostDetail from './PostDetail';

function App() {
  return (
    <div className="app-container">
      <Router>
        <main>
          <Routes>
            <Route path="/post/:slug" element={<PostDetail />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
