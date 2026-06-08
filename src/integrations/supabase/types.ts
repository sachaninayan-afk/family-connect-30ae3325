export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      families: {
        Row: {
          category: string
          child_name: string
          created_at: string
          date_of_birth: string | null
          date_of_visit: string
          family_number: string
          father_mobile: string | null
          father_name: string | null
          home_address: string | null
          id: string
          karyakar_name: string
          mother_mobile: string | null
          mother_name: string | null
          school_name: string | null
          standard: string | null
          surname: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          child_name: string
          created_at?: string
          date_of_birth?: string | null
          date_of_visit: string
          family_number: string
          father_mobile?: string | null
          father_name?: string | null
          home_address?: string | null
          id?: string
          karyakar_name: string
          mother_mobile?: string | null
          mother_name?: string | null
          school_name?: string | null
          standard?: string | null
          surname?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          child_name?: string
          created_at?: string
          date_of_birth?: string | null
          date_of_visit?: string
          family_number?: string
          father_mobile?: string | null
          father_name?: string | null
          home_address?: string | null
          id?: string
          karyakar_name?: string
          mother_mobile?: string | null
          mother_name?: string | null
          school_name?: string | null
          standard?: string | null
          surname?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      family_visits: {
        Row: {
          category: string
          created_at: string
          date_of_visit: string
          family_head_mobile: string
          family_head_name: string
          home_address: string | null
          id: string
          karyakar_names: string[]
          kid1_name: string | null
          kid1_std: string | null
          kid2_name: string | null
          kid2_std: string | null
          kid3_name: string | null
          kid3_std: string | null
          kids_mother_mobile: string | null
          surname: string
          total_females: number
          total_kids: number
          total_males: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          date_of_visit: string
          family_head_mobile: string
          family_head_name: string
          home_address?: string | null
          id?: string
          karyakar_names?: string[]
          kid1_name?: string | null
          kid1_std?: string | null
          kid2_name?: string | null
          kid2_std?: string | null
          kid3_name?: string | null
          kid3_std?: string | null
          kids_mother_mobile?: string | null
          surname: string
          total_females?: number
          total_kids?: number
          total_males?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          date_of_visit?: string
          family_head_mobile?: string
          family_head_name?: string
          home_address?: string | null
          id?: string
          karyakar_names?: string[]
          kid1_name?: string | null
          kid1_std?: string | null
          kid2_name?: string | null
          kid2_std?: string | null
          kid3_name?: string | null
          kid3_std?: string | null
          kids_mother_mobile?: string | null
          surname?: string
          total_females?: number
          total_kids?: number
          total_males?: number
          updated_at?: string
        }
        Relationships: []
      }
      karyakars: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
