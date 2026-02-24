"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVistaro } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AlertsFeed({ title = "Alerts" }: { title?: string }) {
  const alerts = useVistaro((s) => s.alerts);
  const acknowledge = useVistaro((s) => s.acknowledgeAlert);

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-semibold">{title}</div>
            <div className="text-sm text-zinc-600">Overdue events (in-app).</div>
          </div>
          <Badge variant="gray">{alerts.length}</Badge>
        </div>

        <div className="mt-3 space-y-2">
          {alerts.length === 0 ? (
            <div className="text-sm text-zinc-500">No alerts yet.</div>
          ) : (
            alerts.slice(0, 6).map((a) => {
              const ack = Boolean(a.acknowledgedAtMs);
              return (
                <div key={a.id} className={cn("rounded-2xl border border-zinc-200 bg-white px-4 py-3 flex items-start justify-between gap-3", ack ? "opacity-70" : "")}>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="red">Overdue</Badge>
                      <span className="text-xs text-zinc-500">Level: {a.level}</span>
                    </div>
                    <div className="mt-1 text-sm text-zinc-800">{a.message}</div>
                    <div className="mt-1 text-xs text-zinc-500">{ack ? "Acknowledged" : "Needs attention"}</div>
                  </div>
                  <div className="shrink-0">
                    <Button size="sm" variant="secondary" disabled={ack} onClick={() => acknowledge(a.id)}>{ack ? "Done" : "Acknowledge"}</Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
