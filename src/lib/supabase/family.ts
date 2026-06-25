import { createClient } from "@/lib/supabase/server";
import type { Family, FamilyMember, FamilyInvite } from "@/lib/types/domain";

/** The current user's family membership, or null if they haven't joined/created a family yet. */
export async function getCurrentFamilyMember(): Promise<FamilyMember | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("family_members")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  return data;
}

export async function getFamily(familyId: string): Promise<Family | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("families").select("*").eq("id", familyId).single();
  return data;
}

export async function getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", familyId)
    .order("created_at");

  return data ?? [];
}

/** Pending (not yet accepted/expired/revoked) invites for a family, newest first. */
export async function getPendingInvites(familyId: string): Promise<FamilyInvite[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("family_invites")
    .select("*")
    .eq("family_id", familyId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return data ?? [];
}
