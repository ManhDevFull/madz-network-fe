import ProfileView from "../profile-view";

type ProfileBySlugPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function ProfileBySlugPage({ params }: ProfileBySlugPageProps) {
    const { slug } = await params;
    return <ProfileView userSlug={slug} />;
}
