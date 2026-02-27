export async function searchWeb(query, numResults = 5) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://ddg-api.vercel.app/search?q=${encodedQuery}&num=${numResults}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      query,
      results: data.map((item) => ({
        title: item.title,
        url: item.url,
        snippet: item.snippet,
      })),
      count: data.length,
    };
  } catch (error) {
    return {
      query,
      error: error.message,
      results: [],
      count: 0,
    };
  }
}

export async function fetchPage(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    return {
      url,
      status: response.status,
      content: html.substring(0, 5000),
      length: html.length,
    };
  } catch (error) {
    return {
      url,
      error: error.message,
      status: 0,
    };
  }
}
