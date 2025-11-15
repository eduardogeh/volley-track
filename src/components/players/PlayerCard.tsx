import 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import type { PlayerProps } from "../../types/TeamPlayersTypes.ts";

export type PlayerCardProps = {
  player?: PlayerProps;
  onCardClick: (player: PlayerProps) => void;
  onEditClick?: (player: PlayerProps | null) => void;
  isSelected?: boolean;
  colorOfCard?: string;
  onDeletePlayer?: (player: PlayerProps) => void;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
}

export function PlayerCard({
  player,
  onCardClick,
  onEditClick,
  isSelected,
  colorOfCard,
  onDeletePlayer,
  showEditButton = true,
  showDeleteButton = true
}: PlayerCardProps) {

  if (!player) return null;

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const cardStyle = {
    boxShadow: isSelected ? `0 0 15px ${colorOfCard || 'hsl(var(--primary))'}` : 'none',
  };

  return (
    <div className="box-border w-1/4 p-1 sm:w-[16.667%] md:w-1/8">
      <div
        onClick={() => onCardClick(player)}
        style={cardStyle}
        className={cn(
          "relative cursor-pointer overflow-hidden rounded-lg transition-all duration-200",
          isSelected && "scale-105"
        )}
      >
        <img
          src={player.photo || 'no-image.png'}
          alt={player.name}
          className="aspect-[1/1.2] w-full object-cover"
        />

        {/* Overlay com o número do jogador */}
        <div
          className="absolute bottom-1 left-1 rounded-sm px-1.5 py-0 text-white"
          style={{ backgroundColor: colorOfCard || 'rgba(0,0,0,0.7)' }}
        >
          <span className="text-2xl font-bold">{player.number}</span>
        </div>

        {/* Botão de Editar */}
        {showEditButton && onEditClick && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1 h-7 w-7 bg-black/50 text-white hover:bg-black/80 hover:text-white"
            onClick={(e) => handleActionClick(e, () => onEditClick(player!))}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}

        {/* Botão de Excluir */}
        {showDeleteButton && onDeletePlayer && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute bottom-1 right-1 h-7 w-7 bg-black/50 text-white hover:bg-destructive/80 hover:text-white"
            onClick={(e) => handleActionClick(e, () => onDeletePlayer(player!))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}