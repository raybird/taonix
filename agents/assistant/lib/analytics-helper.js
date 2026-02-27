export async function analyzeData(data, type = "basic") {
  if (!Array.isArray(data)) {
    return { error: "Data must be an array" };
  }

  const results = {
    count: data.length,
    basic: calculateBasicStats(data),
    distribution: calculateDistribution(data),
  };

  if (type === "full") {
    results.correlations = calculateCorrelations(data);
    results.outliers = detectOutliers(data);
  }

  return results;
}

function calculateBasicStats(data) {
  const numericData = data.filter((n) => typeof n === "number");

  if (numericData.length === 0) {
    return { error: "No numeric data found" };
  }

  const sorted = [...numericData].sort((a, b) => a - b);
  const sum = numericData.reduce((a, b) => a + b, 0);
  const mean = sum / numericData.length;

  return {
    count: numericData.length,
    sum,
    mean: Math.round(mean * 100) / 100,
    min: Math.min(...numericData),
    max: Math.max(...numericData),
    median: sorted[Math.floor(sorted.length / 2)],
  };
}

function calculateDistribution(data) {
  const groups = {};
  data.forEach((item) => {
    const key = String(item);
    groups[key] = (groups[key] || 0) + 1;
  });
  return groups;
}

function calculateCorrelations(data) {
  return { note: "Correlation analysis requires paired data" };
}

function detectOutliers(data) {
  const numericData = data.filter((n) => typeof n === "number");
  if (numericData.length < 4) return [];

  const mean = numericData.reduce((a, b) => a + b, 0) / numericData.length;
  const std = Math.sqrt(
    numericData.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) /
      numericData.length,
  );

  return numericData.filter((n) => Math.abs(n - mean) > 2 * std);
}

export async function generateReport(data, format = "summary") {
  const analysis = await analyzeData(data, "basic");

  const templates = {
    summary: `數據分析報告\n===========\n數據筆數: ${analysis.count}\n平均值: ${analysis.basic?.mean || "N/A"}\n最小值: ${analysis.basic?.min || "N/A"}\n最大值: ${analysis.basic?.max || "N/A"}`,
    detailed: `詳細分析報告\n=============\n${JSON.stringify(analysis, null, 2)}`,
  };

  return {
    format,
    report: templates[format] || templates.summary,
    timestamp: new Date().toISOString(),
  };
}
