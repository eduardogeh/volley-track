import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type {ScoutedEvent} from "@/types/PlayerActionTypes.ts";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../ui/accordion";
import {useEffect, useMemo, useState} from "react";
import { Button } from "../ui/button";
import {Trash2} from "lucide-react";

interface ScoutedEventsSidebarProps {
  events: ScoutedEvent[];
  onEventClick: (event: ScoutedEvent) => void;
  onDeleteEvent: (eventId: number) => void;
  activeEventId?: number | null;
}

export function ScoutedEventsSidebar({ events, onEventClick, onDeleteEvent, activeEventId }: ScoutedEventsSidebarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const groupedEvents = useMemo(() => {
    return events.reduce((acc, event) => {
      const { categoryName, categoryColor } = event;
      if (!acc[categoryName]) {
        acc[categoryName] = { color: categoryColor, events: [] };
      }
      acc[categoryName].events.push(event);
      return acc;
    }, {} as Record<string, { color: string, events: ScoutedEvent[] }>);
  }, [events]);

  const [openCategories, setOpenCategories] = useState<string[]>([]);

  useEffect(() => {
    const allCurrentCategories = Object.keys(groupedEvents);
    setOpenCategories(allCurrentCategories);
  }, [groupedEvents]);


  return (
    <div className="h-full flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4 border-b shrink-0">
        <h3 className="font-semibold text-lg">Ações Registradas</h3>
      </div>

      <ScrollArea className="flex-grow">
        {events.length > 0 ? (
          <Accordion type="multiple" value={openCategories} onValueChange={setOpenCategories} className="w-full p-2">
            {Object.entries(groupedEvents).map(([categoryName, data]) => (
              <AccordionItem value={categoryName} key={categoryName} className="border-b-0 mb-1">
                <AccordionTrigger className="p-2 rounded-md hover:bg-accent [&[data-state=open]]:bg-accent">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: data.color }}
                    ></span>
                    <span className="font-semibold text-sm">{categoryName}</span>
                    <span className="text-xs text-muted-foreground ml-2 px-1.5 py-0.5 rounded-full bg-muted">{data.events.length}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0">
                  <div className="space-y-1 pl-4 border-l-2" style={{borderColor: data.color}}>
                    {data.events.map((event) => (
                      <div key={event.id} className="group flex items-center rounded-md pr-1 transition-colors hover:bg-accent">
                        <button
                          onClick={() => onEventClick(event)}
                          className={cn(
                            "flex-grow text-left p-2 flex items-center gap-3 transition-colors focus:outline-none",
                            activeEventId === event.id && "bg-accent"
                          )}
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={event.playerPhoto} />
                            <AvatarFallback>{event.playerNumber}</AvatarFallback>
                          </Avatar>
                          <div className="flex-grow text-sm">
                            <p className="font-semibold">{event.actionDescription}</p>
                            <p className="text-xs text-muted-foreground">{event.playerName}</p>
                          </div>
                          <div className="text-sm font-mono text-muted-foreground">
                            {formatTime(event.clipStart)}
                          </div>
                        </button>

                        {/* Botão de Deletar que aparece no hover */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEvent(event.id);
                          }}
                          title="Excluir ação"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="p-4 text-sm text-center text-muted-foreground">Nenhuma ação registrada.</p>
        )}
      </ScrollArea>
    </div>
  );
}