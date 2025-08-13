// src/App.tsx
import 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { HomePage } from './pages/HomePage.tsx';
import { TeamManagementPage } from './pages/TeamManagementPage';
import {ScoutsPage} from "./pages/ScoutsPage.tsx";

const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#9c27b0' },
        background: { default: '#f4f6f8' },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Normaliza o CSS e aplica a cor de fundo do tema */}
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/teams" element={<TeamManagementPage />} />
                    <Route path="/scouts" element={<ScoutsPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;