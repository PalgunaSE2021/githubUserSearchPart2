"use client";

import { useParams } from "next/navigation";
import { useGithubUser } from "@/hooks/useGithubUser";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserPage() {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError } = useGithubUser(username);

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError)
    return <p className="text-center text-red-500 mt-10">User not found.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <Link href="/">
        <Button variant="outline" className="mb-4">
          ← Back
        </Button>
      </Link>

      <div className="flex items-center gap-6">
        <img
          src={data.avatar_url}
          alt={data.login}
          className="w-32 h-32 rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold">{data.name || data.login}</h1>
          <p className="text-gray-600">@{data.login}</p>
          <p className="mt-2">{data.bio}</p>
          <p className="mt-2">Followers: {data.followers}</p>
          <p>Following: {data.following}</p>
          <p>Public Repos: {data.public_repos}</p>
        </div>
      </div>
    </div>
  );
}
