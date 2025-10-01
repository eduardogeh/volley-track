export interface Project {
  id: number;
  season: string;
  tournament: string;
  description?: string;
  video_path?: string;
  id_scout_model: number;
  id_team: number;
}