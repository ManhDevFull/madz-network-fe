import TextSkeleton from "@/components/ui/skeleton";
import { FaHeart, FaRegCommentDots, FaShare } from "react-icons/fa";

type PostProps = {
    username?: string | null;
    avatarUrl?: string | null;
    content?: string | null;
    mediaUrl?: string | null;
    likeCount?: number;
    commentCount?: number;
    createdAt?: string;
    updatedAt?: string;
};

export default function Post({
    username,
    avatarUrl,
    content,
    mediaUrl,
    likeCount,
    commentCount,
    createdAt,
    updatedAt,
}: PostProps) {
    const isLoading = !createdAt;
    const displayName = username?.trim() || "Người dùng";
    const timeLabel = createdAt ? formatRelativePostTime(createdAt) : "";
    const isEdited =
        Boolean(createdAt && updatedAt) &&
        new Date(updatedAt as string).getTime() > new Date(createdAt as string).getTime();

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex gap-4">
                    <AvatarFallback />
                    <div className="flex flex-col">
                        <TextSkeleton width={200} height={20} />
                        <TextSkeleton width={280} height={16} className="mt-2" />
                    </div>
                </div>
                <TextSkeleton width={890} height={120} className="mt-0" />
                <div className="flex gap-5">
                    <button className="inline-flex items-center gap-2">
                        <FaHeart className="text-sm" />
                        Thích
                    </button>
                    <button className="inline-flex items-center gap-2">
                        <FaRegCommentDots className="text-sm" />
                        Bình luận
                    </button>
                    <button className="inline-flex items-center gap-2">
                        <FaShare className="text-sm" />
                        Chia sẻ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-4">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={displayName}
                        className="h-12 w-12 rounded-full object-cover"
                    />
                ) : (
                    <AvatarFallback />
                )}
                <div className="min-w-0">
                    <p className="text-base font-semibold text-white">{displayName}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/50">
                        <span>{timeLabel}</span>
                        {isEdited ? <span className="text-white/40">Đã chỉnh sửa</span> : null}
                    </div>
                </div>
            </div>

            {content ? <p className="whitespace-pre-wrap text-sm leading-6 text-white/80">{content}</p> : null}

            {mediaUrl ? (
                <div className="overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.03]">
                    <img
                        src={mediaUrl}
                        alt="Post media"
                        className="max-h-[460px] w-full object-cover"
                    />
                </div>
            ) : null}

            <div className="flex flex-wrap gap-5 text-white/80">
                <button className="inline-flex items-center gap-2">
                    <FaHeart className="text-sm" />
                    Thích
                    <span className="text-white/45">{likeCount ?? 0}</span>
                </button>
                <button className="inline-flex items-center gap-2">
                    <FaRegCommentDots className="text-sm" />
                    Bình luận
                    <span className="text-white/45">{commentCount ?? 0}</span>
                </button>
                <button className="inline-flex items-center gap-2">
                    <FaShare className="text-sm" />
                    Chia sẻ
                </button>
            </div>
        </div>
    );
}

function AvatarFallback() {
    return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/10 text-muted">
            <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 448 512"
                className="h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M383.9 308.3l23.9-62.6c4-10.5-3.7-21.7-15-21.7h-58.5c11-18.9 17.8-40.6 17.8-64v-.3c39.2-7.8 64-19.1 64-31.7 0-13.3-27.3-25.1-70.1-33-9.2-32.8-27-65.8-40.6-82.8-9.5-11.9-25.9-15.6-39.5-8.8l-27.6 13.8c-9 4.5-19.6 4.5-28.6 0L182.1 3.4c-13.6-6.8-30-3.1-39.5 8.8-13.5 17-31.4 50-40.6 82.8-42.7 7.9-70 19.7-70 33 0 12.6 24.8 23.9 64 31.7v.3c0 23.4 6.8 45.1 17.8 64H56.3c-11.5 0-19.2 11.7-14.7 22.3l25.8 60.2C27.3 329.8 0 372.7 0 422.4v44.8C0 491.9 20.1 512 44.8 512h358.4c24.7 0 44.8-20.1 44.8-44.8v-44.8c0-48.4-25.8-90.4-64.1-114.1zM176 480l-41.6-192 49.6 32 24 40-32 120zm96 0l-32-120 24-40 49.6-32L272 480zm41.7-298.5c-3.9 11.9-7 24.6-16.5 33.4-10.1 9.3-48 22.4-64-25-2.8-8.4-15.4-8.4-18.3 0-17 50.2-56 32.4-64 25-9.5-8.8-12.7-21.5-16.5-33.4-.8-2.5-6.3-5.7-6.3-5.8v-10.8c28.3 3.6 61 5.8 96 5.8s67.7-2.1 96-5.8v10.8c-.1.1-5.6 3.2-6.4 5.8z"></path>
            </svg>
        </div>
    );
}

function formatRelativePostTime(dateValue: string) {
    const createdAt = new Date(dateValue);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 14) {
        return createdAt.toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
        });
    }

    if (diffDays >= 1) {
        return `${diffDays} ngày trước`;
    }

    if (diffHours >= 1) {
        return `${diffHours} giờ trước`;
    }

    const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `${diffMinutes} phút trước`;
}
