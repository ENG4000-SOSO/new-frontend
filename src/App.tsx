import Layout from '@components/Layout';
import { useAuth } from '@context/auth_context';
import GroundStations from "@pages/GroundStations";
import Home from '@pages/Home';
import Login from "@pages/Login";
import Register from '@pages/Register';
import Satellites from '@pages/Satellites';
import Schedule from "@pages/Schedule";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';


function App() {

  const { user } = useAuth();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route path="/satellites" element={user ? <Satellites /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ground-stations" element={user ? <GroundStations /> : <Login />} />
          <Route path="/schedule" element={user ? <Schedule /> : <Login />} />
        
        </Routes>
      </Layout>
    </Router>
  );
}

export default App
