"use client";

import Image from "next/image";
import { useState } from "react";
import {
    RiEditLine,
    RiUserFollowLine,
    RiUserUnfollowLine,
    RiMoreLine,
    RiGridLine,
    RiNewspaperLine,
    RiUserLine,
    RiMapPinLine,
    RiCalendarLine,
    RiHeartLine,
    RiChat3Line,
    RiShareLine,
    RiImageLine,
} from "react-icons/ri";
import type { ProfileUser } from "@/app/profile/profile-view";

// ─── Types ───────────────────────────────────────────────────────────
type Tab = "posts" | "about" | "photos";

type UserPost = {
    id: string;
    user_id: string;
    content: string | null;
    media_url: string | null;
    like_count: number;
    comment_count: number;
    created_at: string;
    updated_at: string;
};

type MobileProfileViewProps = {
    userProfile: ProfileUser | null;
    posts: UserPost[];
    isOwnProfile: boolean;
    isLoading: boolean;
    onFollow?: () => void;
    onUnfollow?: () => void;
    onEditProfile?: () => void;
};

// ─── Skeleton primitives ──────────────────────────────────────────────
function Pulse({ className }: { className: string }) {
    return <div className={`animate-pulse rounded-xl bg-white/[0.07] ${className}`} />;
}

// ─── Skeleton screen ─────────────────────────────────────────────────
function MobileProfileSkeleton() {
    return (
        <div className="w-full">
            {/* Cover */}
            <Pulse className="h-44 w-full rounded-none rounded-b-2xl" />

            {/* Avatar + name row */}
            <div className="relative px-4">
                <div className="absolute -top-12 left-4 h-24 w-24 rounded-full border-4 border-background bg-white/[0.07] animate-pulse" />
                <div className="flex items-end justify-end pt-3 pb-3">
                    <Pulse className="h-9 w-28 rounded-full" />
                </div>
            </div>

            <div className="px-4 space-y-2 pb-4">
                <Pulse className="h-6 w-48" />
                <Pulse className="h-4 w-64" />
                <Pulse className="h-4 w-40 mt-1" />
            </div>

            {/* Stats */}
            <div className="flex border-y border-white/[0.06] px-4 py-3 gap-6">
                {[80, 60, 90].map((w, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <Pulse className={`h-5 w-10`} />
                        <Pulse className={`h-3 w-${w > 70 ? 16 : 12}`} />
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-4 pt-4 pb-2">
                {[80, 64, 72].map((w, i) => <Pulse key={i} className={`h-9 w-${w > 70 ? 24 : 20} rounded-full`} />)}
            </div>

            {/* Posts */}
            {[1, 2].map((i) => (
                <div key={i} className="mx-4 mb-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <Pulse className="h-10 w-10 rounded-full" />
                        <div className="space-y-1.5">
                            <Pulse className="h-4 w-32" />
                            <Pulse className="h-3 w-20" />
                        </div>
                    </div>
                    <Pulse className="h-4 w-full" />
                    <Pulse className="h-4 w-4/5" />
                    <Pulse className="h-44 w-full rounded-xl" />
                </div>
            ))}
        </div>
    );
}

// ─── Post card ────────────────────────────────────────────────────────
function PostCard({ post, userProfile }: { post: UserPost; userProfile: ProfileUser }) {
    const [liked, setLiked] = useState(false);
    const date = new Date(post.created_at).toLocaleDateString("vi-VN", {
        day: "numeric", month: "short",
    });

    return (
        <article className="mx-3 mb-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.025]">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                {userProfile.avatar_url ? (
                    <Image
                        src={userProfile.avatar_url} alt={userProfile.username}
                        width={40} height={40}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-[#2fb36d]/30"
                    />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2fb36d]/20 text-sm font-bold text-[#2fb36d]">
                        {userProfile.username[0]?.toUpperCase()}
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white/90 truncate">{userProfile.username}</p>
                    <p className="text-xs text-white/40">{date}</p>
                </div>
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-white/40 hover:bg-white/[0.06] transition">
                    <RiMoreLine size={18} />
                </button>
            </div>

            {/* Content */}
            {post.content && (
                <p className="px-4 pb-3 text-sm text-white/75 leading-relaxed">{post.content}</p>
            )}

            {/* Media */}
            {post.media_url && (
                <div className="relative w-full aspect-video bg-white/[0.04] overflow-hidden">
                    <Image src={post.media_url} alt="post media" fill className="object-cover" />
                </div>
            )}

            {/* Actions */}
            <div className="flex border-t border-white/[0.05] divide-x divide-white/[0.05]">
                <button
                    type="button"
                    onClick={() => setLiked(v => !v)}
                    className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-medium transition ${liked ? "text-red-400" : "text-white/45 hover:text-white/70"}`}
                >
                    <RiHeartLine size={16} />
                    {(post.like_count ?? 0) + (liked ? 1 : 0)}
                </button>
                <button type="button" className="flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-medium text-white/45 hover:text-white/70 transition">
                    <RiChat3Line size={16} />
                    {post.comment_count ?? 0}
                </button>
                <button type="button" className="flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-medium text-white/45 hover:text-white/70 transition">
                    <RiShareLine size={16} />
                    Chia sẻ
                </button>
            </div>
        </article>
    );
}

// ─── About tab ───────────────────────────────────────────────────────
function AboutTab({ userProfile }: { userProfile: ProfileUser }) {
    const rows = [
        { icon: <RiUserLine size={16} />, label: "Giới tính", value: userProfile.gender ? String(userProfile.gender) : null },
        { icon: <RiMapPinLine size={16} />, label: "Quê quán", value: userProfile.hometown ?? null },
        { icon: <RiCalendarLine size={16} />, label: "Tham gia", value: userProfile.created_at ? new Date(userProfile.created_at).toLocaleDateString("vi-VN", { month: "long", year: "numeric" }) : null },
    ];

    return (
        <div className="mx-3 mb-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] divide-y divide-white/[0.05]">
            {rows.map((row) => (
                <div key={row.label} className="flex items-center gap-4 px-4 py-3">
                    <span className="shrink-0 text-[#2fb36d]">{row.icon}</span>
                    <span className="w-24 shrink-0 text-xs text-white/45">{row.label}</span>
                    <span className="text-sm text-white/80 truncate">{row.value ?? <em className="text-white/25 not-italic">Chưa cập nhật</em>}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Photos tab ──────────────────────────────────────────────────────
function PhotosTab({ posts }: { posts: UserPost[] }) {
    const photos = posts.filter(p => p.media_url);
    if (!photos.length) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-white/30">
                <RiImageLine size={40} />
                <p className="text-sm">Chưa có ảnh nào</p>
            </div>
        );
    }
    return (
        <div className="mx-3 mb-4 grid grid-cols-3 gap-1 overflow-hidden rounded-2xl border border-white/[0.06]">
            {photos.map(p => (
                <div key={p.id} className="relative aspect-square bg-white/[0.04] overflow-hidden">
                    <Image src={p.media_url!} alt="" fill className="object-cover" />
                </div>
            ))}
        </div>
    );
}

// ─── Main component ──────────────────────────────────────────────────
export function MobileProfileView({
    userProfile,
    posts,
    isOwnProfile,
    isLoading,
    onFollow,
    onUnfollow,
    onEditProfile,
}: MobileProfileViewProps) {
    const [activeTab, setActiveTab] = useState<Tab>("posts");

    if (isLoading || !userProfile) {
        return <MobileProfileSkeleton />;
    }

    const isFollowing = userProfile.is_following;

    const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
        { key: "posts", label: "Bài viết", icon: <RiNewspaperLine size={16} /> },
        { key: "about", label: "Giới thiệu", icon: <RiUserLine size={16} /> },
        { key: "photos", label: "Ảnh", icon: <RiGridLine size={16} /> },
    ];

    return (
        <div className="w-full pb-4">
            {/* ── Cover photo ── */}
            <div className="relative h-44 w-full overflow-hidden rounded-b-[28px] bg-gradient-to-br from-[#1a2e24] via-[#0f1a16] to-[#0f1016]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(47,179,109,0.25),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(47,179,109,0.12),transparent_60%)]" />
                {/* Decorative grid lines */}
                <svg className="absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#2fb36d" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* ── Avatar + actions row ── */}
            <div className="relative -mt-[52px] flex items-end justify-between px-4 pb-3">
                {/* Avatar */}
                <div className="relative">
                    {userProfile.avatar_url ? (
                        <Image
                            src={userProfile.avatar_url}
                            alt={userProfile.username}
                            width={96} height={96}
                            className="h-24 w-24 rounded-full object-cover ring-4 ring-background shadow-[0_0_0_2px_rgba(47,179,109,0.4)]"
                        />
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#2fb36d] to-[#1a7a42] ring-4 ring-background shadow-[0_0_0_2px_rgba(47,179,109,0.4)] text-3xl font-bold text-black">
                            {userProfile.username[0]?.toUpperCase()}
                        </div>
                    )}
                    {/* Online dot */}
                    <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background bg-[#2fb36d]" />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-14">
                    {isOwnProfile ? (
                        <button
                            type="button"
                            onClick={onEditProfile}
                            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/[0.1] active:scale-95"
                        >
                            <RiEditLine size={15} />
                            Chỉnh sửa
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={isFollowing ? onUnfollow : onFollow}
                                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${isFollowing
                                        ? "border border-white/10 bg-white/[0.06] text-white/80 hover:bg-white/[0.1]"
                                        : "bg-[#2fb36d] text-black shadow-[0_4px_16px_rgba(47,179,109,0.4)] hover:bg-[#25a05e]"
                                    }`}
                            >
                                {isFollowing ? <RiUserUnfollowLine size={15} /> : <RiUserFollowLine size={15} />}
                                {isFollowing ? "Đang theo dõi" : "Theo dõi"}
                            </button>
                            <button
                                type="button"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/60 transition hover:bg-white/[0.1] active:scale-95"
                            >
                                <RiMoreLine size={18} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* ── Name & bio ── */}
            <div className="px-4 pb-3">
                <h1 className="text-xl font-bold text-white">{userProfile.username}</h1>
                {userProfile.bio && (
                    <p className="mt-1 text-sm text-white/55 leading-relaxed">{userProfile.bio}</p>
                )}
                {userProfile.hometown && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/40">
                        <RiMapPinLine size={13} />
                        {userProfile.hometown}
                    </p>
                )}
            </div>

            {/* ── Stats bar ── */}
            <div className="flex items-stretch border-y border-white/[0.06] divide-x divide-white/[0.06]">
                {[
                    { label: "Bài viết", value: userProfile.post_count ?? posts.length },
                    { label: "Người theo dõi", value: userProfile.follower_count ?? 0 },
                    { label: "Đang theo dõi", value: userProfile.following_count ?? 0 },
                ].map((stat) => (
                    <button
                        key={stat.label}
                        type="button"
                        className="flex flex-1 flex-col items-center justify-center gap-0.5 py-3 transition hover:bg-white/[0.03] active:bg-white/[0.06]"
                    >
                        <span className="text-base font-bold text-white">{stat.value.toLocaleString()}</span>
                        <span className="text-[10px] text-white/40 font-medium">{stat.label}</span>
                    </button>
                ))}
            </div>

            {/* ── Tab bar ── */}
            <div className="flex gap-2 px-3 pt-3 pb-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 ${activeTab === tab.key
                                ? "bg-[#2fb36d] text-black shadow-[0_4px_12px_rgba(47,179,109,0.3)]"
                                : "bg-white/[0.05] text-white/55 hover:bg-white/[0.09]"
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Tab content ── */}
            <div className="mt-3">
                {activeTab === "posts" && (
                    posts.length ? (
                        posts.map((post) => (
                            <PostCard key={post.id} post={post} userProfile={userProfile} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3 py-16 text-white/30">
                            <RiNewspaperLine size={40} />
                            <p className="text-sm">Chưa có bài viết nào</p>
                        </div>
                    )
                )}
                {activeTab === "about" && <AboutTab userProfile={userProfile} />}
                {activeTab === "photos" && <PhotosTab posts={posts} />}
            </div>
        </div>
    );
}
