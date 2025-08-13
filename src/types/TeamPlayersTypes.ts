export interface Team {
    id: number;
    name: string;
    logo: string;
    color: string;
    players?: PlayerProps[];
}

export interface PlayerProps {
    id?: number;
    name: string;
    number?: number;
    height?: string;
    position: string;
    photo?: string; // Base64 encoded image
}