// src/components/analysis/PlayerSelectionModal.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { PlayerProps } from '@/types/TeamPlayersTypes';

interface PlayerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: PlayerProps[];
  onConfirm: (selectedPlayerId: number) => void;
  scoutActionDescription: string;
}

export function PlayerSelectionModal({ isOpen, onClose, players, onConfirm, scoutActionDescription }: PlayerSelectionModalProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedPlayerId) {
      onConfirm(selectedPlayerId);
      // O onClose será chamado pelo onOpenChange
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* <<< ADICIONE A CLASSE DE LARGURA AQUI >>> */}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Selecionar Jogador</DialogTitle>
          <DialogDescription>
            Ação: <span className="font-semibold">{scoutActionDescription}</span>
          </DialogDescription>
        </DialogHeader>
        {/* Aumentei o grid para 4 colunas para preencher melhor o espaço */}
        <div className="max-h-[60vh] overflow-y-auto p-4 grid grid-cols-4 gap-2">
          {players.map((player) => (
            <Button
              key={player.id}
              variant="outline"
              onClick={() => setSelectedPlayerId(player.id)}
              className={cn("h-16 flex flex-col", selectedPlayerId === player.id && "ring-2 ring-primary")}
            >
              <span className="text-2xl font-bold">{player.number}</span>
              <span className="text-xs truncate">{player.name}</span>
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={!selectedPlayerId}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}