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
            recipes: {
                Row: {
                    axisNames: Json | null
                    created_at: string | null
                    id: string
                    name: string | null
                    points: Json | null
                    public: boolean | null
                    user_id: string | null
                }
                Insert: {
                    axisNames?: Json | null
                    created_at?: string | null
                    id?: string
                    name?: string | null
                    points?: Json | null
                    public?: boolean | null
                    user_id?: string | null
                }
                Update: {
                    axisNames?: Json | null
                    created_at?: string | null
                    id?: string
                    name?: string | null
                    points?: Json | null
                    public?: boolean | null
                    user_id?: string | null
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
