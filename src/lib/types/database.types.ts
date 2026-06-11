// Hand-written types matching supabase/migrations/0001_initial_schema.sql.
// Once the Supabase project is set up, regenerate with:
//   npx supabase gen types typescript --project-id <project-id> > src/lib/types/database.types.ts

export type FamilyRole = "parent" | "co_parent" | "guardian";
export type InviteStatus = "pending" | "accepted" | "expired" | "revoked";
export type PatternType = "weekly" | "alternating_weeks" | "custom";
export type SwapRequestType = "swap" | "give_up" | "request_time";
export type SwapRequestStatus = "pending" | "accepted" | "declined" | "cancelled";
export type NotificationType =
  | "swap_request_new"
  | "swap_request_accepted"
  | "swap_request_declined"
  | "upcoming_change_reminder"
  | "family_invite"
  | "note_reminder";
export type NoteTargetType = "family" | "member" | "child";

export interface Database {
  public: {
    Tables: {
      families: {
        Row: {
          id: string;
          name: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_by: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["families"]["Insert"]>;
        Relationships: [];
      };
      family_members: {
        Row: {
          id: string;
          family_id: string;
          user_id: string;
          role: FamilyRole;
          display_name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          user_id: string;
          role: FamilyRole;
          display_name: string;
          color?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["family_members"]["Insert"]>;
        Relationships: [];
      };
      family_invites: {
        Row: {
          id: string;
          family_id: string;
          invited_email: string;
          invited_role: Exclude<FamilyRole, "parent">;
          token: string;
          status: InviteStatus;
          invited_by: string;
          created_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          invited_email: string;
          invited_role: Exclude<FamilyRole, "parent">;
          token?: string;
          status?: InviteStatus;
          invited_by: string;
          created_at?: string;
          expires_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["family_invites"]["Insert"]>;
        Relationships: [];
      };
      children: {
        Row: {
          id: string;
          family_id: string;
          first_name: string;
          date_of_birth: string | null;
          avatar_url: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          first_name: string;
          date_of_birth?: string | null;
          avatar_url?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["children"]["Insert"]>;
        Relationships: [];
      };
      custody_schedules: {
        Row: {
          id: string;
          family_id: string;
          name: string;
          pattern_type: PatternType;
          cycle_start_date: string;
          cycle_length_days: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          name: string;
          pattern_type: PatternType;
          cycle_start_date: string;
          cycle_length_days?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["custody_schedules"]["Insert"]>;
        Relationships: [];
      };
      custody_schedule_blocks: {
        Row: {
          id: string;
          schedule_id: string;
          parent_member_id: string;
          cycle_day_start: number;
          cycle_day_end: number;
          start_time: string;
          end_time: string;
          label: string | null;
        };
        Insert: {
          id?: string;
          schedule_id: string;
          parent_member_id: string;
          cycle_day_start: number;
          cycle_day_end: number;
          start_time?: string;
          end_time?: string;
          label?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["custody_schedule_blocks"]["Insert"]>;
        Relationships: [];
      };
      swap_requests: {
        Row: {
          id: string;
          family_id: string;
          requested_by: string;
          responder_id: string | null;
          request_type: SwapRequestType;
          affected_dates: string[];
          proposed_assigned_member_id: string;
          message: string | null;
          status: SwapRequestStatus;
          responded_at: string | null;
          response_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          requested_by: string;
          responder_id?: string | null;
          request_type: SwapRequestType;
          affected_dates: string[];
          proposed_assigned_member_id: string;
          message?: string | null;
          status?: SwapRequestStatus;
          responded_at?: string | null;
          response_message?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["swap_requests"]["Insert"]>;
        Relationships: [];
      };
      custody_overrides: {
        Row: {
          id: string;
          family_id: string;
          schedule_id: string | null;
          date: string;
          assigned_member_id: string;
          reason: string | null;
          created_by: string;
          source_request_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          schedule_id?: string | null;
          date: string;
          assigned_member_id: string;
          reason?: string | null;
          created_by: string;
          source_request_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["custody_overrides"]["Insert"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          family_id: string;
          recipient_user_id: string;
          type: NotificationType;
          title: string;
          body: string;
          related_request_id: string | null;
          is_read: boolean;
          email_sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          recipient_user_id: string;
          type: NotificationType;
          title: string;
          body: string;
          related_request_id?: string | null;
          is_read?: boolean;
          email_sent_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [];
      };
      notes: {
        Row: {
          id: string;
          family_id: string;
          author_member_id: string;
          title: string;
          body: string | null;
          target_type: NoteTargetType;
          target_id: string | null;
          reminder_at: string | null;
          is_done: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          author_member_id: string;
          title: string;
          body?: string | null;
          target_type?: NoteTargetType;
          target_id?: string | null;
          reminder_at?: string | null;
          is_done?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notes"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_family_member: {
        Args: { _family_id: string };
        Returns: boolean;
      };
      create_family_with_owner: {
        Args: { _name: string; _display_name: string; _color?: string };
        Returns: string;
      };
      accept_family_invite: {
        Args: { _token: string; _display_name: string; _color?: string };
        Returns: string;
      };
      accept_swap_request: {
        Args: { _request_id: string };
        Returns: undefined;
      };
      decline_swap_request: {
        Args: { _request_id: string; _response_message?: string | null };
        Returns: undefined;
      };
    };
  };
}
