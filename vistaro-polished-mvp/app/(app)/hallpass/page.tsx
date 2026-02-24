"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StartTripSheet } from "@/components/hallpass/StartTripSheet";
import { ActiveTripCard } from "@/components/hallpass/ActiveTripCard";
import { AlertsFeed } from "@/components/hallpass/AlertsFeed";
import { useVistaro } from "@/lib/store";

export default function HallPassPage() {
  const role = useVistaro((s) => s.session.role);
  const trips = useVistaro((s) => s.trips);
  const destinations = useVistaro((s) => s.destinations);
  const wallets = useVistaro((s) => s.wallets);
  const ensureOverdueAlerts = useVistaro((s) => s.ensureOverdueAlerts);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => ensureOverdueAlerts(), 30000);
    return () => clearInterval(t);
  }, [ensureOverdueAlerts]);

  const activeTrips = useMemo(() => trips.filter((t) => t.status === "active"), [trips]);

  const sortedIds = useMemo(() => {
    const now = Date.now();
    return activeTrips.slice().sort((a, b) => {
      const aOver = now > a.expectedReturnAtMs;
      const bOver = now > b.expectedReturnAtMs;
      if (aOver !== bOver) return aOver ? -1 : 1;
      return b.startedAtMs - a.startedAtMs;
    }).map((t) => t.id);
  }, [activeTrips]);

  const totalCoins = useMemo(() => Object.values(wallets).reduce((acc, w) => acc + w.coins, 0), [wallets]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xl font-semibold">Hall Pass</div>
              <div className="mt-1 text-sm text-zinc-600">Trips are timed. Green means safe. Red means overdue. Calm accountability.</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="gray">Active: {activeTrips.length}</Badge>
              <Badge variant="gray">Coins: {totalCoins}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {sortedIds.length === 0 ? (
            <Card><CardContent><div className="text-base font-semibold">No active trips</div><div className="mt-1 text-sm text-zinc-600">Start a trip to see the timer + alerts behavior.</div></CardContent></Card>
          ) : (
            sortedIds.map((id) => <ActiveTripCard key={id} tripId={id} />)
          )}
        </div>

        <div className="space-y-4">
          <AlertsFeed title={(role === "admin" || role === "security") ? "Admin/Security Alerts" : "Teacher Alerts"} />
          <Card>
            <CardContent>
              <div className="text-base font-semibold">Quick Reference</div>
              <div className="mt-2 text-sm text-zinc-600">Destinations (defaults):</div>
              <div className="mt-2 space-y-1">
                {destinations.map((d) => (
                  <div key={d.id} className="flex items-center justify-between text-sm">
                    <span className="text-zinc-800">{d.name}</span>
                    <span className="text-zinc-500">{d.defaultMinutes} min</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-zinc-500">This MVP polls every 30s to create overdue alerts (idempotent).</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <motion.div className="fixed bottom-6 right-6 z-40" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: "easeOut" }}>
        <Button size="lg" onClick={() => setOpen(true)}>Start Trip</Button>
      </motion.div>

      <StartTripSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
