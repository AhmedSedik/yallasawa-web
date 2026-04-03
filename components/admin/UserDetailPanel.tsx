"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, ShieldCheck, ShieldX, Clock, Trophy, Users as UsersIcon } from "lucide-react";
import Link from "next/link";
import ConfirmDialog from "./ConfirmDialog";

interface UserDetail {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string;
  countryCode: string;
  emailVerified: boolean;
  googleId: string | null;
  totalWatchMs: number;
  longestSessionMs: number;
  largestRoomSize: number;
  dailyWatchMs: Record<string, number>;
  privacy: Record<string, string>;
  createdAt: string | null;
  updatedAt: string | null;
}

interface WatchEntry {
  id: string;
  title: string;
  platform: string;
  watchedAt: string | null;
  durationMs: number;
}

interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
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
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function UserDetailPanel({ userId }: { userId: string }) {
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [history, setHistory] = useState<WatchEntry[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const [userRes, histRes, friendsRes] = await Promise.all([
        fetch(`/api/admin/users/${userId}`),
        fetch(`/api/admin/users/${userId}/watch-history`),
        fetch(`/api/admin/users/${userId}/friends`),
      ]);

      if (userRes.ok) setUser(await userRes.json());
      if (histRes.ok) {
        const data = await histRes.json();
        setHistory(data.history);
      }
      if (friendsRes.ok) {
        const data = await friendsRes.json();
        setFriends(data.friends);
      }
      setLoading(false);
    }
    load();
  }, [userId]);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edits),
    });
    setUser((prev) => prev ? { ...prev, ...edits } : prev);
    setEditing(false);
    setEdits({});
    setSaving(false);
  }

  async function handleVerifyToggle() {
    if (!user) return;
    const newVal = !user.emailVerified;
    await fetch(`/api/admin/users/${userId}/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: newVal }),
    });
    setUser((prev) => prev ? { ...prev, emailVerified: newVal } : prev);
  }

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    router.push("/admin/users");
  }

  if (loading) {
    return <p className="text-outline">Loading user...</p>;
  }

  if (!user) {
    return <p className="text-red-400">User not found</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/users" className="text-outline hover:text-text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-display font-bold">{user.username}</h1>
        {user.googleId && (
          <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs text-blue-400">Google</span>
        )}
      </div>

      {/* Profile Info */}
      <div className="glass glass-border rounded-lg p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-surface-high flex items-center justify-center text-lg text-outline">
                {(user.username?.[0] || "?").toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-display font-semibold">{user.displayName}</p>
              <p className="text-sm text-outline">@{user.username}</p>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="text-sm text-cta-amber-light hover:underline"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {editing ? (
          <div className="space-y-3">
            {(["displayName", "bio", "email", "countryCode"] as const).map((field) => (
              <div key={field}>
                <label className="block text-xs text-outline mb-1 capitalize">{field}</label>
                <input
                  type="text"
                  defaultValue={user[field] || ""}
                  onChange={(e) => setEdits((prev) => ({ ...prev, [field]: e.target.value }))}
                  className="w-full rounded-md bg-surface-low px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-cta-amber-deep/40"
                />
              </div>
            ))}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 amber-gradient rounded-md px-4 py-2 text-sm font-semibold text-surface-base"
            >
              <Save size={14} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-outline">Email:</span> <span>{user.email}</span></div>
            <div><span className="text-outline">Bio:</span> <span>{user.bio || "—"}</span></div>
            <div><span className="text-outline">Country:</span> <span>{user.countryCode || "—"}</span></div>
            <div><span className="text-outline">Joined:</span> <span>{formatDate(user.createdAt)}</span></div>
            <div><span className="text-outline">Updated:</span> <span>{formatDate(user.updatedAt)}</span></div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleVerifyToggle}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${
            user.emailVerified
              ? "bg-red-500/15 text-red-400 hover:bg-red-500/25"
              : "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
          }`}
        >
          {user.emailVerified ? <ShieldX size={16} /> : <ShieldCheck size={16} />}
          {user.emailVerified ? "Unverify Email" : "Verify Email"}
        </button>

        <button
          onClick={() => setShowDelete(true)}
          className="flex items-center gap-2 rounded-md bg-red-500/15 px-4 py-2 text-sm text-red-400 hover:bg-red-500/25 transition-colors"
        >
          <Trash2 size={16} />
          Delete User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass glass-border rounded-lg p-4 text-center">
          <Clock size={18} className="mx-auto mb-2 text-cta-amber-light" />
          <p className="text-lg font-display font-bold">{formatMs(user.totalWatchMs)}</p>
          <p className="text-xs text-outline">Total Watch Time</p>
        </div>
        <div className="glass glass-border rounded-lg p-4 text-center">
          <Trophy size={18} className="mx-auto mb-2 text-cyan" />
          <p className="text-lg font-display font-bold">{formatMs(user.longestSessionMs)}</p>
          <p className="text-xs text-outline">Longest Session</p>
        </div>
        <div className="glass glass-border rounded-lg p-4 text-center">
          <UsersIcon size={18} className="mx-auto mb-2 text-cta-amber-light" />
          <p className="text-lg font-display font-bold">{user.largestRoomSize}</p>
          <p className="text-xs text-outline">Largest Room</p>
        </div>
      </div>

      {/* Privacy Settings */}
      {Object.keys(user.privacy).length > 0 && (
        <div className="glass glass-border rounded-lg p-5">
          <h3 className="text-sm font-display font-semibold mb-3">Privacy Settings</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(user.privacy).map(([key, val]) => (
              <div key={key}>
                <span className="text-outline capitalize">{key}:</span>{" "}
                <span>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Watch History */}
      <div className="glass glass-border rounded-lg p-5">
        <h3 className="text-sm font-display font-semibold mb-3">Watch History ({history.length})</h3>
        {history.length === 0 ? (
          <p className="text-sm text-outline">No watch history</p>
        ) : (
          <div className="space-y-2">
            {history.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between bg-surface-container rounded-md px-3 py-2 text-sm">
                <div>
                  <p className="font-medium">{entry.title || "Untitled"}</p>
                  <p className="text-xs text-outline">{entry.platform} &middot; {formatDate(entry.watchedAt)}</p>
                </div>
                <span className="text-outline">{formatMs(entry.durationMs)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Friends */}
      <div className="glass glass-border rounded-lg p-5">
        <h3 className="text-sm font-display font-semibold mb-3">Friends ({friends.length})</h3>
        {friends.length === 0 ? (
          <p className="text-sm text-outline">No friends</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {friends.map((friend) => (
              <Link
                key={friend.id}
                href={`/admin/users/${friend.id}`}
                className="flex items-center gap-2 bg-surface-container rounded-md px-3 py-2 text-sm hover:bg-surface-high transition-colors"
              >
                {friend.avatarUrl ? (
                  <img src={friend.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-surface-high flex items-center justify-center text-[10px] text-outline">
                    {(friend.username?.[0] || "?").toUpperCase()}
                  </div>
                )}
                {friend.username}
              </Link>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Delete User"
        message={`Permanently delete @${user.username}? This removes all their data, watch history, friendships, and friend requests.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </div>
  );
}
