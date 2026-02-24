"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TimerRing } from "@/components/hallpass/TimerRing";
import { useVistaro } from "@/lib/store";

export function ActiveTripCard({ tripId }: { tripId: string }) {
  const trip = useVistaro((s) => s.trips.find((t) => t.id === tripId));
  const student = useVistaro((s) => s.students.find((st) => st.id === trip?.studentId));
  const dest = useVistaro((s) => s.destinations.find((d) => d.id === trip?.destinationId));
  const closeTrip = useVistaro((s) => s.closeTrip);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(t); }, []);

  const computed = useMemo(() => {
    if (!trip) return null;
    const remainingMs = trip.expectedReturnAtMs - now;
    const ontime = remainingMs >= 0;
    const absSeconds = Math.floor(Math.abs(remainingMs) / 1000);
    const totalMs = now - trip.startedAtMs;
    const progress = ontime ? Math.max(0, Math.min(1, totalMs / (trip.expectedReturnAtMs - trip.startedAtMs))) : 1;
    return { ontime, seconds: absSeconds, progress };
  }, [trip, now]);

  if (!trip || !computed) return null;

  return (
    <Card className={!computed.ontime ? "animate-subtlePulse" : ""}>
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-base font-semibold truncate">{student ? `${student.firstName} ${student.lastName}` : "Student"}</div>
              <Badge variant={computed.ontime ? "green" : "red"}>{computed.ontime ? "On time" : "Overdue"}</Badge>
            </div>
            <div className="mt-1 text-sm text-zinc-600">
              Destination: <span className="font-medium text-zinc-800">{dest?.name ?? "—"}</span>
            </div>
            <div className="mt-4"><TimerRing seconds={computed.seconds} progress={computed.progress} state={computed.ontime ? "ontime" : "overdue"} /></div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-zinc-500">Started {Math.max(0, Math.floor((now - trip.startedAtMs) / 60000))} min ago</div>
              <Button onClick={() => closeTrip(trip.id)} variant={computed.ontime ? "secondary" : "destructive"}>Mark Returned</Button>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl border border-zinc-200 bg-zinc-50" aria-hidden />
        </div>
      </CardContent>
    </Card>
  );
}
