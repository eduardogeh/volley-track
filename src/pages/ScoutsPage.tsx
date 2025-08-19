import { useState, useEffect } from 'react';
// <<< MUDANÇA: Imports do shadcn/ui e lucide-react
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Link as RouterLink } from 'react-router-dom';

import { ScoutEditor } from '../components/ScoutEditor';
import type { ScoutModel } from '../types/ScoutTypes';

export function ScoutsPage() {
  const [scouts, setScouts] = useState<ScoutModel[]>([]);
  const [selectedScout, setSelectedScout] = useState<ScoutModel | null>(null);

    // MOCK DE SCOUT
    const mockScout: ScoutModel = {
        id: 1,
        name: 'Scout Completo',
        grid_width: 3,
        grid_height: 4,
        categories: [
            {
                id: 1,
                name: 'Saque',
                color: '#4CAF50',
                subcategories: [
                    {id: 1, name: '+', type: 'resultado'},
                    {id: 2, name: '-', type: 'resultado'},
                    {id: 3, name: 'erro', type: 'resultado'},
                    {id: 20, name: 'Ponto', type: 'resultado'},
                    {id: 4, name: '1', type: 'zona'},
                    {id: 5, name: '5', type: 'zona'},
                    {id: 6, name: '6', type: 'zona'},
                ]
            },
            {
                id: 2,
                name: 'Ataque',
                color: '#FAF045',
                subcategories: [
                    {id: 7, name: '+', type: 'resultado'},
                    {id: 8, name: '-', type: 'resultado'},
                    {id: 9, name: 'erro', type: 'resultado'},
                    {id: 10, name: '1', type: 'zona'},
                    {id: 11, name: '6', type: 'zona'},
                ]
            },
            {
                id: 2,
                name: 'Ataque',
                color: '#1cffc2',
                subcategories: [
                    {id: 7, name: '+', type: 'resultado'},
                    {id: 8, name: '-', type: 'resultado'},
                    {id: 9, name: 'erro', type: 'resultado'},
                    {id: 10, name: '1', type: 'zona'},
                    {id: 11, name: '6', type: 'zona'},
                ]
            },
            {
                id: 2,
                name: 'Ataque',
                color: '#f20135',
                subcategories: [
                    {id: 7, name: '+', type: 'resultado'},
                    {id: 8, name: '-', type: 'resultado'},
                    {id: 9, name: 'erro', type: 'resultado'},
                    {id: 10, name: '1', type: 'zona'},
                    {id: 11, name: '6', type: 'zona'},
                ]
            },
            {
                id: 2,
                name: 'Ataque',
                color: '#0121f2',
                subcategories: [
                    {id: 7, name: '+', type: 'resultado'},
                    {id: 8, name: '-', type: 'resultado'},
                    {id: 9, name: 'erro', type: 'resultado'},
                    {id: 10, name: '1', type: 'zona'},
                    {id: 11, name: '6', type: 'zona'},
                ]
            },
            {
                id: 2,
                name: 'Ataque',
                color: '#b601f2',
                subcategories: [
                    {id: 7, name: '+', type: 'resultado'},
                    {id: 8, name: '-', type: 'resultado'},
                    {id: 9, name: 'erro', type: 'resultado'},
                    {id: 10, name: '1', type: 'zona'},
                    {id: 11, name: '6', type: 'zona'},
                ]
            }
        ]
    };

  useEffect(() => {
    setTimeout(() => {
      setScouts([mockScout]);
      setSelectedScout(mockScout);
    }, 100);
  }, []);

  const handleAddNewScout = async () => {
    alert('Adicionar novo scout ainda não implementado');
  };

  const handleUpdateScout = async (scout: ScoutModel) => {
    console.log('Atualizando scout (mock)', scout);
  };

  return (
    // <<< MUDANÇA: Layout principal com Tailwind CSS
    <main className="box-border h-screen w-screen p-2 pt-16">
      {/* <<< MUDANÇA: Botão "Voltar" com shadcn e 'asChild' para roteamento */}
      <Button asChild className="absolute left-4 top-4 z-10">
        <RouterLink to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </RouterLink>
      </Button>

      {/* <<< MUDANÇA: Estrutura de duas colunas com Flexbox do Tailwind */}
      <div className="flex h-full flex-row gap-2">
        {/* Coluna da Esquerda (Sidebar) */}
        <aside className="basis-1/3 shrink-0">
          {/* <<< MUDANÇA: Substituição do Paper por div com estilo de card */}
          <div className="flex h-full flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
            {/* Cabeçalho da Sidebar */}
            <div className="flex items-center justify-between border-b p-2 pl-4">
              <h3 className="text-lg font-semibold">Scouts</h3>
              <Button variant="ghost" size="icon" onClick={handleAddNewScout} title="Adicionar novo scout">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
            {/* Lista de Scouts */}
            <div className="flex-grow overflow-y-auto p-1">
              {scouts.map((scout) => (
                <button
                  key={scout.id}
                  onClick={() => setSelectedScout(scout)}
                  className={cn(
                    "w-full rounded-md p-2 text-left text-sm transition-colors hover:bg-accent",
                    selectedScout?.id === scout.id && "bg-accent font-semibold"
                  )}
                >
                  {scout.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Coluna da Direita (Editor) */}
        <section className="basis-2/3 flex-grow">
          <div className="h-full overflow-y-auto rounded-lg border bg-card text-card-foreground shadow-sm">
            {selectedScout ? (
              <ScoutEditor
                key={selectedScout.id}
                initialModel={selectedScout}
                onSave={handleUpdateScout}
              />
            ) : (
              <div className="flex h-full items-center justify-center p-3">
                <p className="text-lg text-muted-foreground">
                  Selecione ou crie um scout para começar.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}