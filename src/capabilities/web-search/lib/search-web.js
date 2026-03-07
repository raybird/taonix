export async function searchWeb(query, numResults = 5) {
  return [
    {
      title: `${query} - 搜尋結果`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      snippet: "Mock-friendly web search capability result.",
      numResults,
    },
  ];
}
