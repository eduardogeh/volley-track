// src/components/scouts/ScoutModelEditor.tsx
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
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
    // <<< ALTERADO: Lógica simplificada para lidar apenas com grid_width
    const numericValue = name === 'grid_width' ? parseInt(value, 10) || 1 : value;
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
    <div>
      {/* Cabeçalho do Editor */}
      <div className="border-b p-4">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Editar Modelo de Scout</h2>
        <div className="flex items-end gap-4">
          <div className="flex-grow">
            <Label htmlFor="model-name">Nome do Modelo</Label>
            <Input id="model-name" name="name" value={model.name} onChange={handleModelChange} />
          </div>
          <div>
            {/* <<< ALTERADO: Label de "Largura" para "Colunas" >>> */}
            <Label htmlFor="grid-width">Colunas</Label>
            <Input id="grid-width" name="grid_width" type="number" value={model.grid_width} onChange={handleModelChange} inputMode="numeric" min={1} max={12} />
          </div>
          {/* <<< REMOVIDO: Input de "Altura Grid" >>> */}
          <Button onClick={() => onSave(model)}>Salvar Modelo</Button>
        </div>
      </div>

      {/* Seção das Categorias */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Categorias de Análise</h3>
          <Button variant="outline" size="sm" onClick={() => openCategoryModal(null, null)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Categoria
          </Button>
        </div>
        <Separator className="my-4" />

        {/* Grid de Cards de Categoria */}
        <div className="overflow-x-auto pb-4">
          <div
            className="grid justify-start gap-4"
            // <<< MUDANÇA 2: '1fr' trocado por 'min-content' >>>
            style={{ gridTemplateColumns: `repeat(${model.grid_width}, min-content)` }}
          >
            {model.categories.map((category, index) => (
              <CategoryCard
                key={category.id || `cat-${index}`}
                category={category}
                onEdit={() => openCategoryModal(category, index)}
                onDelete={() => handleDeleteCategory(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal/Dialog para Editar Categoria */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingIndex !== null ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryEditor
              category={editingCategory}
              onChange={saveCategory}
              onDelete={closeModal} // onClose foi renomeado para onDelete no seu componente
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
