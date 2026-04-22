"use client";

import { useState } from "react";

import { handleAPI } from "@/hooks/axios";
import { toast } from "@/lib/toast";
import { Model } from "@/components/ui/model";

export default function NewPostPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">Bài viết mới</h2>
                <button
                    className="flex-1 rounded-[20px] bg-white/20 px-4 py-2 text-left text-sm text-white/70 transition hover:bg-white/30"
                    onClick={() => setShowModal(true)}
                    type="button"
                >
                    Bạn đang nghĩ gì?
                </button>
            </div>

            <ModelNewPost onClose={() => setShowModal(false)} open={showModal} />
        </div>
    );
}

function ModelNewPost({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit() {
        const trimmedContent = content.trim();

        if (!trimmedContent) {
            toast.warning("Nội dung bài viết không được để trống.");
            return;
        }

        try {
            setIsSubmitting(true);
            await handleAPI("/posts", "post", {
                content: trimmedContent,
            });

            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("thread-clone:post-created"));
            }

            toast.success("Đăng bài thành công.");
            setContent("");
            onClose();
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Không thể đăng bài lúc này.";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Model onClose={onClose} open={open}>
            <div className="mb-5 pr-14">
                <h3 className="text-lg font-semibold text-white">Tạo bài viết mới</h3>
                <p className="mt-1 text-sm text-white/60">Chia sẻ điều bạn đang nghĩ với mọi người.</p>
            </div>

            <div className="space-y-4">
                <textarea
                    className="min-h-40 w-full resize-none rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#2fb36d]/60 focus:bg-white/[0.07]"
                    placeholder="Bạn đang nghĩ gì?"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                />

                <div className="flex justify-end gap-3">
                    <button
                        className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                        onClick={onClose}
                        type="button"
                    >
                        Hủy
                    </button>
                    <button
                        className="rounded-full bg-[#2fb36d] px-5 py-2 text-sm font-medium text-black transition hover:bg-[#39c97b] disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isSubmitting}
                        onClick={() => void handleSubmit()}
                        type="button"
                    >
                        {isSubmitting ? "Đang đăng..." : "Đăng bài"}
                    </button>
                </div>
            </div>
        </Model>
    );
}
