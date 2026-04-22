import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  userSlug: string | null;
  setToken: (
    token: string,
    userId?: string | null,
    userSlug?: string | null,
  ) => void;
  setUserId: (userId: string | null) => void;
  setUserSlug: (userSlug: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userId: null,
      userSlug: null,
      setToken: (token, userId, userSlug) =>
        set({
          accessToken: token,
          ...(userId !== undefined ? { userId } : {}),
          ...(userSlug !== undefined ? { userSlug } : {}),
        }),
      setUserId: (userId) =>
        set({
          userId,
        }),
      setUserSlug: (userSlug) =>
        set({
          userSlug,
        }),
      logout: () =>
        set({
          accessToken: null,
          userId: null,
          userSlug: null,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
