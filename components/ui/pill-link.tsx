import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

type PillLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function PillLink({
  href,
  children,
  variant = "secondary",
  className,
}: PillLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-5 text-[0.78rem] font-bold uppercase tracking-[0.22em] transition-transform duration-200",
        variant === "primary"
          ? "bg-accent text-black shadow-accent"
          : "border border-border-subtle bg-surface-2 text-foreground hover:border-white/20 hover:bg-white/[0.08]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
