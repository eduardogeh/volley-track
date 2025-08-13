// src/components/scouts/ScoutModelEditor.tsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Paper, Divider, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CategoryCard } from './CategoryCard';
import { CategoryEditor } from './CategoryEditor'; // Supondo que você tenha este componente para o modal
import type { ScoutModel, Category } from '../types/ScoutTypes';

interface ScoutModelEditorProps {
    initialModel: ScoutModel;
    onSave: (model: ScoutModel) => void;
}

export function ScoutEditor({ initialModel, onSave }: ScoutModelEditorProps) {
    const [model, setModel] = useState<ScoutModel>(initialModel);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    useEffect(() => {
        setModel(initialModel);
    }, [initialModel]);

    const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Garante que valores numéricos sejam salvos como números
        const numericValue = (name === 'grid_width' || name === 'grid_height') ? parseInt(value, 10) || 1 : value;
        setModel(prev => ({ ...prev, [name]: numericValue }));
    };

    const handleCategoriesChange = (updatedCategories: Category[]) => {
        setModel(prev => ({ ...prev, categories: updatedCategories }));
    };

    const openCategoryModal = (category: Category | null, index: number | null) => {
        const emptyCategory = { id: Date.now(), name: 'Nova Categoria', subcategories: [], color: '#cccccc' };
        setEditingCategory(category ?? emptyCategory);
        setEditingIndex(index);
        setModalOpen(true);
    };

    const saveCategory = (updatedCategory: Category) => {
        const newCategories = [...model.categories];
        if (editingIndex !== null) {
            newCategories[editingIndex] = updatedCategory;
        } else {
            newCategories.push({ ...updatedCategory, id: Date.now() }); // Garante um ID temporário para a key
        }
        handleCategoriesChange(newCategories);
        closeModal();
    };

    const handleDeleteCategory = (index: number) => {
        const newCategories = model.categories.filter((_, i) => i !== index);
        handleCategoriesChange(newCategories);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
        setEditingIndex(null);
    };


    return (
        <Box>
            <Paper elevation={0} sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
                <Typography variant="h5" gutterBottom>Editar Modelo de Scout</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField name="name" label="Nome do Modelo" value={model.name} onChange={handleModelChange} sx={{ flexGrow: 1 }} />
                    <TextField name="grid_width" label="Largura Grid" type="number" value={model.grid_width} onChange={handleModelChange} inputProps={{ min: 1, max: 12 }} />
                    <TextField name="grid_height" label="Altura Grid" type="number" value={model.grid_height} onChange={handleModelChange} inputProps={{ min: 1 }} />
                    <Button variant="contained" onClick={() => onSave(model)}>Salvar Modelo</Button>
                </Box>
            </Paper>

            <Box sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Categorias de Análise</Typography>
                    <Button size="small" startIcon={<AddIcon />} onClick={() => openCategoryModal(null, null)}>
                        Adicionar Categoria
                    </Button>
                </Box>
                <Divider sx={{ my: 2 }} />

                {/* --- ÁREA DO GRID ATUALIZADA --- */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${model.grid_width}, min-content)`,
                        justifyContent: 'start',
                        gap: 2
                    }}
                >
                    {model.categories.map((category, index) => (
                        // -> 2. O <Grid item> não é mais necessário
                        <CategoryCard
                            key={category.id || `cat-${index}`}
                            category={category}
                            onEdit={() => openCategoryModal(category, index)}
                            onDelete={() => handleDeleteCategory(index)}
                        />
                    ))}
                </Box>
            </Box>

            <Modal open={modalOpen} onClose={closeModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}>
                    {editingCategory && (
                        <CategoryEditor
                            category={editingCategory}
                            onChange={saveCategory}
                            onClose={closeModal}
                        />
                    )}
                </Box>
            </Modal>
        </Box>
    );
}
