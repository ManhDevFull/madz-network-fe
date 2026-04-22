import type { ToastInput, ToastRecord, ToastType } from "@/types/toast";

type Listener = () => void;
type ToastPayload = string | ToastInput;

const DEFAULT_DURATION = 3800;

let toasts: ToastRecord[] = [];

const listeners = new Set<Listener>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function scheduleRemoval(id: string, duration: number) {
  clearScheduledRemoval(id);

  const timer = setTimeout(() => {
    dismissToast(id);
  }, duration);

  timers.set(id, timer);
}

function clearScheduledRemoval(id: string) {
  const timer = timers.get(id);

  if (!timer) {
    return;
  }

  clearTimeout(timer);
  timers.delete(id);
}

function createToast(type: ToastType, payload: ToastPayload) {
  const normalized =
    typeof payload === "string" ? { description: payload } : payload;

  const toast: ToastRecord = {
    id: createToastId(),
    type,
    createdAt: Date.now(),
    title: normalized.title,
    description: normalized.description,
    duration: normalized.duration ?? DEFAULT_DURATION,
  };

  toasts = [toast, ...toasts].slice(0, 5);
  emit();
  scheduleRemoval(toast.id, toast.duration);
  return toast.id;
}

function createToastId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function dismissToast(id: string) {
  clearScheduledRemoval(id);
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

function dismissAllToasts() {
  for (const toast of toasts) {
    clearScheduledRemoval(toast.id);
  }

  toasts = [];
  emit();
}

export function subscribeToToasts(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToastSnapshot() {
  return toasts;
}

export const toast = Object.assign(
  (payload: ToastPayload) => createToast("message", payload),
  {
    success: (payload: ToastPayload) => createToast("success", payload),
    error: (payload: ToastPayload) => createToast("error", payload),
    errol: (payload: ToastPayload) => createToast("error", payload),
    warning: (payload: ToastPayload) => createToast("warning", payload),
    notify: (payload: ToastPayload) => createToast("notify", payload),
    message: (payload: ToastPayload) => createToast("message", payload),
    mesage: (payload: ToastPayload) => createToast("message", payload),
    dismiss: dismissToast,
    dismissAll: dismissAllToasts,
  },
);
