import { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Category, Subcategory } from '@/types/ScoutTypes';

interface InteractiveCategoryCardProps {
  category: Category;
  onScoutComplete: (combination: { category: Category, resultado: Subcategory, zona: Subcategory }) => void;
}

function hexToRgba(hex: string = '#cccccc', alpha: number = 0.1): string {
  if (!hex || hex.length < 4) return `rgba(204, 204, 204, ${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function InteractiveCategoryCard({ category, onScoutComplete }: InteractiveCategoryCardProps) {
  const [selectedResultado, setSelectedResultado] = useState<Subcategory | null>(null);
  const [selectedZona, setSelectedZona] = useState<Subcategory | null>(null);

  const resultadoSubcategories = category.subcategories?.filter(sub => sub.type === 'resultado');
  const zonaSubcategories = category.subcategories?.filter(sub => sub.type === 'zona');

  useEffect(() => {
    if (selectedResultado && selectedZona) {
      onScoutComplete({ category, resultado: selectedResultado, zona: selectedZona });

      const timer = setTimeout(() => {
        setSelectedResultado(null);
        setSelectedZona(null);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [selectedResultado, selectedZona, category, onScoutComplete]);

  const cardStyle = {
    backgroundColor: hexToRgba(category.color, 0.25),
    borderColor: hexToRgba(category.color, 0.4),
  };

  return (
    <Card className="flex flex-col h-[100px] w-[180px] p-0" style={cardStyle}>
      <CardContent className="flex h-full w-full flex-col p-0">
        <div className="flex h-[40px] items-center p-0">
          <CardTitle className="text-base font-bold">{category.name}</CardTitle>
        </div>
        <div className="flex flex-col flex-grow">
          {/* Linha de Resultados */}
          <div className="flex flex-grow w-full border-t">
            {resultadoSubcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedResultado(sub)}
                className={cn(
                  "flex flex-grow basis-0 items-center justify-center border-r border-border/50 last:border-r-0 transition-colors",
                  selectedResultado?.id === sub.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                )}
              >
                <span className="text-base font-medium">{sub.name}</span>
              </button>
            ))}
          </div>
          {/* Linha de Zonas */}
          <div className="flex flex-grow w-full border-t">
            {zonaSubcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedZona(sub)}
                className={cn(
                  "flex flex-grow basis-0 items-center justify-center border-r border-border/50 last:border-r-0 transition-colors",
                  selectedZona?.id === sub.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                )}
              >
                <span className="text-base font-medium">{sub.name}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}