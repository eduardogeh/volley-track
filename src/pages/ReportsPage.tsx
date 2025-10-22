import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link as RouterLink } from 'react-router-dom';
import { ArrowLeft, FileDown } from 'lucide-react';
import { toast } from 'sonner';

import type { Project } from '../types/ProjectTypes';

export function ReportsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const allProjects = await window.api.project.getAll();
        setProjects(allProjects);
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        toast.error("Não foi possível carregar a lista de partidas.");
      }
    };
    loadProjects();
  }, []);

  const handleExportExcel = async () => {
    if (!selectedProjectId) {
      toast.warning("Por favor, selecione uma partida primeiro.");
      return;
    }

    setIsExporting(true);
    toast.info("Gerando arquivo Excel...", {
      description: "Isso pode levar alguns segundos.",
    });

    try {
      const result = await window.api.reports.exportMatchReportExcel(Number(selectedProjectId));

      if (result.success) {
        toast.success("Arquivo Excel gerado com sucesso!", {
          description: `Salvo em: ${result.path}`,
        });
      } else {
        toast.error("Falha ao gerar o arquivo.", {
          description: result.message || "A exportação foi cancelada ou não havia dados.",
        });
      }
    } catch (error) {
      console.error("Erro ao exportar para Excel:", error);
      toast.error("Ocorreu um erro inesperado ao gerar o arquivo.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="h-screen w-screen p-4 flex flex-col items-center">
      <div className="absolute left-4 top-4">
        <Button asChild variant="outline">
          <RouterLink to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </RouterLink>
        </Button>
      </div>

      <header className="text-center mt-16 mb-8">
        <h1 className="text-3xl font-bold">Relatórios de Partida</h1>
        <p className="text-muted-foreground mt-2">
          Selecione uma partida e clique em "Gerar" para exportar as estatísticas para um arquivo Excel.
        </p>
      </header>

      <div className="flex flex-col items-center gap-4 p-6 rounded-lg border bg-card shadow-sm w-full max-w-md">
        <div className="w-full">
          <label htmlFor="project-select" className="text-sm font-medium mb-2 block">
            Partida
          </label>
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger id="project-select">
              <SelectValue placeholder="Selecione uma partida..." />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.tournament} - {p.season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleExportExcel}
          disabled={!selectedProjectId || isExporting}
          className="w-full"
        >
          {isExporting ? "Gerando..." : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Gerar Relatório Excel
            </>
          )}
        </Button>
      </div>
    </main>
  );
}