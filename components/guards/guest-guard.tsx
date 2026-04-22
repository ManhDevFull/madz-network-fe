"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";
import { useAuthHydration } from "@/store/use-auth-hydration";

export function GuestGuard({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthHydration();
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (token) {
      router.replace("/");
    }
  }, [hasHydrated, router, token]);

  if (!hasHydrated) {
    return null;
  }

  if (token) {
    return null;
  }

  return <>{children}</>;
}
