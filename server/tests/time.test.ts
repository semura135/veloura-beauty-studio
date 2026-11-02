import { describe, it, expect } from "vitest";
import { addMinutes, isAligned } from "../src/domain/time";

describe("addMinutes", () => {
  it("adds 60 minutes", () => {
    const start = new Date("2026-11-02T06:00:00.000Z");
    const result = addMinutes(start, 60);
    expect(result.toISOString()).toBe("2026-11-02T07:00:00.000Z");
  });
  it("check the input not mutate", () => {
    const start = new Date("2026-11-02T06:00:00.000Z");
    const result = addMinutes(start, 60);
    expect(start.toISOString()).toBe("2026-11-02T06:00:00.000Z");
  });
  it("crosses midnight", () => {
    const start = new Date("2026-11-02T23:30:00.000Z");
    const result = addMinutes(start, 60);
    expect(result.toISOString()).toBe("2026-11-03T00:30:00.000Z");
  });
  it("throws on an invalid date", () => {
    expect(() => addMinutes(new Date("nope"), 10)).toThrow("Invalid date");
  });
});

describe("isAligned", () => {
  it("is true for a 15-minute boundary", () => {
    const d = new Date("2026-11-02T06:15:00.000Z");
    expect(isAligned(d)).toBe(true);
  });

  it("is false for a time off the boundary", () => {
    const d = new Date("2026-11-02T06:10:00.000Z");
    expect(isAligned(d)).toBe(false);
  });
  it("throws on an invalid date", () => {
    expect(() => isAligned(new Date("nope"))).toThrow("Invalid date");
  });
});
