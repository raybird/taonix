import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, "..");
// v19.0.0: 支持外部數據路徑注入，達成物理級解耦
const DATA_DIR = process.env.TAONIX_DATA_DIR || path.join(PROJECT_ROOT, ".data");
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".jsonl": "text/plain",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

const server = http.createServer((req, res) => {
  // 1. 心跳檢查接口
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "alive", data_dir: DATA_DIR }));
  }

  let url = req.url === "/" ? "/index.html" : req.url;
  let filePath;

  // 2. 數據路徑映射 (Data Proxy)
  if (url.startsWith("/.data/")) {
    const fileName = url.replace("/.data/", "");
    filePath = path.join(DATA_DIR, fileName);
  } else {
    filePath = path.join(__dirname, url);
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(err.code === "ENOENT" ? 404 : 500);
      res.end(`[Console] Error ${err.code}: ${filePath}`);
    } else {
      res.writeHead(200, { 
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store" // 確保數據始終最新
      });
      res.end(content);
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🏆 Taonix Web Console v19.0.0 (Hardened)`);
  console.log(`   - Data Source: ${DATA_DIR}`);
  console.log(`   - Listen Addr: http://0.0.0.0:${PORT}`);
  console.log(`   - Access Hint: 若在容器外執行，請確保 .data 目錄已正確掛載。\n`);
});
