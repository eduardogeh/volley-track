// src/components/scouts/ScoutEditor.tsx
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { PlusCircle } from "lucide-react";
import { CategoryCard } from './CategoryCard.tsx';
import { CategoryEditor } from './CategoryEditor.tsx';
import type { ScoutModel, Category } from '../../types/ScoutTypes.ts';

interface ScoutEditorProps {
  initialModel: ScoutModel;
  onSave: (model: ScoutModel) => void;
}

export function ScoutEditor({ initialModel, onSave }: ScoutEditorProps) {
  const [model, setModel] = useState<ScoutModel>(initialModel);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    setModel(initialModel);
  }, [initialModel]);

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = name === 'grid_width' ? parseInt(value, 10) || 1 : value;
    setModel(prev => ({ ...prev, [name]: numericValue }));
  };

  // Função para atualizar o estado do modelo com as novas categorias
  const handleCategoriesChange = (updatedCategories: Category[]) => {
    setModel(prev => ({ ...prev, categories: updatedCategories }));

  };

  const openCategoryModal = (category: Category | null, index: number | null) => {
    // Cria uma cópia profunda para evitar mutação direta do estado
    const categoryToEdit: Category = category
      ? JSON.parse(JSON.stringify(category))
      : {
      id: Date.now(),
        name: 'Nova Categoria',
        subcategories: [],
        color: '#cccccc',
        time_to_clip_before_event: 5,
        time_to_clip_after_event: 5
    };
    setEditingCategory(categoryToEdit);
    setEditingIndex(index);
    setModalOpen(true);
  };

  // <<< ALTERADO: Esta função agora é chamada pelo 'onChange' do CategoryEditor >>>
  // Ela atualiza o estado temporário da categoria que está sendo editada no modal.
  const handleCategoryEdit = (updatedCategory: Category) => {
    setEditingCategory(updatedCategory);
  };

  const saveCategoryAndClose = () => {
    if (!editingCategory) return;

    const newCategories = [...model.categories];
    if (editingIndex !== null) {
      newCategories[editingIndex] = editingCategory;
    } else {
      newCategories.push({ ...editingCategory, id: Date.now() });
    }

    // <<< A SOLUÇÃO ESTÁ AQUI >>>
    // 1. Crie o objeto 'model' completo e atualizado primeiro.
    const updatedModel = { ...model, categories: newCategories };

    // 2. Use este novo objeto para tudo.
    handleCategoriesChange(newCategories); // Isso ainda é útil para atualizar o estado local se onSave não o fizer
    onSave(updatedModel); // Envia o modelo correto e atualizado para o banco
    closeModal();
  };

  // Deleta a categoria a partir do card na grid principal
  const handleDeleteCategoryFromGrid = (index: number) => {
    const newCategories = model.categories.filter((_, i) => i !== index);
    handleCategoriesChange(newCategories);
    onSave({ ...model, categories: newCategories });
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
            <Label htmlFor="grid-width">Colunas</Label>
            <Input id="grid-width" name="grid_width" type="number" value={model.grid_width} onChange={handleModelChange} inputMode="numeric" min={1} max={12} />
          </div>
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

        <div className="overflow-x-auto pb-4">
          <div
            className="grid justify-start gap-4"
            style={{ gridTemplateColumns: `repeat(${model.grid_width}, min-content)` }}
          >
            {model.categories.map((category, index) => (
              <CategoryCard
                key={category.id || `cat-${index}`}
                category={category}
                onEdit={() => openCategoryModal(category, index)}
                onDelete={() => handleDeleteCategoryFromGrid(index)}
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
            // <<< ALTERADO: Mapeamento correto das props >>>
            <CategoryEditor
              category={editingCategory}
              onChange={handleCategoryEdit}
              onSave={saveCategoryAndClose}
              onClose={closeModal}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}