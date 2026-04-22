"use client";

import { SectionCard } from "@/components/ui/section-card";

import Post from "./post";

type ProfileHistoryPageProps = {
    userProfile: {
        id: string;
        username?: string | null;
        avatar_url?: string | null;
    } | null;
    posts: UserPost[] | null;
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

export default function ProfileHistoryPage({ posts, userProfile }: ProfileHistoryPageProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Bài viết</h2>
            <div className="flex gap-4">
                <div className="flex-1">
                    {posts === null ? (
                        <>
                            <SectionCard className="mb-3">
                                <Post />
                            </SectionCard>
                            <SectionCard className="mb-3">
                                <Post />
                            </SectionCard>
                        </>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <SectionCard key={post.id} className="mb-3">
                                <Post
                                    avatarUrl={userProfile?.avatar_url ?? null}
                                    commentCount={post.comment_count}
                                    content={post.content}
                                    createdAt={post.created_at}
                                    likeCount={post.like_count}
                                    mediaUrl={post.media_url}
                                    updatedAt={post.updated_at}
                                    username={userProfile?.username ?? null}
                                />
                            </SectionCard>
                        ))
                    ) : (
                        <SectionCard>
                            <div className="rounded-[20px] border border-dashed border-white/10 bg-white/[0.02] px-5 py-10 text-center text-sm text-white/55">
                                Chưa có bài viết nào để hiển thị.
                            </div>
                        </SectionCard>
                    )}
                </div>
            </div>
        </div>
    );
}
