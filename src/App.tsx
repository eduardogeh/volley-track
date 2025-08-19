import 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import { HomePage } from './pages/HomePage.tsx';
import { TeamManagementPage } from './pages/TeamManagementPage';
import { ScoutsPage } from "./pages/ScoutsPage.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/teams" element={<TeamManagementPage />} />
        <Route path="/scouts" element={<ScoutsPage />} />
      </Routes>
    </Router>
  );
}

export default App;