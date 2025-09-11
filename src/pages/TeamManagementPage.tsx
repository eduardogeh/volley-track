import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TeamEditor } from '../components/teams/TeamEditor.tsx';
import { PlayerGrid } from '../components/players/PlayerGrid.tsx';
import type { PlayerProps, Team } from "../types/TeamPlayersTypes.ts";
import { PlayerModal } from "../components/players/PlayerModal.tsx";
import { TeamList } from '../components/teams/TeamList.tsx';

export function TeamManagementPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [players, setPlayers] = useState<PlayerProps[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<PlayerProps | null>(null);
    const [playerToSwap, setPlayerToSwap] = useState<PlayerProps | null>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            const allTeams = await window.api.team.getAll();
            setTeams(allTeams);

            if (allTeams && allTeams.length > 0) {
                await handleSelectTeam(allTeams[0]);
            }
        };

        loadInitialData();
    }, []);

    const handleSelectTeam = async (team: Team) => {
        const teamPlayers = await window.api.player.getByTeamId(team.id);
        setSelectedTeam(team);
        setPlayers(teamPlayers);
        setPlayerToSwap(null);
    };

    const refetchTeams = async () => {
        const allTeams = await window.api.team.getAll();
        setTeams(allTeams);
        return allTeams;
    };

    const handleDeleteTeam = async (teamToDelete: Team) => {
        const confirmed = window.confirm(`Tem certeza que deseja remover a equipe "${teamToDelete.name}"? Todos os seus jogadores serão perdidos.`);
        if (confirmed) {
            await window.api.team.delete(teamToDelete.id);
            const remainingTeams = await refetchTeams();

            if (selectedTeam?.id === teamToDelete.id) {
                setSelectedTeam(null);
                setPlayers([]);
            }
            setTeams(remainingTeams)
            if (remainingTeams.length > 0 && !selectedTeam) {
                await handleSelectTeam(remainingTeams[0]);
            }
        }
    };

    const handleDeletePlayer = async (playerToDelete: PlayerProps) => {
        const confirmed = window.confirm(`Tem certeza que deseja remover "${playerToDelete.name}"?`);
        if (confirmed) {
            await window.api.player.delete(playerToDelete.id!);
            await refetchPlayers();
        }
    };

    const handleTeamUpdate = async (updatedTeam: Team) => {
      await window.api.team.update(updatedTeam);
        const allTeams = await window.api.team.getAll();
        setTeams(allTeams);
        setSelectedTeam(updatedTeam);
    };

    const refetchPlayers = async () => {
        if (selectedTeam) {
            const updatedPlayers = await window.api.player.getByTeamId(selectedTeam.id);
            setPlayers(updatedPlayers);
        }
    }

    const handlePlayerSwap = (clickedPlayer: PlayerProps) => {
      if (!playerToSwap) {
            setPlayerToSwap(clickedPlayer);
        } else {
            if (playerToSwap.id === clickedPlayer.id) {
                setPlayerToSwap(null);
                return;
            }

            const currentPlayers = [...players];
            const indexA = currentPlayers.findIndex(p => p.id === playerToSwap.id);
            const indexB = currentPlayers.findIndex(p => p.id === clickedPlayer.id);

            if (indexA !== -1 && indexB !== -1) {
                [currentPlayers[indexA], currentPlayers[indexB]] = [currentPlayers[indexB], currentPlayers[indexA]];
                setPlayers(currentPlayers);

                const orderedIds = currentPlayers
                    .map(p => p.id)
                    .filter((id): id is number => id !== undefined);

                window.api.player.updateOrder(selectedTeam!.id, orderedIds);
            }

            setPlayerToSwap(null);
        }
    };

    const handleSavePlayer = async (playerData: PlayerProps) => {
        if (playerData.id) {
            await window.api.player.update(playerData);
        } else {
            await window.api.player.create({ ...playerData, team_id: selectedTeam!.id });
        }
        await refetchPlayers();
        handleCloseModal();
    };

    const handleOpenPlayerModal = (player: PlayerProps | null) => {
        setEditingPlayer(player);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingPlayer(null);
    };

    const handleAddNewTeam = async () => {
        const newTeamId = await window.api.team.create({});
        const allTeams = await window.api.team.getAll();
        setTeams(allTeams);
        const newTeam = allTeams.find(t => t.id === newTeamId);
        if (newTeam) {
            await handleSelectTeam(newTeam);
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

      <PlayerModal open={isModalOpen} onClose={handleCloseModal} player={editingPlayer} onSave={handleSavePlayer} />

      <div className="flex h-full flex-row gap-2">
        {/* Coluna da Esquerda (Sidebar com TeamList) */}
        <aside className="basis-1/3 shrink-0">
          <TeamList
            teams={teams}
            selectedTeamId={selectedTeam?.id}
            onSelectTeam={handleSelectTeam}
            onAddTeam={handleAddNewTeam}
            onDeleteTeam={handleDeleteTeam}
          />
        </aside>

        {/* Coluna da Direita (Editor de Time e Grid de Jogadores) */}
        <section className="basis-2/3 flex-grow">
          <div className="flex h-full flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
            {selectedTeam ? (
              <>
                <TeamEditor team={selectedTeam} onSave={handleTeamUpdate}/>
                <div className="flex-grow overflow-y-auto p-2">
                  <PlayerGrid
                    players={players}
                    playerToSwap={playerToSwap || undefined}
                    onPlayerSwap={handlePlayerSwap}
                    onEditPlayer={handleOpenPlayerModal}
                    onAddPlayer={() => handleOpenPlayerModal(null)}
                    colorOfCard={selectedTeam?.color}
                    onDeletePlayer={handleDeletePlayer}
                  />
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-3">
                <p className="text-lg text-muted-foreground">
                  Selecione ou crie um time para começar.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}