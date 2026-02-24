import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ModuleTiles() {
  const tiles = [
    { title: "Hall Pass", desc: "Timed trips with escalation + coins.", href: "/hallpass", status: "Active" as const },
    { title: "Seating Chart", desc: "Visual map + quick notes.", href: "#", status: "Soon" as const },
    { title: "Parent Messaging", desc: "Templates + scheduled updates.", href: "#", status: "Soon" as const },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {tiles.map((t) => (
        <Link key={t.title} href={t.href} className={t.href == "#" ? "pointer-events-none opacity-60" : ""}>
          <Card className="transition-transform hover:-translate-y-0.5">
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 border border-zinc-200" />
                <Badge variant={t.status === "Active" ? "green" : "gray"}>{t.status}</Badge>
              </div>
              <div className="mt-4 text-base font-semibold">{t.title}</div>
              <div className="mt-1 text-sm text-zinc-600">{t.desc}</div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
