import React from 'react';

type Day = {
  date: string; // ISO date
  label: string;
  inMonth: boolean;
};

export default function Calendar({ year, month }: { year: number; month: number }) {
  // Simple calendar grid for the given month
  const first = new Date(year, month - 1, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: Day[] = [];
  // fill leading empty days
  for (let i = 0; i < startDay; i++) {
    cells.push({ date: '', label: '', inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month - 1, d);
    cells.push({ date: dt.toISOString().slice(0, 10), label: String(d), inMonth: true });
  }

  return (
    <table className="w-full table-fixed">
      <caption className="sr-only">Calendar for {year}-{String(month).padStart(2, '0')}</caption>
      <thead>
        <tr>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <th key={d} scope="col" className="py-2 text-left text-sm font-medium text-gray-700">
              {d}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: Math.ceil(cells.length / 7) }).map((_, r) => (
          <tr key={r}>
            {cells.slice(r * 7, r * 7 + 7).map((c, ci) => (
              <td key={ci} className={`h-20 align-top border p-1 ${c.inMonth ? '' : 'bg-gray-50'}`}>
                {c.inMonth ? (
                  <button className="w-full text-left text-sm" aria-label={`Select ${c.date}`}>
                    {c.label}
                  </button>
                ) : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
