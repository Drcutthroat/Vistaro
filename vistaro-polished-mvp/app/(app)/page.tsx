import { ModuleTiles } from "@/components/shell/ModuleTiles";
import { Card, CardContent } from "@/components/ui/card";

export default function ModulesPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          <div className="text-xl font-semibold">Modules</div>
          <div className="mt-1 text-sm text-zinc-600">Pick a tool. Vistaro stays calm: one job per screen.</div>
        </CardContent>
      </Card>
      <ModuleTiles />
    </div>
  );
}
