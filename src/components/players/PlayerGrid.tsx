import 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus } from 'lucide-react';
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
  players,
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
    <>
      <Button onClick={onAddPlayer} className="mb-4">
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Jogador
      </Button>

      {renderDividerWithLabel("Titulares")}

      {/* Container principal dos jogadores */}
      <div className="flex flex-wrap gap-4">
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
      </div>

      {reservas.length > 0 && (
        <>
          {renderDividerWithLabel("Reservas")}

          <div className="flex flex-wrap gap-4">
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
          </div>
        </>
      )}
    </>
  );
}