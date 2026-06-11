import { redirect } from "next/navigation";
import { getCurrentFamilyMember, getFamily, getFamilyMembers } from "@/lib/supabase/family";

const ROLE_LABELS: Record<string, string> = {
  parent: "Parent",
  co_parent: "Co-parent",
  guardian: "Guardian",
};

export default async function FamilyPage() {
  const member = await getCurrentFamilyMember();
  if (!member) {
    redirect("/family/setup");
  }

  const [family, members] = await Promise.all([
    getFamily(member.family_id),
    getFamilyMembers(member.family_id),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">{family?.name ?? "Your family"}</h1>
      <p className="mt-1 text-sm text-gray-500">
        Family members can see the shared calendar, requests, and notes.
      </p>

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

      <p className="mt-4 text-sm text-gray-500">
        Inviting a co-parent or guardian is coming soon.
      </p>
    </div>
  );
}
