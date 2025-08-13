import { useState, useEffect } from 'react';
import { Box, Paper, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

    // --- CORREÇÃO no Carregamento Inicial ---
    useEffect(() => {
        // É preciso usar uma função async dentro do useEffect
        const loadInitialData = async () => {
            const allTeams = await window.api.team.getAll(); // Espera a Promise resolver
            setTeams(allTeams);

            if (allTeams && allTeams.length > 0) {
                // handleSelectTeam também precisa ser async para ser esperado aqui
                await handleSelectTeam(allTeams[0]);
            }
        };

        loadInitialData();
    }, []); // O array de dependência vazio está correto para carregar apenas uma vez

    // --- CORREÇÃO nas Funções de Manipulação ---
    const handleSelectTeam = async (team: Team) => { // -> Adicione 'async'
        const teamPlayers = await window.api.player.getByTeamId(team.id); // -> Adicione 'await'
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

            // Se o time deletado era o que estava selecionado, limpa a seleção
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
            await refetchPlayers(); // Recarrega a lista de jogadores do time atual
        }
    };

    const handleTeamUpdate = async (updatedTeam: Team) => { // -> Boa prática: seja consistente com async
        await window.api.team.update(updatedTeam);
        // Recarrega a lista para ter certeza que está em sincronia
        const allTeams = await window.api.team.getAll();
        setTeams(allTeams);
    };

    const refetchPlayers = async () => { // -> Adicione 'async'
        if (selectedTeam) {
            const updatedPlayers = await window.api.player.getByTeamId(selectedTeam.id); // -> Adicione 'await'
            setPlayers(updatedPlayers);
        }
    }

    const handlePlayerSwap = (clickedPlayer: PlayerProps) => {
        // ... (código existente aqui está correto, pois não faz chamadas async diretas, só no final)
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

    const handleSavePlayer = async (playerData: PlayerProps) => { // -> Adicione 'async'
        if (playerData.id) {
            await window.api.player.update(playerData);
        } else {
            await window.api.player.create({ ...playerData, team_id: selectedTeam!.id });
        }
        await refetchPlayers(); // -> Adicione 'await'
        handleCloseModal();
    };

    // As funções abaixo não precisam ser async pois só manipulam o estado local
    const handleOpenPlayerModal = (player: PlayerProps | null) => {
        setEditingPlayer(player);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingPlayer(null);
    };

    // Esta já estava correta
    const handleAddNewTeam = async () => {
        const newTeamId = await window.api.team.create({});
        const allTeams = await window.api.team.getAll();
        setTeams(allTeams);
        const newTeam = allTeams.find(t => t.id === newTeamId);
        if (newTeam) {
            await handleSelectTeam(newTeam);
        }
    };

    // --- O JSX de retorno permanece o mesmo ---
    return (
        <Box sx={{ height: '100vh', width: '100vw', p: 2, pt: 8, boxSizing: 'border-box' }}>
            <RouterLink to="/" style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
                <Button variant="contained" startIcon={<ArrowBackIcon />}>Voltar</Button>
            </RouterLink>

            <PlayerModal open={isModalOpen} onClose={handleCloseModal} player={editingPlayer} onSave={handleSavePlayer} />

            <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%', gap: 2 }}>
                <Box sx={{ flexBasis: '33.33%', flexShrink: 0 }}>
                    <TeamList
                        teams={teams}
                        selectedTeamId={selectedTeam?.id}
                        onSelectTeam={handleSelectTeam}
                        onAddTeam={handleAddNewTeam}
                        onDeleteTeam={handleDeleteTeam}
                    />
                </Box>

                <Box sx={{ flexBasis: '66.67%', flexGrow: 1, minWidth: 0 }}>
                    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {selectedTeam ? (
                            <>
                                <TeamEditor team={selectedTeam} onSave={handleTeamUpdate} />
                                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                                    <PlayerGrid
                                        players={players}
                                        playerToSwap={playerToSwap || undefined}
                                        onPlayerSwap={handlePlayerSwap}
                                        onEditPlayer={handleOpenPlayerModal}
                                        onAddPlayer={() => handleOpenPlayerModal(null)}
                                        colorOfCard={selectedTeam?.color}
                                        onDeletePlayer={handleDeletePlayer}
                                    />
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <Typography variant="h6" color="textSecondary">
                                    Selecione ou crie um time para começar.
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}