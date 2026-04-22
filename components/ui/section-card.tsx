import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

type SectionCardProps = {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  eyebrow,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-[13px] border border-white/8 bg-white/[0.035] p-4 shadow-soft backdrop-blur-sm",
        className,
      )}
    >
      {(eyebrow || title) && (
        <header className="mb-4 grid gap-1">
          {eyebrow ? (
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          ) : null}
        </header>
      )}
      {children}
    </section>
  );
}
