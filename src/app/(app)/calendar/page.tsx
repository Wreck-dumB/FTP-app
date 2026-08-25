import Calendar from '@/components/Calendar/Calendar';

export default function CalendarDemoPage() {
  const today = new Date();
  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-bold">Calendar demo</h1>
      <p className="mt-2 text-gray-600">A simple accessible calendar grid for demos and testing.</p>
      <div className="mt-6">
        <Calendar year={today.getFullYear()} month={today.getMonth() + 1} />
      </div>
    </div>
  );
}
