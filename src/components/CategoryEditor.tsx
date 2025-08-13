import 'react';
import { Paper, Box, TextField, Typography, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { Category, Subcategory } from '../types/ScoutTypes';

interface CategoryEditorProps {
    category: Category;
    onChange: (category: Category) => void;
    onDelete: () => void;
}

export function CategoryEditor({ category, onChange, onDelete }: CategoryEditorProps) {

    // -> O HANDLER AGORA CONVERTE O PESO PARA NÚMERO
    const handleSubcategoryChange = (index: number, field: keyof Subcategory, value: string | number) => {
        const newSubcategories = [...category.subcategories];
        // Converte para número se o campo for 'weight'
        const finalValue = field === 'weight' ? (Number(value) || 0) : value;

        newSubcategories[index] = { ...newSubcategories[index], [field]: finalValue };
        onChange({ ...category, subcategories: newSubcategories });
    };

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextField
                    variant="standard"
                    label="Nome da Categoria"
                    value={category.name}
                    onChange={(e) => onChange({ ...category, name: e.target.value })}
                />
                <IconButton onClick={onDelete}><DeleteIcon /></IconButton>
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Sub-categorias</Typography>
                {category.subcategories.map((sub: Subcategory, index: number) => (
                    <Box key={sub.id || `new-sub-${index}`} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                        <TextField size="small" label="Nome" value={sub.name} onChange={(e) => handleSubcategoryChange(index, 'name', e.target.value)} />
                        <TextField size="small" label="Grupo" value={sub.type} onChange={(e) => handleSubcategoryChange(index, 'type', e.target.value)} />

                        {/* -> INPUT DE PESO ADICIONADO <- */}
                        <TextField
                            size="small"
                            label="Peso"
                            type="number"
                            value={sub.weight}
                            onChange={(e) => handleSubcategoryChange(index, 'weight', e.target.value)}
                            sx={{ width: '80px' }} // Define uma largura fixa para o campo de peso
                        />

                        <IconButton size="small" /* onClick={() => handleDeleteSubcategory(index)} */><DeleteIcon fontSize="small" /></IconButton>
                    </Box>
                ))}
                <Button size="small" startIcon={<AddIcon />}>Adicionar Sub-categoria</Button>
            </Box>
        </Paper>
    );
}