import UsersTable from "@/components/admin/UsersTable";

export const dynamic = "force-dynamic";

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-xl font-display font-bold mb-6">Users</h1>
      <UsersTable />
    </div>
  );
}
