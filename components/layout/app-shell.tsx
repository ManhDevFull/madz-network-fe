import type { ReactNode } from "react";

type AppShellProps = {
  desktop: ReactNode;
  mobile: ReactNode;
};

export function AppShell({ desktop, mobile }: AppShellProps) {
  return (
    <>
      <div className="hidden lg:block">{desktop}</div>
      <div className="block lg:hidden">{mobile}</div>
    </>
  );
}
