"use client";

import { useEffect, useRef, useState } from "react";
import { RiDownload2Line, RiCloseLine, RiInstallLine, RiSmartphoneLine } from "react-icons/ri";

type InstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const STORAGE_KEY = "pwa-install-btn-pos";
const VIEWPORT_GAP = 8;
const DEFAULT_BUTTON_SIZE = 56;
const DEFAULT_RIGHT_OFFSET = 24;
const DEFAULT_BOTTOM_OFFSET = 96;

// Capture the prompt event ASAP — before any React component mounts
if (typeof window !== "undefined") {
    window.addEventListener(
        "beforeinstallprompt",
        (e) => {
            e.preventDefault();
            (window as typeof window & { __pwaPrompt?: Event }).__pwaPrompt = e;
        },
        { once: true }
    );
}

export function PwaInstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(() => {
        if (typeof window === "undefined") {
            return null;
        }

        const cached = (window as typeof window & { __pwaPrompt?: Event }).__pwaPrompt;
        return cached ? (cached as InstallPromptEvent) : null;
    });
    const [isVisible, setIsVisible] = useState(() => {
        if (typeof window === "undefined") {
            return false;
        }

        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (navigator as Navigator & { standalone?: boolean }).standalone === true;

        if (isStandalone) {
            return false;
        }

        return "serviceWorker" in navigator && "matchMedia" in window;
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [canInstallDirectly, setCanInstallDirectly] = useState(() => {
        if (typeof window === "undefined") {
            return false;
        }

        return Boolean((window as typeof window & { __pwaPrompt?: Event }).__pwaPrompt);
    });

    const btnRef = useRef<HTMLDivElement>(null);
    const dragStart = useRef({ mouseX: 0, mouseY: 0, elX: 0, elY: 0 });
    const hasDragged = useRef(false);

    function clampPosition(nextPos: { x: number; y: number }, width = DEFAULT_BUTTON_SIZE, height = DEFAULT_BUTTON_SIZE) {
        if (typeof window === "undefined") {
            return nextPos;
        }

        return {
            x: Math.max(VIEWPORT_GAP, Math.min(window.innerWidth - width - VIEWPORT_GAP, nextPos.x)),
            y: Math.max(VIEWPORT_GAP, Math.min(window.innerHeight - height - VIEWPORT_GAP, nextPos.y)),
        };
    }

    // Default position: bottom right
    const getInitialPos = () => {
        if (typeof window === "undefined") return { x: 0, y: 0 };

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return clampPosition(JSON.parse(stored) as { x: number; y: number });
            }
        } catch { }

        return clampPosition({
            x: window.innerWidth - DEFAULT_BUTTON_SIZE - DEFAULT_RIGHT_OFFSET,
            y: window.innerHeight - DEFAULT_BUTTON_SIZE - DEFAULT_BOTTOM_OFFSET,
        });
    };

    const [pos, setPos] = useState<{ x: number; y: number }>(() => getInitialPos());

    useEffect(() => {
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (navigator as Navigator & { standalone?: boolean }).standalone === true;

        if (isStandalone) return;

        // Fallback: listen for future event
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as InstallPromptEvent);
            setCanInstallDirectly(true);
            setIsVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    // Persist position
    const savePos = (x: number, y: number) => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ x, y })); } catch { }
    };

    useEffect(() => {
        function syncPositionToViewport() {
            const btnW = btnRef.current?.offsetWidth ?? DEFAULT_BUTTON_SIZE;
            const btnH = btnRef.current?.offsetHeight ?? DEFAULT_BUTTON_SIZE;

            setPos((currentPos) => {
                const clampedPos = clampPosition(currentPos, btnW, btnH);

                if (clampedPos.x === currentPos.x && clampedPos.y === currentPos.y) {
                    return currentPos;
                }

                savePos(clampedPos.x, clampedPos.y);
                return clampedPos;
            });
        }

        syncPositionToViewport();
        window.addEventListener("resize", syncPositionToViewport);

        return () => {
            window.removeEventListener("resize", syncPositionToViewport);
        };
    }, []);

    // --- Pointer drag logic ---
    const onPointerDown = (e: React.PointerEvent) => {
        if (!btnRef.current) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        hasDragged.current = false;
        setIsDragging(true);
        const rect = btnRef.current.getBoundingClientRect();
        dragStart.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            elX: rect.left,
            elY: rect.top,
        };
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.mouseX;
        const dy = e.clientY - dragStart.current.mouseY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged.current = true;

        const btnW = btnRef.current?.offsetWidth ?? 56;
        const btnH = btnRef.current?.offsetHeight ?? 56;
        setPos(clampPosition({ x: dragStart.current.elX + dx, y: dragStart.current.elY + dy }, btnW, btnH));
    };

    const onPointerUp = () => {
        setIsDragging(false);
        savePos(pos.x, pos.y);
        if (!hasDragged.current) {
            setShowConfirm(true);
        }
    };

    const handleInstall = async () => {
        if (!deferredPrompt) {
            setShowConfirm(true);
            return;
        }
        await deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === "accepted") {
            setIsVisible(false);
            setShowConfirm(false);
        }
        setDeferredPrompt(null);
        setShowConfirm(false);
    };

    if (!isVisible || dismissed) return null;

    return (
        <>
            {/* Draggable FAB */}
            <div
                ref={btnRef}
                style={{ left: pos.x, top: pos.y, position: "fixed", zIndex: 9999, touchAction: "none" }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                className={`group select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            >
                <button
                    type="button"
                    aria-label="Cài đặt ứng dụng"
                    className={`
            flex h-14 w-14 items-center justify-center rounded-full
            bg-[#0f1016] border border-[#2fb36d]/40
            shadow-[0_0_20px_rgba(47,179,109,0.35),0_4px_16px_rgba(0,0,0,0.5)]
            text-[#2fb36d] transition-all
            ${isDragging ? "scale-110 shadow-[0_0_30px_rgba(47,179,109,0.6)]" : "hover:scale-105"}
          `}
                    onClick={(e) => { e.stopPropagation(); }}
                >
                    <RiDownload2Line size={24} />
                </button>
                {/* Tooltip */}
                {!isDragging && (
                    <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0f1016] border border-white/10 px-3 py-1 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        Cài ứng dụng
                    </span>
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div
                    className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/60 backdrop-blur-sm pb-8 px-4"
                    onClick={() => setShowConfirm(false)}
                >
                    <div
                        className="w-full max-w-sm rounded-[28px] bg-[#0f1016] border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.8)] overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pt-5 pb-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2fb36d]/15 border border-[#2fb36d]/30">
                                <RiSmartphoneLine size={24} className="text-[#2fb36d]" />
                            </div>
                            <button
                                type="button"
                                onClick={() => { setShowConfirm(false); setDismissed(true); }}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-white/50 hover:text-white transition"
                            >
                                <RiCloseLine size={20} />
                            </button>
                        </div>

                        <div className="px-5 pb-2">
                            <h2 className="text-xl font-bold text-white">Cài đặt Thread Clone</h2>
                            <p className="mt-2 text-sm text-white/55 leading-relaxed">
                                {canInstallDirectly
                                    ? "Cài về màn hình chính để trải nghiệm như app thật — mở nhanh, dùng offline và không có thanh địa chỉ."
                                    : "Trình duyệt chưa phát lệnh cài đặt ngay lúc này. Bạn vẫn có thể dùng nút ở thanh địa chỉ hoặc tải lại sau khi app đủ điều kiện PWA."}
                            </p>
                        </div>

                        {/* Feature list */}
                        <div className="mx-5 my-3 grid gap-2 rounded-2xl bg-white/[0.04] p-4 border border-white/[0.06]">
                            {[
                                "Mở nhanh từ màn hình chính",
                                "Giao diện toàn màn hình",
                                "Nhận thông báo đẩy",
                            ].map((feat) => (
                                <div key={feat} className="flex items-center gap-3 text-sm text-white/70">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2fb36d]" />
                                    {feat}
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3 p-5 pt-2">
                            <button
                                type="button"
                                onClick={() => { setShowConfirm(false); setDismissed(true); }}
                                className="rounded-2xl border border-white/10 bg-white/[0.04] py-3 text-sm font-medium text-white/60 transition hover:bg-white/[0.08]"
                            >
                                Để sau
                            </button>
                            <button
                                type="button"
                                onClick={handleInstall}
                                className="flex items-center justify-center gap-2 rounded-2xl bg-[#2fb36d] py-3 text-sm font-semibold text-black shadow-[0_4px_20px_rgba(47,179,109,0.4)] transition hover:bg-[#25a05e] active:scale-95"
                            >
                                <RiInstallLine size={18} />
                                {canInstallDirectly ? "Cài ngay" : "Thử lại"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
