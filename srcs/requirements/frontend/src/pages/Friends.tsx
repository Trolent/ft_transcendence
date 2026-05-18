import { FriendsList } from "@/friends";
<<<<<<< HEAD
import { PageLayout } from "@/layout";

export default function Friends() {
  return (
    <PageLayout maxWidth="max-w-lg">
        <FriendsList />
=======
import { useAuth } from "@/auth";
import { PageLayout } from "@/layout";

export default function Friends() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return null;

  return (
    <PageLayout maxWidth="max-w-lg">
        <FriendsList username={user.username} />
>>>>>>> origin/main
    </PageLayout>
  )
}

