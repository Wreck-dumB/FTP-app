import { describe, it, expect } from "vitest";
import { toDateString, fromDateString, daysBetween, addDays } from "./dates";

describe("toDateString / fromDateString", () => {
  it("round-trips a date", () => {
    const d = new Date(2026, 6, 6); // 2026-07-06 local
    expect(toDateString(d)).toBe("2026-07-06");
    expect(toDateString(fromDateString("2026-07-06"))).toBe("2026-07-06");
  });

  it("pads single-digit months and days", () => {
    expect(toDateString(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("parses to local midnight", () => {
    const d = fromDateString("2026-02-28");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(1);
    expect(d.getDate()).toBe(28);
    expect(d.getHours()).toBe(0);
  });
});

describe("daysBetween", () => {
  it("counts whole days ignoring time of day", () => {
    const a = new Date(2026, 6, 1, 23, 59);
    const b = new Date(2026, 6, 3, 0, 1);
    expect(daysBetween(a, b)).toBe(2);
  });

  it("is negative when b is before a", () => {
    expect(daysBetween(new Date(2026, 6, 10), new Date(2026, 6, 7))).toBe(-3);
  });

  it("crosses the AU DST-end boundary without drift (first Sunday of April)", () => {
    // In Australia/Sydney, 2026-04-05 has 25 hours. Whole-day math must not care.
    expect(daysBetween(fromDateString("2026-04-04"), fromDateString("2026-04-06"))).toBe(2);
  });

  it("crosses year boundaries", () => {
    expect(daysBetween(fromDateString("2025-12-30"), fromDateString("2026-01-02"))).toBe(3);
  });
});

describe("addDays", () => {
  it("adds days across a month boundary", () => {
    expect(toDateString(addDays(fromDateString("2026-01-30"), 3))).toBe("2026-02-02");
  });

  it("subtracts with negative days", () => {
    expect(toDateString(addDays(fromDateString("2026-03-01"), -1))).toBe("2026-02-28");
  });

  it("does not mutate the input", () => {
    const d = fromDateString("2026-07-06");
    addDays(d, 5);
    expect(toDateString(d)).toBe("2026-07-06");
  });
});
