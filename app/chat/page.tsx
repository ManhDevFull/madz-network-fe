"use client";

import { useState } from "react";
import { BsLayoutSidebarInset, BsLayoutSidebarInsetReverse } from "react-icons/bs";
import {
    RiEdit2Line,
    RiMore2Fill,
    RiPushpin2Line,
    RiSearchLine,
    RiSettings4Line,
    RiUser3Line,
} from "react-icons/ri";

import { MarketingShell } from "@/components/layout/marketing-shell";
import { SectionCard } from "@/components/ui/section-card";
import { cn } from "@/utils/cn";
import InputSend from "@/components/ui/input-send";

const conversations = [
    {
        id: "1",
        name: "Mạnh Frontend",
        message: "Phần profile hôm nay nhìn ổn hơn rồi.",
        time: "2 phút",
        unread: 2,
        active: true,
    },
    {
        id: "2",
        name: "Thanh Design",
        message: "Tối ưu lại spacing panel chat nhé.",
        time: "14 phút",
        unread: 0,
    },
    {
        id: "3",
        name: "Khoa Backend",
        message: "API follow vừa lên xong rồi đó.",
        time: "45 phút",
        unread: 1,
    },
    {
        id: "4",
        name: "Team Product",
        message: "Mai review luồng kết bạn.",
        time: "Hôm qua",
        unread: 0,
    },
] as const;

const initialMessages = [
    {
        id: "m1",
        author: "them",
        content: "Luồng chat này cần cảm giác giống app riêng, không phải chỉ là một section.",
        time: "18:21",
    },
    {
        id: "m2",
        author: "me",
        content: "Mình đang khóa scroll ở trong shell, để phần nội dung không tràn ra ngoài viewport.",
        time: "18:23",
    },
    {
        id: "m3",
        author: "them",
        content: "Ổn. Thanh nav bên trái nhớ cho co lại chỉ còn icon khi cần.",
        time: "18:24",
    },
    {
        id: "m4",
        author: "me",
        content: "Mình để panel trái chiếm khoảng 1.2/5, khi thu gọn sẽ trượt label ra ngoài và giữ icon.",
        time: "18:26",
    },
] as const;

