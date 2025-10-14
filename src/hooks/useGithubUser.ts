import { useQuery } from "@tanstack/react-query";

export function useGithubUser(username: string) {
  return useQuery({
    queryKey: ["github-user", username],
    queryFn: async () => {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) throw new Error("User not found");
      return res.json();
    },
    enabled: !!username, // only run when username exists
  });
}
