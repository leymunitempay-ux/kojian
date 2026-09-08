/* ============================================================
   星冕 VR3D — 零依赖本地静态服务器
   用法：node server.js [port]   默认端口 8080
   打开 http://localhost:8080
   ============================================================ */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = parseInt(process.argv[2] || process.env.PORT || "8080", 10);
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webm": "video/webm",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (urlPath === "/") urlPath = "/index.html";

    let filePath = path.normalize(path.join(ROOT, urlPath));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403); res.end("Forbidden"); return;
    }

    fs.stat(filePath, (err, stat) => {
      if (!err && stat.isDirectory()) {
        filePath = path.join(filePath, "index.html");
        fs.stat(filePath, (err2) => { if (err2) return send404(res); send(filePath, res); });
      } else if (!err) {
        send(filePath, res);
      } else {
        send404(res);
      }
    });
  } catch (e) {
    res.writeHead(500); res.end("Server error");
  }
});

function send(fp, res) {
  fs.readFile(fp, (err, data) => {
    if (err) return send404(res);
    const ext = path.extname(fp).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(data);
  });
}

function send404(res) {
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><title>404 — 星冕.</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{font-family:system-ui,sans-serif;background:#0B0B0D;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center}
a{color:#8B7CFF}h1{font-size:clamp(3rem,10vw,6rem);margin:0;background:linear-gradient(120deg,#54E1FF,#8B7CFF,#FF6EC7);-webkit-background-clip:text;background-clip:text;color:transparent}</style>
</head><body><div><h1>404</h1><p>未找到该页面 — 空间坐标漂移了</p><p><a href="/">← 返回首页</a></p></div></body></html>`);
}

server.listen(PORT, () => {
  console.log("星冕 VR3D 已启动 → http://localhost:" + PORT);
  console.log("  前台首页  /  后台 admin/login.html（默认账号 admin / gigi123）");
});
