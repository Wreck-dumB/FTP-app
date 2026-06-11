import { redirect } from "next/navigation";
import { getCurrentFamilyMember, getFamily } from "@/lib/supabase/family";

export default async function DashboardPage() {
  const member = await getCurrentFamilyMember();
  if (!member) {
    redirect("/family/setup");
  }

  const family = await getFamily(member.family_id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        {family?.name ?? "Dashboard"}
      </h1>
      <p className="mt-2 text-gray-600">
        Welcome, {member.display_name}. This is where you&apos;ll see today&apos;s custody
        schedule, pending swap requests, and recent notifications once they&apos;re built.
      </p>
    </div>
  );
}
