"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import React, { useEffect, useRef, useState } from "react";
import {
  RiChat3Fill,
  RiChat3Line,
  RiHome5Fill,
  RiHome5Line,
  RiLoginBoxLine,
  RiNotification3Line,
  RiSearchLine,
  RiUser3Fill,
  RiUser3Line,
  RiUserAddLine,
  RiSettings4Line,
} from "react-icons/ri";

import { AppShell } from "@/components/layout/app-shell";
import { DesktopLayout } from "@/components/layout/desktop-layout";
import { MobileLayout } from "@/components/layout/mobile-layout";
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
  currentPage: "home" | "login" | "register" | "chat" | "profile" | "settings";
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
  const mobileNavItems = isAuthenticated
    ? [
      { href: "/", label: "Nhà", key: "home", icon: RiHome5Line, activeIcon: RiHome5Fill },
      { href: "/search", label: "Tìm kiếm", key: "search", icon: RiSearchLine, activeIcon: RiSearchLine },
      { href: "/chat", label: "Tin nhắn", key: "chat", icon: RiChat3Line, activeIcon: RiChat3Fill },
      { href: "/profile", label: "Cá nhân", key: "profile", icon: RiUser3Line, activeIcon: RiUser3Fill },
      { href: "/settings", label: "Cài đặt", key: "settings", icon: RiSettings4Line, activeIcon: RiSettings4Line },
    ]
    : [
      { href: "/", label: "Nhà", key: "home", icon: RiHome5Line, activeIcon: RiHome5Fill },
      { href: "/login", label: "Đăng nhập", key: "login", icon: RiLoginBoxLine, activeIcon: RiLoginBoxLine },
      { href: "/register", label: "Đăng ký", key: "register", icon: RiUserAddLine, activeIcon: RiUserAddLine },
    ];

  const brandSlot = (
    <Link href="/" className="inline-flex items-center gap-3">
      <BrandMark />
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.32em] text-muted">
          MADZ Network
        </p>
        <p className="text-sm font-semibold text-foreground">
          MADZ Network
        </p>
      </div>
    </Link>
  );

  const desktopSearchSlot = (
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
        <SearchResultsPanel isSearching={isSearching} results={searchResults}>
          {(user) => (
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
          )}
        </SearchResultsPanel>
      ) : null}
    </div>
  );

  const mobileSearchSlot = (
    <div className="relative" ref={searchRef}>
      <div className="flex h-12 items-center gap-3 rounded-full border border-black/8 bg-white px-4 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
        <RiSearchLine className="shrink-0 text-[#2fb36d]" size={19} />
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
          placeholder="Tìm kiếm tài khoản hoặc nội dung"
          className="h-full w-full bg-transparent text-sm text-black outline-none placeholder:text-black/35"
        />
      </div>

      {isSearchOpen ? (
        <div className="absolute left-0 top-[calc(100%+0.75rem)] z-30 w-full overflow-hidden rounded-[24px] border border-black/8 bg-white p-2 shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
          <SearchResultsPanel isSearching={isSearching} results={searchResults} light>
            {(user) => (
              <Link
                key={user.id}
                href={profile?.slug === user.slug ? "/profile" : `/profile/${user.slug}`}
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchValue("");
                }}
                className="flex items-start gap-3 rounded-[18px] px-3 py-3 transition hover:bg-black/[0.03]"
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
                  <p className="truncate text-sm font-semibold text-black/90">
                    {getDisplayName(user.username)}
                  </p>
                  <p className="mt-1 truncate text-xs text-black/45">
                    @{user.slug}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-black/55">
                    {user.bio?.trim() || "Chưa có mô tả"}
                  </p>
                </div>
              </Link>
            )}
          </SearchResultsPanel>
        </div>
      ) : null}
    </div>
  );

  const desktopNavSlot = (
    <>
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
      ) : null}
    </>
  );

  const accountMenuSlot = isAuthenticated ? (
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
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-sm font-bold text-black">
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
        <AccountMenu onClose={() => setIsMenuOpen(false)} onLogout={handleLogout} />
      ) : null}
    </div>
  ) : null;

  const mobileTopActionSlot = isAuthenticated ? (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white text-black/70 shadow-[0_10px_24px_rgba(0,0,0,0.06)] transition hover:bg-black/[0.03]"
        >
          <RiNotification3Line size={20} />
        </button>
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex h-11 items-center gap-3 rounded-full border border-black/8 bg-white px-2.5 py-2 text-left shadow-[0_10px_24px_rgba(0,0,0,0.06)] transition hover:bg-black/[0.03]"
        >
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={resolvedDisplayName}
              width={32}
              height={32}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-black">
              {initials}
            </div>
          )}
        </button>
      </div>

      {isMenuOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.8rem)] z-20 min-w-[210px] rounded-[24px] border border-black/8 bg-white p-2 shadow-[0_20px_40px_rgba(0,0,0,0.14)]">
          <AccountMenu
            light
            onClose={() => setIsMenuOpen(false)}
            onLogout={handleLogout}
          />
        </div>
      ) : null}
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="inline-flex h-11 items-center rounded-full border border-black/8 bg-white px-4 text-sm font-semibold text-black shadow-[0_10px_24px_rgba(0,0,0,0.06)]"
      >
        Đăng nhập
      </Link>
    </div>
  );

  const activeIndex = mobileNavItems.findIndex(item => item.key === currentPage);
  const resolvedActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  const [mountedNavIndex, setMountedNavIndex] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("marketing-shell-nav-idx");
      if (stored !== null) return parseInt(stored, 10);
    }
    return resolvedActiveIndex;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMountedNavIndex(resolvedActiveIndex);
      sessionStorage.setItem("marketing-shell-nav-idx", resolvedActiveIndex.toString());
    }, 60);
    return () => clearTimeout(timer);
  }, [resolvedActiveIndex]);

  const mobileBottomNavSlot = (
    <div className="cyber-signboard w-full max-w-[500px] mx-auto pb-[env(safe-area-inset-bottom)]">
      <style dangerouslySetInnerHTML={{
        __html: `
  .cyber-signboard {
    --primary-glow: #2fb36d;
    --inactive-color: #5c6b7f;
    --bg-dark: #0f1016;
    --switch-width: min(500px, calc(100vw - 16px));
    --switch-height: 52px;
    --padding: 4px;
    --count: ${mobileNavItems.length};
    --radius: calc(var(--switch-height) * 0.35);
    --inner-radius: calc(var(--switch-height) * 0.25);
    --icon-size: 24px;
    --item-width: calc((var(--switch-width) - (var(--padding) * 2)) / var(--count));

    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    font-family: inherit;
  }

  .cyber-switch {
    position: relative;
    width: var(--switch-width);
    height: var(--switch-height);
    background: var(--bg-dark);
    border-radius: var(--radius);
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.8),
      inset 0 -1px 2px rgba(255, 255, 255, 0.05),
      0 12px 30px -10px rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    padding: var(--padding);
    margin: 0 auto;
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid #1f222e;
  }

  .cyber-switch input[type="radio"] {
    display: none;
  }

  .cyber-label {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 2;
    position: relative;
    border-radius: var(--inner-radius);
    transition: all 0.3s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .cyber-link {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    border: 0;
    padding: 0;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }

  .cyber-label .icon {
    width: var(--icon-size);
    height: var(--icon-size);
    color: var(--inactive-color);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
  }

  .cyber-highlight {
    position: absolute;
    top: var(--padding);
    left: var(--padding);
    width: var(--item-width);
    height: calc(var(--switch-height) - (var(--padding) * 2));
    background: transparent;
    z-index: 1;
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
  }

  .highlight-inner {
    width: 100%;
    height: 100%;
    border-radius: var(--inner-radius);
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.02) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow:
      0 0 20px var(--primary-glow),
      inset 0 0 15px rgba(47, 179, 109, 0.2);
    backdrop-filter: blur(4px);
    position: relative;
    animation: neon-pulse 3s infinite ease-in-out;
  }

  .highlight-inner::after {
    content: "";
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.8),
      transparent
    );
    opacity: 0.8;
  }

  ${mobileNavItems.map((_, i) => `
  #cyber-opt-${i}:checked ~ .cyber-highlight {
    transform: translateX(${i * 100}%);
  }
  #cyber-opt-${i}:checked ~ [for="cyber-opt-${i}"] .icon {
    color: #fff;
    filter: drop-shadow(0 0 8px var(--primary-glow));
    transform: scale(1.1);
  }
  `).join("")}

  .cyber-label:hover .icon {
    color: #aeb9cc;
  }

  .cyber-label:active .icon {
    transform: scale(0.95);
  }

  @keyframes neon-pulse {
    0%, 100% {
      box-shadow: 0 0 16px var(--primary-glow), inset 0 0 12px rgba(47, 179, 109, 0.2);
    }
    50% {
      box-shadow: 0 0 24px var(--primary-glow), inset 0 0 18px rgba(47, 179, 109, 0.4);
    }
  }
      `}} />
      <div className="cyber-switch">
        {mobileNavItems.map((item, index) => {
          const inputId = `cyber-opt-${index}`;
          const isActive = resolvedActiveIndex === index;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <React.Fragment key={item.key}>
              <input type="radio" id={inputId} name="cyber-mode" checked={mountedNavIndex === index} readOnly />
              <label htmlFor={inputId} className="cyber-label">
                <Link
                  href={item.href ?? "/"}
                  className="cyber-link"
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="icon" />
                </Link>
              </label>
            </React.Fragment>
          );
        })}
        <div className="cyber-highlight">
          <div className="highlight-inner" />
        </div>
      </div>
    </div>
  );

  return (
    <AppShell
      desktop={(
        <DesktopLayout
          brandSlot={brandSlot}
          searchSlot={desktopSearchSlot}
          navSlot={desktopNavSlot}
          accountSlot={accountMenuSlot}
          bodyClassName={bodyClassName}
          contentClassName={contentClassName}
        >
          {children}
        </DesktopLayout>
      )}
      mobile={(
        <MobileLayout
          brandSlot={(
            <div className="flex min-w-0 items-center gap-3">
              <BrandMark />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-black/90">MADZ Network</p>
                <p className="truncate text-xs text-black/45">
                  Không gian xã hội gọn cho mobile
                </p>
              </div>
            </div>
          )}
          topActionSlot={mobileTopActionSlot}
          searchSlot={mobileSearchSlot}
          bottomNavSlot={mobileBottomNavSlot}
          bodyClassName={cn("bg-transparent", bodyClassName)}
          contentClassName={contentClassName}
        >
          {children}
        </MobileLayout>
      )}
    />
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

function SearchResultsPanel({
  isSearching,
  results,
  light = false,
  children,
}: {
  isSearching: boolean;
  results: SearchUser[];
  light?: boolean;
  children: (user: SearchUser) => ReactNode;
}) {
  if (isSearching) {
    return (
      <div className={cn("px-4 py-3 text-sm", light ? "text-black/55" : "text-white/55")}>
        Đang tìm kiếm...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={cn("px-4 py-3 text-sm", light ? "text-black/55" : "text-white/55")}>
        Không tìm thấy người dùng phù hợp.
      </div>
    );
  }

  return <div className="grid gap-1">{results.map(children)}</div>;
}

function AccountMenu({
  light = false,
  onClose,
  onLogout,
}: {
  light?: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  const baseClassName = light
    ? "rounded-[18px] px-4 py-3 text-sm text-black/75 transition hover:bg-black/[0.05] hover:text-black"
    : "rounded-[18px] px-4 py-3 text-sm text-silver transition hover:bg-white/[0.06] hover:text-foreground";

  return (
    <div
      className={cn(
        !light &&
        "absolute right-0 top-[calc(100%+1.4rem)] z-20 grid min-w-[220px] gap-1 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03)),var(--surface-1)] p-2 shadow-[rgba(0,0,0,0.5)_0px_12px_28px]",
        light && "grid gap-1",
      )}
    >
      <Link href="/profile" onClick={onClose} className={baseClassName}>
        Trang cá nhân
      </Link>
      <Link href="/settings" onClick={onClose} className={baseClassName}>
        Cài đặt
      </Link>
      <button
        type="button"
        onClick={onLogout}
        className={cn(
          "rounded-[18px] px-4 py-3 text-left text-sm transition",
          light ? "text-red-500 hover:bg-red-500/10" : "text-danger hover:bg-danger/10",
        )}
      >
        Đăng xuất
      </button>
    </div>
  );
}
