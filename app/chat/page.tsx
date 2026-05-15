"use client";

import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { BsLayoutSidebarInset, BsLayoutSidebarInsetReverse } from "react-icons/bs";
import {
    RiAlarmWarningLine,
    RiCheckLine,
    RiFileList3Line,
    RiFolderSharedLine,
    RiEdit2Line,
    RiNotificationOffLine,
    RiPriceTag3Line,
    RiMore2Fill,
    RiPushpin2Line,
    RiSearchLine,
    RiSettings4Line,
    RiTeamLine,
    RiDeleteBinLine,
    RiUser3Line,
    RiCloseLine,
    RiDownload2Line,
    RiShareForwardLine,
    RiArrowGoForwardLine,
    RiZoomInLine,
    RiZoomOutLine,
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

const recentImages = [
    { id: "img-1", url: "https://picsum.photos/seed/chat1/800/800", label: "Ảnh 01" },
    { id: "img-2", url: "https://picsum.photos/seed/chat2/800/800", label: "Ảnh 02" },
    { id: "img-3", url: "https://picsum.photos/seed/chat3/800/800", label: "Ảnh 03" },
];

const recentFiles = [
    { id: "file-1", name: "brief-product.pdf" },
    { id: "file-2", name: "meeting-notes.docx" },
    { id: "file-3", name: "release-checklist.xlsx" },
] as const;

export default function ChatPage() {
    const activeContactName = "Mạnh Frontend";
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [messages, setMessages] = useState([...initialMessages]);
    const [draftMessage, setDraftMessage] = useState("");
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(true);
    const [nickname, setNickname] = useState("");
    const [nicknameDraft, setNicknameDraft] = useState("");
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const [isSearchingInChat, setIsSearchingInChat] = useState(false);
    const [chatSearchValue, setChatSearchValue] = useState("");
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [imageZoom, setImageZoom] = useState(1);

    const [isDraggingState, setIsDraggingState] = useState(false);
    const pan = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement | null>(null);

    const nicknameRowRef = useRef<HTMLDivElement | null>(null);
    const searchRowRef = useRef<HTMLDivElement | null>(null);

    const handleDragStart = (e: React.MouseEvent) => {
        if (imageZoom <= 1) return;
        isDragging.current = true;
        setIsDraggingState(true);
        dragStart.current = { x: e.clientX - pan.current.x, y: e.clientY - pan.current.y };
    };

    const handleDragMove = (e: React.MouseEvent) => {
        if (!isDragging.current || imageZoom <= 1 || !imageRef.current) return;

        const container = imageRef.current.parentElement;
        if (!container) return;

        const imgIntrinsicW = imageRef.current.naturalWidth || 1;
        const imgIntrinsicH = imageRef.current.naturalHeight || 1;
        const imgBoxW = imageRef.current.clientWidth;
        const imgBoxH = imageRef.current.clientHeight;

        const boxRatio = imgBoxW / imgBoxH;
        const imgRatio = imgIntrinsicW / imgIntrinsicH;

        let actualRenderedW = imgBoxW;
        let actualRenderedH = imgBoxH;

        if (imgRatio > boxRatio) {
            actualRenderedH = imgBoxW / imgRatio;
        } else {
            actualRenderedW = imgBoxH * imgRatio;
        }

        const renderedScaledW = actualRenderedW * imageZoom;
        const renderedScaledH = actualRenderedH * imageZoom;

        const contW = container.clientWidth;
        const contH = container.clientHeight;

        const basePanX = Math.max(0, (renderedScaledW - contW) / 2);
        const basePanY = Math.max(0, (renderedScaledH - contH) / 2);

        const EDGE_BUFFER = 80;
        const maxPanX = basePanX > 0 ? basePanX + EDGE_BUFFER : 0;
        const maxPanY = basePanY > 0 ? basePanY + EDGE_BUFFER : 0;

        const newX = e.clientX - dragStart.current.x;
        const newY = e.clientY - dragStart.current.y;

        const boundedX = Math.max(-maxPanX, Math.min(newX, maxPanX));
        const boundedY = Math.max(-maxPanY, Math.min(newY, maxPanY));

        pan.current = { x: boundedX, y: boundedY };
        imageRef.current.style.transform = `translate(${boundedX}px, ${boundedY}px) scale(${imageZoom})`;
    };

    const handleDragEnd = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        setIsDraggingState(false);
    };

    // Clamp pan when zoom changes (like zooming out)
    useEffect(() => {
        if (!imageRef.current) return;
        if (imageZoom <= 1) {
            pan.current = { x: 0, y: 0 };
            imageRef.current.style.transform = `scale(${imageZoom})`;
            return;
        }

        const container = imageRef.current.parentElement;
        if (!container) return;

        const imgIntrinsicW = imageRef.current.naturalWidth || 1;
        const imgIntrinsicH = imageRef.current.naturalHeight || 1;
        const imgBoxW = imageRef.current.clientWidth;
        const imgBoxH = imageRef.current.clientHeight;

        const boxRatio = imgBoxW / imgBoxH;
        const imgRatio = imgIntrinsicW / imgIntrinsicH;

        let actualRenderedW = imgBoxW;
        let actualRenderedH = imgBoxH;

        if (imgRatio > boxRatio) {
            actualRenderedH = imgBoxW / imgRatio;
        } else {
            actualRenderedW = imgBoxH * imgRatio;
        }

        const renderedScaledW = actualRenderedW * imageZoom;
        const renderedScaledH = actualRenderedH * imageZoom;

        const contW = container.clientWidth;
        const contH = container.clientHeight;

        const basePanX = Math.max(0, (renderedScaledW - contW) / 2);
        const basePanY = Math.max(0, (renderedScaledH - contH) / 2);

        const EDGE_BUFFER = 80;
        const maxPanX = basePanX > 0 ? basePanX + EDGE_BUFFER : 0;
        const maxPanY = basePanY > 0 ? basePanY + EDGE_BUFFER : 0;

        pan.current = {
            x: Math.max(-maxPanX, Math.min(pan.current.x, maxPanX)),
            y: Math.max(-maxPanY, Math.min(pan.current.y, maxPanY))
        };

        imageRef.current.style.transform = `translate(${pan.current.x}px, ${pan.current.y}px) scale(${imageZoom})`;
    }, [imageZoom, selectedImageIndex]);

    useEffect(() => {
        if (!isEditingNickname && !isSearchingInChat) {
            return undefined;
        }

        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;

            if (
                isEditingNickname &&
                nicknameRowRef.current &&
                !nicknameRowRef.current.contains(target)
            ) {
                setIsEditingNickname(false);
            }

            if (
                isSearchingInChat &&
                searchRowRef.current &&
                !searchRowRef.current.contains(target)
            ) {
                setIsSearchingInChat(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isEditingNickname, isSearchingInChat, nickname, nicknameDraft]);

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
            setDraftMessage("");
        } finally {
            setIsSendingMessage(false);
        }
    }

    function handleSaveNickname() {
        const nextNickname = nicknameDraft.trim();
        if (nextNickname === activeContactName || nextNickname === "") {
            setNickname("");
        } else {
            setNickname(nextNickname);
        }
        setIsEditingNickname(false);
    }

    function handleNicknameKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSaveNickname();
        }
    }

    const navLabelClassName = cn(
        "origin-left overflow-hidden whitespace-nowrap will-change-transform transition-[max-width,opacity,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        isNavCollapsed
            ? "pointer-events-none max-w-0 -translate-x-4 opacity-0 delay-0"
            : "max-w-[240px] translate-x-0 opacity-100 delay-100",
    );
    const navBodyClassName = cn(
        "min-w-0 basis-0 overflow-hidden will-change-transform transition-[max-width,opacity,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        isNavCollapsed
            ? "pointer-events-none max-w-0 translate-x-3 opacity-0 delay-0"
            : "flex-1 max-w-full translate-x-0 opacity-100 delay-150",
    );

    const displayContactName = nickname || activeContactName;

    return (
        <MarketingShell
            currentPage="chat"
        >
            <div className="flex h-full min-h-0 overflow-hidden">
                <SectionCard
                    className={cn(
                        "flex h-full min-h-0 shrink-0 flex-col overflow-hidden !p-0 will-change-[width] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
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

                <SectionCard className="ml-3 flex h-full min-h-0 flex-1 flex-col overflow-hidden !p-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <div className="flex items-center justify-between border-b border-white/8 px-3 p-2">
                        <div className="min-w-0">
                            <div className="mt-1 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2fb36d] text-sm font-bold text-black">
                                    MM
                                </div>
                                <div className="min-w-0">
                                    <h2 className="truncate text-lg font-semibold text-white">
                                        {displayContactName}
                                    </h2>
                                    <p className="text-sm text-white/45">Hoạt động 3 phút trước</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white">
                                <RiUser3Line size={18} />
                            </button>
                            <button
                                onClick={() => setIsInfoOpen(!isInfoOpen)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white">
                                <RiMore2Fill size={24} />
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
                <SectionCard
                    className={cn(
                        "flex h-full shrink-0 overflow-hidden !p-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                        isInfoOpen
                            ? "ml-3 w-[24%] min-w-[300px] opacity-100"
                            : "ml-0 w-0 min-w-0 border-transparent !p-0 opacity-0",
                    )}
                >
                    <div
                        className={cn(
                            "flex h-full w-full flex-col overflow-hidden transition-opacity duration-200",
                            isInfoOpen ? "opacity-100 delay-100" : "pointer-events-none opacity-0",
                        )}
                    >
                        <div className="border-b border-white/8 px-4 py-3">
                            <h3 className="text-base text-center font-semibold text-white">Thông tin đoạn chat</h3>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto py-2">
                            <div className="flex flex-col">
                                <EditableInfoRow
                                    containerRef={nicknameRowRef}
                                    icon={<RiPriceTag3Line size={18} />}
                                    title="Biệt danh"
                                    value={displayContactName}
                                    isEditing={isEditingNickname}
                                    draftValue={nicknameDraft}
                                    onDraftChange={setNicknameDraft}
                                    onStartEdit={() => {
                                        setNicknameDraft(displayContactName);
                                        setIsEditingNickname(true);
                                    }}
                                    onSave={handleSaveNickname}
                                    onKeyDown={handleNicknameKeyDown}
                                />

                                <SearchInfoRow
                                    containerRef={searchRowRef}
                                    icon={<RiSearchLine size={18} />}
                                    title="Tìm kiếm trong cuộc trò chuyện"
                                    isSearching={isSearchingInChat}
                                    value={chatSearchValue}
                                    onOpen={() => setIsSearchingInChat(true)}
                                    onChange={setChatSearchValue}
                                />

                                <div className="h-[1px] w-full bg-white/5 my-2" />

                                <MediaBlock
                                    title="File và file phương tiện"
                                    actionLabel="Xem tất cả"
                                    items={recentImages.map((image, idx) => (
                                        <button
                                            type="button"
                                            key={image.id}
                                            onClick={() => {
                                                setSelectedImageIndex(idx);
                                                setImageZoom(1);
                                                pan.current = { x: 0, y: 0 };
                                            }}
                                            className="aspect-square rounded-lg border border-white/8 bg-white/[0.05] overflow-hidden cursor-pointer hover:border-white/20 transition group"
                                        >
                                            <img src={image.url} alt={image.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        </button>
                                    ))}
                                />

                                <div className="px-4 pb-2 grid gap-1 mt-1">
                                    {recentFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center gap-3 rounded-lg hover:bg-white/[0.04] p-2 transition cursor-pointer"
                                        >
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/65">
                                                <RiFileList3Line size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-white/80">
                                                    {file.name}
                                                </p>
                                                <p className="mt-0.5 text-xs text-white/40">Tệp gần đây</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-[1px] w-full bg-white/5 my-2" />

                                <ActionBlock
                                    title="Tùy chọn khác"
                                    items={[
                                        {
                                            icon: <RiNotificationOffLine size={18} />,
                                            label: "Tắt thông báo",
                                            tone: "default",
                                        },
                                        {
                                            icon: <RiTeamLine size={18} />,
                                            label: `Tạo nhóm chat với ${displayContactName}`,
                                            tone: "default",
                                        },
                                        {
                                            icon: <RiFolderSharedLine size={18} />,
                                            label: "Quản lý media và file",
                                            tone: "default",
                                        },
                                    ]}
                                />

                                <div className="h-[1px] w-full bg-white/5 my-2" />

                                <ActionBlock
                                    title="Quyền riêng tư & hỗ trợ"
                                    items={[
                                        {
                                            icon: <RiAlarmWarningLine size={18} />,
                                            label: "Báo cáo cuộc trò chuyện",
                                            tone: "danger",
                                        },
                                        {
                                            icon: <RiDeleteBinLine size={18} />,
                                            label: "Xóa đoạn hội thoại",
                                            tone: "danger",
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </SectionCard>
            </div>

            {selectedImageIndex !== null && (
                <div className="fixed inset-0 z-[100] flex bg-black/70 backdrop-blur-md">
                    {/* Left Actions Toolbar */}
                    <div className="flex w-16 shrink-0 flex-col items-center gap-6 border-r border-white/10 bg-black/40 py-6">
                        <button
                            type="button"
                            onClick={() => setSelectedImageIndex(null)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 hover:scale-105"
                            title="Đóng"
                        >
                            <RiCloseLine size={24} />
                        </button>
                        <div className="h-px w-6 bg-white/10" />
                        <div className="flex flex-col gap-4">
                            <button className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white" title="Tải xuống">
                                <RiDownload2Line size={22} />
                            </button>
                            <button className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white" title="Chia sẻ">
                                <RiShareForwardLine size={22} />
                            </button>
                            <button className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white" title="Chuyển tiếp">
                                <RiArrowGoForwardLine size={22} />
                            </button>
                        </div>
                    </div>

                    {/* Main Image View */}
                    <div
                        className={cn(
                            "relative flex flex-1 flex-col items-center justify-center overflow-hidden p-6",
                            imageZoom > 1 ? (isDraggingState ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
                        )}
                        onMouseDown={handleDragStart}
                        onMouseMove={handleDragMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                    >
                        <div className="absolute top-6 right-6 z-10 flex gap-3">
                            <button
                                onClick={() => {
                                    setImageZoom(z => {
                                        const newZ = Math.max(0.5, z - 0.25);
                                        if (newZ <= 1) pan.current = { x: 0, y: 0 };
                                        return newZ;
                                    });
                                }}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white/80 transition hover:bg-black/60 hover:text-white"
                            >
                                <RiZoomOutLine size={20} />
                            </button>
                            <button
                                onClick={() => setImageZoom(z => Math.min(4, z + 0.25))}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white/80 transition hover:bg-black/60 hover:text-white"
                            >
                                <RiZoomInLine size={20} />
                            </button>
                        </div>
                        <img
                            ref={imageRef}
                            src={recentImages[selectedImageIndex].url}
                            alt="Selected"
                            draggable={false}
                            style={{
                                transform: `translate(${pan.current.x}px, ${pan.current.y}px) scale(${imageZoom})`,
                                transition: isDraggingState ? 'none' : 'transform 0.3s ease-out'
                            }}
                            className="max-h-full max-w-full select-none object-contain"
                        />
                    </div>

                    {/* Right Thumbnails Sidebar */}
                    <div className="flex w-[140px] shrink-0 flex-col items-center gap-3 overflow-y-auto border-l border-white/10 bg-black/40 py-6">
                        {recentImages.map((img, idx) => (
                            <button
                                key={img.id}
                                type="button"
                                onClick={() => {
                                    setSelectedImageIndex(idx);
                                    setImageZoom(1);
                                    pan.current = { x: 0, y: 0 };
                                }}
                                className={cn(
                                    "h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300",
                                    idx === selectedImageIndex
                                        ? "border-green-400 opacity-100 scale-100"
                                        : "border-transparent opacity-40 hover:opacity-100 hover:scale-95",
                                )}
                            >
                                <img src={img.url} alt={img.label} className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </MarketingShell>
    );
}

function EditableInfoRow({
    containerRef,
    icon,
    title,
    value,
    isEditing,
    draftValue,
    onDraftChange,
    onStartEdit,
    onSave,
    onKeyDown,
}: {
    containerRef: React.RefObject<HTMLDivElement | null>;
    icon: ReactNode;
    title: string;
    value: string;
    isEditing: boolean;
    draftValue: string;
    onDraftChange: (value: string) => void;
    onStartEdit: () => void;
    onSave: () => void;
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}) {
    return (
        <div
            ref={containerRef}
            onClick={!isEditing ? onStartEdit : undefined}
            className={cn(
                "group flex w-full items-center gap-3 px-4 py-2.5 transition hover:bg-white/[0.04]",
                !isEditing ? "cursor-pointer" : "",
            )}
        >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-white/65 transition group-hover:bg-white/[0.1]">
                {icon}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
                <p className="text-xs text-white/40">{title}</p>
                <div className="relative mt-0.5 flex h-6 items-center">
                    <div
                        className={cn(
                            "absolute inset-0 flex items-center transition-all duration-300",
                            isEditing
                                ? "pointer-events-none translate-x-2 opacity-0"
                                : "translate-x-0 opacity-100",
                        )}
                    >
                        <p className="truncate text-sm font-medium text-white/90">{value}</p>
                    </div>

                    <div
                        className={cn(
                            "absolute inset-0 flex items-center gap-2 transition-all duration-300",
                            isEditing
                                ? "translate-x-0 opacity-100"
                                : "pointer-events-none -translate-x-2 opacity-0",
                        )}
                    >
                        <input
                            autoFocus
                            value={draftValue}
                            onChange={(event) => onDraftChange(event.target.value)}
                            onKeyDown={onKeyDown}
                            className="h-full w-full border-b border-white/20 bg-transparent text-sm text-white outline-none focus:border-white/50"
                        />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSave();
                            }}
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.1] text-white/80 transition hover:bg-white/[0.2] hover:text-white"
                        >
                            <RiCheckLine size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SearchInfoRow({
    containerRef,
    icon,
    title,
    isSearching,
    value,
    onOpen,
    onChange,
}: {
    containerRef: React.RefObject<HTMLDivElement | null>;
    icon: ReactNode;
    title: string;
    isSearching: boolean;
    value: string;
    onOpen: () => void;
    onChange: (value: string) => void;
}) {
    return (
        <div
            ref={containerRef}
            onClick={!isSearching ? onOpen : undefined}
            className={cn(
                "group flex w-full items-center gap-3 px-4 py-2.5 transition hover:bg-white/[0.04]",
                !isSearching ? "cursor-pointer" : "",
            )}
        >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-white/65 transition group-hover:bg-white/[0.1]">
                {icon}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
                <div className="relative flex h-8 items-center">
                    <div
                        className={cn(
                            "absolute inset-0 flex items-center transition-all duration-300",
                            isSearching
                                ? "pointer-events-none translate-x-2 opacity-0"
                                : "translate-x-0 opacity-100",
                        )}
                    >
                        <p className="truncate text-sm text-white/80">{title}</p>
                    </div>

                    <div
                        className={cn(
                            "absolute inset-0 flex items-center transition-all duration-300",
                            isSearching
                                ? "translate-x-0 opacity-100"
                                : "pointer-events-none -translate-x-2 opacity-0",
                        )}
                    >
                        <input
                            autoFocus
                            value={value}
                            onChange={(event) => onChange(event.target.value)}
                            placeholder="Nhập nội dung..."
                            className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MediaBlock({
    title,
    actionLabel,
    items,
}: {
    title: string;
    actionLabel: string;
    items: ReactNode[];
}) {
    return (
        <div className="flex flex-col py-1">
            <div className="flex cursor-pointer items-center justify-between px-4 py-2 transition hover:bg-white/[0.04]">
                <h4 className="text-sm font-medium text-white">{title}</h4>
                <button className="text-xs text-white/50 transition hover:text-white">
                    {actionLabel}
                </button>
            </div>
            <div className="grid grid-cols-3 gap-2 px-4 pb-2 pt-1">
                {items}
            </div>
        </div>
    );
}

function ActionBlock({
    title,
    items,
}: {
    title: string;
    items: Array<{
        icon: ReactNode;
        label: string;
        tone: "default" | "danger";
    }>;
}) {
    return (
        <div className="flex flex-col py-1">
            <h4 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/30">{title}</h4>
            <div className="flex flex-col">
                {items.map((item) => (
                    <button
                        key={item.label}
                        className={cn(
                            "group flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-white/[0.04]",
                            item.tone === "danger" ? "text-red-400" : "text-white/80",
                        )}
                    >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05] transition group-hover:bg-white/[0.1]">
                            {item.icon}
                        </span>
                        <span className="text-sm">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
