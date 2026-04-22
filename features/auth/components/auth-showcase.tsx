type AuthShowcaseProps = {
  mode: "login" | "register";
};

export function AuthShowcase({ mode }: AuthShowcaseProps) {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_top,#2d2d2d_0%,#171717_48%,#101010_100%)] p-8">
      <div className="auth-mesh absolute inset-0 opacity-90" />
      <div className="auth-disc auth-disc-main absolute right-[-12%] top-[-8%] h-[520px] w-[520px] rounded-full" />
      <div className="auth-disc auth-disc-secondary absolute bottom-[-22%] left-[28%] h-[420px] w-[420px] rounded-full" />
      <div className="auth-spotlight absolute inset-x-0 bottom-0 h-48" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-muted">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[720px] flex-1 items-center justify-center">
        <div className="relative w-full max-w-[620px]">
          <div className="absolute left-6 top-12 w-[210px] rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06))] p-5 shadow-[rgba(0,0,0,0.45)_0px_18px_40px] backdrop-blur-md">
            <p className="text-[0.64rem] uppercase tracking-[0.24em] text-muted">
              Active Users
            </p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-bold text-foreground">288K</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
                  Live Session Volume
                </p>
              </div>
              <div className="relative h-14 w-14 rounded-full border border-white/10 bg-black/25">
                <div className="absolute inset-[8px] rounded-full border-[3px] border-white/10 border-t-accent border-r-accent" />
              </div>
            </div>
          </div>

          <div className="relative ml-auto w-[420px] rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] p-6 shadow-[rgba(0,0,0,0.55)_0px_24px_60px] backdrop-blur-md">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.64rem] uppercase tracking-[0.24em] text-muted">
                  Product Health
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  Authentication throughput stays stable.
                </p>
              </div>
              <div className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-accent">
                +12.4%
              </div>
            </div>

            <div className="grid gap-6">
              <div className="auth-chart">
                <div className="auth-chart-grid" />
                <div className="auth-chart-line" />
                <div className="auth-chart-dot auth-chart-dot-1" />
                <div className="auth-chart-dot auth-chart-dot-2" />
                <div className="auth-chart-dot auth-chart-dot-3" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Tokens", value: "58.1K" },
                  { label: "Latency", value: "92ms" },
                  { label: "Error", value: "0.3%" },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[20px] border border-white/10 bg-black/20 px-4 py-3"
                  >
                    <p className="text-[0.6rem] uppercase tracking-[0.22em] text-muted">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
