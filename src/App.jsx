import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LeadsList from './pages/LeadsList';
import LeadDetails from './pages/LeadDetails';
import ProspectSearch from './pages/ProspectSearch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<LeadsList />} />
        <Route path="/leads/:id" element={<LeadDetails />} />
        <Route path="/recherche" element={<ProspectSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
