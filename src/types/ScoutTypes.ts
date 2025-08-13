// src/types/ScoutModelTypes.ts

export type Subcategory = {
    id?: number;
    name: string;
    type: string; // "resultado", "zona", "tipo", etc.
    weight?: number; // Peso da subcategoria
};

export type Category = {
    id?: number;
    name: string;
    color?: string;
    subcategories: Subcategory[];
};

export type ScoutModel = {
    id?: number;
    name: string;
    grid_width: number;
    grid_height: number;
    categories: Category[];
};