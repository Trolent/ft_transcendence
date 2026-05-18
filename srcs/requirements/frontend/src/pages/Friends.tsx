import { FriendsList } from "@/friends";
import { useAuth } from "@/auth";
import { PageLayout } from "@/layout";

export default function Friends() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return null;

  return (
    <PageLayout maxWidth="max-w-lg">
        <FriendsList username={user.username} />
    </PageLayout>
  )
}

