import RoomsTable from "@/components/admin/RoomsTable";

export const dynamic = "force-dynamic";

export default function RoomsPage() {
  return (
    <div>
      <h1 className="text-xl font-display font-bold mb-6">Rooms</h1>
      <RoomsTable />
    </div>
  );
}
