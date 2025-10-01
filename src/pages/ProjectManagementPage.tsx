import { useState, useEffect } from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProjectList } from '../components/projects/ProjectList';
import { ProjectEditor } from '../components/projects/ProjectEditor';
import type { Project } from '../types/ProjectTypes';
import type {Team} from "@/types/TeamPlayersTypes.ts";
import type {ScoutModel} from "@/types/ScoutTypes.ts";
import {toast} from "sonner";

export function ProjectManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [availableScoutModels, setAvailableScoutModels] = useState<ScoutModel[]>([]);
  const navigate = useNavigate();


  useEffect(() => {
    const loadInitialData = async () => {
      toast.promise(
        async () => {
          const allProjects = await window.api.project.getAll();
          const allTeams = await window.api.team.getAll();
          const allScoutModels = await window.api.scout.getAll();

          setProjects(allProjects);
          setAvailableTeams(allTeams);
          setAvailableScoutModels(allScoutModels);

          if (allProjects.length > 0) {
            setSelectedProject(allProjects[0]);
          }
        },
        {
          loading: 'Carregando dados...',
          success: 'Dados carregados com sucesso!',
          error: 'Erro ao carregar os dados.',
        }
      );
    };

    loadInitialData();
  }, []);

  const refetchProjects = async () => {
    const allProjects = await window.api.project.getAll();
    setProjects(allProjects);
    return allProjects;
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleAddNewProject = async () => {
    if (availableTeams.length === 0) {
      toast.warning("Não é possível criar um projeto.", {
        description: "Por favor, crie um time primeiro."
      });
      return;
    }

    if (availableScoutModels.length === 0) {
      toast.warning("Não é possível criar um projeto.", {
        description: "Por favor, crie um modelo de scout primeiro."
      });
      return;
    }

    try {
      const defaultTeamId = availableTeams[0].id;
      const defaultScoutModelId = availableScoutModels[0].id;

      const newProjectId = await window.api.project.create({
        season: new Date().getFullYear().toString(),
        tournament: 'Novo Campeonato',
        description: '',
        id_team: defaultTeamId,
        id_scout_model: defaultScoutModelId
      });

      const allProjects = await refetchProjects();
      const newProject = allProjects.find(p => p.id === newProjectId);
      if (newProject) {
        setSelectedProject(newProject);
      }
      toast.success("Novo projeto criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      toast.error("Não foi possível criar o projeto.");
    }
  };

  const handleDeleteProject = async (projectToDelete: Project) => {
    const confirmed = window.confirm(`Deseja remover o projeto "${projectToDelete.tournament} - ${projectToDelete.season}"?`);
    if (confirmed) {
      try {
        await window.api.project.delete(projectToDelete.id);
        const remainingProjects = await refetchProjects();

        if(selectedProject?.id === projectToDelete.id) {
          setSelectedProject(remainingProjects[0] || null);
        }
        toast.success(`Projeto "${projectToDelete.tournament}" removido.`);
      } catch (error) {
        console.error("Erro ao remover projeto:", error);
        toast.error("Não foi possível remover o projeto.");
      }
    }
  };

  const handleProjectUpdate = async (updatedProject: Project) => {
    try {
      await window.api.project.update(updatedProject);
      await refetchProjects();
      setSelectedProject(updatedProject);
      toast.success("Projeto salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      toast.error("Erro ao salvar as alterações.");
    }
  };

  const handlePlayProject = (project: Project) => {
    if (!project.video_path) {
      toast.error("Projeto sem vídeo!", {
        description: "Por favor, selecione um arquivo de vídeo para este projeto antes de iniciar a análise."
      });
      return;
    }
    navigate(`/analysis/${project.id}`);
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
          <ProjectList
            projects={projects}
            selectedProjectId={selectedProject?.id}
            onSelectProject={handleSelectProject}
            onAddProject={handleAddNewProject}
            onDeleteProject={handleDeleteProject}
            onPlayProject={handlePlayProject}
          />
        </aside>

        <section className="basis-2/3 flex-grow">
          <div className="flex h-full flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
            {selectedProject ? (
              <ProjectEditor project={selectedProject} onSave={handleProjectUpdate} onPlayProject={handlePlayProject} />
            ) : (
              <div className="flex h-full items-center justify-center p-3">
                <p className="text-lg text-muted-foreground">
                  Selecione ou crie um projeto para começar.
                </p>
              </div>
            )}
            <div className="flex-grow overflow-y-auto p-2"></div>
          </div>
        </section>
      </div>
    </main>
  );
}