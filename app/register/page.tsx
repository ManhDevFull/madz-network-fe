import { AuthShell } from "@/components/layout/auth-shell";
import { GuestGuard } from "@/components/guards/guest-guard";
import { AuthForm } from "@/features/auth/components/auth-form";
import { AuthShowcase } from "@/features/auth/components/auth-showcase";

export default function RegisterPage() {
  return (
    <GuestGuard>
      <AuthShell
        title="Create account"
        description="Open a new profile with email, username, and password. The form maps directly to your Nest auth DTO."
        showcase={<AuthShowcase mode="register" />}
      >
        <AuthForm mode="register" />
      </AuthShell>
    </GuestGuard>
  );
}
