import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PlayerCard } from '../players/PlayerCard';
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

  const { titulares, reservas } = useMemo(() => {
    return {
      titulares: players.slice(0, 6),
      reservas: players.slice(6),
    };
  }, [players]);

  const handleConfirm = () => {
    if (selectedPlayerId) {
      onConfirm(selectedPlayerId);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const renderDividerWithLabel = (label: string) => (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <Separator />
      </div>
      <div className="relative flex justify-center">
        <Badge variant="secondary">{label}</Badge>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Selecionar Jogador</DialogTitle>
          <DialogDescription>
            Ação: <span className="font-semibold">{scoutActionDescription}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto p-4">
          {renderDividerWithLabel("Titulares")}
          <div className="flex flex-wrap justify-center gap-4">
            {titulares.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onCardClick={() => setSelectedPlayerId(player.id!)}
                isSelected={selectedPlayerId === player.id}
                showEditButton={false}
                showDeleteButton={false}
              />
            ))}
          </div>

          {reservas.length > 0 && (
            <>
              {renderDividerWithLabel("Reservas")}
              <div className="flex flex-wrap justify-center gap-4">
                {reservas.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onCardClick={() => setSelectedPlayerId(player.id!)}
                    isSelected={selectedPlayerId === player.id}
                    showEditButton={false}
                    showDeleteButton={false}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={!selectedPlayerId}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}