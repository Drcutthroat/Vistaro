"use client";
import { create } from "zustand";
import { nanoid } from "@/lib/tinyid";
import type { Alert, Destination, Role, Student, Trip, Wallet } from "@/lib/types";

type State = {
  session: { role: Role | null };
  destinations: Destination[];
  students: Student[];
  trips: Trip[];
  alerts: Alert[];
  wallets: Record<string, Wallet>;
  loginAs: (role: Role) => void;
  logout: () => void;
  startTrip: (args: { studentId: string; destinationId: string; minutes: number }) => Trip;
  closeTrip: (tripId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  ensureOverdueAlerts: () => void;
  awardCoinsOnClose: (trip: Trip) => void;
};

const destinations: Destination[] = [
  { id: "bathroom", name: "Bathroom", defaultMinutes: 6 },
  { id: "nurse", name: "Nurse", defaultMinutes: 12 },
  { id: "office", name: "Office", defaultMinutes: 10 },
  { id: "counselor", name: "Counselor", defaultMinutes: 15 },
];

const students: Student[] = [
  { id: "s1", firstName: "Aaliyah", lastName: "R.", grade: "7" },
  { id: "s2", firstName: "Mateo", lastName: "G.", grade: "8" },
  { id: "s3", firstName: "Jordan", lastName: "K.", grade: "6" },
  { id: "s4", firstName: "Sofia", lastName: "L.", grade: "7" },
  { id: "s5", firstName: "Ethan", lastName: "M.", grade: "8" },
];

const overdueSeconds = (t: Trip, now: number) => Math.floor(Math.max(0, now - t.expectedReturnAtMs) / 1000);
const totalSeconds = (t: Trip, now: number) => Math.floor(Math.max(0, now - t.startedAtMs) / 1000);

export const useVistaro = create<State>((set, get) => ({
  session: { role: null },
  destinations,
  students,
  trips: [],
  alerts: [],
  wallets: {},

  loginAs: (role) => set({ session: { role } }),
  logout: () => set({ session: { role: null } }),

  startTrip: ({ studentId, destinationId, minutes }) => {
    const role = get().session.role;
    if (!role) throw new Error("Not logged in");
    const startedAtMs = Date.now();
    const expectedReturnAtMs = startedAtMs + minutes * 60 * 1000;
    const trip: Trip = { id: nanoid(), studentId, destinationId, createdByRole: role, status: "active", startedAtMs, expectedReturnAtMs };
    set((s) => ({ trips: [trip, ...s.trips] }));
    return trip;
  },

  closeTrip: (tripId) => {
    if (!get().session.role) return;
    const now = Date.now();
    const updated = get().trips.map((t) => {
      if (t.id !== tripId || t.status !== "active") return t;
      const closed: Trip = { ...t, status: "closed", closedAtMs: now, totalSeconds: totalSeconds(t, now), overdueSeconds: overdueSeconds(t, now) };
      get().awardCoinsOnClose(closed);
      return closed;
    });
    set({ trips: updated });
  },

  acknowledgeAlert: (alertId) => {
    const role = get().session.role;
    if (!role) return;
    set((s) => ({ alerts: s.alerts.map((a) => a.id === alertId ? { ...a, acknowledgedAtMs: Date.now(), acknowledgedByRole: role } : a) }));
  },

  ensureOverdueAlerts: () => {
    const now = Date.now();
    const { trips, alerts } = get();
    const active = trips.filter((t) => t.status === "active");
    const existing = new Set(alerts.filter((a) => a.level === "teacher").map((a) => a.tripId));
    const newAlerts: Alert[] = [];

    for (const trip of active) {
      if (now <= trip.expectedReturnAtMs) continue;
      if (existing.has(trip.id)) continue;
      const s = get().students.find((x) => x.id === trip.studentId);
      const d = get().destinations.find((x) => x.id === trip.destinationId);
      const mins = Math.ceil(overdueSeconds(trip, now) / 60);
      newAlerts.push({ id: nanoid(), tripId: trip.id, level: "teacher", createdAtMs: now, message: `${s?.firstName ?? "Student"} overdue to ${d?.name ?? "destination"} by ${mins} min.` });
    }
    if (newAlerts.length) set((s) => ({ alerts: [...newAlerts, ...s.alerts] }));
  },

  awardCoinsOnClose: (trip) => {
    if ((trip.overdueSeconds ?? 0) > 0) return;
    const studentId = trip.studentId;
    set((s) => {
      const current = s.wallets[studentId]?.coins ?? 0;
      return { wallets: { ...s.wallets, [studentId]: { studentId, coins: current + 3 } } };
    });
  },
}));
