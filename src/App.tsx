import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth } from '@context/auth_context';
import Layout from '@components/Layout';
import Home from '@pages/Home';
import Satellites from '@pages/Satellites';
import Register from '@pages/Register';
import Login from "@pages/Login"

function App() {

  const { user } = useAuth();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route path="/satellites" element={user ? <Satellites /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App
