"use client";

import { useState, useEffect, useCallback } from "react";
import { Bot, XCircle, Trash2 } from "lucide-react";
import Pagination from "./Pagination";
import ConfirmDialog from "./ConfirmDialog";

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
  isBot: boolean;
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
  const [confirmAction, setConfirmAction] = useState<"close-stale" | "delete-non-bot" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [togglingBot, setTogglingBot] = useState<string | null>(null);

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

  async function handleCleanup() {
    if (!confirmAction) return;
    setActionLoading(true);
    const res = await fetch("/api/admin/rooms/cleanup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: confirmAction }),
    });
    const data = await res.json();
    setActionLoading(false);
    setConfirmAction(null);

    if (data.success) {
      fetchRooms();
    }
  }

  async function toggleBot(roomId: string, currentIsBot: boolean) {
    setTogglingBot(roomId);
    await fetch(`/api/admin/rooms/${roomId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBot: !currentIsBot }),
    });
    setRooms((prev) =>
      prev.map((r) => r.id === roomId ? { ...r, isBot: !currentIsBot } : r)
    );
    setTogglingBot(null);
  }

  const confirmMessages = {
    "close-stale": {
      title: "Close Stale Rooms",
      message: "This will mark all active non-bot rooms as ended. Bot rooms will be preserved. Continue?",
      label: "Close All",
    },
    "delete-non-bot": {
      title: "Delete All Non-Bot Rooms",
      message: "This will permanently delete ALL rooms that are not flagged as bot. This cannot be undone. Continue?",
      label: "Delete All",
    },
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
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

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setConfirmAction("close-stale")}
            className="flex items-center gap-1.5 rounded-md bg-amber-500/15 px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/25 transition-colors"
          >
            <XCircle size={14} />
            Close Stale Active
          </button>
          <button
            onClick={() => setConfirmAction("delete-non-bot")}
            className="flex items-center gap-1.5 rounded-md bg-red-500/15 px-3 py-2 text-xs text-red-400 hover:bg-red-500/25 transition-colors"
          >
            <Trash2 size={14} />
            Delete All Non-Bot
          </button>
        </div>
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
              <th className="px-4 py-3 font-medium">Bot</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-outline">Loading...</td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-outline">No rooms found</td>
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
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleBot(room.id, room.isBot)}
                      disabled={togglingBot === room.id}
                      className={`rounded-md p-1.5 transition-colors ${
                        room.isBot
                          ? "bg-blue-500/20 text-blue-400"
                          : "text-outline/40 hover:bg-surface-high hover:text-outline"
                      }`}
                      title={room.isBot ? "Bot room (click to unflag)" : "Flag as bot room"}
                    >
                      <Bot size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {confirmAction && (
        <ConfirmDialog
          open
          title={confirmMessages[confirmAction].title}
          message={confirmMessages[confirmAction].message}
          confirmLabel={confirmMessages[confirmAction].label}
          onConfirm={handleCleanup}
          onCancel={() => setConfirmAction(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
