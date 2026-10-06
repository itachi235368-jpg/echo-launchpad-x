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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_events: {
        Row: {
          created_at: string
          details: Json
          event_type: string
          id: number
          is_public: boolean
          owner_id: string | null
          persona_id: string
          title: string
        }
        Insert: {
          created_at?: string
          details?: Json
          event_type: string
          id?: never
          is_public?: boolean
          owner_id?: string | null
          persona_id: string
          title: string
        }
        Update: {
          created_at?: string
          details?: Json
          event_type?: string
          id?: never
          is_public?: boolean
          owner_id?: string | null
          persona_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_events_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          caption: string
          cost_usd: number
          created_at: string
          id: string
          kind: string
          owner_id: string | null
          persona_id: string
          prompt: string
          provider_run_id: string | null
          published_at: string | null
          status: string
          storage_path: string | null
          thumbnail_url: string | null
        }
        Insert: {
          caption?: string
          cost_usd?: number
          created_at?: string
          id?: string
          kind: string
          owner_id?: string | null
          persona_id: string
          prompt?: string
          provider_run_id?: string | null
          published_at?: string | null
          status?: string
          storage_path?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          caption?: string
          cost_usd?: number
          created_at?: string
          id?: string
          kind?: string
          owner_id?: string | null
          persona_id?: string
          prompt?: string
          provider_run_id?: string | null
          published_at?: string | null
          status?: string
          storage_path?: string | null
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      personas: {
        Row: {
          appearance_prompt: string
          avatar_url: string | null
          bio: string
          cover_url: string | null
          created_at: string
          disclosure: string
          follower_count: number
          id: string
          is_demo: boolean
          name: string
          niche: string
          owner_id: string | null
          personality: Json
          slug: string
          status: string
          symbol: string
          updated_at: string
          voice_id: string | null
        }
        Insert: {
          appearance_prompt?: string
          avatar_url?: string | null
          bio?: string
          cover_url?: string | null
          created_at?: string
          disclosure?: string
          follower_count?: number
          id?: string
          is_demo?: boolean
          name: string
          niche: string
          owner_id?: string | null
          personality?: Json
          slug: string
          status?: string
          symbol: string
          updated_at?: string
          voice_id?: string | null
        }
        Update: {
          appearance_prompt?: string
          avatar_url?: string | null
          bio?: string
          cover_url?: string | null
          created_at?: string
          disclosure?: string
          follower_count?: number
          id?: string
          is_demo?: boolean
          name?: string
          niche?: string
          owner_id?: string | null
          personality?: Json
          slug?: string
          status?: string
          symbol?: string
          updated_at?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          preferences: Json
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          preferences?: Json
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferences?: Json
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          attempts: number
          caption: string
          channel: string
          created_at: string
          id: string
          last_error: string | null
          media_id: string | null
          owner_id: string
          persona_id: string
          scheduled_for: string
          status: string
        }
        Insert: {
          attempts?: number
          caption?: string
          channel: string
          created_at?: string
          id?: string
          last_error?: string | null
          media_id?: string | null
          owner_id: string
          persona_id: string
          scheduled_for: string
          status?: string
        }
        Update: {
          attempts?: number
          caption?: string
          channel?: string
          created_at?: string
          id?: string
          last_error?: string | null
          media_id?: string | null
          owner_id?: string
          persona_id?: string
          scheduled_for?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_posts_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_posts_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens: {
        Row: {
          burn_bps: number
          created_at: string
          creator_bps: number
          curve_progress: number
          holders_count: number
          id: string
          launch_signature: string | null
          launched_at: string | null
          market_cap_usd: number
          mint_address: string | null
          network: string
          owner_id: string | null
          persona_id: string
          price_usd: number
          status: string
          supply: number
          treasury_bps: number
          volume_24h_usd: number
        }
        Insert: {
          burn_bps?: number
          created_at?: string
          creator_bps?: number
          curve_progress?: number
          holders_count?: number
          id?: string
          launch_signature?: string | null
          launched_at?: string | null
          market_cap_usd?: number
          mint_address?: string | null
          network?: string
          owner_id?: string | null
          persona_id: string
          price_usd?: number
          status?: string
          supply?: number
          treasury_bps?: number
          volume_24h_usd?: number
        }
        Update: {
          burn_bps?: number
          created_at?: string
          creator_bps?: number
          curve_progress?: number
          holders_count?: number
          id?: string
          launch_signature?: string | null
          launched_at?: string | null
          market_cap_usd?: number
          mint_address?: string | null
          network?: string
          owner_id?: string | null
          persona_id?: string
          price_usd?: number
          status?: string
          supply?: number
          treasury_bps?: number
          volume_24h_usd?: number
        }
        Relationships: [
          {
            foreignKeyName: "tokens_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: true
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      treasuries: {
        Row: {
          allowed_services: string[]
          approval_above_usd: number
          daily_limit_usd: number
          id: string
          kill_switch: boolean
          monthly_limit_usd: number
          operating_balance_usd: number
          owner_id: string | null
          persona_id: string
          reserve_usd: number
          updated_at: string
        }
        Insert: {
          allowed_services?: string[]
          approval_above_usd?: number
          daily_limit_usd?: number
          id?: string
          kill_switch?: boolean
          monthly_limit_usd?: number
          operating_balance_usd?: number
          owner_id?: string | null
          persona_id: string
          reserve_usd?: number
          updated_at?: string
        }
        Update: {
          allowed_services?: string[]
          approval_above_usd?: number
          daily_limit_usd?: number
          id?: string
          kill_switch?: boolean
          monthly_limit_usd?: number
          operating_balance_usd?: number
          owner_id?: string | null
          persona_id?: string
          reserve_usd?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treasuries_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: true
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_links: {
        Row: {
          chain: string
          created_at: string
          id: string
          user_id: string
          verified_at: string
          wallet_address: string
        }
        Insert: {
          chain?: string
          created_at?: string
          id?: string
          user_id: string
          verified_at?: string
          wallet_address: string
        }
        Update: {
          chain?: string
          created_at?: string
          id?: string
          user_id?: string
          verified_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "creator"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "creator"],
    },
  },
} as const
