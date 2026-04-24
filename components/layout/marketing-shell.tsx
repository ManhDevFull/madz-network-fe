"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { BrandMark } from "@/components/ui/brand-mark";
import { PillLink } from "@/components/ui/pill-link";
import { authApi } from "@/lib/api";
import { axiosClient } from "@/hooks/axios";
import { useAuthHydration } from "@/store/use-auth-hydration";
import { useAuthStore } from "@/store/auth.store";
import type { UserProfile } from "@/types/user";
import { cn } from "@/utils/cn";

type MarketingShellProps = {
  children: ReactNode;
  currentPage: "home" | "login" | "register" | "chat" | "profile";
  contentClassName?: string;
  bodyClassName?: string;
};

const navItems = [
  { href: "/", label: "Trang chủ", key: "home" },
  { href: "/login", label: "Đăng nhập", key: "login" },
  { href: "/register", label: "Đăng ký", key: "register" },
] as const;

const navItemsLoggedIn = [
  { href: "/", label: "Trang chủ", key: "home" },
  { href: "/chat", label: "Nhắn tin", key: "chat" },
] as const;

type SearchUser = {
  id: string;
  slug: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
};

export function MarketingShell({
  children,
  currentPage,
  contentClassName,
  bodyClassName,
}: MarketingShellProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setToken = useAuthStore((state) => state.setToken);
  const logout = useAuthStore((state) => state.logout);
  const hasHydrated = useAuthHydration();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const isAuthenticated = hasHydrated && Boolean(accessToken);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!hasHydrated || !accessToken) {
        setProfile(null);
        return;
      }

      try {
        const me = await authApi.me(accessToken);

        if (cancelled) {
          return;
        }

        setProfile(me);
        setToken(accessToken, me.id, me.slug);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            "thread-clone:display-name",
            normalizeDisplayName(me.username),
          );
        }
      } catch {
        if (!cancelled) {
          setProfile(null);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [accessToken, hasHydrated, setToken]);

  useEffect(() => {
    if (!isMenuOpen && !isSearchOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }

      if (!searchRef.current?.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen, isSearchOpen]);

  useEffect(() => {
    const keyword = searchValue.trim();

    if (!keyword) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await axiosClient.get<SearchUser[]>("/user/search", {
          params: { q: keyword },
          headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          signal: controller.signal,
        });

        setSearchResults(response.data);
        setIsSearchOpen(true);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
      setIsSearching(false);
    };
  }, [accessToken, searchValue]);

  function handleLogout() {
    logout();
    setIsMenuOpen(false);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("thread-clone:last-email");
      window.localStorage.removeItem("thread-clone:display-name");
    }

    router.push("/login");
  }

  const displayName =
    hasHydrated && typeof window !== "undefined"
      ? window.localStorage.getItem("thread-clone:display-name")
      : null;
  const resolvedDisplayName = getDisplayName(profile?.username ?? displayName);
  const initials = getInitials(resolvedDisplayName);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[1540px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="fixed left-0 top-0 z-10 mx-2 -mt-2 flex w-full items-center justify-between gap-4 px-9 py-4 sm:px-10">
          <div className="surface-panel flex w-[calc(100%-1rem)] items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <BrandMark />
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.32em] text-muted">
                  Madz Network
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Thread Clone
                </p>
              </div>
            </Link>

            <div className="hidden min-h-11 items-center gap-2 md:flex">
              <div className="relative mr-2 w-[320px]" ref={searchRef}>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setSearchValue(nextValue);
                    setIsSearchOpen(Boolean(nextValue.trim()));
                  }}
                  onFocus={() => {
                    if (searchValue.trim()) {
                      setIsSearchOpen(true);
                    }
                  }}
                  placeholder="Tìm kiếm ..."
                  className="h-11 w-full rounded-full border border-white/10 bg-surface-2 px-4 text-sm text-foreground outline-none transition placeholder:text-white/35 focus:border-[#2fb36d]/60 focus:bg-white/[0.06]"
                />

                {isSearchOpen ? (
                  <div className="absolute left-0 top-[calc(100%+0.7rem)] z-30 w-full overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03)),var(--surface-1)] p-2 shadow-[rgba(0,0,0,0.5)_0px_12px_28px]">
                    {isSearching ? (
                      <div className="px-4 py-3 text-sm text-white/55">
                        Đang tìm kiếm...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="grid gap-1">
                        {searchResults.map((user) => (
                          <Link
                            key={user.id}
                            href={profile?.slug === user.slug ? "/profile" : `/profile/${user.slug}`}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchValue("");
                            }}
                            className="flex items-start gap-3 rounded-[18px] px-3 py-3 transition hover:bg-white/[0.06]"
                          >
                            {user.avatar_url ? (
                              <Image
                                src={user.avatar_url}
                                alt={user.username}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-black">
                                {getInitials(getDisplayName(user.username))}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {getDisplayName(user.username)}
                              </p>
                              <p className="mt-1 truncate text-xs text-white/40">
                                @{user.slug}
                              </p>
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/50">
                                {user.bio?.trim() || "Chưa có mô tả"}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-sm text-white/55">
                        Không tìm thấy người dùng phù hợp.
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {!hasHydrated ? <HeaderSkeleton /> : null}

              {hasHydrated && !isAuthenticated ? (
                <nav className="flex items-center gap-2">
                  {navItems.map((item) => (
                    <PillLink
                      key={item.key}
                      href={item.href}
                      variant={currentPage === item.key ? "primary" : "secondary"}
                    >
                      {item.label}
                    </PillLink>
                  ))}
                </nav>
              ) : null}

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <nav className="flex items-center gap-2">
                    {navItemsLoggedIn.map((item) => (
                      <PillLink
                        key={item.key}
                        href={item.href}
                        variant={currentPage === item.key ? "primary" : "secondary"}
                      >
                        {item.label}
                      </PillLink>
                    ))}
                  </nav>

                  <div className="relative" ref={menuRef}>
                    <button
                      type="button"
                      onClick={() => setIsMenuOpen((open) => !open)}
                      className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/10 bg-surface-2 px-3 py-2 text-left transition hover:border-white/20 hover:bg-white/[0.08]"
                    >
                      {profile?.avatar_url ? (
                        <Image
                          src={profile.avatar_url}
                          alt={resolvedDisplayName}
                          width={32}
                          height={32}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-6 w-6 6items-center justify-center rounded-full bg-accent text-sm font-bold text-black">
                          {initials}
                        </div>
                      )}
                      <div className="pr-1">
                        <span className="text-sm font-semibold text-foreground">
                          {resolvedDisplayName}
                        </span>
                      </div>
                    </button>

                    {isMenuOpen ? (
                      <div className="absolute right-0 top-[calc(100%+1.4rem)] z-20 grid min-w-[220px] gap-1 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03)),var(--surface-1)] p-2 shadow-[rgba(0,0,0,0.5)_0px_12px_28px]">
                        <Link
                          href="/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="rounded-[18px] px-4 py-3 text-sm text-silver transition hover:bg-white/[0.06] hover:text-foreground"
                        >
                          Trang cá nhân
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsMenuOpen(false)}
                          className="rounded-[18px] px-4 py-3 text-sm text-silver transition hover:bg-white/[0.06] hover:text-foreground"
                        >
                          Cài đặt
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="rounded-[18px] px-4 py-3 text-left text-sm text-danger transition hover:bg-danger/10"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main
          className={cn(
            "mt-18 grid flex-1 gap-4 overflow-hidden py-2"
          )}
        >
          <section className={cn(
            "surface-panel flex h-[calc(100vh-7.5rem)] min-h-0 flex-col justify-between gap-8 overflow-hidden px-3 py-6 sm:px-4 sm:py-6",
            bodyClassName,
          )}>
            <div className={cn("grid min-h-0 flex-1 gap-4 overflow-hidden", contentClassName)}>
              {children}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-11 w-24 animate-pulse rounded-full bg-white/8" />
      <div className="h-11 w-24 animate-pulse rounded-full bg-white/8" />
      <div className="h-11 w-28 animate-pulse rounded-full bg-white/8" />
    </div>
  );
}

function getDisplayName(displayName: string | null) {
  if (!displayName) {
    return "User";
  }

  return normalizeDisplayName(displayName);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function normalizeDisplayName(value: string) {
  return (
    value
      .trim()
      .replace(/^@+/, "")
      .split(/[._-]/g)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || "User"
  );
}
