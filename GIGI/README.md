# 星冕 VR3D 个人作品展示网站

> 依据《星冕_VR3D_个人作品展示网站_设计方案 V2.0》构建的**纯前端完整版**。
> 定位：**星冕 PERSONAL DIGITAL STUDIO** —— 个人数字作品中心。

## ✨ 特性

- **🌌 沉浸版首页（Three.js WebGL 环绕展厅）**：参考桌面 gerenwang 站点 3D 动态升级 —— 「戴上 VR 眼镜」开场仪式、可**拖拽环视 / 滚轮缩放 / 触屏双指**的 3D 空间、程序化星空球壳 + 星云 + 漂浮尘埃 + 流星彩蛋、中央光核大厅与五个环绕**分区光柱灯塔**（作品/项目/文章/关于/联系），点击灯塔或顶部导航 → **相机镜头飞行推进** → 打开**全息内容窗口**（数据读取 localStorage，与后台联动）；含罗盘 HUD 指示分区方位、氛围切换（夜色/黄昏/晨光/白昼）、安静模式、自动缓转、全屏；Three.js 本地 vendor、零 CDN。
- **📄 经典滚动版首页**：保留原 CSS 3D 视差展厅（`pages/classic-home.html`），沉浸版内可一键切换。
- **VR 3D 沉浸视觉系统（经典版）**：CSS perspective + translateZ 空间分层、星空粒子、透视网格地平线、3D 悬浮作品卡片、镜头式页面切换、鼠标视差。
- **前台 12 类页面**：首页 / 作品 / 作品详情 / 项目 / 项目详情 / 文章 / 文章详情 / 媒体画廊 / 视频 / 关于 / 联系 / 搜索。
- **后台管理系统**（纯前端 + localStorage 持久化）：登录 / Dashboard / 作品·项目·文章 CRUD / Markdown 编辑器（实时预览）/ 媒体管理 / 拖拽上传 / 网站设置 / 个人资料 / SEO / 数据统计。
- **暗 / 亮 / 跟随系统** 三种主题；**响应式**（1920 → 375px）；**零依赖**、可离线运行。
- 种子内容：作品、项目、Markdown 文章、画廊、视频、个人资料、统计样例。

## 🚀 运行方式（任选其一）

### 方式一：本地静态服务器（推荐）

```bash
# 需要 Node.js（自带 server.js，无任何依赖）
node server.js
# 打开 http://localhost:8080
```

也可以使用任意静态服务器（如 `python -m http.server 8080`）。

### 方式二：直接双击 index.html

- **沉浸版首页（index.html）** 依赖 ES Module + WebGL，请通过本地静态服务器访问；
- 经典滚动版（`pages/classic-home.html`）可离线双击打开（浏览器 localStorage 作数据层）。个别浏览器对 `file://` 本地存储有限制，若后台保存不生效请使用方式一。

## 🔑 后台入口

- 地址：`/admin/login.html`（沉浸页右上与经典首页底部均有入口）
- 演示账号 / 密码：`admin` / `gigi123`（可在后台「网站设置」中修改）

## 🗂 目录结构

```text
.
├── index.html           首页（Three.js 沉浸环绕展厅）
├── pages/
│   ├── classic-home.html 经典滚动版首页（CSS 3D 视差展厅）
│   ├── works.html …      其余前台页面
├── admin/               后台管理页面
├── assets/
│   ├── css/             设计系统（tokens/global/vr3d/…）
│   ├── js/              引擎与页面逻辑
│   ├── images/          SVG 占位封面（可用后台替换为自己的图）
│   └── icons/
├── content/articles/    Markdown 文章归档（示例）
├── uploads/             上传目录（演示环境文件存于浏览器本地存储）
├── scripts/             一次性资源生成脚本（node scripts/*.mjs）
├── server.js            零依赖静态服务器
├── robots.txt / sitemap.xml / README.md
└── 星冕_VR3D_个人作品展示网站_设计方案.md
```

## ⚙️ 说明与限制（纯前端版）

1. **数据持久化**：内容存于浏览器 `localStorage`（键前缀 `xingmian_`）。换浏览器 / 清缓存会重置为种子内容。
2. **文件上传**：纯前端无法写磁盘；小于 1.2MB 的图片会转 DataURL 存入本地，其余文件仅记录元数据（演示交互）。接入真实后端后替换 `assets/js/store.js` / `admin-pages.js` 的上传逻辑即可。
3. **Markdown 编辑器**：内置零依赖渲染器（标题 / 表格 / 代码块高亮 / 引用等）。
4. 生产部署建议按设计方案第六十章的 Phase 5-6 接入后端（Node/Express + SQLite）与真实域名/HTTPS。

## 🎨 视觉还原要点

| 方案章节 | 落地位置 |
| --- | --- |
| §3.5 环绕沉浸展厅（参考 gerenwang 站） | `index.html` + `assets/js/scene3d.js` / `home3d.js` / `assets/css/immersive.css` |
| §3.5 星空/网格/视差/3D 卡片/镜头切换/沉浸模式 | `assets/css/vr3d.css` + `assets/js/fx.js` |
| §3.5.7 首页展厅布局（经典滚动版） | `pages/classic-home.html` + `assets/css/home.css` |
| §5 双主题色板 | `assets/css/tokens.css`（`data-theme`） |
| §3.5.4 3D 卡片 hover 效果 | `.work-card3d` 系列 |
| §8~30 前台页面 | `pages/*.html` + `assets/js/app.js`（按 `data-page` 路由） |
| §32~44 后台页面 | `admin/*.html` + `assets/js/admin-pages.js` |
