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
    // Container principal que centraliza tudo na tela
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">

      {/* Bloco de conteúdo com largura máxima definida */}
      <div className="w-full max-w-md space-y-8">

        {/* Cabeçalho */}
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Relatórios de Partida</h1>
          <p className="text-muted-foreground mt-2">
            Selecione uma partida para exportar as estatísticas.
          </p>
        </header>

        {/* Card com as ações principais */}
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm">
          <div className="w-full">
            <label htmlFor="project-select" className="mb-2 block text-sm font-medium text-card-foreground">
              Partida
            </label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger id="project-select" className="w-full">
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
                Gerar Relatório
              </>
            )}
          </Button>
        </div>

        {/* Botão de navegação para voltar */}
        <div className="text-center">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <RouterLink to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Início
            </RouterLink>
          </Button>
        </div>

      </div>
    </main>
  );
}