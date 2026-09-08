/* 一次性生成后台页面壳（HTML 保持静态，内容由 admin-pages.js 渲染） */
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function shell(rel, adminPage, title, entity) {
  const prefix = "../".repeat(rel.split("/").length);
  const theme = `
<script>
(function(){try{var t=JSON.parse(localStorage.getItem('xingmian_settings')||'null');var m=(t&&t.theme)||'dark';var d=m==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):m;document.documentElement.setAttribute('data-theme',d);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();
</script>`;
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — 星冕 Admin</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0B0B0D">
<link rel="icon" type="image/svg+xml" href="${prefix}assets/icons/favicon.svg">
${theme}
<link rel="stylesheet" href="${prefix}assets/css/reset.css">
<link rel="stylesheet" href="${prefix}assets/css/tokens.css">
<link rel="stylesheet" href="${prefix}assets/css/global.css">
<link rel="stylesheet" href="${prefix}assets/css/admin.css">
<link rel="stylesheet" href="${prefix}assets/css/responsive.css">
</head>
<body class="admin-body" data-admin-page="${adminPage}"${entity ? ` data-entity="${entity}"` : ""} data-root="${prefix.slice(0, -1) || "."}">

  <div class="admin-layout">
    <aside class="admin-sidebar" id="admin-sidebar"></aside>
    <div class="admin-main">
      <header class="admin-header"><div class="flex items-center gap-md" style="width:100%" id="admin-header-inner"></div></header>
      <main class="admin-content" id="page-root"></main>
    </div>
  </div>

  <script src="${prefix}assets/js/utils.js"></script>
  <script src="${prefix}assets/js/data.js"></script>
  <script src="${prefix}assets/js/store.js"></script>
  <script src="${prefix}assets/js/db.js"></script>
  <script src="${prefix}assets/js/md.js"></script>
  <script src="${prefix}assets/js/theme.js"></script>
  <script src="${prefix}assets/js/fx.js"></script>
  <script src="${prefix}assets/js/admin.js"></script>
  <script src="${prefix}assets/js/admin-pages.js"></script>
</body>
</html>
`;
}

const pages = [
  // 作品
  ["admin/works/index.html", "works-list", "作品管理", "works"],
  ["admin/works/create.html", "work-form", "新建作品", "works"],
  ["admin/works/edit.html", "work-form", "编辑作品", "works"],
  // 项目
  ["admin/projects/index.html", "projects-list", "项目管理", "projects"],
  ["admin/projects/create.html", "project-form", "新建项目", "projects"],
  ["admin/projects/edit.html", "project-form", "编辑项目", "projects"],
  // 文章
  ["admin/articles/index.html", "articles-list", "文章管理", "articles"],
  ["admin/articles/create.html", "article-form", "新建文章", "articles"],
  ["admin/articles/edit.html", "article-form", "编辑文章", "articles"],
  // 媒体
  ["admin/media/index.html", "media-list", "媒体管理", ""],
  ["admin/media/upload.html", "media-upload", "文件上传", ""],
  // 设置
  ["admin/settings/index.html", "settings-site", "网站设置", ""],
  ["admin/settings/profile.html", "settings-profile", "个人资料", ""],
  ["admin/settings/seo.html", "settings-seo", "SEO 设置", ""],
  // 统计
  ["admin/statistics.html", "statistics", "数据统计", ""],
];

for (const [file, page, title, entity] of pages) {
  const p = path.join(root, file);
  const rel = path.relative(root, path.dirname(p)).replace(/\\/g, "/");
  mkdirSync(path.dirname(p), { recursive: true });
  writeFileSync(p, shell(rel, page, title, entity), "utf8");
  console.log("✓", file);
}
console.log("done");
