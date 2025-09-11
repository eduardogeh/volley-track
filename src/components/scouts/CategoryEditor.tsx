import 'react';
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx"
import { Trash2, PlusCircle } from "lucide-react";
import type { Category, Subcategory } from '@/types/ScoutTypes.ts';
import {NumericInput} from "@/components/ui/NumericInput.tsx";

interface CategoryEditorProps {
  category: Category;
  onChange: (updatedCategory: Category) => void;
  onSave: () => void;
  onClose: () => void;
}

export function CategoryEditor({ category, onChange, onSave, onClose }: CategoryEditorProps) {

  const handleSubcategoryChange = (index: number, field: keyof Subcategory, value: string | number) => {
    const newSubcategories = [...category.subcategories];
    const finalValue = field === 'weight' ? (Number(value) || 0) : value;
    newSubcategories[index] = { ...newSubcategories[index], [field]: finalValue };
    onChange({ ...category, subcategories: newSubcategories });
  };

  const handleAddSubcategory = () => {
    const newSubcategory: Subcategory = {
      id: Date.now(),
      name: '',
      type: 'resultado',
      weight: 0,
    };
    onChange({ ...category, subcategories: [...category.subcategories, newSubcategory] });
  };

  const handleDeleteSubcategory = (indexToDelete: number) => {
    const filteredSubcategories = category.subcategories.filter((_, index) => index !== indexToDelete);
    onChange({ ...category, subcategories: filteredSubcategories });
  };

  return (
    <div>
      {/* Cabeçalho */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
        <div className="md:col-span-3">
          <Label htmlFor="category-name">Nome da Categoria</Label>
          <Input
            id="category-name"
            value={category.name}
            onChange={(e) => onChange({ ...category, name: e.target.value })}
            className="text-lg"
          />
        </div>
        <div>
          <Label htmlFor="category-color">Cor</Label>
          <Input
            id="category-color"
            type="color"
            value={category.color}
            onChange={(e) => onChange({ ...category, color: e.target.value })}
            className="h-9 w-full p-1"
          />
        </div>

        <div className="grid grid-cols-4 gap-4 md:col-span-5 mt-2">
          <div>
            <Label htmlFor="clip-before">Clip Antes (s)</Label>
            <Input
              id="clip-before"
              type="number"
              value={category.time_to_clip_before_event}
              onChange={(e) => onChange({ ...category, time_to_clip_before_event: Number(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="clip-after">Clip Depois (s)</Label>
            <Input
              id="clip-after"
              type="number"
              value={category.time_to_clip_after_event}
              onChange={(e) => onChange({ ...category, time_to_clip_after_event: Number(e.target.value) || 0 })}
            />
          </div>
        </div>
      </div>

      {/* Seção de Sub-categorias */}
      <div className="mt-6">
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">Sub-categorias</h4>

        {/* Cabeçalho da lista de subcategorias */}
        {category.subcategories.length > 0 && (
          <div className="mb-1 flex items-end gap-2 pr-10">
            <div className="flex-grow">
              <Label className="text-xs font-normal text-muted-foreground">Nome</Label>
            </div>
            <div className="w-[180px] shrink-0">
              <Label className="text-xs font-normal text-muted-foreground">Tipo</Label>
            </div>
            <div className="w-24 shrink-0">
              <Label className="text-xs font-normal text-muted-foreground">Peso</Label>
            </div>
          </div>
        )}

        {category.subcategories.map((sub, index) => (
          <div key={sub.id} className="mb-2 flex items-end gap-2">
            <div className="flex-grow">
              <Input
                id={`sub-name-${sub.id}`}
                placeholder="Nome"
                value={sub.name}
                onChange={(e) => handleSubcategoryChange(index, 'name', e.target.value)}
              />
            </div>

            <div className="w-[180px] shrink-0">
              <Select
                value={sub.type}
                onValueChange={(value) => handleSubcategoryChange(index, 'type', value)}
              >
                <SelectTrigger id={`sub-type-${sub.id}`} className="w-full">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resultado">Resultado</SelectItem>
                  <SelectItem value="zona">Zona</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-24 shrink-0">
              <NumericInput
                id={`sub-weight-${sub.id}`}
                placeholder="Peso"
                value={sub.weight || 0}
                onChange={(numericValue) => handleSubcategoryChange(index, 'weight', numericValue)}
              />
            </div>

            <Button variant="ghost" size="icon" onClick={() => handleDeleteSubcategory(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="mt-2" onClick={handleAddSubcategory}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Sub-categoria
        </Button>
      </div>

      {/* Rodapé com botões de ação */}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onSave}>
          Salvar e Fechar
        </Button>
      </div>
    </div>
  );
}