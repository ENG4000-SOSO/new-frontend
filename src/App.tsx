import Layout from '@components/Layout';
import { useAuth } from '@context/auth/auth_context';
import GroundStations from "@pages/GroundStations";
import Home from '@pages/Home';
import Login from "@pages/Login";
import Mission from '@pages/Mission';
import Missions from '@pages/Missions';
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ground-stations" element={user ? <GroundStations /> : <Login />} />
          <Route path="/schedule" element={user ? <Schedule /> : <Login />} />
          <Route path="/Mission" element={user ? <Mission /> : <Login />} />
          <Route path="/Missions" element={user ? <Missions /> : <Login />} />

          <Route path="*" element={<div>404 Not Found</div>} />
        
        </Routes>
      </Layout>
    </Router>
  );
}

export default App
