type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>

export type Point = {
    x: number;
    y: number;
    id: string;
    title?: string;
    details?: string;
    tasted_at?: Date;

};

export type NewPoint = Partial<Point>

export type PointUpdate = AtLeast<Point, 'id'>

export interface AxisNames {
    x: string
    y: string
}

export type Recipe = {
    name: string;
    id: string;
    points: Point[];
    axisNames: AxisNames;
    public: boolean
    created_at: Date
};

export type RecipeUpdate = AtLeast<Recipe, 'id'>


