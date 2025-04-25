import Layout from '@components/Layout';
import { useAuth } from '@context/auth/auth_context';
import GroundStations from "@pages/GroundStations";
import Home from '@pages/Home';
import Login from "@pages/Login";
import Mission from '@pages/Mission';
import Missions from '@pages/Missions';
import Register from '@pages/Register';
import Satellites from '@pages/Satellites';
import Schedule from '@pages/Schedule';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {

  const { user } = useAuth();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route path="/satellites" element={user ? <Satellites /> : <Login />} />
          <Route path="/groundstations" element={user ? <GroundStations /> : <Login />} />
          <Route path="/missions" element={user ? <Missions /> : <Login />} />
          <Route path="/missions/:id" element={user ? <Mission /> : <Login />} />
          <Route path="/schedule/:id" element={user ? <Schedule /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ground-stations" element={user ? <GroundStations /> : <Login />} />
          <Route path="/schedule" element={user ? <Schedule /> : <Login />} />
          <Route path="/Mission" element={user ? <Mission /> : <Login />} />
          <Route path="/Missions" element={user ? <Missions /> : <Login />} />
          <Route path="/Login" element={<Login />} />

          <Route path="*" element={<div>404 Not Found</div>} />
        
        </Routes>
      </Layout>
    </Router>
  );
}

export default App
