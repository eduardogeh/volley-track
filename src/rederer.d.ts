import type { PlayerProps, Team } from "./types/TeamPlayersTypes.ts";
import type {Scout} from "./types/ScoutTypes.ts";

export {};

declare global {
  interface Window {
    api: {
      team: {
        getAll: () => Team[];
        update: (team: Team) => void;
        create: (team: Partial<Omit<Team, 'id'>>) => Promise<number>;
        delete: (teamId: number) => void;
      };
      player: {
        getByTeamId: (teamId: number) => Promise<PlayerProps[]>;
        create: (player: Omit<PlayerProps, 'id'> & { team_id: number }) => void;
        update: (player: PlayerProps) => void;
        updateOrder: (teamId: number, orderedPlayerIds: number[]) => void;
        delete: (playerId: number) => void;
      };
      scout: {
        getAll: () => Promise<Scout[]>;
        getById: (scoutId: number) => Promise<Scout | null>;
        save: (scout: Partial<Omit<Scout, 'id'>>) => Promise<number>;
        delete: (scoutId: number) => Promise<void>;
      },
      project: {
        getAll: () => Promise<Project[]>;
        getById: (projectId: number) => Promise<Project | null>;
        create: (project: Partial<Omit<Project, 'id'>>) => Promise<number>;
        update: (project: Project) => Promise<void>;
        delete: (projectId: number) => Promise<void>;
      };
      dialog: {
        openFile: () => Promise<string | null>;
      };
      fileToUrl: {
        convert: (filePath: string) => string;
      },
      getMediaServerUrl: () => Promise<string>;
    };
  }
}