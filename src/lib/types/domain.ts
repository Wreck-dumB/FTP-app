import type { Database } from "./database.types";

export type Family = Database["public"]["Tables"]["families"]["Row"];
export type FamilyMember = Database["public"]["Tables"]["family_members"]["Row"];
export type FamilyInvite = Database["public"]["Tables"]["family_invites"]["Row"];
export type ChildProfile = Database["public"]["Tables"]["children"]["Row"];
export type CustodySchedule = Database["public"]["Tables"]["custody_schedules"]["Row"];
export type CustodyScheduleBlock = Database["public"]["Tables"]["custody_schedule_blocks"]["Row"];
export type CustodyOverride = Database["public"]["Tables"]["custody_overrides"]["Row"];
export type SwapRequest = Database["public"]["Tables"]["swap_requests"]["Row"];
export type AppNotification = Database["public"]["Tables"]["notifications"]["Row"];
export type Note = Database["public"]["Tables"]["notes"]["Row"];

/** Result of expanding a custody schedule for a single calendar date. */
export interface CustodyAssignment {
  date: string; // ISO date (YYYY-MM-DD)
  assignedMemberId: string;
  source: "override" | "schedule";
  reason?: string | null;
  label?: string | null;
}
