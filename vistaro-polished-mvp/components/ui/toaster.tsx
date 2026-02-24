"use client";
import * as React from "react";
import { create } from "zustand";
import { cn } from "@/lib/utils";

type Toast = { id: string; title: string; description?: string };
type ToastState = { toasts: Toast[]; push: (t: Omit<Toast,"id">) => void; remove: (id: string) => void };

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (t) => set((s) => ({ toasts: [...s.toasts, { ...t, id: String(Date.now()) + Math.random().toString(16).slice(2) }] })),
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast(t: Omit<Toast,"id">) {
  useToastStore.getState().push(t);
  setTimeout(() => {
    const st = useToastStore.getState();
    const first = st.toasts[0];
    if (first) st.remove(first.id);
  }, 2600);
}

export function Toaster() {
  const { toasts, remove } = useToastStore();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[340px] flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={cn("rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft")} onClick={() => remove(t.id)} role="button">
          <div className="text-sm font-semibold">{t.title}</div>
          {t.description ? <div className="mt-1 text-sm text-zinc-600">{t.description}</div> : null}
        </div>
      ))}
    </div>
  );
}
