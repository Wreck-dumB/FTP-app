import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { acceptInvite } from "./actions";
import { errorMessage } from "@/lib/utils/errors";

const ROLE_LABELS: Record<string, string> = {
  parent: "Parent",
  co_parent: "Co-parent",
  guardian: "Guardian",
};

export default async function AcceptInvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const { error } = await searchParams;
  const errorText = errorMessage(error);

  const supabase = await createClient();

  const { data: previewRows } = await supabase.rpc("get_invite_preview", { _token: token });
  const preview = previewRows?.[0];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!preview) {
    return (
      <InviteShell>
        <p className="text-gray-700">
          This invite link doesn&apos;t exist. Double-check the link, or ask the family member who
          invited you to send a new one.
        </p>
      </InviteShell>
    );
  }

  if (preview.status !== "pending") {
    const statusText =
      preview.status === "accepted"
        ? "already been used"
        : preview.status === "revoked"
          ? "been revoked"
          : "expired";
    return (
      <InviteShell>
        <p className="text-gray-700">
          This invite has {statusText}. Ask the family member who invited you to send a new one if
          you still need to join.
        </p>
      </InviteShell>
    );
  }

  if (new Date(preview.expires_at) <= new Date()) {
    return (
      <InviteShell>
        <p className="text-gray-700">
          This invite has expired. Ask the family member who invited you to send a new one.
        </p>
      </InviteShell>
    );
  }

  const nextPath = `/accept-invite/${token}`;

  if (!user) {
    return (
      <InviteShell>
        <p className="text-gray-700">
          You&apos;ve been invited to join <strong>{preview.family_name}</strong> as a{" "}
          {ROLE_LABELS[preview.invited_role] ?? preview.invited_role}.
        </p>
        <p className="mt-4 text-sm text-gray-500">Log in or sign up to accept this invite.</p>
        <div className="mt-4 flex gap-3">
          <Link
            href={`/login?next=${encodeURIComponent(nextPath)}`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Log in
          </Link>
          <Link
            href={`/signup?next=${encodeURIComponent(nextPath)}`}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            Sign up
          </Link>
        </div>
      </InviteShell>
    );
  }

  return (
    <InviteShell>
      <p className="text-gray-700">
        You&apos;ve been invited to join <strong>{preview.family_name}</strong> as a{" "}
        {ROLE_LABELS[preview.invited_role] ?? preview.invited_role}.
      </p>

      {errorText && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{errorText}</p>
      )}

      <form action={acceptInvite} className="mt-4 space-y-4">
        <input type="hidden" name="token" value={token} />
        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
            Your display name
          </label>
          <input
            id="display_name"
            name="display_name"
            type="text"
            required
            placeholder="e.g. Dad, Grandma"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            This is how you&apos;ll appear on the shared calendar.
          </p>
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Your calendar color
          </label>
          <input
            id="color"
            name="color"
            type="color"
            defaultValue="#3b82f6"
            className="mt-1 h-10 w-16 rounded-md border border-gray-300 p-1"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Join {preview.family_name}
        </button>
      </form>
    </InviteShell>
  );
}

function InviteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-center text-2xl font-bold text-gray-900">Forward Thinking Parents</h1>
        {children}
      </div>
    </div>
  );
}
