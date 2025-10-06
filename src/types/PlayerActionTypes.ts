export interface PlayerAction {
  id?: number;
  project_id: number;
  player_id: number;
  resultado_id?: number;
  zona_id?: number;
  clip_start?: number;
  clip_end?: number;
}

export type ScoutedEvent = {
  id: number;
  playerName: string;
  playerNumber?: number;
  playerPhoto?: string;
  actionDescription?: string;
  categoryName: string;
  categoryColor: string;
  clipStart: number;
  clipEnd?: number;
}