"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import SearchInput from "./SearchInput";
import Pagination from "./Pagination";

interface UserSummary {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  totalWatchMs: number;
  createdAt: string | null;
}

function formatMs(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UsersTable() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [search, setSearch] = useState("");
  const [verified, setVerified] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (verified) params.set("verified", verified);
    params.set("page", String(page));

    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users);
    setTotalPages(data.totalPages);
    setTotal(data.total);
    setLoading(false);
  }, [search, verified, page]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchUsers, search]);

  async function handleCreateTest(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/admin/users/create-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername }),
    });
    if (res.ok) {
      setNewUsername("");
      setShowCreate(false);
      fetchUsers();
    }
    setCreating(false);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search by username..."
          />
        </div>

        <select
          value={verified}
          onChange={(e) => { setVerified(e.target.value); setPage(1); }}
          className="rounded-md bg-surface-low px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-cta-amber-deep/40"
        >
          <option value="">All</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 rounded-md bg-cta-amber-deep/10 px-3 py-2.5 text-sm text-cta-amber-light hover:bg-cta-amber-deep/20 transition-colors"
        >
          <UserPlus size={16} />
          Test Account
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreateTest} className="glass glass-border rounded-md p-4 mb-4 flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs text-outline mb-1">Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full rounded-md bg-surface-low px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-cta-amber-deep/40"
              placeholder="testuser"
              required
              minLength={3}
              maxLength={20}
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="amber-gradient rounded-md px-4 py-2 text-sm font-semibold text-surface-base"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
      )}

      <p className="text-xs text-outline mb-3">{total} users total</p>

      <div className="rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-high text-left text-outline">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Verified</th>
              <th className="px-4 py-3 font-medium">Watch Time</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-outline">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-outline">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="bg-surface-container hover:bg-surface-high transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="flex items-center gap-2 hover:text-cta-amber-light transition-colors"
                    >
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-surface-high flex items-center justify-center text-xs text-outline">
                          {(user.username?.[0] || "?").toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium">{user.username || user.displayName}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-outline">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                      user.emailVerified
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/15 text-red-400"
                    }`}>
                      {user.emailVerified ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-outline">{formatMs(user.totalWatchMs)}</td>
                  <td className="px-4 py-3 text-outline">{formatDate(user.createdAt)}</td>
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
