"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toErrorCode } from "@/lib/utils/errors";
import { sanitizeColor, cleanText } from "@/lib/utils/inputs";

export async function acceptInvite(formData: FormData) {
  const supabase = await createClient();

  const token = formData.get("token") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/accept-invite/${token}`)}`);
  }

  const displayName = cleanText(formData.get("display_name"));
  const color = sanitizeColor(formData.get("color"));

  if (!displayName) {
    redirect(`/accept-invite/${token}?error=missing_name`);
  }

  const { error } = await supabase.rpc("accept_family_invite", {
    _token: token,
    _display_name: displayName,
    _color: color,
  });

  if (error) {
    redirect(`/accept-invite/${token}?error=${toErrorCode(error)}`);
  }

  redirect("/family");
}
