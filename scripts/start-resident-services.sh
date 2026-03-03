#!/bin/bash

# Taonix Resident Services Starter (v23.0.0)
# 負責在容器內啟動並守護 3000 埠的 Web 控制台服務。

CONSOLE_DIR="/app/workspace/projects/taonix/web-console"
PORT=3000

echo "🚀 啟動 Taonix 常駐服務守護進程..."

while true; do
  if ! lsof -i:$PORT > /dev/null; then
    echo "[Watcher] 偵測到 $PORT 埠無監聽，正在啟動 Web 控制台..."
    cd $CONSOLE_DIR && node server.js >> /app/workspace/projects/taonix/.data/console_service.log 2>&1 &
    sleep 5
  fi
  sleep 30
done
