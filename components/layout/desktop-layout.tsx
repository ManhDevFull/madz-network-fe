import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

type DesktopLayoutProps = {
  children: ReactNode;
  brandSlot: ReactNode;
  searchSlot: ReactNode;
  navSlot: ReactNode;
  accountSlot: ReactNode;
  bodyClassName?: string;
  contentClassName?: string;
};

export function DesktopLayout({
  children,
  brandSlot,
  searchSlot,
  navSlot,
  accountSlot,
  bodyClassName,
  contentClassName,
}: DesktopLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[1540px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="fixed left-0 top-0 z-10 mx-2 -mt-2 flex w-full items-center justify-between gap-4 px-9 py-4 sm:px-10">
          <div className="surface-panel flex w-[calc(100%-1rem)] items-center justify-between gap-4 px-5 py-4 sm:px-6">
            {brandSlot}

            <div className="flex min-h-11 items-center gap-2">
              {searchSlot}
              {navSlot}
              {accountSlot}
            </div>
          </div>
        </header>

        <main className="mt-18 grid flex-1 gap-4 overflow-hidden py-2">
          <section
            className={cn(
              "surface-panel flex h-[calc(100vh-7.5rem)] min-h-0 flex-col justify-between gap-8 overflow-hidden px-3 py-6 sm:px-4 sm:py-6",
              bodyClassName,
            )}
          >
            <div
              className={cn(
                "grid min-h-0 flex-1 gap-4 overflow-hidden",
                contentClassName,
              )}
            >
              {children}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
