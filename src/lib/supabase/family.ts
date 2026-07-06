import { createClient } from "@/lib/supabase/server";
import type { Family, FamilyMember, FamilyInvite } from "@/lib/types/domain";
import type { PostgrestError } from "@supabase/supabase-js";

/** Log the raw database error server-side and throw a wrapped one for the error boundary. */
function fail(context: string, error: PostgrestError): never {
  console.error(`${context}:`, error);
  throw new Error(`${context} (${error.code})`);
}

/**
 * The current user's family membership, or null if they haven't joined/created
 * a family yet. Throws on query failure — a DB error must never look like
 * "no family" (that would route an existing family into /family/setup).
 */
export async function getCurrentFamilyMember(): Promise<FamilyMember | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("family_members")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at")
    .limit(1)
    .maybeSingle();

  if (error) fail("Failed to load family membership", error);

  return data;
}

export async function getFamily(familyId: string): Promise<Family | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("families")
    .select("*")
    .eq("id", familyId)
    .single();

  if (error) fail("Failed to load family", error);

  return data;
}

export async function getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("family_members")
    .select("*")
    .eq("family_id", familyId)
    .order("created_at");

  if (error) fail("Failed to load family members", error);

  return data ?? [];
}

/** Pending (not yet accepted/expired/revoked) invites for a family, newest first. */
export async function getPendingInvites(familyId: string): Promise<FamilyInvite[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("family_invites")
    .select("*")
    .eq("family_id", familyId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) fail("Failed to load pending invites", error);

  return data ?? [];
}
