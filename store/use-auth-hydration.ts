"use client";

import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/auth.store";

export function useAuthHydration() {
  const [hasHydrated, setHasHydrated] = useState(() =>
    useAuthStore.persist ? useAuthStore.persist.hasHydrated() : true,
  );

  useEffect(() => {
    const persistApi = useAuthStore.persist;

    if (!persistApi) {
      return;
    }

    const unsubscribeHydrate = persistApi.onHydrate(() => {
      setHasHydrated(false);
    });

    const unsubscribeFinishHydration = persistApi.onFinishHydration(() => {
      setHasHydrated(true);
    });

    return () => {
      unsubscribeHydrate();
      unsubscribeFinishHydration();
    };
  }, []);

  return hasHydrated;
}
