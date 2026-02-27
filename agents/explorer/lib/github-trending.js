export async function getGithubTrending(language = "") {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const dateStr = date.toISOString().split("T")[0];
  const query = `created:>${dateStr}${language ? ` language:${language}` : ""}`;
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`;

  const response = await fetch(url, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  const data = await response.json();

  return (data.items || []).map((repo) => ({
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    stars: repo.stargazers_count,
    language: repo.language,
    url: repo.html_url,
    created_at: repo.created_at,
  }));
}
