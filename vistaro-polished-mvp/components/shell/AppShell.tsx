"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVistaro } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const role = useVistaro((s) => s.session.role);
  const logout = useVistaro((s) => s.logout);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-zinc-900 shadow-soft" />
            <div>
              <div className="text-lg font-semibold leading-tight">Vistaro</div>
              <div className="text-sm text-zinc-500 leading-tight">Suite MVP</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {role ? <Badge variant="gray" className="capitalize">{role}</Badge> : null}
            <Button variant="secondary" onClick={() => { logout(); router.push("/login"); }}>Log out</Button>
          </div>
        </header>

        <nav className="mt-6 flex gap-2">
          <NavLink href="/" active={pathname === "/"} label="Modules" />
          <NavLink href="/hallpass" active={pathname.startsWith("/hallpass")} label="Hall Pass" />
        </nav>

        <motion.main className="mt-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: "easeOut" }}>
          {children}
        </motion.main>
      </div>
    </div>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href} className={["rounded-xl px-3 py-2 text-sm font-medium transition-colors", active ? "bg-zinc-900 text-white" : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50"].join(" ")}>
      {label}
    </Link>
  );
}
