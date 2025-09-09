import { Card, CardContent, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Pencil, Trash2 } from "lucide-react";

import type { Category } from '../../types/ScoutTypes.ts';

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

  const cardStyle = {
    backgroundColor: hexToRgba(category.color, 0.25),
    borderColor: hexToRgba(category.color, 0.4),
  };

  return (
    <Card className="flex h-[160px] min-w-[200px] max-w-[260px]" style={cardStyle}>
      <CardContent className="flex h-full w-full flex-col p-0">

        {/* <<< ALTERADO: Layout do cabeçalho ajustado para 'justify-between' >>> */}
        <div className="flex h-[30%] items-center justify-between p-2">
          <CardTitle className="text-base font-bold">{category.name}</CardTitle>
          {/* <<< ALTERADO: Removido o posicionamento absoluto dos botões >>> */}
          <div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
              <Pencil className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}>
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Corpo com as subcategorias */}
        <div className="flex h-[70%] flex-col">
          {resultadoSubcategories && resultadoSubcategories.length > 0 && (
            <div className="flex h-1/2 w-full border-t">
              {resultadoSubcategories.map((sub) => (
                <div key={sub.id} className="flex flex-grow basis-0 items-center justify-center border-r border-border/50 last:border-r-0">
                  <span className="text-base font-medium">{sub.name}</span>
                </div>
              ))}
            </div>
          )}

          {zonaSubcategories && zonaSubcategories.length > 0 && (
            <div className="flex h-1/2 w-full border-t">
              {zonaSubcategories.map((sub) => (
                <div key={sub.id} className="flex flex-grow basis-0 items-center justify-center border-r border-border/50 last:border-r-0">
                  <span className="text-base font-medium">{sub.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}