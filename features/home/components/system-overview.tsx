import { SectionCard } from "@/components/ui/section-card";
import { getApiBaseUrl } from "@/lib/env";

const architecture = [
  {
    label: "Frontend",
    value: "Next.js App Router with shared components and feature folders",
  },
  {
    label: "Backend",
    value: "NestJS auth API on " + getApiBaseUrl(),
  },
  {
    label: "Contract",
    value: "POST /auth/register and POST /auth/login with JSON payloads",
  },
];

export function SystemOverview() {
  return (
    <SectionCard eyebrow="System" title="How the MVP is wired">
      <div className="grid gap-3">
        {architecture.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-1 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-muted">
              {item.label}
            </span>
            <span className="max-w-[32rem] text-sm leading-6 text-silver">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
