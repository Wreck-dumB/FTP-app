import { redirect } from "next/navigation";
import {
  getCurrentFamilyMember,
  getFamily,
  getFamilyMembers,
  getPendingInvites,
} from "@/lib/supabase/family";
import { createInvite, revokeInvite } from "@/app/(app)/family/actions";
import { errorMessage } from "@/lib/utils/errors";
import { getSiteUrl } from "@/lib/env";

const ROLE_LABELS: Record<string, string> = {
  parent: "Parent",
  co_parent: "Co-parent",
  guardian: "Guardian",
};

export default async function FamilyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorText = errorMessage(error);
  const member = await getCurrentFamilyMember();
  if (!member) {
    redirect("/family/setup");
  }

  const [family, members, pendingInvites] = await Promise.all([
    getFamily(member.family_id),
    getFamilyMembers(member.family_id),
    getPendingInvites(member.family_id),
  ]);

  const siteUrl = getSiteUrl();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">{family?.name ?? "Your family"}</h1>
      <p className="mt-1 text-sm text-gray-500">
        Family members can see the shared calendar, requests, and notes.
      </p>

      {errorText && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{errorText}</p>
      )}

      <div className="mt-6 rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Members</h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {members.map((m) => (
            <li key={m.id} className="flex items-center gap-3 px-4 py-3">
              <span
                className="h-3 w-3 flex-shrink-0 rounded-full"
                style={{ backgroundColor: m.color }}
                aria-hidden
              />
              <span className="font-medium text-gray-900">{m.display_name}</span>
              <span className="text-sm text-gray-500">{ROLE_LABELS[m.role] ?? m.role}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-900">Invite a co-parent or guardian</h2>
        <form action={createInvite} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="coparent@example.com"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              defaultValue="co_parent"
              className="mt-1 block rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="co_parent">Co-parent</option>
              <option value="guardian">Guardian</option>
            </select>
          </div>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Send invite
          </button>
        </form>
        <p className="mt-2 text-xs text-gray-500">
          There&apos;s no email sending set up yet — after creating an invite, copy its link below
          and send it to them yourself.
        </p>
      </div>

      {pendingInvites.length > 0 && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">Pending invites</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {pendingInvites.map((invite) => {
              const link = `${siteUrl}/accept-invite/${invite.token}`;
              return (
                <li key={invite.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{invite.invited_email}</p>
                      <p className="text-sm text-gray-500">
                        {ROLE_LABELS[invite.invited_role] ?? invite.invited_role} &middot; expires{" "}
                        {new Date(invite.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                    <form action={revokeInvite}>
                      <input type="hidden" name="id" value={invite.id} />
                      <button
                        type="submit"
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Revoke
                      </button>
                    </form>
                  </div>
                  <p className="mt-2 break-all rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600">
                    {link}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
