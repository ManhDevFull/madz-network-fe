'use client'

import { MarketingShell } from "@/components/layout/marketing-shell";
import { SectionCard } from "@/components/ui/section-card";
import TextSkeleton from "@/components/ui/skeleton";
import { handleAPI } from "@/hooks/axios";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useAuthStore } from "@/store/auth.store";
import { useAuthHydration } from "@/store/use-auth-hydration";

import ProfileHistoryPage from "./history";
import NewPostPage from "./newPost";
import BtnAddFRD from "./btn-addFRD";

export type ProfileUser = {
    id: string;
    slug: string;
    username: string;
    email?: string | null;
    avatar_url: string | null;
    bio: string | null;
    createAt?: string;
    created_at?: string;
    gender?: string | number | null;
    hometown?: string | null;
    post_count?: number;
    follower_count?: number;
    following_count?: number;
    friendship_id?: string | null;
    friendship_status?: "self" | "none" | "pending" | "accepted" | "rejected" | "blocked" | "unknown" | null;
    friendship_requested_by_me?: boolean;
    is_following?: boolean | null;
};

type ProfileViewProps = {
    userSlug?: string;
};

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

export default function ProfileView({ userSlug }: ProfileViewProps) {
    const router = useRouter();
    const hasHydrated = useAuthHydration();
    const accessToken = useAuthStore((state) => state.accessToken);
    const currentUserSlug = useAuthStore((state) => state.userSlug);
    const setUserSlug = useAuthStore((state) => state.setUserSlug);
    const [userProfile, setUserProfile] = useState<ProfileUser | null>(null);
    const [viewerProfile, setViewerProfile] = useState<ProfileUser | null>(null);
    const [posts, setPosts] = useState<UserPost[]>([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [editForm, setEditForm] = useState({
        slug: "",
        gender: "",
        hometown: "",
    });

    useEffect(() => {
        if (!hasHydrated) {
            return;
        }

        if (!userSlug && !accessToken) {
            router.replace("/login");
            return;
        }

        if (userSlug && currentUserSlug && userSlug === currentUserSlug) {
            router.replace("/profile");
            return;
        }

        setIsPageLoading(true);
        setIsEditingProfile(false);

        async function getProfile() {
            try {
                let me: ProfileUser | null = null;

                if (accessToken) {
                    me = await handleAPI<ProfileUser>("/user/me", "get");
                    setViewerProfile(me);
                } else {
                    setViewerProfile(null);
                }

                const isOwnProfile = Boolean(me && (!userSlug || userSlug === me.slug));

                const profile = isOwnProfile
                    ? me
                    : await handleAPI<ProfileUser>(`/user/${userSlug}`, "get");

                if (!profile) {
                    throw new Error("Không thể tải thông tin cá nhân.");
                }
                console.log(profile)
                const profilePosts = await handleAPI<UserPost[]>(
                    `/posts/user/${profile.id}`,
                    "get",
                );

                setUserProfile({
                    ...profile,
                    post_count: profile.post_count ?? profilePosts.length,
                });
                setPosts(profilePosts);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Không thể tải thông tin cá nhân.";
                toast.error(message);
                setPosts([]);
            } finally {
                setIsPageLoading(false);
            }
        }

        void getProfile();
    }, [accessToken, currentUserSlug, hasHydrated, router, userSlug]);

    useEffect(() => {
        function handlePostCreated() {
            if (!userProfile?.id) {
                return;
            }

            void handleAPI<UserPost[]>(`/posts/user/${userProfile.id}`, "get")
                .then((profilePosts) => {
                    setPosts(profilePosts);
                    setUserProfile((current) =>
                        current
                            ? {
                                ...current,
                                post_count: profilePosts.length,
                            }
                            : current,
                    );
                })
                .catch(() => {
                    toast.error("Không thể tải lại bài viết mới.");
                });
        }

        window.addEventListener("thread-clone:post-created", handlePostCreated);

        return () => {
            window.removeEventListener("thread-clone:post-created", handlePostCreated);
        };
    }, [userProfile?.id]);

    useEffect(() => {
        if (!userProfile) {
            return;
        }

        setEditForm({
            slug: userProfile.slug ?? "",
            gender:
                userProfile.gender === null || userProfile.gender === undefined
                    ? ""
                    : String(userProfile.gender),
            hometown: userProfile.hometown ?? "",
        });
    }, [userProfile]);

    const isOwnProfile = Boolean(
        userProfile && viewerProfile && userProfile.id === viewerProfile.id,
    );

    const renderInfoRow = (
        label: string,
        value: ReactNode,
        skeletonWidth: number,
    ) => (
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <span className="shrink-0">{label}:</span>
            <span className="inline-flex min-w-0 items-center">
                {userProfile ? value : <TextSkeleton width={skeletonWidth} height={16} className="mt-1" />}
            </span>
        </div>
    );

    const joinedAt = userProfile?.created_at ?? userProfile?.createAt;
    const joinedAtLabel = joinedAt
        ? new Date(joinedAt).toLocaleDateString("vi-VN")
        : "Chưa cập nhật";
    const genderLabel = resolveGenderLabel(userProfile?.gender);
    const hometownLabel = userProfile?.hometown?.trim() || "Chưa cập nhật";
    const profileHeading = "Trang cá nhân";
    const profileSubline = `@${userProfile?.slug ?? "user"}`;
    const bioLabel =
        userProfile?.bio === null || userProfile?.bio === ""
            ? "Chưa cập nhật tiểu sử"
            : userProfile?.bio ?? "Chưa cập nhật tiểu sử";

    async function handleProfileAction() {
        if (!isOwnProfile) {
            return;
        }

        if (!isEditingProfile) {
            setIsEditingProfile(true);
            return;
        }

        try {
            setIsSavingProfile(true);

            const payload = {
                slug: editForm.slug.trim() || null,
                gender: editForm.gender === "" ? null : Number(editForm.gender),
                hometown: editForm.hometown.trim() || null,
            };

            const updatedProfile = await handleAPI<ProfileUser, typeof payload>(
                "/user/me",
                "patch",
                payload,
            );

            setUserSlug(updatedProfile.slug);

            setUserProfile((current) =>
                current
                    ? {
                        ...current,
                        ...updatedProfile,
                        post_count: current.post_count,
                        follower_count:
                            updatedProfile.follower_count ?? current.follower_count,
                        following_count:
                            updatedProfile.following_count ?? current.following_count,
                    }
                    : updatedProfile,
            );
            setIsEditingProfile(false);
            toast.success("Cập nhật thông tin cá nhân thành công.");
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Không thể cập nhật thông tin cá nhân.";
            toast.error(message);
        } finally {
            setIsSavingProfile(false);
        }
    }

    if (isPageLoading) {
        return <ProfilePageSkeleton currentPage="profile" />;
    }

    return (
        <MarketingShell currentPage="profile">
            <div className="flex gap-5">
                <div className="flex-[1.5]">
                    <SectionCard>
                        <div className="flex flex-col items-center justify-center">
                            <i className="pb-3 text-center text-xl">{profileHeading}</i>
                            {userProfile?.avatar_url ? (
                                <img src={userProfile.avatar_url} alt="avatar" className="h-20 w-20 rounded-full border-1-white/40 object-cover" />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/10 text-muted">
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth="0"
                                        viewBox="0 0 448 512"
                                        className="h-11 w-11"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M383.9 308.3l23.9-62.6c4-10.5-3.7-21.7-15-21.7h-58.5c11-18.9 17.8-40.6 17.8-64v-.3c39.2-7.8 64-19.1 64-31.7 0-13.3-27.3-25.1-70.1-33-9.2-32.8-27-65.8-40.6-82.8-9.5-11.9-25.9-15.6-39.5-8.8l-27.6 13.8c-9 4.5-19.6 4.5-28.6 0L182.1 3.4c-13.6-6.8-30-3.1-39.5 8.8-13.5 17-31.4 50-40.6 82.8-42.7 7.9-70 19.7-70 33 0 12.6 24.8 23.9 64 31.7v.3c0 23.4 6.8 45.1 17.8 64H56.3c-11.5 0-19.2 11.7-14.7 22.3l25.8 60.2C27.3 329.8 0 372.7 0 422.4v44.8C0 491.9 20.1 512 44.8 512h358.4c24.7 0 44.8-20.1 44.8-44.8v-44.8c0-48.4-25.8-90.4-64.1-114.1zM176 480l-41.6-192 49.6 32 24 40-32 120zm96 0l-32-120 24-40 49.6-32L272 480zm41.7-298.5c-3.9 11.9-7 24.6-16.5 33.4-10.1 9.3-48 22.4-64-25-2.8-8.4-15.4-8.4-18.3 0-17 50.2-56 32.4-64 25-9.5-8.8-12.7-21.5-16.5-33.4-.8-2.5-6.3-5.7-6.3-5.8v-10.8c28.3 3.6 61 5.8 96 5.8s67.7-2.1 96-5.8v10.8c-.1.1-5.6 3.2-6.4 5.8z"></path>
                                    </svg>
                                </div>
                            )}
                            {userProfile === null ? (
                                <div className="flex flex-col items-center justify-center pt-3">
                                    <TextSkeleton width={160} height={20} className="mt-1" />
                                    <TextSkeleton width={220} height={16} className="mt-3" />
                                    <TextSkeleton width={200} height={16} className="mt-4" />
                                </div>
                            ) : (
                                <div className="pt-3">
                                    <h2 className="text-center text-xl font-bold">{userProfile.username}</h2>
                                    {isOwnProfile && isEditingProfile ? (
                                        <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300">
                                            <span>@</span>
                                            <input
                                                className="min-w-[140px] bg-transparent text-center text-sm text-white outline-none placeholder:text-white/30"
                                                onChange={(event) =>
                                                    setEditForm((current) => ({
                                                        ...current,
                                                        slug: event.target.value,
                                                    }))
                                                }
                                                placeholder="ten-cua-ban"
                                                value={editForm.slug}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500">{profileSubline}</p>
                                    )}
                                    <p className="mt-2 text-center text-gray-400">
                                        {bioLabel}
                                    </p>
                                </div>
                            )}
                        </div>
                        <hr className="mt-2 py-2 text-white/30" />
                        <div>
                            <div className="flex items-center justify-between pr-2">
                                <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
                                {isOwnProfile ? (
                                    <button
                                        className="flex items-center gap-2 text-sm font-medium text-white transition hover:text-[#2fb36d] disabled:cursor-not-allowed disabled:opacity-60"
                                        disabled={isSavingProfile || userProfile === null}
                                        onClick={() => void handleProfileAction()}
                                        type="button"
                                    >
                                        {isEditingProfile ? "Lưu" : <FaRegEdit size={18} color="white" />}
                                    </button>
                                ) : null}
                            </div>

                            {renderInfoRow("Ngày tham gia", joinedAtLabel, 100)}
                            {renderInfoRow("Số bài viết", userProfile?.post_count, 80)}
                            {renderInfoRow(
                                "Giới tính",
                                isOwnProfile && isEditingProfile ? (
                                    <select
                                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white outline-none transition focus:border-[#2fb36d]/60"
                                        onChange={(event) =>
                                            setEditForm((current) => ({
                                                ...current,
                                                gender: event.target.value,
                                            }))
                                        }
                                        value={editForm.gender}
                                    >
                                        <option value="">Chưa cập nhật</option>
                                        <option value="0">Nam</option>
                                        <option value="1">Nữ</option>
                                        <option value="2">Khác</option>
                                    </select>
                                ) : (
                                    genderLabel
                                ),
                                120,
                            )}
                            {renderInfoRow(
                                "Quê quán",
                                isOwnProfile && isEditingProfile ? (
                                    <input
                                        className="w-full rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white outline-none transition placeholder:text-white/30 focus:border-[#2fb36d]/60"
                                        onChange={(event) =>
                                            setEditForm((current) => ({
                                                ...current,
                                                hometown: event.target.value,
                                            }))
                                        }
                                        placeholder="Nhập quê quán"
                                        value={editForm.hometown}
                                    />
                                ) : (
                                    hometownLabel
                                ),
                                120,
                            )}
                            {renderInfoRow("Số người theo dõi", userProfile?.follower_count ?? 0, 120)}
                            {renderInfoRow("Đang theo dõi", userProfile?.following_count ?? 0, 120)}
                        </div>
                    </SectionCard>
                    {!isOwnProfile ? (
                        <BtnAddFRD
                            initialIsFollowing={userProfile?.is_following ?? false}
                            initialRequestedByMe={userProfile?.friendship_requested_by_me ?? false}
                            initialStatus={userProfile?.friendship_status ?? null}
                            targetId={userProfile?.id ?? ""}
                        />
                    ) : null}
                </div>
                <div className="flex-[3]">
                    {isOwnProfile ? (
                        <SectionCard className="mb-3">
                            <NewPostPage />
                        </SectionCard>
                    ) : null}
                    <SectionCard>
                        <ProfileHistoryPage posts={posts} userProfile={userProfile} />
                    </SectionCard>
                </div>
            </div>
        </MarketingShell>
    );
}

function ProfilePageSkeleton({ currentPage }: { currentPage: "profile" }) {
    return (
        <MarketingShell currentPage={currentPage}>
            <div className="flex gap-5">
                <div className="flex-[1.5]">
                    <SectionCard>
                        <div className="flex flex-col items-center justify-center">
                            <TextSkeleton width={124} height={24} className="mb-3" />
                            <div className="h-20 w-20 border-1 mt-[3px] ml-[2px] border-white/40 rounded-full bg-white/8" />
                            <div className="flex flex-col items-center justify-center pt-3">
                                <TextSkeleton width={160} height={20} className="mt-1" />
                                <TextSkeleton width={220} height={16} className="mt-2" />
                                <TextSkeleton width={200} height={16} className="mt-4" />
                            </div>
                        </div>
                        <hr className="mt-2 py-2 text-white/30" />
                        <div>
                            <div className="flex items-center justify-between pr-2">
                                <TextSkeleton width={144} height={22} />
                                <TextSkeleton width={24} height={24} />
                            </div>
                            <InfoRowSkeleton width={100} />
                            <InfoRowSkeleton width={80} />
                            <InfoRowSkeleton width={120} />
                            <InfoRowSkeleton width={120} />
                            <InfoRowSkeleton width={120} />
                            <InfoRowSkeleton width={120} />
                        </div>
                    </SectionCard>
                </div>
                <div className="flex-[3]">
                    <SectionCard className="mb-3">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <TextSkeleton width={120} height={22} />
                                <TextSkeleton width={420} height={40} />
                            </div>
                        </div>
                    </SectionCard>
                    <SectionCard>
                        <ProfileHistoryPage posts={null} userProfile={null} />
                    </SectionCard>
                </div>
            </div>
        </MarketingShell>
    );
}

function InfoRowSkeleton({ width }: { width: number }) {
    return (
        <div className="mt-[7.8px] flex items-center gap-2 text-sm text-gray-500">
            <TextSkeleton width={96} height={15} />
            <TextSkeleton width={width} height={15} />
        </div>
    );
}

function resolveGenderLabel(gender?: string | number | null) {
    if (gender === null || gender === undefined || gender === "") {
        return "Chưa cập nhật";
    }

    const normalized = String(gender).toLowerCase();

    if (normalized === "0" || normalized === "male" || normalized === "nam") {
        return "Nam";
    }

    if (
        normalized === "1" ||
        normalized === "female" ||
        normalized === "nu" ||
        normalized === "nữ"
    ) {
        return "Nữ";
    }

    if (normalized === "2" || normalized === "other") {
        return "Khác";
    }

    return String(gender);
}
