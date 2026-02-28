export async function generateReport(data, type = "summary", options = {}) {
  const generators = {
    summary: generateSummary,
    detailed: generateDetailed,
    markdown: generateMarkdown,
    json: generateJSON,
  };

  const generator = generators[type] || generators.summary;
  return await generator(data, options);
}

async function generateSummary(data, options) {
  const { title = "Report", format = "text" } = options;

  return {
    type: "summary",
    title,
    content: formatSummaryContent(data),
    generatedAt: new Date().toISOString(),
  };
}

async function generateDetailed(data, options) {
  const { title = "Detailed Report", includeMetrics = true } = options;

  return {
    type: "detailed",
    title,
    content: formatDetailedContent(data),
    metrics: includeMetrics ? calculateMetrics(data) : null,
    generatedAt: new Date().toISOString(),
  };
}

async function generateMarkdown(data, options) {
  const { title = "Report", sections = [] } = options;

  let md = `# ${title}\n\n`;
  md += `*Generated: ${new Date().toLocaleString()}*\n\n`;

  if (sections.length > 0) {
    for (const section of sections) {
      md += `## ${section.title}\n\n${section.content}\n\n`;
    }
  } else {
    md += formatMarkdownContent(data);
  }

  return {
    type: "markdown",
    title,
    content: md,
    generatedAt: new Date().toISOString(),
  };
}

async function generateJSON(data, options) {
  return {
    type: "json",
    data,
    generatedAt: new Date().toISOString(),
  };
}

function formatSummaryContent(data) {
  if (Array.isArray(data)) {
    return `Total items: ${data.length}`;
  }
  return JSON.stringify(data).substring(0, 200);
}

function formatDetailedContent(data) {
  return JSON.stringify(data, null, 2);
}

function formatMarkdownContent(data) {
  if (Array.isArray(data)) {
    return data.map((item) => `- ${JSON.stringify(item)}`).join("\n");
  }
  return JSON.stringify(data, null, 2);
}

function calculateMetrics(data) {
  if (!Array.isArray(data)) return null;

  return {
    count: data.length,
    fields: data.length > 0 ? Object.keys(data[0]).length : 0,
  };
}
