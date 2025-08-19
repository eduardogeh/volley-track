import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; // Usado para as divisórias
import { Pencil, Trash2 } from "lucide-react";

import type { Category } from '../types/ScoutTypes';

interface Props {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

// A função auxiliar para converter HEX para RGBA permanece a mesma
function hexToRgba(hex: string = '#cccccc', alpha: number = 0.1): string {
  if (!hex || hex.length < 4) return `rgba(204, 204, 204, ${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function CategoryCard({ category, onEdit, onDelete }: Props) {
  // A lógica de filtragem permanece a mesma
  const resultadoSubcategories = category.subcategories?.filter(sub => sub.type === 'resultado');
  const zonaSubcategories = category.subcategories?.filter(sub => sub.type === 'zona');

  // <<< MUDANÇA: Estilos dinâmicos para o Card
  const cardStyle = {
    backgroundColor: hexToRgba(category.color, 0.1),
    borderColor: hexToRgba(category.color, 0.3),
  };

  return (
    <Card className="flex h-[120px] min-w-[180px] max-w-[220px]" style={cardStyle}>
      <CardContent className="flex h-full w-full flex-col p-0">
        {/* Cabeçalho do Card */}
        <div className="flex h-[30%] items-center justify-between p-2">
          <CardTitle className="text-sm font-bold">{category.name}</CardTitle>
          <div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Corpo com as subcategorias */}
        <div className="flex h-[70%] flex-col">
          {resultadoSubcategories && resultadoSubcategories.length > 0 && (
            <div className="flex h-1/2 w-full border-t">
              {resultadoSubcategories.map((sub) => (
                <div key={sub.id} className="group flex flex-grow basis-0 items-center justify-center">
                  <span className="text-xs">{sub.name}</span>
                  {/* Adiciona separador vertical, exceto no último item */}
                  <Separator orientation="vertical" className="last-of-type:hidden" />
                </div>
              ))}
            </div>
          )}

          {zonaSubcategories && zonaSubcategories.length > 0 && (
            <div className="flex h-1/2 w-full border-t">
              {zonaSubcategories.map((sub) => (
                <div key={sub.id} className="group flex flex-grow basis-0 items-center justify-center">
                  <span className="text-xs">{sub.name}</span>
                  <Separator orientation="vertical" className="last-of-type:hidden" />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}