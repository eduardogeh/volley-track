// src/App.tsx
import { Box, Container, Grid } from '@mui/material';

// 1. Importe nosso novo componente de botão
import { StandardButton } from '../components/StandardButton';

// 2. Importe apenas os ícones
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddchartIcon from '@mui/icons-material/Addchart';
import { Link as RouterLink } from 'react-router-dom';

const mainContainerStyle = {
    bgcolor: '#f4f6f8', // Fundo claro
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#333',
};

export function HomePage() {
    return (
        <Container maxWidth={false} component="main" sx={mainContainerStyle}>
            <Box mb={4}>
                <img src="/logo.png" alt="Logo do Projeto" style={{ maxHeight: '150px' }} />
            </Box>

            {/* Veja como o código ficou mais limpo e declarativo */}
            <Grid container spacing={2} justifyContent="center" maxWidth="md">
                <Grid>
                    <StandardButton fullWidth buttonType="primary" startIcon={<AddCircleOutlineIcon />}>
                        Novo Projeto
                    </StandardButton>
                </Grid>
                <Grid>
                    <StandardButton fullWidth buttonType="primary" startIcon={<FolderOutlinedIcon />}>
                        Projetos
                    </StandardButton>
                </Grid>
                <Grid>
                    <RouterLink to="/teams" style={{ textDecoration: 'none', width: '100%' }}>
                        <StandardButton fullWidth buttonType="primary" startIcon={<GroupOutlinedIcon />}>
                            Times
                        </StandardButton>
                    </RouterLink>
                </Grid>
                <Grid>
                    <RouterLink to="/scouts" style={{ textDecoration: 'none', width: '100%' }}>
                        <StandardButton fullWidth buttonType="primary" startIcon={<AddchartIcon />}>
                            Scouts
                        </StandardButton>
                    </RouterLink>
                </Grid>
                <Grid>
                    <StandardButton fullWidth buttonType="primary" startIcon={<BarChartIcon />}>
                        Dashboards
                    </StandardButton>
                </Grid>
            </Grid>
        </Container>
    );
}