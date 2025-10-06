import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PostList from './PostList';
import Home from './home.jsx';
import PostDetail from './PostDetail';
import Register from './Register.jsx';
import Login from './Login.jsx';
import CreatePost from './CreatePost.jsx';
import ScheduleAppointment from './ScheduleAppointment.jsx';
import EditPost from './EditPost.jsx';
import SellerProfile from './SellerProfile.jsx';

function App() {
  return (
    <div className="app-container">
      <Router>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/schedule" element={<ScheduleAppointment />} />
            <Route path="/edit-post/:slug" element={<EditPost />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/profile" element={<SellerProfile />} />
            <Route path="/blog" element={<PostList />} />
            <Route path="/post/:slug" element={<PostDetail />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
