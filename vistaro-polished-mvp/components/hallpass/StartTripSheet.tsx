"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useVistaro } from "@/lib/store";
import { toast } from "@/components/ui/toaster";

export function StartTripSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const students = useVistaro((s) => s.students);
  const destinations = useVistaro((s) => s.destinations);
  const startTrip = useVistaro((s) => s.startTrip);

  const [q, setQ] = useState("");
  const [studentId, setStudentId] = useState<string | null>(null);
  const [destinationId, setDestinationId] = useState<string | null>(null);
  const [minutes, setMinutes] = useState<number>(10);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return students;
    return students.filter((s) => `${s.firstName} ${s.lastName}`.toLowerCase().includes(qq));
  }, [q, students]);

  const selectedDest = destinations.find((d) => d.id === destinationId);

  function pickDestination(id: string) {
    setDestinationId(id);
    const d = destinations.find((x) => x.id === id);
    if (d) setMinutes(d.defaultMinutes);
  }

  function resetAndClose() {
    setQ(""); setStudentId(null); setDestinationId(null); setMinutes(10); onClose();
  }

  function doStart() {
    if (!studentId || !destinationId) return;
    startTrip({ studentId, destinationId, minutes });
    toast({ title: "Trip started", description: "Timer is live. Vistaro is watching the clock." });
    resetAndClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div className="fixed inset-0 bg-black/20 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetAndClose} />
          <motion.div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-2xl px-4 pb-6"
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}>
            <Card className="rounded-t-3xl border border-zinc-200 shadow-soft">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">Start Trip</div>
                    <div className="text-sm text-zinc-600">Two taps. No forms.</div>
                  </div>
                  <Button variant="ghost" onClick={resetAndClose}>Close</Button>
                </div>

                <div className="mt-4 grid gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Student</div>
                      {studentId ? <Badge variant="gray">Selected</Badge> : <Badge variant="gray">Pick one</Badge>}
                    </div>
                    <div className="mt-2"><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search students..." /></div>
                    <div className="mt-2 max-h-44 overflow-auto rounded-2xl border border-zinc-200 bg-white">
                      {filtered.map((s) => {
                        const selected = s.id === studentId;
                        return (
                          <button key={s.id} onClick={() => setStudentId(s.id)}
                            className={["w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-zinc-50", selected ? "bg-zinc-50" : ""].join(" ")}>
                            <span className="font-medium">{s.firstName} {s.lastName}</span>
                            <span className="text-xs text-zinc-500">Grade {s.grade ?? "—"}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Destination</div>
                      {destinationId ? <Badge variant="gray">{selectedDest?.defaultMinutes ?? minutes} min</Badge> : <Badge variant="gray">Pick one</Badge>}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {destinations.map((d) => {
                        const selected = d.id === destinationId;
                        return (
                          <button key={d.id} onClick={() => pickDestination(d.id)}
                            className={["rounded-2xl border px-4 py-3 text-left transition-colors", selected ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white hover:bg-zinc-50"].join(" ")}>
                            <div className="text-sm font-semibold">{d.name}</div>
                            <div className={["text-xs", selected ? "text-white/80" : "text-zinc-500"].join(" ")}>Default: {d.defaultMinutes} min</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-sm font-medium">Minutes</div>
                      <div className="mt-2"><Input type="number" min={1} max={120} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} /></div>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full" disabled={!studentId || !destinationId || minutes <= 0} onClick={doStart}>Start Trip</Button>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-500">Vistaro auto-creates an alert if the trip goes overdue (polling).</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
