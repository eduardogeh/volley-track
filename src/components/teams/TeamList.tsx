import 'react';
import {
    List,
    ListItemButton,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Paper,
    Box,
    IconButton, ListItemSecondaryAction
} from '@mui/material';
import type {Team} from "../../types/TeamPlayersTypes.ts";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from '@mui/icons-material/Delete';

export interface TeamListProps {
    teams: Team[];
    selectedTeamId?: number;
    onSelectTeam: (team: Team) => void;
    onAddTeam: () => void;
    onDeleteTeam: (team: Team) => void;
}

export function TeamList({ teams, selectedTeamId, onSelectTeam, onAddTeam, onDeleteTeam }: TeamListProps) {
    return (
        <Paper elevation={1} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">Equipes</Typography>
                <IconButton onClick={onAddTeam} color="primary" title="Adicionar nova equipe">
                    <AddCircleOutlineIcon />
                </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <List sx={{ pt: 0 }}>
                    {teams && teams.length > 0 ? (
                        teams.map((team) => (
                            <ListItemButton
                                key={team.id}
                                selected={selectedTeamId === team.id}
                                onClick={() => onSelectTeam(team)}
                            >
                                <ListItemAvatar>
                                    <Avatar src={team.logo} variant="rounded" />
                                </ListItemAvatar>
                                <ListItemText primary={team.name} />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => onDeleteTeam(team)}>
                                        <DeleteIcon color={"error"}/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItemButton>
                        ))
                    ) : (
                        // Caso contrário, mostra a mensagem de "nenhuma equipe"
                        <Box sx={{ p: 2, textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" color="textSecondary">
                                Nenhuma equipe encontrada.
                            </Typography>
                        </Box>
                    )}
                </List>
            </Box>
        </Paper>
    );
}