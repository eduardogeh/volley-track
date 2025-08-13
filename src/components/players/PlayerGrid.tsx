import 'react';
import { Box, Button, Divider, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PlayerCard } from './PlayerCard.tsx';
import type {PlayerProps} from "../../types/TeamPlayersTypes.ts";

export type PlayerGridProps = {
    players?: PlayerProps[];
    playerToSwap?: PlayerProps;
    onPlayerSwap: (player: PlayerProps) => void;
    onEditPlayer: (player: PlayerProps | null) => void;
    onAddPlayer: () => void;
    colorOfCard?: string;
    onDeletePlayer: (player: PlayerProps) => void;
}

export function PlayerGrid({
                               players, // Receba a prop normalmente, sem valor padrão aqui
                               playerToSwap,
                               onPlayerSwap,
                               onEditPlayer,
                               onAddPlayer,
                               colorOfCard,
                               onDeletePlayer,
                           }: PlayerGridProps) {

    const playerList = Array.isArray(players) ? players : [];

    const titulares = playerList.slice(0, 6);
    const reservas = playerList.slice(6);

    const flexContainerSx = {
        display: 'flex',
        flexWrap: 'wrap',
        margin: -0.5,
    };

    return (
        <>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAddPlayer} sx={{ mb: 2 }}>
                Adicionar Jogador
            </Button>

            <Divider sx={{ my: 2 }}>
                <Chip label="Titulares" />
            </Divider>

            <Box sx={flexContainerSx}>
                {titulares.map((player) => (
                    <PlayerCard
                        key={player.id}
                        player={player}
                        onCardClick={onPlayerSwap}
                        onEditClick={onEditPlayer}
                        isSelected={playerToSwap?.id === player.id}
                        colorOfCard={colorOfCard}
                        onDeletePlayer={onDeletePlayer}
                    />
                ))}
            </Box>

            {reservas.length > 0 && (
                <>
                    <Divider sx={{ my: 2 }}>
                        <Chip label="Reservas" />
                    </Divider>
                    <Box sx={flexContainerSx}>
                        {reservas.map((player) => (
                            <PlayerCard
                                key={player.id}
                                player={player}
                                onCardClick={onPlayerSwap}
                                onEditClick={onEditPlayer}
                                isSelected={playerToSwap?.id === player.id}
                                colorOfCard={colorOfCard}
                                onDeletePlayer={onDeletePlayer}
                            />
                        ))}
                    </Box>
                </>
            )}
        </>
    );
}