import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import { Link as RouterLink } from 'react-router-dom';

import { ScoutEditor } from '../components/scouts/ScoutEditor.tsx';
import type { ScoutModel } from '../types/ScoutTypes';
import {toast} from "sonner";

export function ScoutsPage() {
  const [scouts, setScouts] = useState<ScoutModel[]>([]);
  const [selectedScout, setSelectedScout] = useState<ScoutModel | null>(null);

  useEffect(() => {
    const loadScouts = async () => {
      const allScouts = await window.api.scout.getAll();
      setScouts(allScouts);
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

    const scoutToSelect = allScouts.find(s => s.id === scoutIdToSelect) || allScouts[0];
    setSelectedScout(scoutToSelect);
  };

  const handleAddNewScout = async () => {
    try {
      const newScout: Partial<ScoutModel> = {
        name: 'Novo Scout',
        grid_width: 4,
        grid_height: 3,
        categories: [],
      };
      const newScoutId = await window.api.scout.save(newScout);
      await refetchAndSelectScout(newScoutId);
      toast.success("Novo scout criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar novo scout:", error);
      toast.error("Não foi possível criar o scout.");
    }
  };

  const handleUpdateScout = async (scoutToSave: ScoutModel) => {
    try {
      await window.api.scout.save(scoutToSave);
      await refetchAndSelectScout(scoutToSave.id);
      toast.success(`Scout "${scoutToSave.name}" salvo com sucesso!`);
    } catch (error) {
      console.error("Erro ao salvar o scout:", error);
      toast.error("Não foi possível salvar as alterações.");
    }
  };

  const handleDeleteScout = async (scoutToDelete: ScoutModel) => {
    const confirmed = window.confirm(`Tem certeza que deseja excluir o scout "${scoutToDelete.name}"?`);
    if (confirmed && scoutToDelete.id) {
      try {
        await window.api.scout.delete(scoutToDelete.id);
        if (selectedScout?.id === scoutToDelete.id) {
          await refetchAndSelectScout();
        } else {
          await refetchAndSelectScout(selectedScout?.id);
        }
        toast.success(`Scout "${scoutToDelete.name}" excluído.`);
      } catch (error) {
        console.error("Erro ao excluir o scout:", error);
        toast.error("Não foi possível excluir o scout.");
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