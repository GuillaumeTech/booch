export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[]

export interface Database {
    public: {
        Tables: {
            Recipes: {
                Row: {
                    axisNames: Json | null
                    created_at: string | null
                    id: number
                    name: string
                    points: Json | null
                    public: boolean | null
                    user_id: string
                }
                Insert: {
                    axisNames?: Json | null
                    created_at?: string | null
                    id?: number
                    name: string
                    points?: Json | null
                    public?: boolean | null
                    user_id: string
                }
                Update: {
                    axisNames?: Json | null
                    created_at?: string | null
                    id?: number
                    name?: string
                    points?: Json | null
                    public?: boolean | null
                    user_id?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
