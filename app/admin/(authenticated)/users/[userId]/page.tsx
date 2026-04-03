import UserDetailPanel from "@/components/admin/UserDetailPanel";

export const dynamic = "force-dynamic";

export default async function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return <UserDetailPanel userId={userId} />;
}
