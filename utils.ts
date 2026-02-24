"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVistaro } from "@/lib/store";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const role = useVistaro((s) => s.session.role);
  useEffect(() => { if (!role) router.replace("/login"); }, [role, router]);
  if (!role) return null;
  return <>{children}</>;
}
