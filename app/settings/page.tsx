"use client";

import { type ReactNode, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { BtnIcon } from "@/components/ui/btn-icon";
import { SectionCard } from "@/components/ui/section-card";
import { toast } from "@/lib/toast";
import { useAuthStore } from "@/store/auth.store";
import { AiTwotoneSetting } from "react-icons/ai";
import { RiArrowDownSLine, RiShieldUserLine, RiSparklingLine, RiUserSettingsLine } from "react-icons/ri";

type SettingAction =
    | "profile"
    | "change-password"
    | "contact"
    | "privacy"
    | "notifications"
    | "appearance"
    | "autoplay"
    | "content-filter"
    | "devices"
    | "2fa"
    | "sessions"
    | "security-history"
    | "switch-account"
    | "logout";

type SettingItem = {
    label: string;
    action: SettingAction;
    tone?: "default" | "danger";
};

type SettingSection = {
    id: string;
    title: string;
    description: string;
    items: SettingItem[];
    icon: ReactNode;
    className?: string;
};

const settingSections: SettingSection[] = [
    {
        id: "account",
        title: "Account Settings",
        description: "Quản lý thông tin cá nhân và quyền truy cập tài khoản.",
        icon: <RiUserSettingsLine size={18} />,
        items: [
            { label: "Thông tin hồ sơ", action: "profile" },
            { label: "Đổi mật khẩu", action: "change-password" },
            { label: "Email và số điện thoại", action: "contact" },
            { label: "Quyền riêng tư", action: "privacy" },
        ],
    },
    {
        id: "function",
        title: "Function Settings",
        description: "Thiết lập hành vi chính của ứng dụng trong quá trình sử dụng.",
        icon: <RiSparklingLine size={18} />,
        items: [
            { label: "Thông báo", action: "notifications" },
            { label: "Hiệu ứng giao diện", action: "appearance" },
            { label: "Tự động phát media", action: "autoplay" },
            { label: "Bộ lọc nội dung", action: "content-filter" },
        ],
    },
    {
        id: "security",
        title: "Security Settings",
        description: "Kiểm soát đăng nhập, thiết bị và bảo mật nâng cao.",
        icon: <RiShieldUserLine size={18} />,
        items: [
            { label: "Thiết bị đăng nhập", action: "devices" },
            { label: "Xác minh 2 bước", action: "2fa" },
            { label: "Session hoạt động", action: "sessions" },
            { label: "Lịch sử bảo mật", action: "security-history" },
        ],
    },
    {
        id: "session",
        title: "Session Settings",
        description: "Quản lý các phiên đăng nhập trên thiết bị.",
        icon: <RiShieldUserLine size={18} />,
        items: [
            { label: "Đổi tài khoản", action: "switch-account" },
            { label: "Đăng xuất", action: "logout", tone: "danger" },
        ],
        className: "lg:hidden",
    },
];

export default function SettingsPage() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const [expandedSectionIds, setExpandedSectionIds] = useState<string[]>(
        settingSections.map((section) => section.id),
    );

    const areAllSectionsCollapsed = expandedSectionIds.length === 0;

    const visibleSections = useMemo(
        () =>
            settingSections.map((section) => ({
                ...section,
                isExpanded: expandedSectionIds.includes(section.id),
            })),
        [expandedSectionIds],
    );

    function handleToggleAllSections(nextActive: boolean) {
        setExpandedSectionIds(nextActive ? [] : settingSections.map((section) => section.id));
    }

    function handleToggleSection(sectionId: string) {
        setExpandedSectionIds((currentSectionIds) =>
            currentSectionIds.includes(sectionId)
                ? currentSectionIds.filter((id) => id !== sectionId)
                : [...currentSectionIds, sectionId],
        );
    }

    function handleSettingAction(item: SettingItem) {
        if (item.action === "logout") {
            logout();

            if (typeof window !== "undefined") {
                window.localStorage.removeItem("thread-clone:last-email");
                window.localStorage.removeItem("thread-clone:display-name");
            }

            toast.success("Đã đăng xuất khỏi thiết bị này.");
            router.push("/login");
            return;
        }

        if (item.action === "switch-account") {
            logout();

            if (typeof window !== "undefined") {
                window.localStorage.removeItem("thread-clone:last-email");
                window.localStorage.removeItem("thread-clone:display-name");
            }

            toast.notify("Chuyển sang màn hình đăng nhập để đổi tài khoản.");
            router.push("/login");
            return;
        }

        toast.notify(`${item.label} sẽ được hỗ trợ ở bước tiếp theo.`);
    }

    return (
        <MarketingShell currentPage="settings">
            <div className="flex h-full w-full flex-col gap-4 overflow-y-auto pr-1">
                <SectionCard className="py-3">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Settings</h1>
                            <p className="mt-1 text-sm text-white/45">
                                Quản lý tài khoản, tính năng và bảo mật trong một nơi.
                            </p>
                        </div>

                        <BtnIcon
                            ariaLabel="toggle settings icon"
                            type="rotate"
                            active={areAllSectionsCollapsed}
                            onActiveChange={handleToggleAllSections}
                            icon={<AiTwotoneSetting size={25} />}
                            className="h-11 w-11 rounded-full border border-white/8 bg-white/[0.04] text-white/75 hover:bg-white/[0.07]"
                        />
                    </div>
                </SectionCard>

                {visibleSections.map((section) => (
                    <SectionCard key={section.id} className={section.className ? `py-3 ${section.className}` : "py-3"}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] text-white/70">
                                    {section.icon}
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-xl font-semibold">{section.title}</h2>
                                    <p className="mt-1 text-sm text-white/45">{section.description}</p>
                                </div>
                            </div>

                            <BtnIcon
                                ariaLabel={`toggle ${section.title}`}
                                type="rotate"
                                active={!section.isExpanded}
                                onClick={() => handleToggleSection(section.id)}
                                icon={<RiArrowDownSLine size={22} />}
                                className="mt-1 h-10 w-10 shrink-0 rounded-full border border-white/8 bg-white/[0.04] text-white/70 hover:bg-white/[0.07]"
                            />
                        </div>

                        <div
                            className={`
                                overflow-hidden transition-[max-height,opacity,margin,padding] duration-300 ease-out
                                ${section.isExpanded ? "mt-1 max-h-96 pt-2 opacity-100" : "mt-0 max-h-0 pt-0 opacity-0"}
                            `}
                        >
                            <div className="grid gap-2">
                                {section.items.map((item) => (
                                    <button
                                        key={item.label}
                                        type="button"
                                        onClick={() => handleSettingAction(item)}
                                        className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                                            item.tone === "danger"
                                                ? "border-red-500/20 bg-red-500/[0.04] text-red-200 hover:bg-red-500/[0.08]"
                                                : "border-white/6 bg-white/[0.025] text-white/72 hover:bg-white/[0.04]"
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </SectionCard>
                ))}
            </div>
        </MarketingShell>
    );
}
