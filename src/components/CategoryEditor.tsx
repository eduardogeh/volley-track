import 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// <<< NOVO: Importe os componentes do Select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, PlusCircle } from "lucide-react";

import type { Category, Subcategory } from '../types/ScoutTypes';

interface CategoryEditorProps {
  category: Category;
  onChange: (category: Category) => void;
  onDelete: () => void;
}

export function CategoryEditor({ category, onChange, onDelete }: CategoryEditorProps) {
  // A lógica de manipulação foi unificada para lidar com o Select também
  const handleSubcategoryChange = (index: number, field: keyof Subcategory, value: string | number) => {
    const newSubcategories = [...category.subcategories];
    const finalValue = field === 'weight' ? (Number(value) || 0) : value;
    newSubcategories[index] = { ...newSubcategories[index], [field]: finalValue };
    onChange({ ...category, subcategories: newSubcategories });
  };

  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="w-full pr-4">
          <Label htmlFor="category-name">Nome da Categoria</Label>
          <Input
            id="category-name"
            value={category.name}
            onChange={(e) => onChange({ ...category, name: e.target.value })}
            className="text-lg"
          />
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Seção de Sub-categorias */}
      <div className="mt-4">
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">Sub-categorias</h4>
        {category.subcategories.map((sub: Subcategory, index: number) => (
          <div key={sub.id || `new-sub-${index}`} className="mb-2 flex items-center gap-2">
            <Input placeholder="Nome" value={sub.name} onChange={(e) => handleSubcategoryChange(index, 'name', e.target.value)} />

            {/* <<< MUDANÇA: Substituição do Input pelo Select >>> */}
            <Select
              value={sub.type}
              onValueChange={(value) => handleSubcategoryChange(index, 'type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resultado">Resultado</SelectItem>
                <SelectItem value="zona">Zona</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Peso"
              type="number"
              value={sub.weight}
              onChange={(e) => handleSubcategoryChange(index, 'weight', e.target.value)}
              className="w-20"
            />
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="mt-2">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Sub-categoria
        </Button>
      </div>
    </div>
  );
}