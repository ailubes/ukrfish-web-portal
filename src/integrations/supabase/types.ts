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
      members: {
        Row: {
          description: string | null
          email: string | null
          id: string
          join_date: string | null
          logo: string | null
          membership_type: string
          name: string
          phone: string | null
          production_amount: number | null
          production_type: string | null
          user_id: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          description?: string | null
          email?: string | null
          id?: string
          join_date?: string | null
          logo?: string | null
          membership_type?: string
          name: string
          phone?: string | null
          production_amount?: number | null
          production_type?: string | null
          user_id?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          description?: string | null
          email?: string | null
          id?: string
          join_date?: string | null
          logo?: string | null
          membership_type?: string
          name?: string
          phone?: string | null
          production_amount?: number | null
          production_type?: string | null
          user_id?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      membership_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          member_id: string
          notes: string | null
          payment_date: string
          payment_status: string
          payment_type: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          member_id: string
          notes?: string | null
          payment_date?: string
          payment_status?: string
          payment_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          member_id?: string
          notes?: string | null
          payment_date?: string
          payment_status?: string
          payment_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_payments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_plans: {
        Row: {
          duration: string
          features: string[] | null
          id: string
          is_popular: boolean | null
          name: string
          price: number
        }
        Insert: {
          duration: string
          features?: string[] | null
          id?: string
          is_popular?: boolean | null
          name: string
          price: number
        }
        Update: {
          duration?: string
          features?: string[] | null
          id?: string
          is_popular?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          author: string | null
          category: string | null
          content: string
          id: string
          image_url: string | null
          publish_date: string | null
          summary: string
          tags: string[] | null
          title: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          id?: string
          image_url?: string | null
          publish_date?: string | null
          summary: string
          tags?: string[] | null
          title: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          id?: string
          image_url?: string | null
          publish_date?: string | null
          summary?: string
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          id: string
          role: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          id: string
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      upsert_article: {
        Args: { article_data: Json }
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
