import './App.css';

import Layout from '@components/Layout';
import { useAuth } from '@context/auth/auth_context';
import Home from '@pages/Home';
import Login from "@pages/Login";
import Register from '@pages/Register';
import Satellites from '@pages/Satellites';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  const { user } = useAuth();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route path="/satellites" element={user ? <Satellites /> : <Login />} />
          <Route path="/groundstations" element={user ? <Satellites /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
