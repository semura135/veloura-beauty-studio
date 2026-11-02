export const SLOT_MINUTES = 15;

export function assertValidDate(date: Date): void {
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
}
export function addMinutes(date: Date, minutes: number): Date {
  assertValidDate(date);
  if (!Number.isFinite(minutes)) {
    throw new Error("minutes must be a finite number");
  }
  return new Date(date.getTime() + minutes * 60_000);
}
export function isAligned(
  date: Date,
  stepMinutes: number = SLOT_MINUTES,
): boolean {
  assertValidDate(date);
  if (stepMinutes <= 0) {
    throw new Error("stepMinutes must be positive");
  }
  if (date.getTime() % (stepMinutes * 60_000) === 0) {
    return true;
  }
  return false;
}
