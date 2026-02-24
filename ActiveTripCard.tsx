import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }: { className?: string; variant?: "default" | "red" | "green" | "gray" } & React.HTMLAttributes<HTMLSpanElement>) {
  const styles = { default: "bg-zinc-900 text-white", red: "bg-red-600 text-white", green: "bg-emerald-600 text-white", gray: "bg-zinc-100 text-zinc-800 border border-zinc-200" } as const;
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", styles[variant], className)} {...props} />;
}
