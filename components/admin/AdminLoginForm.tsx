"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-text-warm mb-1.5">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-md bg-surface-low px-4 py-3 text-sm text-text-primary placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-cta-amber-deep/40"
          placeholder="Enter admin username"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-warm mb-1.5">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md bg-surface-low px-4 py-3 text-sm text-text-primary placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-cta-amber-deep/40"
          placeholder="Enter admin password"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full amber-gradient rounded-md px-4 py-3 text-sm font-semibold text-surface-base transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <span className="flex items-center justify-center gap-2">
          <Lock size={16} />
          {loading ? "Signing in..." : "Sign In"}
        </span>
      </button>
    </form>
  );
}
