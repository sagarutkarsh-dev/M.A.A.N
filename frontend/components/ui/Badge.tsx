import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "emerald" | "rose" | "amber" | "slate" | "cyan" | "outline";
  size?: "sm" | "md";
  children: React.ReactNode;
}

export function Badge({ className, variant = "emerald", size = "sm", children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center font-bold uppercase tracking-wider rounded-lg border";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  const variantStyles = {
    emerald:
      "bg-emerald-100 dark:bg-emerald-900/60 border-emerald-300 dark:border-emerald-600/50 text-emerald-800 dark:text-emerald-200",
    rose:
      "bg-rose-100 dark:bg-rose-900/80 border-rose-300 dark:border-rose-600/60 text-rose-700 dark:text-rose-200",
    amber:
      "bg-amber-100 dark:bg-amber-950/60 border-amber-300/80 dark:border-amber-700 text-amber-800 dark:text-amber-300",
    slate:
      "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300",
    cyan:
      "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800/40 text-cyan-700 dark:text-cyan-300",
    outline:
      "bg-transparent border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300",
  };

  return (
    <span className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
}

export default Badge;
