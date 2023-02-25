export type Point = {
    x: number;
    y: number;
    id: string;
    title?: string;
    details?: string;
    date?: Date;
};

export type NewPoint = {
    x?: number;
    y?: number;
    id?: string;
    title?: string;
    details?: string;
    date?: Date;
};

export  type Recipe = {
    name: string;
    id: string;
    points: Point[];
};