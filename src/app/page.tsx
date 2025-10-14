"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const { setLastUser } = useUserStore();
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    setLastUser(trimmed);
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
    </div>
  );
}
