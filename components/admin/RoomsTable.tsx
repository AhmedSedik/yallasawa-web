"use client";

import { useState, useEffect, useCallback } from "react";
import Pagination from "./Pagination";

interface RoomEntry {
  id: string;
  code: string;
  title: string;
  hostUserId: string | null;
  privacy: string;
  status: string;
  memberCount: number;
  peakMembers: number;
  totalUniqueMembers: number;
  createdAt: string | null;
  endedAt: string | null;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function RoomsTable() {
  const [rooms, setRooms] = useState<RoomEntry[]>([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    params.set("page", String(page));

    const res = await fetch(`/api/admin/rooms?${params}`);
    const data = await res.json();
    setRooms(data.rooms);
    setTotalPages(data.totalPages);
    setTotal(data.total);
    setLoading(false);
  }, [status, page]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-md bg-surface-low px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-cta-amber-deep/40"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="ended">Ended</option>
        </select>
        <p className="text-xs text-outline">{total} rooms total</p>
      </div>

      <div className="rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-high text-left text-outline">
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Privacy</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Peak</th>
              <th className="px-4 py-3 font-medium">Unique</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-outline">Loading...</td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-outline">No rooms found</td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id} className="bg-surface-container hover:bg-surface-high transition-colors">
                  <td className="px-4 py-3 font-mono text-cta-amber-light">{room.code}</td>
                  <td className="px-4 py-3">{room.title || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-surface-high px-2 py-0.5 text-xs">
                      {room.privacy}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                      room.status === "active"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-surface-high text-outline"
                    }`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-outline">{room.peakMembers}</td>
                  <td className="px-4 py-3 text-outline">{room.totalUniqueMembers}</td>
                  <td className="px-4 py-3 text-outline">{formatDate(room.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
