"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
