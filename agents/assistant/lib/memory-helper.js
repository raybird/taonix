export async function searchMemory(query) {
  console.log(`搜尋記憶: ${query}`);

  const results = [
    { type: "preference", content: "使用者偏好...", relevance: 0.9 },
    { type: "task", content: "歷史任務...", relevance: 0.8 },
  ];

  return {
    query,
    results,
    count: results.length,
  };
}

export async function saveToMemory(key, value) {
  return {
    action: "saved",
    key,
    value,
    timestamp: new Date().toISOString(),
  };
}
