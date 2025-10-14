"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const { setLastUser, recentUsers, addRecentUser } = useUserStore();
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    setLastUser(trimmed);
    addRecentUser(trimmed);
    router.push(`/user/${trimmed}`);
  };

  return (
    <div className="max-w-lg mx-auto mt-20 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        GitHub User Finder
      </h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <Input
          placeholder="Enter GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>

      {/* Recent Search History */}
      {recentUsers.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Recent Searches</h2>
          <div className="flex gap-2 flex-wrap">
            {recentUsers.slice(0, 5).map((u, idx) => (
              <Button
                key={idx}
                size="sm"
                variant="outline"
                onClick={() => router.push(`/user/${u}`)}
              >
                {u}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
