import { MarketingShell } from "@/components/layout/marketing-shell";
import { PillLink } from "@/components/ui/pill-link";
import { SectionCard } from "@/components/ui/section-card";
import { FeedPreview } from "@/features/home/components/feed-preview";
import { SystemOverview } from "@/features/home/components/system-overview";
import { ToastDemo } from "@/features/home/components/toast-demo";

export default function Home() {
  return (
    <MarketingShell
      currentPage="home"
    >
      <SectionCard>
       Trang chủ
      </SectionCard>
    </MarketingShell>
  );
}
