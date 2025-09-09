import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// <<< NOVO: Importe o ícone de lixeira >>>
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import { Link as RouterLink } from 'react-router-dom';

import { ScoutEditor } from '../components/scouts/ScoutEditor.tsx';
import type { ScoutModel } from '../types/ScoutTypes';

export function ScoutsPage() {
  const [scouts, setScouts] = useState<ScoutModel[]>([]);
  const [selectedScout, setSelectedScout] = useState<ScoutModel | null>(null);

  // <<< ALTERADO: Carregamento inicial busca os dados do banco >>>
  useEffect(() => {
    const loadScouts = async () => {
      const allScouts = await window.api.scout.getAll();
      setScouts(allScouts);
      // Seleciona o primeiro scout da lista por padrão
      if (allScouts.length > 0) {
        setSelectedScout(allScouts[0]);
      }
    };

    loadScouts();
  }, []);

  const refetchAndSelectScout = async (scoutIdToSelect?: number) => {
    const allScouts = await window.api.scout.getAll();
    setScouts(allScouts);

    if (allScouts.length === 0) {
      setSelectedScout(null);
      return;
    }

    // Tenta encontrar o scout pelo ID, senão seleciona o primeiro
    const scoutToSelect = allScouts.find(s => s.id === scoutIdToSelect) || allScouts[0];
    setSelectedScout(scoutToSelect);
  };

  // <<< ALTERADO: Cria um novo scout no banco de dados >>>
  const handleAddNewScout = async () => {
    const newScout: Partial<ScoutModel> = {
      name: 'Novo Scout',
      grid_width: 4, // Valor padrão de colunas
      categories: [],
    };

    const newScoutId = await window.api.scout.save(newScout);
    await refetchAndSelectScout(newScoutId);
  };

  // <<< ALTERADO: Atualiza o scout selecionado no banco de dados >>>
  const handleUpdateScout = async (scoutToSave: ScoutModel) => {
    await window.api.scout.save(scoutToSave);
    // Recarrega os dados para garantir que a lista lateral seja atualizada (ex: se o nome mudou)
    await refetchAndSelectScout(scoutToSave.id);
  };

  // <<< NOVO: Deleta um scout do banco de dados >>>
  const handleDeleteScout = async (scoutToDelete: ScoutModel) => {
    const confirmed = window.confirm(`Tem certeza que deseja excluir o scout "${scoutToDelete.name}"?`);
    if (confirmed && scoutToDelete.id) {
      await window.api.scout.delete(scoutToDelete.id);
      // Se o scout deletado era o selecionado, refaz a busca e seleciona o primeiro da lista
      if (selectedScout?.id === scoutToDelete.id) {
        await refetchAndSelectScout();
      } else {
        // Senão, apenas refaz a busca mantendo a seleção atual
        await refetchAndSelectScout(selectedScout?.id);
      }
    }
  };

  return (
    <main className="box-border h-screen w-screen p-2 pt-16">
      <Button asChild className="absolute left-4 top-4 z-10">
        <RouterLink to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </RouterLink>
      </Button>

      <div className="flex h-full flex-row gap-2">
        <aside className="basis-1/3 shrink-0">
          <div className="flex h-full flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex items-center justify-between border-b p-2 pl-4">
              <h3 className="text-lg font-semibold">Scouts</h3>
              <Button variant="ghost" size="icon" onClick={handleAddNewScout} title="Adicionar novo scout">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-grow overflow-y-auto p-1">
              {scouts.map((scout) => (
                // <<< NOVO: Container para agrupar o nome e o botão de deletar >>>
                <div key={scout.id} className="group flex items-center gap-1 rounded-md pr-1 transition-colors hover:bg-accent">
                  <button
                    onClick={() => setSelectedScout(scout)}
                    className={cn(
                      "w-full rounded-md p-2 text-left text-sm",
                      selectedScout?.id === scout.id && "bg-accent font-semibold"
                    )}
                  >
                    {scout.name}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    title={`Excluir ${scout.name}`}
                    onClick={() => handleDeleteScout(scout)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="basis-2/3 flex-grow">
          <div className="h-full overflow-y-auto rounded-lg border bg-card text-card-foreground shadow-sm">
            {selectedScout ? (
              <ScoutEditor
                key={selectedScout.id} // Chave é importante para o React recriar o componente ao trocar de scout
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