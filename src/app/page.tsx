"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGithubUser } from "@/hooks/useGithubUser";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [search, setSearch] = useState("");
  const { setLastUser } = useUserStore();

  const { data, isLoading, isError } = useGithubUser(search);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault(); // prevent form reload
    if (username.trim()) {
      setSearch(username.trim());
      setLastUser(username.trim());
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        GitHub User Finder
      </h1>

      {/* 🔍 Input + Button inside form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <Input
          placeholder="Enter GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      )}

      {isError && <p className="text-red-500 text-center">User not found.</p>}

      {data && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{data.name || data.login}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <img
              src={data.avatar_url}
              alt={data.login}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <p>Followers: {data.followers}</p>
              <p>Public Repos: {data.public_repos}</p>
              <Link href={`/user/${data.login}`}>
                <Button>View More</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
