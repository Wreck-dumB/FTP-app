"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamilyMember } from "@/lib/supabase/family";
import { toErrorCode } from "@/lib/utils/errors";
import { sanitizeColor, cleanText } from "@/lib/utils/inputs";

export async function createFamily(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const name = cleanText(formData.get("name"));
  const displayName = cleanText(formData.get("display_name"));
  const color = sanitizeColor(formData.get("color"));

  if (!name || !displayName) {
    redirect("/family/setup?error=missing_fields");
  }

  const { error } = await supabase.rpc("create_family_with_owner", {
    _name: name,
    _display_name: displayName,
    _color: color,
  });

  if (error) {
    redirect(`/family/setup?error=${toErrorCode(error)}`);
  }

  redirect("/family");
}

export async function createInvite(formData: FormData) {
  const supabase = await createClient();

  const member = await getCurrentFamilyMember();
  if (!member) {
    redirect("/family/setup");
  }

  const email = cleanText(formData.get("email"), 320).toLowerCase();
  const role = formData.get("role") as string;

  if (!email || (role !== "co_parent" && role !== "guardian")) {
    redirect("/family?error=invalid_input");
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
    redirect(`/family?error=${toErrorCode(error)}`);
  }

  revalidatePath("/family");
  redirect("/family");
}

export async function revokeInvite(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const id = formData.get("id") as string;

  // RLS scopes this to invites for the caller's own family — a foreign
  // invite id is simply a no-op, not an error.
  await supabase.from("family_invites").update({ status: "revoked" }).eq("id", id);

  revalidatePath("/family");
}
