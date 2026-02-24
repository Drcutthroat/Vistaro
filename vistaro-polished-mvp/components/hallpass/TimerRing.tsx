"use client";
import { motion } from "framer-motion";
import { cn, formatMMSS } from "@/lib/utils";

export function TimerRing({ seconds, progress, state }: { seconds: number; progress: number; state: "ontime" | "overdue"; }) {
  const radius = 18;
  const stroke = 4;
  const c = 2 * Math.PI * radius;
  const dash = c * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12">
        <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r={radius} strokeWidth={stroke} fill="none" className="stroke-zinc-200" />
          <motion.circle cx="24" cy="24" r={radius} strokeWidth={stroke} fill="none"
            className={cn(state === "ontime" ? "stroke-emerald-600" : "stroke-red-600")}
            strokeLinecap="round" strokeDasharray={c}
            animate={{ strokeDashoffset: dash }} transition={{ duration: 0.25, ease: "easeOut" }} />
        </svg>
      </div>
      <div>
        <div className={cn("text-lg font-semibold tabular-nums", state === "ontime" ? "text-zinc-900" : "text-red-700")}>{formatMMSS(seconds)}</div>
        <div className="text-xs text-zinc-500">{state === "ontime" ? "Remaining" : "Overdue"}</div>
      </div>
    </div>
  );
}
