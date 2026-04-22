import { AuthShell } from "@/components/layout/auth-shell";
import { GuestGuard } from "@/components/guards/guest-guard";
import { AuthForm } from "@/features/auth/components/auth-form";
import { AuthShowcase } from "@/features/auth/components/auth-showcase";

export default function LoginPage() {
  return (
    <GuestGuard>
      <AuthShell
        title="Welcome back"
        description="Sign in with the account already stored in your Nest backend and jump straight back into the feed."
        showcase={<AuthShowcase mode="login" />}
      >
        <AuthForm mode="login" />
      </AuthShell>
    </GuestGuard>
  );
}
