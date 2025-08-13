import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Typography, Avatar } from '@mui/material';
import type {Team} from "../../types/TeamPlayersTypes.ts";

export function TeamEditor({ team, onSave }: { team: Team | null, onSave?: (team: Team) => void }) {
    const [editedTeam, setEditedTeam] = useState<Team | null>(team);
    // -> 1. Crie uma ref para o input da logo
    const logoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setEditedTeam(team);
    }, [team]);

    if (!editedTeam) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedTeam(prevTeam => prevTeam ? { ...prevTeam, [name]: value } : null);
    };

    // -> 2. Crie a função para manipular a seleção da nova logo
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                // Atualiza o estado com a nova logo em base64
                setEditedTeam(prevTeam => prevTeam ? { ...prevTeam, logo: reader.result as string } : null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (editedTeam) {
            onSave?.(editedTeam);
        }
    };

    return (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 3, borderBottom: '1px solid #ddd' }}>
            {/* -> 3. Faça a área da logo ser clicável */}
            <Box onClick={() => logoInputRef.current?.click()} sx={{ cursor: 'pointer' }}>
                <Avatar src={editedTeam.logo} sx={{ width: 80, height: 80 }} variant="rounded" />
                <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
                <TextField
                    fullWidth
                    label="Nome do Time"
                    variant="outlined"
                    name="name"
                    value={editedTeam.name || ''}
                    onChange={handleChange}
                />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="caption">Cor</Typography>
                <Box
                    component="input"
                    type="color"
                    name="color"
                    value={editedTeam.color}
                    onChange={handleChange}
                    sx={{ width: 50, height: 50, border: 'none', padding: 0, background: 'none', cursor: 'pointer' }}
                />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                    component="button"
                    onClick={handleSave}
                    sx={{
                        padding: '6px 12px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#115293' }
                    }}
                >
                    Salvar
                </Box>
            </Box>
        </Box>
    );
}