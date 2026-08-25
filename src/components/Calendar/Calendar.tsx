'use client';

import React, { useEffect, useRef, useState } from 'react';

type Day = {
  date: string; // ISO date
  label: string;
  inMonth: boolean;
};

export default function Calendar({ year, month }: { year: number; month: number }) {
  const first = new Date(year, month - 1, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: Day[] = [];
  for (let i = 0; i < startDay; i++) cells.push({ date: '', label: '', inMonth: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month - 1, d);
    cells.push({ date: dt.toISOString().slice(0, 10), label: String(d), inMonth: true });
  }

  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (focusedIndex !== null) {
      const el = buttonRefs.current[focusedIndex];
      el?.focus();
    }
  }, [focusedIndex]);

  function handleKeyDown(e: React.KeyboardEvent, idx: number) {
    const cols = 7;
    let next: number | null = null;
    switch (e.key) {
      case 'ArrowRight':
        next = idx + 1;
        break;
      case 'ArrowLeft':
        next = idx - 1;
        break;
      case 'ArrowDown':
        next = idx + cols;
        break;
      case 'ArrowUp':
        next = idx - cols;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = cells.length - 1;
        break;
      case 'Enter':
      case ' ':
        // let the button handle activation
        return;
      default:
        return;
    }

    e.preventDefault();
    // clamp and find next focusable in-month cell
    while (next !== null && (next < 0 || next >= cells.length || !cells[next].inMonth)) {
      if (next < 0 || next >= cells.length) {
        next = null;
        break;
      }
      // advance towards a valid cell
      next += e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1;
    }

    if (next !== null) setFocusedIndex(next);
  }

  return (
    <div role="group" aria-label={`Calendar ${year}-${String(month).padStart(2, '0')}`}>
      <table className="w-full table-fixed" role="grid" aria-readonly>
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
              {cells.slice(r * 7, r * 7 + 7).map((c, ci) => {
                const idx = r * 7 + ci;
                return (
                  <td
                    key={ci}
                    role="gridcell"
                    aria-selected={focusedIndex === idx}
                    className={`h-20 align-top border p-1 ${c.inMonth ? '' : 'bg-gray-50'}`}
                  >
                    {c.inMonth ? (
                      <button
                        ref={(el) => {
                          buttonRefs.current[idx] = el;
                        }}
                        className="w-full text-left text-sm"
                        aria-label={`Select ${c.date}`}
                        tabIndex={focusedIndex === null && idx === 0 ? 0 : focusedIndex === idx ? 0 : -1}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        onFocus={() => setFocusedIndex(idx)}
                      >
                        {c.label}
                      </button>
                    ) : (
                      <div aria-hidden className="text-sm text-gray-400" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
