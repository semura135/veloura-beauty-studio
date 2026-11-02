import { describe, it, expect } from "vitest";
import {
  addMinutes,
  isAligned,
  intervalsOverlap,
  toSlotStarts,
} from "../src/domain/time";

describe("addMinutes", () => {
  it("adds 60 minutes", () => {
    const start = new Date("2026-11-02T06:00:00.000Z");
    const result = addMinutes(start, 60);
    expect(result.toISOString()).toBe("2026-11-02T07:00:00.000Z");
  });
  it("check the input not mutate", () => {
    const start = new Date("2026-11-02T06:00:00.000Z");
    addMinutes(start, 60);
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

describe("intervalsOverlap", () => {
  it("treats touching intervals as NOT overlapping", () => {
    const aStart = new Date("2026-11-02T06:00:00.000Z");
    const aEnd = new Date("2026-11-02T07:00:00.000Z");
    const bStart = new Date("2026-11-02T07:00:00.000Z");
    const bEnd = new Date("2026-11-02T08:00:00.000Z");
    expect(intervalsOverlap(aStart, aEnd, bStart, bEnd)).toBe(false);
  });
  it("is false for completely separate intervals", () => {
    const aStart = new Date("2026-11-02T06:00:00.000Z");
    const aEnd = new Date("2026-11-02T07:00:00.000Z");
    const bStart = new Date("2026-11-02T09:00:00.000Z");
    const bEnd = new Date("2026-11-02T10:00:00.000Z");
    expect(intervalsOverlap(aStart, aEnd, bStart, bEnd)).toBe(false);
  });
  it("partial overlap", () => {
    const aStart = new Date("2026-11-02T06:00:00.000Z");
    const aEnd = new Date("2026-11-02T07:00:00.000Z");
    const bStart = new Date("2026-11-02T06:30:00.000Z");
    const bEnd = new Date("2026-11-02T07:30:00.000Z");
    expect(intervalsOverlap(aStart, aEnd, bStart, bEnd)).toBe(true);
  });
  it("identical intervals", () => {
    const aStart = new Date("2026-11-02T06:00:00.000Z");
    const aEnd = new Date("2026-11-02T07:00:00.000Z");
    const bStart = new Date("2026-11-02T06:00:00.000Z");
    const bEnd = new Date("2026-11-02T07:00:00.000Z");
    expect(intervalsOverlap(aStart, aEnd, bStart, bEnd)).toBe(true);
  });
  it("one fully inside the other", () => {
    const aStart = new Date("2026-11-02T06:00:00.000Z");
    const aEnd = new Date("2026-11-02T09:00:00.000Z");
    const bStart = new Date("2026-11-02T07:00:00.000Z");
    const bEnd = new Date("2026-11-02T08:00:00.000Z");
    expect(intervalsOverlap(aStart, aEnd, bStart, bEnd)).toBe(true);
  });
  it("Ends before start", () => {
    const aStart = new Date("2026-11-02T07:00:00.000Z");
    const aEnd = new Date("2026-11-02T06:00:00.000Z");
    const bStart = new Date("2026-11-02T09:00:00.000Z");
    const bEnd = new Date("2026-11-02T10:00:00.000Z");
    expect(() => intervalsOverlap(aStart, aEnd, bStart, bEnd)).toThrow(
      "Interval end must be after start",
    );
  });
});

describe("toSlotStarts", () => {
  it("returns 4 slots for 60 minutes", () => {
    const start = new Date("2026-11-02T06:00:00.000Z");
    const result = toSlotStarts(start, 60).map((d) => d.toISOString());
    expect(result).toEqual([
      "2026-11-02T06:00:00.000Z",
      "2026-11-02T06:15:00.000Z",
      "2026-11-02T06:30:00.000Z",
      "2026-11-02T06:45:00.000Z",
    ]);
  });
  it("returns 5 slots for 75 minutes", () => {
    const start = new Date("2026-11-02T06:00:00.000Z");
    const result = toSlotStarts(start, 75);
    expect(result).toHaveLength(5);
    expect(result.at(-1)?.toISOString()).toBe("2026-11-02T07:00:00.000Z");
  });

  it("returns 12 slots for 180 minutes", () => {
    const start = new Date("2026-11-02T06:00:00.000Z");
    const result = toSlotStarts(start, 180);
    expect(result).toHaveLength(12);
    expect(result.at(-1)?.toISOString()).toBe("2026-11-02T08:45:00.000Z");
  });

  it("throws on an unaligned start", () => {
    const start = new Date("2026-11-02T06:10:00.000Z");
    expect(() => toSlotStarts(start, 60)).toThrow(
      "Start must be aligned to 15 minutes",
    );
  });

  it("throws when duration is not a multiple of 15", () => {
    const start = new Date("2026-11-02T06:00:00.000Z");
    expect(() => toSlotStarts(start, 50)).toThrow(
      "Duration must be a positive multiple of 15",
    );
  });

  it("throws on an invalid date", () => {
    expect(() => toSlotStarts(new Date("nope"), 60)).toThrow("Invalid date");
  });
});
