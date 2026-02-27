export async function searchWeb(query, numResults = 5) {
  return [
    {
      title: `${query} - 搜尋結果`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      snippet:
        "Web search functionality - to be integrated with actual search API",
    },
  ];
}
