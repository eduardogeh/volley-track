// src/components/analysis/ScoutedEventsSidebar.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface ScoutedEvent {
  id: number;
  playerName: string;
  playerNumber: number;
  playerPhoto?: string;
  actionDescription: string;
  timestamp: number;
}

interface ScoutedEventsSidebarProps {
  events: ScoutedEvent[];
  onEventClick: (timestamp: number) => void;
  activeEventId?: number | null;
}

export function ScoutedEventsSidebar({ events, onEventClick, activeEventId }: ScoutedEventsSidebarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4 border-b shrink-0">
        <h3 className="font-semibold text-lg">Ações Registradas</h3>
      </div>

      {/* ############################################# */}
      {/* <<< A CORREÇÃO ESTÁ NESTA ESTRUTURA >>> */}
      {/* ############################################# */}
      {/* 1. Criamos um contêiner que cresce e gerencia o overflow */}
      <div className="flex-grow overflow-y-auto">
        {/* 2. A ScrollArea agora preenche 100% da altura deste contêiner */}
        <ScrollArea className="h-full">
          <div className="p-2 space-y-1">
            {events.length > 0 ? (
              events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => onEventClick(event.timestamp)}
                  className={cn(
                    "w-full text-left p-2 rounded-md flex items-center gap-3 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring",
                    activeEventId === event.id && "bg-accent"
                  )}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={event.playerPhoto} />
                    <AvatarFallback>{event.playerNumber}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow text-sm">
                    <p className="font-semibold">{event.actionDescription}</p>
                    <p className="text-xs text-muted-foreground">{event.playerName}</p>
                  </div>
                  <div className="text-sm font-mono text-muted-foreground">
                    {formatTime(event.timestamp)}
                  </div>
                </button>
              ))
            ) : (
              <p className="p-4 text-sm text-center text-muted-foreground">Nenhuma ação registrada.</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}