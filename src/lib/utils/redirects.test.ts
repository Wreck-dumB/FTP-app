import { describe, it, expect } from "vitest";
import { safeNext } from "./redirects";

describe("safeNext", () => {
  it("allows same-origin paths", () => {
    expect(safeNext("/dashboard")).toBe("/dashboard");
    expect(safeNext("/accept-invite/abc-123")).toBe("/accept-invite/abc-123");
    expect(safeNext("/family?tab=invites")).toBe("/family?tab=invites");
  });

  it("rejects absolute URLs", () => {
    expect(safeNext("https://evil.example")).toBe("/dashboard");
    expect(safeNext("http://evil.example/phish")).toBe("/dashboard");
  });

  it("rejects protocol-relative URLs", () => {
    expect(safeNext("//evil.example")).toBe("/dashboard");
  });

  it("rejects userinfo tricks", () => {
    expect(safeNext("@evil.example")).toBe("/dashboard");
    expect(safeNext("/@evil.example")).toBe("/dashboard");
  });

  it("rejects backslash tricks", () => {
    expect(safeNext("/\\evil.example")).toBe("/dashboard");
    expect(safeNext("\\\\evil.example")).toBe("/dashboard");
  });

  it("falls back for non-strings and empty values", () => {
    expect(safeNext(null)).toBe("/dashboard");
    expect(safeNext(undefined)).toBe("/dashboard");
    expect(safeNext("")).toBe("/dashboard");
    expect(safeNext(42)).toBe("/dashboard");
  });

  it("honors a custom fallback", () => {
    expect(safeNext("https://evil.example", "/login")).toBe("/login");
  });
});
