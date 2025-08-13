import { useState, useEffect } from 'react';
import {
    Box, Paper, Button, Typography, List, ListItemButton, ListItemText, IconButton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { ScoutEditor } from '../components/ScoutEditor';
import type { ScoutModel } from '../types/ScoutTypes';

export function ScoutsPage() {
    const [scouts, setScouts] = useState<ScoutModel[]>([]);
    const [selectedScout, setSelectedScout] = useState<ScoutModel | null>(null);

    // MOCK DE SCOUT
    const mockScout: ScoutModel = {
        id: 1,
        name: 'Scout Completo',
        grid_width: 3,
        grid_height: 4,
        categories: [
            {
                id: 1,
                name: 'Saque',
                color: '#4CAF50',
                subcategories: [
                    {id: 1, name: '+', type: 'resultado'},
                    {id: 2, name: '-', type: 'resultado'},
                    {id: 3, name: 'erro', type: 'resultado'},
                    {id: 20, name: 'Ponto', type: 'resultado'},
                    {id: 4, name: '1', type: 'zona'},
                    {id: 5, name: '5', type: 'zona'},
                    {id: 6, name: '6', type: 'zona'},
                ]
            },
            {
                id: 2,
                name: 'Ataque',
                color: '#FAF045',
                subcategories: [
                    {id: 7, name: '+', type: 'resultado'},
                    {id: 8, name: '-', type: 'resultado'},
                    {id: 9, name: 'erro', type: 'resultado'},
                    {id: 10, name: '1', type: 'zona'},
                    {id: 11, name: '6', type: 'zona'},
                ]
            },
            {
                id: 2,
                name: 'Ataque',
                color: '#1cffc2',
                subcategories: [
                    {id: 7, name: '+', type: 'resultado'},
                    {id: 8, name: '-', type: 'resultado'},
                    {id: 9, name: 'erro', type: 'resultado'},
                    {id: 10, name: '1', type: 'zona'},
                    {id: 11, name: '6', type: 'zona'},
                ]
            },
            {
                id: 2,
                name: 'Ataque',
                color: '#f20135',
                subcategories: [
                    {id: 7, name: '+', type: 'resultado'},
                    {id: 8, name: '-', type: 'resultado'},
                    {id: 9, name: 'erro', type: 'resultado'},
                    {id: 10, name: '1', type: 'zona'},
                    {id: 11, name: '6', type: 'zona'},
                ]
            },
            {
                id: 2,
                name: 'Ataque',
                color: '#0121f2',
                subcategories: [
                    {id: 7, name: '+', type: 'resultado'},
                    {id: 8, name: '-', type: 'resultado'},
                    {id: 9, name: 'erro', type: 'resultado'},
                    {id: 10, name: '1', type: 'zona'},
                    {id: 11, name: '6', type: 'zona'},
                ]
            },
            {
                id: 2,
                name: 'Ataque',
                color: '#b601f2',
                subcategories: [
                    {id: 7, name: '+', type: 'resultado'},
                    {id: 8, name: '-', type: 'resultado'},
                    {id: 9, name: 'erro', type: 'resultado'},
                    {id: 10, name: '1', type: 'zona'},
                    {id: 11, name: '6', type: 'zona'},
                ]
            }
        ]
    };

    useEffect(() => {
        // Substitui o uso da API por um mock local
        setTimeout(() => {
            setScouts([mockScout]);
            setSelectedScout(mockScout);
        }, 100); // simula carregamento
    }, []);

    const handleAddNewScout = async () => {
        alert('Adicionar novo scout ainda não implementado');
    };

    const handleUpdateScout = async (scout: ScoutModel) => {
        console.log('Atualizando scout (mock)', scout);
    };

    return (
        <Box sx={{height: '100vh', width: '100vw', p: 2, pt: 8, boxSizing: 'border-box'}}>
            <RouterLink to="/" style={{position: 'absolute', top: 16, left: 16, zIndex: 10}}>
                <Button variant="contained" startIcon={<ArrowBackIcon/>}>Voltar</Button>
            </RouterLink>

            <Box sx={{display: 'flex', flexDirection: 'row', height: '100%', gap: 2}}>
                <Box sx={{flexBasis: '33.33%', flexShrink: 0}}>
                    <Paper elevation={1} sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <Box sx={{
                            p: 1, pl: 2, borderBottom: '1px solid #ddd',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <Typography variant="h6">Scouts</Typography>
                            <IconButton onClick={handleAddNewScout} color="primary" title="Adicionar novo scout">
                                <AddCircleOutlineIcon/>
                            </IconButton>
                        </Box>
                        <Box sx={{flexGrow: 1, overflowY: 'auto'}}>
                            <List sx={{pt: 0}}>
                                {scouts.map((scout) => (
                                    <ListItemButton
                                        key={scout.id}
                                        selected={selectedScout?.id === scout.id}
                                        onClick={() => setSelectedScout(scout)}
                                    >
                                        <ListItemText primary={scout.name}/>
                                    </ListItemButton>
                                ))}
                            </List>
                        </Box>
                    </Paper>
                </Box>

                <Box sx={{flexBasis: '66.67%', flexGrow: 1, minWidth: 0}}>
                    <Paper elevation={3} sx={{height: '100%', overflowY: 'auto'}}>
                        {selectedScout ? (
                            <ScoutEditor
                                key={selectedScout.id}
                                initialModel={selectedScout}
                                onSave={handleUpdateScout}
                            />
                        ) : (
                            <Box sx={{
                                p: 3, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', height: '100%'
                            }}>
                                <Typography variant="h6" color="textSecondary">
                                    Selecione ou crie um scout para começar.
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}
