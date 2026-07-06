import Link from "next/link";
import { logout } from "@/app/auth/actions";

export default function NavBar({ email }: { email: string }) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/dashboard" className="text-lg font-bold text-gray-900">
          Forward Thinking Parents
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <Link href="/dashboard" className="hover:text-gray-900">
            Dashboard
          </Link>
          <span className="text-gray-300" title="Coming soon">Calendar</span>
          <span className="text-gray-300" title="Coming soon">Requests</span>
          <span className="text-gray-300" title="Coming soon">Notes</span>
          <Link href="/family" className="hover:text-gray-900">
            Family
          </Link>
          <span className="text-gray-400">{email}</span>
          <form action={logout}>
            <button type="submit" className="font-medium text-blue-600 hover:text-blue-500">
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
