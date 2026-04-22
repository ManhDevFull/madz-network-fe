"use client";

import { useSyncExternalStore } from "react";

import { getToastSnapshot, subscribeToToasts, toast } from "@/lib/toast";
import type { ToastRecord, ToastType } from "@/types/toast";
import { cn } from "@/utils/cn";

const EMPTY_TOASTS: ToastRecord[] = [];

const toneStyles: Record<
  ToastType,
  {
    badge: string;
    border: string;
    glow: string;
    bar: string;
    label: string;
  }
> = {
  success: {
    badge: "bg-accent text-black",
    border: "border-accent/20",
    glow: "shadow-[rgba(30,215,96,0.16)_0px_10px_28px]",
    bar: "bg-accent",
    label: "Success",
  },
  error: {
    badge: "bg-danger text-white",
    border: "border-danger/30",
    glow: "shadow-[rgba(243,114,127,0.18)_0px_10px_28px]",
    bar: "bg-danger",
    label: "Error",
  },
  warning: {
    badge: "bg-[var(--warning)] text-black",
    border: "border-[color:rgba(255,164,43,0.28)]",
    glow: "shadow-[rgba(255,164,43,0.18)_0px_10px_28px]",
    bar: "bg-[var(--warning)]",
    label: "Warning",
  },
  notify: {
    badge: "bg-[var(--notify)] text-white",
    border: "border-[color:rgba(83,157,245,0.28)]",
    glow: "shadow-[rgba(83,157,245,0.18)_0px_10px_28px]",
    bar: "bg-[var(--notify)]",
    label: "Notify",
  },
  message: {
    badge: "bg-surface-3 text-foreground",
    border: "border-white/10",
    glow: "shadow-[rgba(255,255,255,0.06)_0px_10px_28px]",
    bar: "bg-silver/70",
    label: "Message",
  },
};

export function Toaster() {
  const toasts = useSyncExternalStore(
    subscribeToToasts,
    getToastSnapshot,
    () => EMPTY_TOASTS,
  );

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex justify-end sm:inset-x-6 sm:top-6">
      <div className="grid w-full max-w-sm gap-3">
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function ToastCard({ item }: { item: ToastRecord }) {
  const tone = toneStyles[item.type];

  return (
    <article
      className={cn(
        "pointer-events-auto relative overflow-hidden rounded-[24px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03)),var(--surface-1)] p-4 shadow-[rgba(0,0,0,0.5)_0px_8px_24px] backdrop-blur-md transition duration-200 animate-[toast-in_220ms_ease-out]",
        tone.border,
        tone.glow,
      )}
    >
      <div
        className={cn("toast-progress", tone.bar)}
        style={{ animationDuration: `${item.duration ?? 3800}ms` }}
      />
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex min-h-8 min-w-8 items-center justify-center rounded-full px-2 text-[0.62rem] font-bold uppercase tracking-[0.22em]",
              tone.badge,
            )}
          >
            {tone.label.slice(0, 1)}
          </span>
          <div className="grid gap-1">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-muted">
              {tone.label}
            </p>
            {item.title ? (
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={() => toast.dismiss(item.id)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] text-sm text-muted transition hover:bg-white/[0.08] hover:text-foreground"
          aria-label="Dismiss toast"
        >
          x
        </button>
      </div>

      <p className="pr-8 text-sm leading-6 text-silver">{item.description}</p>
    </article>
  );
}
