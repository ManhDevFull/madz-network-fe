 "use client";

import { SectionCard } from "@/components/ui/section-card";
import { handleAPI } from "@/hooks/axios";
import { toast } from "@/lib/toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiMore2Fill, RiUserAddLine, RiUserSharedLine, RiUserStarFill, RiUserStarLine } from "react-icons/ri";
import { useAuthStore } from "@/store/auth.store";

type FriendshipStatus = "self" | "none" | "pending" | "accepted" | "rejected" | "blocked" | "unknown" | null;

type BtnAddFRDProps = {
    targetId: string;
    initialStatus: FriendshipStatus;
    initialRequestedByMe?: boolean;
};

type FriendResponse = {
    id: string;
    requester_id: string;
    addressee_id: string;
    status: number;
};

export default function BtnAddFRD({
    targetId,
    initialStatus,
    initialRequestedByMe = false,
}: BtnAddFRDProps) {
    const router = useRouter();
    const accessToken = useAuthStore((state) => state.accessToken);
    const [isFollowing, setIsFollowing] = useState(false);
    const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>(initialStatus);
    const [requestedByMe, setRequestedByMe] = useState(initialRequestedByMe);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFRD = async () => {
        if (!accessToken) {
            toast.notify("Bạn cần đăng nhập để thêm bạn bè.");
            router.push("/login");
            return;
        }

        if (
            friendshipStatus === "accepted" ||
            friendshipStatus === "blocked" ||
            friendshipStatus === "self" ||
            isSubmitting
        ) {
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await handleAPI<FriendResponse>(`/friend/request/${targetId}`, "POST");
            const nextStatus = mapFriendStatus(res.status);

            setFriendshipStatus(nextStatus);
            setRequestedByMe(res.requester_id !== targetId);

            if (nextStatus === "accepted") {
                toast.success("Đã trở thành bạn bè.");
                return;
            }

            if (nextStatus === "pending") {
                toast.success(
                    res.requester_id === targetId
                        ? "Đã chấp nhận lời mời kết bạn."
                        : "Đã gửi lời mời kết bạn.",
                );
                return;
            }

            toast.success("Cập nhật trạng thái bạn bè thành công.");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Không thể xử lý lời mời kết bạn.";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const friendButton = resolveFriendButton(friendshipStatus, requestedByMe, isSubmitting);

    return (
        <SectionCard className="mt-5 flex gap-3">
            <button
                onClick={() => setIsFollowing(!isFollowing)}
                className="border text-center rounded-lg py-1 bg-white/20 border-white/20 flex-1 flex items-center justify-center gap-2">
                {isFollowing ? (
                    <RiUserStarFill size={17} />
                ) : (
                    <RiUserStarLine size={17} />
                )}
                <p>{isFollowing ? 'Đang theo dõi' : 'Theo dõi'}</p>
            </button>
            <button
                disabled={friendButton.disabled}
                onClick={() => void handleFRD()}
                className="border text-center rounded-lg py-1 bg-green-500/50 border-white/20 flex-1 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70">
                {friendButton.icon === "shared" ? <RiUserSharedLine size={17} /> : null}
                {friendButton.icon === "friend" ? <RiUserAddLine size={17} /> : null}
                {friendButton.icon === "star" ? <RiUserStarFill size={17} /> : null}
                <p>{friendButton.label}</p>
            </button>
            <button
                className="w-9 flex items-center justify-center rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 transition"
            >
                <RiMore2Fill size={17} />
            </button>
        </SectionCard>
    );
}

function mapFriendStatus(status: number): FriendshipStatus {
    switch (status) {
        case 0:
            return "pending";
        case 1:
            return "accepted";
        case 2:
            return "rejected";
        case 3:
            return "blocked";
        default:
            return "unknown";
    }
}

function resolveFriendButton(
    status: FriendshipStatus,
    requestedByMe: boolean,
    isSubmitting: boolean,
) {
    if (isSubmitting) {
        return {
            label: "Đang xử lý...",
            icon: "shared" as const,
            disabled: true,
        };
    }

    if (status === "accepted") {
        return {
            label: "Bạn bè",
            icon: "star" as const,
            disabled: true,
        };
    }

    if (status === "pending" && requestedByMe) {
        return {
            label: "Đã gửi lời mời",
            icon: "shared" as const,
            disabled: true,
        };
    }

    if (status === "pending" && !requestedByMe) {
        return {
            label: "Chấp nhận",
            icon: "friend" as const,
            disabled: false,
        };
    }

    if (status === "blocked") {
        return {
            label: "Đã chặn",
            icon: "shared" as const,
            disabled: true,
        };
    }

    return {
        label: "Thêm bạn bè",
        icon: "friend" as const,
        disabled: false,
    };
}
