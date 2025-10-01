import {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from 'sonner';

import type { Project } from '../types/ProjectTypes';
import type { PlayerProps } from '../types/TeamPlayersTypes';
import type {Category, ScoutModel, Subcategory} from '../types/ScoutTypes';
import {VideoPlayer, type VideoPlayerRef} from "@/components/videoPlayer/VideoPlayer.tsx";
import {InteractiveCategoryCard} from "@/components/analysis/InteractiveCategoryCard.tsx";
import {PlayerSelectionModal} from "@/components/analysis/PlayerSelectionModal.tsx";
import {type ScoutedEvent, ScoutedEventsSidebar} from "@/components/analysis/ScoutEventsSidebar.tsx";

interface CurrentScoutEvent {
  category: Category;
  resultado: Subcategory;
  zona: Subcategory;
  time: number;
}

async function formatVideoPathForElectron(filePath: string): Promise<string> {
  const serverUrl = await window.api.getMediaServerUrl();
  if (!serverUrl) return '';
  const encodedPath = encodeURIComponent(filePath);
  return `${serverUrl}/media/${encodedPath}`;
}

export function AnalysisPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [players, setPlayers] = useState<PlayerProps[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [scoutModel, setScoutModel] = useState<ScoutModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentScoutEvent, setCurrentScoutEvent] = useState<CurrentScoutEvent | null>(null);

  const [scoutedEvents, setScoutedEvents] = useState<ScoutedEvent[]>([]);

  useEffect(() => {
    if (project?.video_path) {
      formatVideoPathForElectron(project.video_path).then(url => {
        setVideoUrl(url);
      });
    }
  }, [project]);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        const projectData = await window.api.project.getById(Number(projectId));
        if (!projectData) {
          toast.error("Projeto não encontrado.");
          return;
        }

        const scoutData = await window.api.scout.getById(projectData.id_scout_model);
        const playersData = await window.api.player.getByTeamId(projectData.id_team);

        setProject(projectData);
        setScoutModel(scoutData);
        setPlayers(playersData);

      } catch (error) {
        console.error("Erro ao carregar dados para análise:", error);
        toast.error("Não foi possível carregar os dados do projeto.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleScoutComplete = useCallback((combination: { category: Category, resultado: Subcategory, zona: Subcategory }) => {
    videoPlayerRef.current?.pause();
    const currentTime = videoPlayerRef.current?.getCurrentTime();
    if (currentTime === undefined) {
      toast.error("Não foi possível obter o tempo do vídeo.");
      return;
    }
    setCurrentScoutEvent({ ...combination, time: currentTime });
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    videoPlayerRef.current?.play();
    setIsModalOpen(false);
  }, []);

  const handleConfirmPlayerSelection = useCallback((selectedPlayerId: number) => {
    if (!currentScoutEvent) return;
    const player = players.find(p => p.id === selectedPlayerId);
    if(!player) return;

    const newEvent: ScoutedEvent = {
      id: Date.now(),
      playerName: player.name,
      playerNumber: player.number || 0,
      playerPhoto: player.photo,
      actionDescription: `${currentScoutEvent.category.name} - ${currentScoutEvent.resultado.name}`,
      timestamp: currentScoutEvent.time
    };

    setScoutedEvents(prevEvents => [...prevEvents, newEvent].sort((a,b) => a.timestamp - b.timestamp));

    toast.success(`Registrado: ${newEvent.actionDescription}`);

    setCurrentScoutEvent(null);
    handleCloseModal();
  }, [currentScoutEvent, players, handleCloseModal]);

  const scoutActionDescription = useMemo(() => {
    if (!currentScoutEvent) return '';
    return `${currentScoutEvent.category.name}: ${currentScoutEvent.resultado.name} na ${currentScoutEvent.zona.name}`;
  }, [currentScoutEvent]);

  // <<< NOVA FUNÇÃO PARA O CLIQUE NA SIDEBAR >>>
  const handleEventClick = (timestamp: number) => {
    videoPlayerRef.current?.seekTo(timestamp);
  };

  if (isLoading) {
    return <div>Carregando análise...</div>;
  }

  if (!project) {
    return <div>Projeto não encontrado.</div>;
  }

  return (
    <main className="h-screen w-screen p-4 flex flex-col">
      {/* O botão e o título foram removidos daqui */}

      {/* ###################################################### */}
      {/* <<< CONTAINER PRINCIPAL COM O LAYOUT FINAL >>> */}
      {/* ###################################################### */}
      <div className="flex-grow flex flex-col gap-4 overflow-hidden">

        {/* --- LINHA SUPERIOR: Sidebar com cabeçalho e Vídeo --- */}
        <div className="h-3/5 shrink-0 flex flex-row gap-4">

          {/* COLUNA DA ESQUERDA: Agora um container flex-col para o cabeçalho e a lista */}
          <aside className="w-[350px] h-full shrink-0 flex flex-col gap-4">

            {/* 1. CABEÇALHO MOVIDO PARA DENTRO DA SIDEBAR */}
            <div className="shrink-0">
              <Button asChild variant="outline" className="mb-4">
                <RouterLink to="/projects">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Projetos
                </RouterLink>
              </Button>
              <h1 className="text-2xl font-bold">{project.tournament} - {project.season}</h1>
            </div>

            {/* 2. LISTA DE AÇÕES OCUPA O ESPAÇO RESTANTE DA SIDEBAR */}
            <div className="flex-grow overflow-hidden">
              <ScoutedEventsSidebar events={scoutedEvents} onEventClick={handleEventClick} />
            </div>
          </aside>

          {/* COLUNA DA DIREITA: Vídeo Player (começa do topo da linha) */}
          <section className="flex-grow h-full bg-card rounded-lg p-4">
            {videoUrl ? (
              <VideoPlayer
                ref={videoPlayerRef}
                src={videoUrl}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-muted rounded-md">
                <p className="text-muted-foreground">Caminho do vídeo não encontrado.</p>
              </div>
            )}
          </section>
        </div>

        {/* --- LINHA INFERIOR: Ferramentas de Scout (continua igual) --- */}
        <div className="flex-grow rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col overflow-hidden">
          <h2 className="font-semibold text-lg mb-4 shrink-0">Ferramentas de Scout ({scoutModel?.name})</h2>
          <div className="overflow-x-auto pb-4">
            {scoutModel && (
              <div className="grid auto-cols-max grid-flow-col gap-4">
                {scoutModel.categories.map((category) => (
                  <InteractiveCategoryCard
                    key={category.id}
                    category={category}
                    onScoutComplete={handleScoutComplete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* O Modal não muda */}
      {currentScoutEvent && (
        <PlayerSelectionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          players={players}
          onConfirm={handleConfirmPlayerSelection}
          scoutActionDescription={scoutActionDescription}
        />
      )}
    </main>
  );
}