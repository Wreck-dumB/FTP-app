"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function acceptInvite(formData: FormData) {
  const supabase = await createClient();

  const token = formData.get("token") as string;
  const displayName = (formData.get("display_name") as string)?.trim();
  const color = (formData.get("color") as string) || "#3b82f6";

  if (!displayName) {
    redirect(`/accept-invite/${token}?error=Please enter your display name`);
  }

  const { error } = await supabase.rpc("accept_family_invite", {
    _token: token,
    _display_name: displayName,
    _color: color,
  });

  if (error) {
    redirect(`/accept-invite/${token}?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/family");
}
