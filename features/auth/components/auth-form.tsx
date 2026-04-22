"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { authApi } from "@/lib/api";
import { toast } from "@/lib/toast";
import type {
  AuthMode,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/store/auth.store";

type AuthFormProps = {
  mode: AuthMode;
};

const initialState = {
  email: "",
  username: "",
  password: "",
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialState);
  const [isPending, startTransition] = useTransition();
  const setToken = useAuthStore((s) => s.setToken);

  function handleForgotPassword() {
    toast.notify({
      title: "Coming Soon",
      description:
        "Password reset flow has not been connected to the backend yet.",
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response =
        mode === "login"
          ? await authApi.login({
              email: formData.email,
              password: formData.password,
            } satisfies LoginPayload)
          : await authApi.register({
              email: formData.email,
              username: formData.username,
              password: formData.password,
            } satisfies RegisterPayload);

      const me = await authApi.me(response.access_token);
      setToken(response.access_token, me.id, me.slug);
      persistSession(
        formData.email,
        mode === "register"
          ? formData.username
          : getStoredDisplayName() ?? deriveDisplayNameFromEmail(formData.email),
      );
      toast.success({
        title: mode === "login" ? "Login Success" : "Account Created",
        description:
          mode === "login"
            ? "Your session is active. Redirecting back to home."
            : "Registration completed. Redirecting back to home.",
      });

      startTransition(() => {
        router.push("/");
      });
    } catch (submitError) {
      toast.error({
        title: "Auth Request Failed",
        description:
          submitError instanceof Error
            ? submitError.message
            : "Request failed. Please try again.",
      });
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-xs font-bold uppercase tracking-[0.22em] text-muted">
          Email
        </label>
        <input
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={(event) =>
            setFormData((current) => ({
              ...current,
              email: event.target.value,
            }))
          }
          className="pill-input"
          placeholder="you@madz.network"
        />
      </div>

      {mode === "register" ? (
        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.22em] text-muted">
            Username
          </label>
          <input
            type="text"
            autoComplete="username"
            required
            minLength={3}
            value={formData.username}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                username: event.target.value,
              }))
            }
            className="pill-input"
            placeholder="@manhdev"
          />
        </div>
      ) : null}

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-xs font-bold uppercase tracking-[0.22em] text-muted">
            Password
          </label>
          {mode === "login" ? (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted transition hover:text-foreground"
            >
              Forgot?
            </button>
          ) : null}
        </div>
        <input
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={mode === "login" ? 1 : 6}
          value={formData.password}
          onChange={(event) =>
            setFormData((current) => ({
              ...current,
              password: event.target.value,
            }))
          }
          className="pill-input"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-6 text-[0.82rem] font-bold uppercase tracking-[0.24em] text-black shadow-accent transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {isPending
          ? "Sending..."
          : mode === "login"
            ? "Sign In"
            : "Create Account"}
      </button>

      <p className="text-sm leading-6 text-muted">
        {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
        <Link
          href={mode === "login" ? "/register" : "/login"}
          className="font-semibold text-foreground underline decoration-border-strong underline-offset-4"
        >
          {mode === "login" ? "Register now" : "Go to login"}
        </Link>
      </p>
    </form>
  );
}

function persistSession(email: string, displayName: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem("thread-clone:last-email", email);
  window.localStorage.setItem("thread-clone:display-name", normalizeDisplayName(displayName));
}

function getStoredDisplayName() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("thread-clone:display-name");
}

function deriveDisplayNameFromEmail(email: string) {
  const [localPart] = email.split("@");

  if (!localPart) {
    return "User";
  }

  return normalizeDisplayName(localPart);
}

function normalizeDisplayName(value: string) {
  const normalized = value
    .trim()
    .replace(/^@+/, "")
    .split(/[._-]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return normalized || "User";
}
