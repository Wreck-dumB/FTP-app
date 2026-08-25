import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center flex-1 px-4 text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl">Forward Thinking Parents</h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Shared custody calendar and swap requests for separated families.
        </p>
        <p className="mt-2 max-w-md text-sm text-gray-600">
          Coordinate schedules without the back-and-forth messaging.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a
            href="https://ftp-app-demo.vercel.app"
            className="rounded-md bg-green-600 px-6 py-3 text-base font-semibold text-white hover:bg-green-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try the demo
          </a>
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md border border-gray-300 px-6 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Clear Schedule</h3>
            <p className="mt-2 text-sm text-gray-600">See who has the kids when. No guessing, no messages.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Easy Swaps</h3>
            <p className="mt-2 text-sm text-gray-600">Request time changes; the other parent approves or declines in one tap.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Private &amp; Secure</h3>
            <p className="mt-2 text-sm text-gray-600">Only invited family members access family data. End-to-end secure.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 text-center text-sm">
        <p>
          <Link href="/" className="hover:underline">
            Privacy
          </Link>
          {' '}&bull;{' '}
          <Link href="/" className="hover:underline">
            Accessibility
          </Link>
          {' '}&bull;{' '}
          <a href="https://github.com/Wreck-dumB/FTP-app" className="hover:underline" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
