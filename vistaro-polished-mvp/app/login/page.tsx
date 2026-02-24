"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useVistaro } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const loginAs = useVistaro((s) => s.loginAs);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <Card className="w-[380px]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-zinc-900" />
              <div>
                <div className="text-lg font-semibold leading-tight">Vistaro</div>
                <div className="text-sm text-zinc-500 leading-tight">Sign in (demo)</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-600">Choose a role to preview the polished MVP UI.</div>
            <div className="mt-4 grid gap-2">
              <Button onClick={() => { loginAs("teacher"); router.push("/"); }}>Continue as Teacher</Button>
              <Button variant="secondary" onClick={() => { loginAs("admin"); router.push("/"); }}>Continue as Admin</Button>
              <Button variant="secondary" onClick={() => { loginAs("security"); router.push("/"); }}>Continue as Security</Button>
            </div>
            <div className="mt-4 text-xs text-zinc-500">Next step: wire Supabase Auth + RLS (same screens).</div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
