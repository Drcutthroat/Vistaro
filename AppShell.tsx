"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "secondary" | "ghost" | "destructive"; size?: "default" | "sm" | "lg" | "icon"; };

export function Button({ className, variant = "default", size = "default", ...props }: Props) {
  const variants: Record<string,string> = {
    default: "bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-950",
    secondary: "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50",
    ghost: "bg-transparent hover:bg-zinc-100",
    destructive: "bg-red-600 text-white hover:bg-red-500",
  };
  const sizes: Record<string,string> = {
    default: "h-11 px-4 rounded-xl",
    sm: "h-9 px-3 rounded-xl text-sm",
    lg: "h-12 px-5 rounded-xl text-base",
    icon: "h-11 w-11 rounded-xl",
  };
  return (
    <button className={cn("inline-flex items-center justify-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900/20 disabled:opacity-50 disabled:pointer-events-none shadow-sm", variants[variant], sizes[size], className)} {...props} />
  );
}
