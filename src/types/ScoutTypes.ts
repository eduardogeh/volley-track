export type Subcategory = {
    id?: number;
    name: string;
    type: string;
    weight?: number;
};

export type Category = {
    id?: number;
    name: string;
    color?: string;
    subcategories: Subcategory[];
    time_to_clip_before_event?: number;
    time_to_clip_after_event?: number;
};

export type ScoutModel = {
    id?: number;
    name: string;
    grid_width: number;
    grid_height: number;
    categories: Category[];
};