import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, "..");
const PORT = 3000;

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
  let url = req.url === "/" ? "/index.html" : req.url;
  let filePath;

  // 數據路徑代理：將 /.data/ 對映到專案根目錄的 .data/
  if (url.startsWith("/.data/")) {
    filePath = path.join(PROJECT_ROOT, url);
  } else {
    filePath = path.join(__dirname, url);
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(err.code === "ENOENT" ? 404 : 500);
      res.end(err.code === "ENOENT" ? "404 Not Found" : "Server Error");
    } else {
      res.writeHead(200, { 
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*" // 允許跨域，方便除錯
      });
      res.end(content);
    }
  });
});

// 明確監聽 0.0.0.0 以支援 Docker 埠號轉發
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Taonix Web Console (Adaptive) 已啟動`);
  console.log(`   - 內部地址: http://0.0.0.0:${PORT}`);
  console.log(`   - 宿主機存取: http://localhost:[您的對映埠號]`);
});
