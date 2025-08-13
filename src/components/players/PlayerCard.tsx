import 'react';
import { Box, Avatar, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import type {PlayerProps} from "../../types/TeamPlayersTypes.ts";
import DeleteIcon from '@mui/icons-material/Delete';

export type PlayerCardProps = {
    player?: PlayerProps;
    onCardClick: (player: PlayerProps) => void;
    onEditClick: (player: PlayerProps | null) => void;
    isSelected?: boolean;
    colorOfCard?: string;
    onDeletePlayer: (player: PlayerProps) => void;
}

export function PlayerCard({ player, onCardClick, onEditClick, isSelected, colorOfCard, onDeletePlayer }: PlayerCardProps) {

    if (!player) return null;

    const iconButtonStyle = {
        bgcolor: 'rgba(0,0,0,0.5)',
        color: 'white',
        '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
        position: 'absolute',
        right: 2,
        bottom: 2,
    };

    return (
        <Box
            sx={{
                boxSizing: 'border-box',
                padding: 0.5,
                width: {
                    xs: '25%',
                    sm: '16.667%',
                    md: '12.5%',
                },
            }}
        >
            <Box
                onClick={() => onCardClick(player)}
                sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isSelected ? `0 0 15px ${colorOfCard || 'rgba(25, 118, 210, 0.8)'}` : 'none',
                }}
            >
                <Avatar
                    src={player.photo || '/no-image.png'}
                    variant="rounded"
                    sx={{ width: '100%', height: 'auto', aspectRatio: '1 / 1.2' }}
                />
                {/* -> CORREÇÃO AQUI <- */}
                <Box sx={{
                    backgroundColor: colorOfCard || 'rgba(0,0,0,0.7)', // Usa a cor do card ou um padrão
                    position: 'absolute',
                    bottom: 4,
                    left: 4,
                    color: 'white', // Cor do número
                    px: 0.5,
                    py: 0,
                    borderRadius: 1,
                }}>
                    <Typography variant="body2" fontSize={'1.5rem'} fontWeight="bold">{player.number}</Typography>
                </Box>
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(player);
                    }}
                    sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                    }}
                >
                    <EditIcon fontSize="inherit" />
                </IconButton>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDeletePlayer(player); }} sx={iconButtonStyle}>
                    <DeleteIcon fontSize="inherit" color={"error"}/>
                </IconButton>
            </Box>
        </Box>
    );

}