import { useState, useEffect, useRef } from 'react'; // Importe o useRef
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Avatar } from '@mui/material';
import type { PlayerProps } from "../../types/TeamPlayersTypes.ts";

export type PlayerModalProps = {
    open: boolean;
    onClose: () => void;
    player?: PlayerProps | null;
    onSave: (playerData: PlayerProps) => void;
}

// Defina um estado inicial padrão
const defaultPlayerState: PlayerProps = { name: '', number: 0, height: '', position: '', photo: '' };

export function PlayerModal({ open, onClose, player, onSave }: PlayerModalProps) {
    const [formData, setFormData] = useState<PlayerProps>(defaultPlayerState);
    const fileInputRef = useRef<HTMLInputElement>(null); // Ref para o input de arquivo escondido

    useEffect(() => {
        if (player) {
            setFormData(player);
        } else {
            setFormData(defaultPlayerState); // Reseta para o estado padrão ao criar novo jogador
        }
    }, [player, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                // O resultado é uma string base64 que pode ser usada no 'src' da imagem
                setFormData(prev => ({ ...prev, photo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave(formData); // O formData já contém a foto em base64
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>{player ? 'Editar Jogador' : 'Cadastrar Novo Jogador'}</DialogTitle>
            <DialogContent>
                {/* --- SEÇÃO DA FOTO ADICIONADA --- */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, gap: 1 }}>
                    <Avatar
                        src={formData.photo}
                        sx={{ width: 100, height: 100, mb: 1 }}
                        variant="rounded"
                    />
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Alterar Foto
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        accept="image/*"
                        style={{ display: 'none' }} // O input fica escondido
                    />
                </Box>
                {/* --- FIM DA SEÇÃO DA FOTO --- */}

                <TextField autoFocus margin="dense" name="name" label="Nome" fullWidth value={formData.name} onChange={handleChange} />
                <TextField margin="dense" name="number" label="Número" type="number" fullWidth value={formData.number || ''} onChange={handleChange} />
                <TextField margin="dense" name="height" label="Altura (ex: 1.85)" fullWidth value={formData.height} onChange={handleChange} />
                <TextField margin="dense" name="position" label="Posição" fullWidth value={formData.position} onChange={handleChange} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">Salvar</Button>
            </DialogActions>
        </Dialog>
    );
}