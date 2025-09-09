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
                getByTeamId: (teamId: number) => PlayerProps[];
                create: (player: Omit<PlayerProps, 'id'> & { team_id: number }) => void;
                update: (player: PlayerProps) => void;
                updateOrder: (teamId: number, orderedPlayerIds: number[]) => void;
                delete: (playerId: number) => void;
            };
            scout: {
                getAll: () => Promise<Scout[]>;
                save: (scout: Partial<Omit<Scout, 'id'>>) => Promise<number>;
                delete: (scoutId: number) => Promise<void>;
            },
        };
    }
}