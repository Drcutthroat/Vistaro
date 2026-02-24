export type Role = "teacher" | "admin" | "security";
export type Destination = { id: string; name: string; defaultMinutes: number };
export type Student = { id: string; firstName: string; lastName: string; grade?: string };
export type TripStatus = "active" | "closed" | "canceled";
export type Trip = {
  id: string;
  studentId: string;
  destinationId: string;
  createdByRole: Role;
  status: TripStatus;
  startedAtMs: number;
  expectedReturnAtMs: number;
  closedAtMs?: number;
  totalSeconds?: number;
  overdueSeconds?: number;
};
export type AlertLevel = "teacher" | "admin" | "security";
export type Alert = {
  id: string;
  tripId: string;
  level: AlertLevel;
  createdAtMs: number;
  acknowledgedAtMs?: number;
  acknowledgedByRole?: Role;
  message: string;
};
export type Wallet = { studentId: string; coins: number };
