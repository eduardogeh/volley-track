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
import {ScoutedEventsSidebar} from "@/components/analysis/ScoutEventsSidebar.tsx";
import type {PlayerAction, ScoutedEvent} from "@/types/PlayerActionTypes.ts";
import {FilterDialog} from "@/components/filter-dialog/FilterDialog.tsx";

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
    const [clipEndTime, setClipEndTime] = useState<number | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentScoutEvent, setCurrentScoutEvent] = useState<CurrentScoutEvent | null>(null);

    const [scoutedEvents, setScoutedEvents] = useState<ScoutedEvent[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<ScoutedEvent[]>([]);
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

    const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);

    const handleToggleSelectEvent = useCallback((eventId: number) => {
        setSelectedEventIds((prev) =>
            prev.includes(eventId)
                ? prev.filter((id) => id !== eventId)
                : [...prev, eventId]
        );
    }, []);

    const handleApplyFilters = (filters: {
        players: string[];
        categories: string[];
        resultSubCategories: string[];
        zoneSubCategories: string[];
    }) => {
        console.log("Aplicando filtros:", filters);
        console.log("Eventos antes do filtro:", filteredEvents);
        const filtered = scoutedEvents.filter(event => {
            const playerMatch = filters.players.length > 0 ? filters.players.includes(event.playerName) : true;
            const categoryMatch = filters.categories.length > 0 ? filters.categories.includes(event.categoryName) : true;
            const resultMatch = filters.resultSubCategories.length > 0 ? filters.resultSubCategories.includes(event.resultadoName) : true;
            const zoneMatch = filters.zoneSubCategories.length > 0 ? filters.zoneSubCategories.includes(event.zonaName) : true;
            return playerMatch && categoryMatch && resultMatch && zoneMatch;
        });

        setFilteredEvents(filtered);
    };

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

                const existingActions = await window.api.playerAction.getByProjectId(Number(projectId));
                setScoutedEvents(existingActions);
                setFilteredEvents(existingActions);

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

    const handleConfirmPlayerSelection = useCallback(async (selectedPlayerId: number) => {
        if (!currentScoutEvent || !project) return;
        const player = players.find(p => p.id === selectedPlayerId);
        if(!player) return;

        const { category, resultado, zona, time } = currentScoutEvent;

        const clip_start = time - (category.time_to_clip_before_event || 5);
        const clip_end = time + (category.time_to_clip_after_event || 5);

        const actionToSave: PlayerAction = {
            project_id: project.id,
            player_id: selectedPlayerId,
            resultado_id: resultado.id,
            zona_id: zona.id,
            clip_start: clip_start < 0 ? 0 : clip_start,
            clip_end: clip_end,
        };

        try {
            const newActionId = await window.api.playerAction.create(actionToSave);

            const newEvent: ScoutedEvent = {
                id: newActionId,
                playerName: player.name,
                playerNumber: player.number || 0,
                playerPhoto: player.photo,
                actionDescription: `${category.name}  ${resultado.name}`,
                resultadoName: resultado.name,
                zonaName: zona.name,
                categoryName: category.name,
                categoryColor: category.color || '#000000',
                clipStart: actionToSave.clip_start || time,
                clipEnd: actionToSave.clip_end,
            };

            setScoutedEvents(prevEvents => {
                const updatedEvents = [...prevEvents, newEvent].sort((a,b) => a.clipStart - b.clipStart);
                setFilteredEvents(updatedEvents); // Aplica os filtros diretamente
                return updatedEvents;
            });

            toast.success(`Registrado: ${newEvent.actionDescription}`);
        } catch (error) {
            console.error("Erro ao salvar a ação:", error);
            toast.error("Falha ao registrar a ação no banco de dados.");
        }

        setCurrentScoutEvent(null);
        handleCloseModal();
    }, [currentScoutEvent, players, project, handleCloseModal]);

    const scoutActionDescription = useMemo(() => {
        if (!currentScoutEvent) return '';
        return `${currentScoutEvent.category.name}: ${currentScoutEvent.resultado.name} na ${currentScoutEvent.zona.name}`;
    }, [currentScoutEvent]);

    const handleEventClick = (event: ScoutedEvent) => {
        videoPlayerRef.current?.seekTo(event.clipStart);
        videoPlayerRef.current?.play();
        setClipEndTime(event.clipEnd || null);
    };

    const handleDeleteEvent = useCallback(async (eventId: number) => {
        const eventToDelete = scoutedEvents.find(e => e.id === eventId);
        if (!eventToDelete) return;

        const confirmed = window.confirm(`Tem certeza que deseja excluir a ação "${eventToDelete.actionDescription}"?`);
        if (confirmed) {
            try {
                await window.api.playerAction.delete(eventId);

                setScoutedEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
                setFilteredEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
                setSelectedEventIds(prev => prev.filter(id => id !== eventId)); // 👈 tira da seleção

                toast.success("Ação removida com sucesso!");
            } catch (error) {
                console.error("Erro ao remover a ação:", error);
                toast.error("Não foi possível remover a ação.");
            }
        }
    }, [scoutedEvents]);

    const handleVideoProgress = (currentTime: number) => {
        if (clipEndTime !== null && currentTime >= clipEndTime) {
            videoPlayerRef.current?.pause();
            setClipEndTime(null);
        }
    };

    const handleExportPlaylist = useCallback(async () => {
        if (!project) {
            toast.error("Projeto não encontrado para exportação.");
            return;
        }

        const eventsToExport = filteredEvents
            .filter(e => selectedEventIds.includes(e.id))
            .sort((a, b) => a.clipStart - b.clipStart);

        if (eventsToExport.length === 0) {
            toast.error("Selecione pelo menos uma ação para exportar.");
            return;
        }

        try {
            const filePath = await window.api.video.exportPlaylist({
                projectId: project.id,
                videoPath: project.video_path!,
                clips: eventsToExport.map(e => ({
                    start: e.clipStart!,
                    end: e.clipEnd!,
                    description: e.actionDescription!,
                })),
            });

            if (!filePath) {
                toast.info("Exportação cancelada.");
                return;
            }

            toast.success("Playlist exportada com sucesso!", {
                action: {
                    label: "Abrir vídeo",
                    onClick: () => {
                        window.api.shell.openPath(filePath);
                    },
                },
            });
        } catch (error) {
            console.error("Erro ao exportar playlist:", error);
            toast.error("Falha ao exportar playlist.");
        }
    }, [project, filteredEvents, selectedEventIds]);


    if (isLoading) {
        return <div>Carregando análise...</div>;
    }

    if (!project) {
        return <div>Projeto não encontrado.</div>;
    }

    return (
        <main className="h-screen w-screen p-4 flex flex-row gap-4">
            <aside className="w-[350px] h-full shrink-0 flex flex-col gap-4">

                {/* Cabeçalho da Sidebar */}
                <div className="shrink-0">
                    <Button asChild variant="outline" className="mb-4">
                        <RouterLink to="/projects">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para Projetos
                        </RouterLink>
                    </Button>
                    <h1 className="text-2xl font-bold">{project.description}</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsFilterDialogOpen(true)}>
                        Filtrar Ações
                    </Button>

                    <Button
                        size="sm"
                        onClick={handleExportPlaylist}
                        disabled={selectedEventIds.length === 0}
                    >
                        Exportar playlist ({selectedEventIds.length})
                    </Button>
                </div>

                {/* Lista de Ações Filtradas */}
                <div className="flex-grow overflow-hidden">
                    <ScoutedEventsSidebar
                        events={filteredEvents}
                        onDeleteEvent={handleDeleteEvent}
                        onEventClick={handleEventClick}
                        selectedEventIds={selectedEventIds}
                        onToggleSelect={handleToggleSelectEvent}
                    />
                </div>
            </aside>

            <section className="flex-grow h-full flex flex-col gap-4 overflow-hidden">
                <div className="w-full bg-card rounded-lg p-4 flex-grow overflow-hidden">
                    {videoUrl ? (
                        <VideoPlayer
                            ref={videoPlayerRef}
                            src={videoUrl}
                            onTimeUpdate={handleVideoProgress}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-muted rounded-md">
                            <p className="text-muted-foreground">Caminho do vídeo não encontrado.</p>
                        </div>
                    )}
                </div>

                {/* ÁREA DAS FERRAMENTAS DE SCOUT */}
                <div className="h-[280px] shrink-0 rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col overflow-hidden">
                    <div className="overflow-y-auto pb-4">
                        {scoutModel && (
                            <div
                                className="grid justify-start gap-4"
                                style={{
                                    gridTemplateColumns: `repeat(${scoutModel.grid_width}, min-content)`
                                }}
                            >
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
            </section>

            {currentScoutEvent && (
                <PlayerSelectionModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    players={players}
                    onConfirm={handleConfirmPlayerSelection}
                    scoutActionDescription={scoutActionDescription}
                />
            )}

            <FilterDialog
                isOpen={isFilterDialogOpen}
                onClose={() => setIsFilterDialogOpen(false)}
                onApplyFilters={handleApplyFilters}
                players={players}
                categories={scoutModel?.categories || []}
            />
        </main>
    );
}
