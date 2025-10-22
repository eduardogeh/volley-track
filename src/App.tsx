import 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import { HomePage } from './pages/HomePage.tsx';
import { TeamManagementPage } from './pages/TeamManagementPage';
import { ScoutsPage } from "./pages/ScoutsPage.tsx";
import {ProjectManagementPage} from "@/pages/ProjectManagementPage.tsx";
import {AnalysisPage} from "@/pages/AnalysisPage.tsx";
import {ReportsPage} from "@/pages/ReportsPage.tsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teams" element={<TeamManagementPage />} />
          <Route path="/scouts" element={<ScoutsPage />} />
          <Route path="/projects" element={<ProjectManagementPage />} />
          <Route path="/analysis/:projectId" element={<AnalysisPage />} />
          <Route path="dashboards" element={<ReportsPage />} />
        </Routes>
      </Router>
      <Toaster richColors position="bottom-right" />
    </>
  );
}

export default App;