export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      audit_issues: {
        Row: {
          audit_id: string;
          category: string;
          created_at: string;
          description: string | null;
          id: string;
          recommendation: string | null;
          severity: string;
          title: string;
        };
        Insert: {
          audit_id: string;
          category: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          recommendation?: string | null;
          severity: string;
          title: string;
        };
        Update: {
          audit_id?: string;
          category?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          recommendation?: string | null;
          severity?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_issues_audit_id_fkey";
            columns: ["audit_id"];
            isOneToOne: false;
            referencedRelation: "audits";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_progress: {
        Row: {
          audit_id: string | null;
          created_at: string | null;
          data: Json | null;
          id: string;
          message: string | null;
          step: number;
          total_steps: number;
        };
        Insert: {
          audit_id?: string | null;
          created_at?: string | null;
          data?: Json | null;
          id?: string;
          message?: string | null;
          step: number;
          total_steps: number;
        };
        Update: {
          audit_id?: string | null;
          created_at?: string | null;
          data?: Json | null;
          id?: string;
          message?: string | null;
          step?: number;
          total_steps?: number;
        };
        Relationships: [
          {
            foreignKeyName: "audit_progress_audit_id_fkey";
            columns: ["audit_id"];
            isOneToOne: false;
            referencedRelation: "audits";
            referencedColumns: ["id"];
          },
        ];
      };
      audits: {
        Row: {
          accessibility_score: number | null;
          best_practices_score: number | null;
          completed_at: string | null;
          created_at: string;
          error_message: string | null;
          id: string;
          performance_score: number | null;
          results: Json | null;
          score: number | null;
          seo_score: number | null;
          status: string;
          updated_at: string;
          url: string;
          user_id: string;
        };
        Insert: {
          accessibility_score?: number | null;
          best_practices_score?: number | null;
          completed_at?: string | null;
          created_at?: string;
          error_message?: string | null;
          id?: string;
          performance_score?: number | null;
          results?: Json | null;
          score?: number | null;
          seo_score?: number | null;
          status?: string;
          updated_at?: string;
          url: string;
          user_id: string;
        };
        Update: {
          accessibility_score?: number | null;
          best_practices_score?: number | null;
          completed_at?: string | null;
          created_at?: string;
          error_message?: string | null;
          id?: string;
          performance_score?: number | null;
          results?: Json | null;
          score?: number | null;
          seo_score?: number | null;
          status?: string;
          updated_at?: string;
          url?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      usage: {
        Row: {
          count: number | null;
          created_at: string | null;
          date: string;
          id: string;
          plan_at_time: string | null;
          user_id: string | null;
        };
        Insert: {
          count?: number | null;
          created_at?: string | null;
          date: string;
          id?: string;
          plan_at_time?: string | null;
          user_id?: string | null;
        };
        Update: {
          count?: number | null;
          created_at?: string | null;
          date?: string;
          id?: string;
          plan_at_time?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          company: string | null;
          created_at: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          plan: string | null;
          subscription_status: string | null;
          trial_ends_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          company?: string | null;
          created_at?: string | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          plan?: string | null;
          subscription_status?: string | null;
          trial_ends_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          company?: string | null;
          created_at?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          plan?: string | null;
          subscription_status?: string | null;
          trial_ends_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

// Helper types for your SEO application
export type Audit = Tables<"audits">;
export type AuditInsert = TablesInsert<"audits">;
export type AuditUpdate = TablesUpdate<"audits">;

export type AuditProgress = Tables<"audit_progress">;
export type AuditIssue = Tables<"audit_issues">;
export type UserProfile = Tables<"user_profiles">;
export type Usage = Tables<"usage">;

// Audit status types
export type AuditStatus = "pending" | "running" | "completed" | "failed";

// Severity levels for issues
export type IssueSeverity = "low" | "medium" | "high" | "critical";

// Subscription plans
export type SubscriptionPlan = "starter" | "professional" | "enterprise";

// Subscription status
export type SubscriptionStatus =
  | "active"
  | "cancelled"
  | "past_due"
  | "trialing";
