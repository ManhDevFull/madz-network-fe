"use client";

import { SectionCard } from "@/components/ui/section-card";
import { toast } from "@/lib/toast";

const actions = [
  {
    label: "Success",
    onClick: () =>
      toast.success({
        title: "Saved",
        description: "Profile changes were stored and synced.",
      }),
  },
  {
    label: "Warning",
    onClick: () =>
      toast.warning({
        title: "Rate Limit",
        description: "You are close to the posting threshold for this minute.",
      }),
  },
  {
    label: "Error",
    onClick: () =>
      toast.error({
        title: "Request Failed",
        description: "Backend did not accept the payload. Check the auth state.",
      }),
  },
  {
    label: "Notify",
    onClick: () =>
      toast.notify({
        title: "New Follower",
        description: "@madz-ui just followed your account.",
      }),
  },
  {
    label: "Message",
    onClick: () =>
      toast.message({
        title: "Heads Up",
        description: "This is the neutral toast type for general UX notices.",
      }),
  },
];

export function ToastDemo() {
  return (
    <SectionCard eyebrow="Toast System" title="Preview all toast types">
      <div className="grid gap-4">
        <p className="max-w-2xl text-sm leading-6 text-muted">
          The app now has a global toast API similar to sonner. Trigger any
          variant here or call `toast.success`, `toast.warning`, `toast.error`,
          `toast.notify`, `toast.message` from your own client components.
        </p>
        <div className="flex flex-wrap gap-3">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-surface-2 px-5 text-[0.76rem] font-bold uppercase tracking-[0.2em] text-foreground transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
