import Link from "next/link";
import type { ReactNode } from "react";

import { BrandMark } from "@/components/ui/brand-mark";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  showcase: ReactNode;
};

export function AuthShell({
  title,
  description,
  children,
  showcase,
}: AuthShellProps) {
  return (
    <div className="auth-page-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1260px] items-center justify-center">
        <div className="auth-frame grid w-full overflow-hidden rounded-[34px] border border-white/8 bg-surface-1 shadow-[rgba(0,0,0,0.55)_0px_18px_60px] lg:grid-cols-[380px_minmax(0,1fr)]">
          <section className="auth-pane-left relative flex flex-col justify-between gap-8 px-6 py-6 sm:px-8 sm:py-8">
            <div className="grid gap-8">
              <div className="flex items-center justify-between gap-4">
                <Link href="/" className="inline-flex items-center gap-3">
                  <BrandMark />
                  <div>
                    <p className="text-[0.66rem] uppercase tracking-[0.3em] text-muted">
                      MADZ
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      Thread Clone
                    </p>
                  </div>
                </Link>
              </div>

              <div className="grid gap-3">
                <div className="grid gap-2">
                  <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-[2.2rem]">
                    {title}
                  </h1>
                  <p className="max-w-[28rem] text-sm leading-6 text-muted">
                    {description}
                  </p>
                </div>
              </div>

              <div className="grid gap-4">{children}</div>
            </div>
          </section>

          <section className="auth-pane-right relative hidden min-h-[720px] overflow-hidden lg:block">
            {showcase}
          </section>
        </div>
      </div>
    </div>
  );
}
