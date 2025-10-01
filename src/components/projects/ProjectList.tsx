import React from 'react';
import { Button } from "@/components/ui/button";
import {PlayCircle, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from '../../types/ProjectTypes';

interface ProjectListProps {
  projects: Project[];
  selectedProjectId?: number | null;
  onSelectProject: (project: Project) => void;
  onAddProject: () => void;
  onDeleteProject: (project: Project) => void;
  onPlayProject: (project: Project) => void;
}

export function ProjectList({
  projects,
  selectedProjectId,
  onSelectProject,
  onAddProject,
  onDeleteProject,
  onPlayProject
}: ProjectListProps) {

  const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    onDeleteProject(project);
  };

  const handlePlayClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    onPlayProject(project);
  };

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
      {/* ... (cabeçalho não muda) ... */}
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold">Projetos</h3>
        <Button variant="ghost" size="icon" onClick={onAddProject} title="Adicionar novo projeto">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto">
        {projects && projects.length > 0 ? (
          <div className="p-2">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-md p-2 text-left text-sm transition-colors hover:bg-accent",
                  "cursor-pointer",
                  selectedProjectId === project.id && "bg-accent font-semibold"
                )}
              >
                <div className="flex flex-col flex-grow truncate">
                  <span className="font-medium">{project.description}</span>
                  <span className="text-sm text-muted-foreground">{project.tournament + ' ' + project.season}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={(e) => handlePlayClick(e, project)}
                    title="Iniciar análise do projeto"
                    className="h-9 shrink-0 bg-green-600 px-3 text-sm text-white hover:bg-green-700"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Iniciar
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => handleDeleteClick(e, project)}
                    title="Excluir projeto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-4">
            <p className="text-sm text-muted-foreground">
              Nenhum projeto encontrado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}