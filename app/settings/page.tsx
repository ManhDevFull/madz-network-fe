"use client";

import { type ReactNode, useMemo, useState } from "react";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { BtnIcon } from "@/components/ui/btn-icon";
import { SectionCard } from "@/components/ui/section-card";
import { AiTwotoneSetting } from "react-icons/ai";
import { RiArrowDownSLine, RiShieldUserLine, RiSparklingLine, RiUserSettingsLine } from "react-icons/ri";

type SettingSection = {
    id: string;
    title: string;
    description: string;
    items: string[];
    icon: ReactNode;
};

const settingSections: SettingSection[] = [
    {
        id: "account",
        title: "Account Settings",
        description: "Quản lý thông tin cá nhân và quyền truy cập tài khoản.",
        icon: <RiUserSettingsLine size={18} />,
        items: ["Thông tin hồ sơ", "Đổi mật khẩu", "Email và số điện thoại", "Quyền riêng tư"],
    },
    {
        id: "function",
        title: "Function Settings",
        description: "Thiết lập hành vi chính của ứng dụng trong quá trình sử dụng.",
        icon: <RiSparklingLine size={18} />,
        items: ["Thông báo", "Hiệu ứng giao diện", "Tự động phát media", "Bộ lọc nội dung"],
    },
    {
        id: "security",
        title: "Security Settings",
        description: "Kiểm soát đăng nhập, thiết bị và bảo mật nâng cao.",
        icon: <RiShieldUserLine size={18} />,
        items: ["Thiết bị đăng nhập", "Xác minh 2 bước", "Phiên hoạt động", "Lịch sử bảo mật"],
    },
];

export default function SettingsPage() {
    const [collapsedSectionIds, setCollapsedSectionIds] = useState<string[]>([]);

    const areAllSectionsCollapsed = collapsedSectionIds.length === settingSections.length;

    const visibleSections = useMemo(
        () =>
            settingSections.map((section) => ({
                ...section,
                isCollapsed: collapsedSectionIds.includes(section.id),
            })),
        [collapsedSectionIds],
    );

    function handleToggleAllSections(nextActive: boolean) {
        setCollapsedSectionIds(nextActive ? settingSections.map((section) => section.id) : []);
    }

    function handleToggleSection(sectionId: string) {
        setCollapsedSectionIds((currentSectionIds) =>
            currentSectionIds.includes(sectionId)
                ? currentSectionIds.filter((id) => id !== sectionId)
                : [...currentSectionIds, sectionId],
        );
    }

    return (
        <MarketingShell currentPage="profile">
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
                    <SectionCard key={section.id} className="py-3">
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
                                active={section.isCollapsed}
                                onClick={() => handleToggleSection(section.id)}
                                icon={<RiArrowDownSLine size={22} />}
                                className="mt-1 h-10 w-10 shrink-0 rounded-full border border-white/8 bg-white/[0.04] text-white/70 hover:bg-white/[0.07]"
                            />
                        </div>

                        <div
                            className={`
                                overflow-hidden transition-[max-height,opacity,margin,padding] duration-300 ease-out
                                ${section.isCollapsed ? "mt-0 max-h-0 pt-0 opacity-0" : "mt-1 max-h-96 pt-2 opacity-100"}
                            `}
                        >
                            <div className="grid gap-2">
                                {section.items.map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-xl border border-white/6 bg-white/[0.025] px-4 py-3 text-sm text-white/72 transition hover:bg-white/[0.04]"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SectionCard>
                ))}
            </div>
        </MarketingShell>
    );
}
