import { redirect } from "next/navigation";
import { getCurrentFamilyMember } from "@/lib/supabase/family";
import { createFamily } from "@/app/(app)/family/actions";
import { errorMessage } from "@/lib/utils/errors";

export default async function FamilySetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorText = errorMessage(error);

  const member = await getCurrentFamilyMember();
  if (member) {
    redirect("/family");
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-gray-900">Set up your family</h1>
      <p className="mt-2 text-gray-600">
        Create a family workspace. You can invite the other parent or guardians once it&apos;s
        set up.
      </p>

      {errorText && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{errorText}</p>
      )}

      <form action={createFamily} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Family name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="The Smith Family"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
            Your display name
          </label>
          <input
            id="display_name"
            name="display_name"
            type="text"
            required
            placeholder="e.g. Mom, Dad, Alex"
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
          Create family
        </button>
      </form>
    </div>
  );
}
