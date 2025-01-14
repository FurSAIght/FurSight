export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      central: {
        Row: {
          created_at: string
          description: string
          id: number
          name: string
          room_id: number
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          name: string
          room_id: number
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: string
          room_id?: number
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "central_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      central_config: {
        Row: {
          central_id: number
          created_at: string
          description: string
          flows: Json
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          central_id: number
          created_at?: string
          description: string
          flows: Json
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          central_id?: number
          created_at?: string
          description?: string
          flows?: Json
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "central_config_central_central_id_fkey"
            columns: ["central_id"]
            isOneToOne: false
            referencedRelation: "central"
            referencedColumns: ["id"]
          },
        ]
      }
      chart: {
        Row: {
          created_at: string
          description: string
          id: number
          name: string
          sensor_id: string
          type: Database["public"]["Enums"]["chart_type_enum"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          name: string
          sensor_id: string
          type?: Database["public"]["Enums"]["chart_type_enum"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: string
          sensor_id?: string
          type?: Database["public"]["Enums"]["chart_type_enum"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chart_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "sensor"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string
          description: string
          id: number
          is_active: boolean
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          is_active?: boolean
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          is_active?: boolean
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sensor: {
        Row: {
          central_id: number
          created_at: string
          description: string
          id: string
          name: string
          type: Database["public"]["Enums"]["sensor_type_enum"]
          updated_at: string | null
        }
        Insert: {
          central_id: number
          created_at?: string
          description: string
          id: string
          name: string
          type?: Database["public"]["Enums"]["sensor_type_enum"]
          updated_at?: string | null
        }
        Update: {
          central_id?: number
          created_at?: string
          description?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["sensor_type_enum"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sensor_central_id_fkey"
            columns: ["central_id"]
            isOneToOne: false
            referencedRelation: "central"
            referencedColumns: ["id"]
          },
        ]
      }
      sensor_data: {
        Row: {
          sensor_id: string
          timestamp: string
          value: number
        }
        Insert: {
          sensor_id: string
          timestamp?: string
          value: number
        }
        Update: {
          sensor_id?: string
          timestamp?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "sensor_data_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "sensor"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      chart_type_enum: "Line" | "Area" | "List" | "Other"
      sensor_type_enum:
        | "Temperature"
        | "Humidity"
        | "Camera"
        | "Motion"
        | "Sound"
        | "Other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

