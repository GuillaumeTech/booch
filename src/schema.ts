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
                    axisNames: Json
                    created_at: string | null
                    description: string | null
                    id: string
                    name: string
                    points: Json | null
                    public: boolean | null
                    user_id: string
                }
                Insert: {
                    axisNames: Json
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    name: string
                    points?: Json | null
                    public?: boolean | null
                    user_id?: string
                }
                Update: {
                    axisNames?: Json
                    created_at?: string | null
                    description?: string | null
                    id?: string
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
