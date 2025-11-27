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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      homie_interests: {
        Row: {
          homie_id: string
          interest_id: string
        }
        Insert: {
          homie_id: string
          interest_id: string
        }
        Update: {
          homie_id?: string
          interest_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "homie_interests_homie_id_fkey"
            columns: ["homie_id"]
            isOneToOne: false
            referencedRelation: "homies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homie_interests_homie_id_fkey"
            columns: ["homie_id"]
            isOneToOne: false
            referencedRelation: "v_current_presence"
            referencedColumns: ["homie_id"]
          },
          {
            foreignKeyName: "homie_interests_homie_id_fkey"
            columns: ["homie_id"]
            isOneToOne: false
            referencedRelation: "v_current_presence_by_interest"
            referencedColumns: ["homie_id"]
          },
          {
            foreignKeyName: "homie_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
        ]
      }
      homies: {
        Row: {
          agreed_to_rules: boolean
          created_at: string
          email: string | null
          first_name: string
          github_url: string | null
          how_to_help: string | null
          id: string
          instagram_url: string | null
          last_name: string
          linkedin_url: string | null
          updated_at: string
          website_url: string | null
          where_from: string | null
          why_billabong: string | null
          working_on: string | null
          x_handle: string | null
          homie_image_url: string | null
        }
        Insert: {
          agreed_to_rules?: boolean
          created_at?: string
          email?: string | null
          first_name: string
          github_url?: string | null
          how_to_help?: string | null
          id?: string
          instagram_url?: string | null
          last_name: string
          linkedin_url?: string | null
          updated_at?: string
          website_url?: string | null
          where_from?: string | null
          why_billabong?: string | null
          working_on?: string | null
          x_handle?: string | null
          homie_image_url?: string | null
        }
        Update: {
          agreed_to_rules?: boolean
          created_at?: string
          email?: string | null
          first_name?: string
          github_url?: string | null
          how_to_help?: string | null
          id?: string
          instagram_url?: string | null
          last_name?: string
          linkedin_url?: string | null
          updated_at?: string
          website_url?: string | null
          where_from?: string | null
          why_billabong?: string | null
          working_on?: string | null
          x_handle?: string | null
          homie_image_url?: string | null
        }
        Relationships: []
      }
      house_rules: {
        Row: {
          created_at: string
          effective_from: string
          id: string
          is_active: boolean
          markdown_body: string
          title: string
          version: number
        }
        Insert: {
          created_at?: string
          effective_from: string
          id?: string
          is_active?: boolean
          markdown_body: string
          title?: string
          version: number
        }
        Update: {
          created_at?: string
          effective_from?: string
          id?: string
          is_active?: boolean
          markdown_body?: string
          title?: string
          version?: number
        }
        Relationships: []
      }
      interests: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      rule_acceptances: {
        Row: {
          accepted_at: string
          homie_id: string
          rule_version: number
        }
        Insert: {
          accepted_at?: string
          homie_id: string
          rule_version: number
        }
        Update: {
          accepted_at?: string
          homie_id?: string
          rule_version?: number
        }
        Relationships: [
          {
            foreignKeyName: "rule_acceptances_homie_id_fkey"
            columns: ["homie_id"]
            isOneToOne: false
            referencedRelation: "homies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rule_acceptances_homie_id_fkey"
            columns: ["homie_id"]
            isOneToOne: false
            referencedRelation: "v_current_presence"
            referencedColumns: ["homie_id"]
          },
          {
            foreignKeyName: "rule_acceptances_homie_id_fkey"
            columns: ["homie_id"]
            isOneToOne: false
            referencedRelation: "v_current_presence_by_interest"
            referencedColumns: ["homie_id"]
          },
          {
            foreignKeyName: "rule_acceptances_rule_version_fkey"
            columns: ["rule_version"]
            isOneToOne: false
            referencedRelation: "house_rules"
            referencedColumns: ["version"]
          },
        ]
      }
      visits: {
        Row: {
          agreed_rules_at: string | null
          checkin_at: string
          checkout_at: string | null
          created_at: string
          homie_id: string
          id: string
          notes: string | null
          purpose: string | null
          source: string | null
        }
        Insert: {
          agreed_rules_at?: string | null
          checkin_at?: string
          checkout_at?: string | null
          created_at?: string
          homie_id: string
          id?: string
          notes?: string | null
          purpose?: string | null
          source?: string | null
        }
        Update: {
          agreed_rules_at?: string | null
          checkin_at?: string
          checkout_at?: string | null
          created_at?: string
          homie_id?: string
          id?: string
          notes?: string | null
          purpose?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_homie_id_fkey"
            columns: ["homie_id"]
            isOneToOne: false
            referencedRelation: "homies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_homie_id_fkey"
            columns: ["homie_id"]
            isOneToOne: false
            referencedRelation: "v_current_presence"
            referencedColumns: ["homie_id"]
          },
          {
            foreignKeyName: "visits_homie_id_fkey"
            columns: ["homie_id"]
            isOneToOne: false
            referencedRelation: "v_current_presence_by_interest"
            referencedColumns: ["homie_id"]
          },
        ]
      }
      welcome_codes: {
        Row: {
          id: string
          created_at: string
          expires_at: string
          code: string
        }
        Insert: {
          id?: string
          created_at?: string
          expires_at: string
          code: string
        }
        Update: {
          id?: string
          created_at?: string
          expires_at?: string
          code?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_current_presence: {
        Row: {
          checkin_at: string | null
          duration: unknown
          email: string | null
          first_name: string | null
          homie_id: string | null
          last_name: string | null
          visit_id: string | null
        }
        Relationships: []
      }
      v_current_presence_by_interest: {
        Row: {
          checkin_at: string | null
          first_name: string | null
          homie_id: string | null
          interest: string | null
          last_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      checkout_stale_visits: {
        Args: { cutoff?: string; max_hours?: number }
        Returns: number
      }
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
