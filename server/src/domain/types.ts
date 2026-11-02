export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no-show";

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Service {
  readonly id: String;
  readonly name: String;
  readonly priceEtb: number;
  readonly durationMin: number;
}

export interface WorkingHours {
  readonly weekday: Weekday;
  readonly startMinute: number;
  readonly endMinute: number;
}

export interface Artist {
  readonly id: string;
  readonly name: string;
  readonly serviceIds: readonly string[];
  readonly workingHours: readonly WorkingHours[];
}

export interface Booking {
  readonly id: string;
  readonly customerId: string;
  readonly artistId: string;
  readonly serviceId: string;
  readonly start: Date;
  readonly end: Date;
  readonly status: BookingStatus;
}
