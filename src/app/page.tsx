"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useUserStore } from "@/store/userStore";
import { Search, User } from "lucide-react";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { recentUsers } = useUserStore();

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`https://api.github.com/users/${trimmed}`);
      if (!res.ok) {
        setError("❌ User not found. Please try another username.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      router.push(`/user/${trimmed}`);
    } catch {
      setError("⚠️ Something went wrong. Try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20 p-6">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        GitHub User Finder
      </h1>

      {/* Search Input */}
      <form
        onSubmit={handleSearch}
        className="flex gap-2 mb-6 border border-gray-300 rounded-lg p-2 shadow-sm bg-white"
      >
        <Input
          placeholder="Enter GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" disabled={isLoading} className="px-4">
          {isLoading ? (
            <span className="animate-pulse">Searching...</span>
          ) : (
            <Search className="h-5 w-5" />
          )}
        </Button>
      </form>

      {/* Error Message */}
      {error && (
        <p className="text-center text-red-500 mb-4 animate-fade-in">{error}</p>
      )}

      {/* Recent Searches */}
      {recentUsers.length > 0 && (
        <Card className="mt-10 p-6 shadow-lg bg-gradient-to-br from-white to-blue-50 border border-blue-100">
          <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">
            🔍 Recent Searches
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {recentUsers.map((user) => (
              <Button
                key={user}
                variant="outline"
                onClick={() => router.push(`/user/${user}`)}
                className="rounded-full bg-white hover:bg-blue-100 border border-blue-300 text-blue-700 flex items-center gap-2 transition-all duration-200"
              >
                <User className="h-4 w-4" /> {user}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
