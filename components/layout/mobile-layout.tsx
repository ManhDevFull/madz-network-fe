import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

type MobileLayoutProps = {
  children: ReactNode;
  brandSlot: ReactNode;
  topActionSlot: ReactNode;
  searchSlot: ReactNode;
  bottomNavSlot: ReactNode;
  bodyClassName?: string;
  contentClassName?: string;
};

export function MobileLayout({
  children,
  brandSlot,
  topActionSlot,
  searchSlot,
  bottomNavSlot,
  bodyClassName,
  contentClassName,
}: MobileLayoutProps) {
  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-background text-[#ffffff] font-sans selection:bg-[#2fb36d]/30 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(47,179,109,0.15),transparent_50%)]" />

      {/* Main content background reaches the very bottom, but content safely pads at pb */}
      <main className={cn("absolute inset-0 z-10 flex flex-col overflow-hidden px-2 pt-2 mt-safe-top [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]", bodyClassName)}>
        <div className={cn("relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden scroll-smooth pb-[76px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]", contentClassName)}>
          {children}
        </div>
      </main>

      {/* Nav floats with margin over the background */}
      <footer className="absolute bottom-3 left-0 right-0 z-40 pointer-events-auto">
        <div className="flex justify-center items-center w-full px-2">
          {bottomNavSlot}
        </div>
      </footer>
    </div>
  );
}