export default function ChatPage() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [messages, setMessages] = useState([...initialMessages]);
    const [draftMessage, setDraftMessage] = useState("");
    const [isSendingMessage, setIsSendingMessage] = useState(false);

    function handleToggleNav() {
        setIsNavCollapsed((currentValue) => !currentValue);
    }

    async function handleSendMessage(value: string) {
        setIsSendingMessage(true);

        try {
            // setMessages((currentMessages) => [
            //     ...currentMessages,
            //     {
            //         id: `m-${Date.now()}`,
            //         author: "me" as const,
            //         content: value,
            //         time: new Date().toLocaleTimeString("vi-VN", {
            //             hour: "2-digit",
            //             minute: "2-digit",
            //         }),
            //     },
            // ]);
            // setDraftMessage("");
        } finally {
            setIsSendingMessage(false);
        }
    }

    const navLabelClassName = cn(
        "origin-left overflow-hidden whitespace-nowrap will-change-transform transition-[max-width,opacity,transform] duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        isNavCollapsed
            ? "pointer-events-none max-w-0 -translate-x-4 opacity-0 delay-0"
            : "max-w-[240px] translate-x-0 opacity-100 delay-140",
    );
    const navBodyClassName = cn(
        "min-w-0 basis-0 overflow-hidden will-change-transform transition-[max-width,opacity,transform] duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        isNavCollapsed
            ? "pointer-events-none max-w-0 translate-x-3 opacity-0 delay-0"
            : "flex-1 max-w-full translate-x-0 opacity-100 delay-180",
    );

    return (
        <MarketingShell
            currentPage="chat"
        >
            <div className="flex h-full min-h-0 gap-3 overflow-hidden">
                <SectionCard
                    className={cn(
                        "flex h-full min-h-0 shrink-0 flex-col overflow-hidden !p-0 will-change-[width] transition-[width,transform,box-shadow] duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isNavCollapsed ? "w-[62px]" : "w-[24%] min-w-[320px]",
                    )}
                >
                    <div className={`flex items-center border-b border-white/8 px-3 py-2 ${isNavCollapsed ? "justify-center" : "justify-between"}`}>
                        <div className={navLabelClassName}>
                            <h1 className="mt-1 text-lg font-semibold text-white">Nhắn tin</h1>
                        </div>

                        <button
                            type="button"
                            onClick={handleToggleNav}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white"
                            aria-label={isNavCollapsed ? "Mở danh sách chat" : "Thu gọn danh sách chat"}
                        >
                            {isNavCollapsed ? (
                                <BsLayoutSidebarInsetReverse size={18} />
                            ) : (
                                <BsLayoutSidebarInset size={18} />
                            )}
                        </button>
                    </div>

                    <div className="flex min-h-[56px] items-center gap-2 border-b border-white/8 px-3 py-2">
                        <button className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-2xl bg-white/6 text-white/70 transition hover:bg-white/10 hover:text-white">
                            <RiSearchLine size={18} />
                        </button>
                        <div className={navBodyClassName}>
                            <div className="flex h-10 w-full items-center rounded-xl border border-white/6 bg-white/[0.03] px-4 text-sm text-white/40">
                                Tìm đoạn chat...
                            </div>
                        </div>
                    </div>

                    <div className={`min-h-0 flex-1 overflow-y-auto ${isNavCollapsed ? "px-1" : "px-3"} py-2`}>
                        <div className="grid gap-2">
                            {conversations.map((conversation) => (
                                <button
                                    key={conversation.id}
                                    type="button"
                                    className={cn(
                                        "flex items-center gap-3 rounded-[10px] border border-transparent text-left transition",
                                        conversation.active
                                            ? "bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                                            : "hover:bg-white/[0.05]",
                                        isNavCollapsed ? "justify-center px-1 py-2" : "px-3 py-1",
                                    )}
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2fb36d] text-sm font-bold text-black">
                                        {conversation.name
                                            .split(" ")
                                            .slice(0, 2)
                                            .map((part) => part[0])
                                            .join("")}
                                    </div>

                                {
                                    !isNavCollapsed && (
                                            <div
                                        className={navBodyClassName}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="truncate text-sm font-semibold text-white">
                                                {conversation.name}
                                            </p>
                                            <span className="shrink-0 text-xs text-white/35">
                                                {conversation.time}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between gap-3">
                                            <p className="truncate text-sm text-white/45">
                                                {conversation.message}
                                            </p>
                                            {conversation.unread > 0 ? (
                                                <span className="flex min-w-3 items-center justify-center rounded-full bg-green-400/90 px-1 py-0 text-[10px] font-semibold text-white">
                                                    {conversation.unread}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                    )
                                }
                                </button>
                            ))}
                        </div>
                    </div>

                    <div
                        className={cn(
                            "grid gap-1 border-t border-white/8 px-2 py-2",
                            isNavCollapsed ? "justify-items-stretch" : "",
                        )}
                    >
                        {[
                            { icon: RiEdit2Line, label: "Tin nhắn mới" },
                            { icon: RiPushpin2Line, label: "Đã ghim" },
                            { icon: RiSettings4Line, label: "Cài đặt chat" },
                        ].map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                className={cn(
                                    "flex items-center gap-2 rounded-[12px] px-2 py-2 text-white/65 transition hover:bg-white/[0.05] hover:text-white",
                                    isNavCollapsed
                                        ? "justify-center px-0 py-0"
                                        : "",
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex shrink-0 items-center justify-center",
                                        isNavCollapsed ? "h-7 w-8 rounded-xl" : "",
                                    )}
                                >
                                    <item.icon className="shrink-0" size={18} />
                                </span>
                                {
                                    !isNavCollapsed && (
                                        <span className={navLabelClassName + " !justify-center"}>
                                            {item.label}
                                        </span>
                                    )
                                }

                            </button>
                        ))}
                    </div>
                </SectionCard>

                <SectionCard className="flex h-full min-h-0 flex-1 flex-col overflow-hidden !p-0">
                    <div className="flex items-center justify-between border-b border-white/8 px-3 p-2">
                        <div className="min-w-0">
                            <div className="mt-1 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2fb36d] text-sm font-bold text-black">
                                    MM
                                </div>
                                <div className="min-w-0">
                                    <h2 className="truncate text-lg font-semibold text-white">
                                        Mạnh Frontend
                                    </h2>
                                    <p className="text-sm text-white/45">Hoạt động 3 phút trước</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white">
                                <RiUser3Line size={18} />
                            </button>
                            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white">
                                <RiMore2Fill size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
                        <div className="flex w-full flex-col gap-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn(
                                        "flex w-full",
                                        message.author === "me" ? "justify-end" : "justify-start",
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[72%] rounded-[14px] px-4 py-2 text-sm leading-5 shadow-[0_18px_32px_rgba(0,0,0,0.18)]",
                                            message.author === "me"
                                                ? "bg-green-400 text-black"
                                                : "border border-white/8 bg-white/[0.05] text-white/82",
                                        )}
                                    >
                                        <p>{message.content}</p>
                                        <p
                                            className={cn(
                                                "text-[11px]",
                                                message.author === "me" ? "text-black/55" : "text-white/35",
                                            )}
                                        >
                                            {message.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-white/8 px-3 py-2">
                        <InputSend
                            value={draftMessage}
                            onChange={setDraftMessage}
                            onSubmit={handleSendMessage}
                            isSending={isSendingMessage}
                            className="w-full"
                        />
                    </div>
                </SectionCard>
            </div>
        </MarketingShell>
    );
}
