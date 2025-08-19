import 'react';
// Importe os componentes e ícones necessários
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Trash2, Shield } from "lucide-react";
import { cn } from "@/lib/utils"; // Utilitário para classes condicionais

import type { Team } from "../../types/TeamPlayersTypes.ts";

export interface TeamListProps {
  teams: Team[];
  selectedTeamId?: number;
  onSelectTeam: (team: Team) => void;
  onAddTeam: () => void;
  onDeleteTeam: (team: Team) => void;
}

export function TeamList({ teams, selectedTeamId, onSelectTeam, onAddTeam, onDeleteTeam }: TeamListProps) {

  const handleDeleteClick = (e: React.MouseEvent, team: Team) => {
    e.stopPropagation(); // Impede que o clique no ícone de lixo selecione o time
    onDeleteTeam(team);
  };

  return (
    // Container principal (substitui o Paper)
    <div className="flex h-full flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold">Equipes</h3>
        <Button variant="ghost" size="icon" onClick={onAddTeam} title="Adicionar nova equipe">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>

      {/* Lista de Times */}
      <div className="flex-grow overflow-y-auto">
        {teams && teams.length > 0 ? (
          <div className="p-2">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => onSelectTeam(team)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md p-2 text-left text-sm transition-colors hover:bg-accent",
                  selectedTeamId === team.id && "bg-accent font-semibold"
                )}
              >
                <Avatar className="h-9 w-9 rounded-md">
                  <AvatarImage src={team.logo} alt={team.name} />
                  <AvatarFallback className="rounded-md">
                    <Shield size={20}/>
                  </AvatarFallback>
                </Avatar>
                <span className="flex-grow truncate">{team.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={(e) => handleDeleteClick(e, team)}
                  title="Excluir equipe"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </button>
            ))}
          </div>
        ) : (
          // Mensagem de "nenhuma equipe"
          <div className="flex h-full items-center justify-center p-4">
            <p className="text-sm text-muted-foreground">
              Nenhuma equipe encontrada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}