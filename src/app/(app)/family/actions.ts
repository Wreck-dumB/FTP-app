"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamilyMember } from "@/lib/supabase/family";

export async function createFamily(formData: FormData) {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const displayName = (formData.get("display_name") as string)?.trim();
  const color = (formData.get("color") as string) || "#3b82f6";

  if (!name || !displayName) {
    redirect("/family/setup?error=Please fill in both fields");
  }

  const { error } = await supabase.rpc("create_family_with_owner", {
    _name: name,
    _display_name: displayName,
    _color: color,
  });

  if (error) {
    redirect(`/family/setup?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/family");
}

export async function createInvite(formData: FormData) {
  const supabase = await createClient();

  const member = await getCurrentFamilyMember();
  if (!member) {
    redirect("/family/setup");
  }

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const role = formData.get("role") as string;

  if (!email || (role !== "co_parent" && role !== "guardian")) {
    redirect("/family?error=Please enter an email and choose a role");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("family_invites").insert({
    family_id: member.family_id,
    invited_email: email,
    invited_role: role,
    invited_by: user.id,
  });

  if (error) {
    redirect(`/family?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/family");
  redirect("/family");
}

export async function revokeInvite(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  // RLS scopes this to invites for the caller's own family — a foreign
  // invite id is simply a no-op, not an error.
  await supabase.from("family_invites").update({ status: "revoked" }).eq("id", id);

  revalidatePath("/family");
}
