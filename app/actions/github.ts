"use server";

import { getUserGithubProfile } from "@/lib/github";
import generateResponse from "@/lib/llm";

export default async function analyzeGithub({ username, tone }: { username: string, tone: string }) {
  const { profile, repos } = await getUserGithubProfile({ username });
  if (!profile || !repos) {
    throw new Error("Failed to fetch Github data");

  }

  const [openPRs, mergedPRs] = await Promise.all([
    fetch(`https://api.github.com/search/issues?q=is:pr+author:${username}+state:open`, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    }).then(res => res.json()),
    fetch(`https://api.github.com/search/issues?q=is:pr+author:${username}+is:merged`, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    }).then(res => res.json()),
  ]);

  const totalOpenPRs = openPRs.total_count || 0;
  const totalMergedPRs = mergedPRs.total_count || 0;
  const mergeRate =
    totalOpenPRs + totalMergedPRs > 0
      ? ((totalMergedPRs / (totalOpenPRs + totalMergedPRs)) * 100).toFixed(2) + "%"
      : "N/A";

  interface Repo {
    name: string;
    language?: string;
    stargazers_count: number;
    forks_count: number;
    description?: string;
  }

  const data = `
        User:${profile.login} (${profile.name})
        Bio:"${profile.bio}"
        Stats:${profile.followers} followers, ${profile.following} following.
        Total Repos: ${profile.public_repos}.
        Account Age: Created in ${new Date(profile.created_at).getFullYear()}.
        PR Stats: ${totalOpenPRs} open PRs, ${totalMergedPRs} merged PRs. Merge Rate: ${mergeRate}.
        
        Recent Repositories:
        
        ${repos.map((repo: Repo, index: number) => `${index + 1}. ${repo.name} (${repo.language || "N/A"}) - ${repo.stargazers_count} stars, ${repo.forks_count} forks. Description - ${repo.description || "N/A"}`).join("\n")}
    `
  console.log(data);
  const feedback = await generateResponse(data, tone);
  return feedback;
}