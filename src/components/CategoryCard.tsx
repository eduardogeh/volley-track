import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Category } from '../types/ScoutTypes';

interface Props {
    category: Category;
    onEdit: () => void;
    onDelete: () => void;
}

function hexToRgba(hex: string = '#cccccc', alpha: number = 0.1): string {
    if (!hex || hex.length < 4) return `rgba(204, 204, 204, ${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function CategoryCard({ category, onEdit, onDelete }: Props) {

    const resultadoSubcategories = category.subcategories?.filter(sub => sub.type === 'resultado');
    const zonaSubcategories = category.subcategories?.filter(sub => sub.type === 'zona');

    const cellStyle = {
        flexGrow: 1,
        aspectRatio: '1 / 1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.7rem', // Diminuindo um pouco a fonte
        color: 'text.primary',
        lineHeight: 1.1, // Diminuindo a altura da linha
        padding: '0.2rem 0', // Reduzindo o padding vertical
    };

    return (
        <Card sx={{
            minWidth: 180,
            maxWidth: 220,
            height: 120,
            backgroundColor: hexToRgba(category.color, 0.1),
            border: `1px solid ${hexToRgba(category.color, 0.3)}`,
            display: 'flex',
        }}>
            <CardContent sx={{
                width: '100%',
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                p: 0,
                '&:last-child': { pb: 0 }
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ p: 1, height: '30%' }}> {/* Reduzindo o padding do cabeçalho */}
                    <Typography variant="subtitle1" fontWeight="bold" fontSize="0.9rem"> {/* Reduzindo a fonte do título */}
                        {category.name}
                    </Typography>
                    <Box>
                        <IconButton size="small" onClick={onEdit}><EditIcon fontSize="inherit" /></IconButton>
                        <IconButton size="small" onClick={onDelete}><DeleteIcon fontSize="inherit" /></IconButton>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', height: '70%' }}> {/* 'flexGrow: 1' REMOVIDO AQUI */}

                    {resultadoSubcategories && resultadoSubcategories.length > 0 && (
                        <Box sx={{ display: 'flex', width: '100%', borderTop: '1px solid', height: '50%', borderColor: 'divider' }}>
                            {resultadoSubcategories.map((sub, index) => (
                                <Typography
                                    key={sub.id}
                                    sx={{
                                        ...cellStyle,
                                        borderRight: index < resultadoSubcategories.length - 1 ? '1px solid' : 'none',
                                        borderColor: 'divider'
                                    }}
                                >
                                    {sub.name}
                                </Typography>
                            ))}
                        </Box>
                    )}

                    {zonaSubcategories && zonaSubcategories.length > 0 && (
                        <Box sx={{ display: 'flex', width: '100%', borderTop: '1px solid', height: '50%' , borderColor: 'divider' }}>
                            {zonaSubcategories.map((sub, index) => (
                                <Typography
                                    key={sub.id}
                                    sx={{
                                        ...cellStyle,
                                        borderRight: index < zonaSubcategories.length - 1 ? '1px solid' : 'none',
                                        borderColor: 'divider'
                                    }}
                                >
                                    {sub.name}
                                </Typography>
                            ))}
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}