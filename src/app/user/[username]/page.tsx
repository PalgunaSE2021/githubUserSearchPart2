"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
}

async function getUser(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
}

async function getRepos(username: string, page: number, perPage: number = 6) {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=${perPage}&page=${page}`
  );
  if (!res.ok) throw new Error("Repos not found");
  return res.json();
}

export default function UserProfilePage() {
  const { username } = useParams();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const perPage = 6;

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ["user", username],
    queryFn: () => getUser(username as string),
  });

  const { data: repos, isLoading: repoLoading } = useQuery({
    queryKey: ["repos", username, page],
    queryFn: () => getRepos(username as string, page, perPage),
    enabled: !!username,
  });

  if (userLoading) return <p className="text-center mt-20">Loading user...</p>;

  if (userError || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-red-500 text-xl mb-4">❌ User not found.</p>
        <Button variant="outline" onClick={() => router.push("/")}>
          Search Another User
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* 🔙 Back Button */}
      <div className="max-w-3xl mx-auto mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          ← Back
        </Button>
      </div>

      {/* User Profile Section */}
      <div className="flex justify-center mb-10">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              {user.name || user.login}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Image
              src={user.avatar_url}
              alt={user.login}
              width={120}
              height={120}
              className="rounded-full"
            />
            <p className="text-gray-600">@{user.login}</p>
            <p>Followers: {user.followers}</p>
            <p>Public Repos: {user.public_repos}</p>
            <a
              href={user.html_url}
              target="_blank"
              className="text-blue-600 underline"
            >
              View on GitHub
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Repositories Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          🧩 Public Repositories
        </h2>

        {repoLoading && <p className="text-center">Loading repositories...</p>}

        {!repoLoading && repos?.length === 0 && (
          <div className="flex flex-col items-center space-y-4 text-center mt-6">
            <p className="text-gray-500 text-lg">No repositories found.</p>
            <Button variant="outline" onClick={() => router.push("/")}>
              Search Another User
            </Button>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos?.map((repo: Repo, index: number) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-md border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-700 truncate">
                    <a href={repo.html_url} target="_blank">
                      {repo.name}
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-gray-600 line-clamp-2">
                    {repo.description || "No description"}
                  </p>
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>⭐ {repo.stargazers_count}</span>
                    <span>{repo.language || "Unknown"}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls - Always Visible */}
        <div className="flex justify-center mt-6 gap-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-2">{page}</span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={repos?.length < perPage} // disable next if less than perPage
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
