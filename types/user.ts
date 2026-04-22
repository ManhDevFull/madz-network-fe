export type UserProfile = {
  id: string;
  slug: string;
  username: string;
  email?: string;
  avatar_url: string | null;
  bio: string | null;
  gender?: number | null;
  hometown?: string | null;
  post_count?: number;
  follower_count?: number;
  following_count?: number;
  created_at?: string;
  createAt?: string;
};
