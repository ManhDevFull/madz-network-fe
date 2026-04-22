import { SectionCard } from "@/components/ui/section-card";
import { getApiBaseUrl } from "@/lib/env";

type AuthSidePanelProps = {
  mode: "login" | "register";
};

export function AuthSidePanel({ mode }: AuthSidePanelProps) {
  const steps =
    mode === "login"
      ? [
          "Send email + password to POST /auth/login",
          "Store access token in localStorage for later calls",
          "Return to the home view after success",
        ]
      : [
          "Send email, username, password to POST /auth/register",
          "Receive access token from Nest auth service",
          "Land back on home with a warm-start session",
        ];

  return (
    <>
      <SectionCard eyebrow="API Route" title={mode === "login" ? "Login endpoint" : "Register endpoint"}>
        <div className="grid gap-3">
          <code className="rounded-[20px] border border-white/10 bg-black/30 px-4 py-3 text-sm text-silver">
            {getApiBaseUrl()}
            {mode === "login" ? "/auth/login" : "/auth/register"}
          </code>
          <p className="text-sm leading-6 text-muted">
            The frontend uses `fetch` against the Nest backend with JSON payloads
            matching the DTOs in your auth module.
          </p>
        </div>
      </SectionCard>

      <SectionCard eyebrow="Flow" title="What happens next">
        <div className="grid gap-3">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex items-start gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-black">
                0{index + 1}
              </div>
              <p className="text-sm leading-6 text-silver">{step}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
