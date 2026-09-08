/* ============================================================
   星冕 VR3D — 种子内容数据（首次运行写入 localStorage，可被后台修改）
   ============================================================ */
(function (global) {
  "use strict";

  const IMG = "assets/images/";
  const WORKS = IMG + "works/";
  const PROJ = IMG + "projects/";
  const ART = IMG + "articles/";
  const GAL = IMG + "gallery/";
  const AVATAR = IMG + "avatar/avatar.svg";
  const BG = IMG + "backgrounds/";

  const today = () => new Date().toISOString().slice(0, 10);

  const works = [
    {
      id: "w1",
      title: "Cyber Bloom — 全息花朵动效",
      slug: "cyber-bloom",
      category: "AE",
      description: "用 After Effects 制作的赛博全息花朵生长动画，融合光效与粒子拖尾，探索霓虹美学与流体运动。",
      cover: WORKS + "w1.svg",
      images: [WORKS + "w1.svg", GAL + "g3.svg", GAL + "g5.svg"],
      videos: [],
      files: [
        { name: "cyber-bloom.aep", size: "86 MB", type: "aep" },
        { name: "cyber-bloom-preview.mp4", size: "24 MB", type: "video" },
      ],
      technologies: ["After Effects", "粒子系统", "光效合成"],
      tags: ["AE", "动画", "全息"],
      github: "",
      demo: "",
      created_at: "2026-08-20",
      updated_at: today(),
      published: true,
      featured: true,
      content:
        "## 项目简介\n\n《Cyber Bloom》是我在 After Effects 中完成的一段赛博全息花朵生长动画。\n\n## 设计概念\n\n以荧光粉紫为主色调，模拟全息投影的视觉质感，花朵从数据流中生长、绽放、消散。\n\n## 制作过程\n\n1. 使用形状图层搭建花瓣结构\n2. 用 CC Particle World 生成星光粒子\n3. 叠加 Glow 与色散营造全息感\n\n## 效果预览\n\n动画全长 12 秒，每秒 60 帧渲染。",
    },
    {
      id: "w2",
      title: "个人作品集网站 — Vue 3 重构",
      slug: "portfolio-vue3",
      category: "网站",
      description: "使用 Vue 3 + Vite 重构的个人作品集，引入 3D 悬浮卡片与暗色沉浸风格。",
      cover: WORKS + "w2.svg",
      images: [WORKS + "w2.svg", GAL + "g1.svg", GAL + "g4.svg"],
      videos: [],
      files: [
        { name: "portfolio-src.zip", size: "4.2 MB", type: "zip" },
        { name: "README.md", size: "8 KB", type: "md" },
      ],
      technologies: ["Vue 3", "TypeScript", "Vite", "CSS 3D"],
      tags: ["Vue", "JavaScript", "Web"],
      github: "https://github.com/xingmian",
      demo: "https://gigi.dev",
      created_at: "2026-07-12",
      updated_at: today(),
      published: true,
      featured: true,
      content:
        "## 项目简介\n\n个人作品集网站的 Vue 3 重构版本，重点优化了作品展示的沉浸感。\n\n## 技术亮点\n\n- Vue 3 组合式 API\n- CSS perspective 实现 3D 悬浮卡片\n- 暗 / 亮主题系统\n\n## 结构\n\n前台作品展示 + 后台内容管理（本地存储）。",
    },
    {
      id: "w3",
      title: "Python 数据分析小工具",
      slug: "python-data-tool",
      category: "Python",
      description: "一个用于处理 CSV 数据并自动生成图表的 Python 命令行小工具。",
      cover: WORKS + "w3.svg",
      images: [WORKS + "w3.svg"],
      videos: [],
      files: [
        { name: "data-tool.py", size: "12 KB", type: "py" },
        { name: "sample-data.csv", size: "240 KB", type: "src" },
      ],
      technologies: ["Python", "Pandas", "Matplotlib"],
      tags: ["Python", "编程"],
      github: "https://github.com/xingmian",
      demo: "",
      created_at: "2026-06-03",
      updated_at: today(),
      published: true,
      featured: false,
      content:
        "## 功能\n\n- 读取 CSV / Excel 数据\n- 自动清洗缺失值\n- 一键生成统计图表\n\n## 代码示例\n\n```python\nimport pandas as pd\n\ndf = pd.read_csv(\"data.csv\")\nprint(df.describe())\n```",
    },
    {
      id: "w4",
      title: "Blender 低多边形小岛",
      slug: "blender-lowpoly-island",
      category: "Blender",
      description: "使用 Blender 3D 完成的低多边形岛屿场景，包含材质、灯光与简易动画。",
      cover: WORKS + "w4.svg",
      images: [WORKS + "w4.svg", GAL + "g2.svg", GAL + "g6.svg"],
      videos: [{ name: "island-turn.mp4", url: "" }],
      files: [
        { name: "island.blend", size: "38 MB", type: "blend" },
      ],
      technologies: ["Blender", "低多边形", "渲染"],
      tags: ["Blender", "3D"],
      github: "",
      demo: "",
      created_at: "2026-05-18",
      updated_at: today(),
      published: true,
      featured: true,
      content:
        "## 场景介绍\n\n一座漂浮在云海之上的低多边形小岛，使用 Cycles 渲染。\n\n## 制作要点\n\n- 低多边形建模与拓扑\n- 程序化云海材质\n- 三点布光",
    },
    {
      id: "w5",
      title: "UI 设计 — 音乐播放器 App",
      slug: "ui-music-app",
      category: "UI设计",
      description: "一套现代极简风格的移动端音乐播放器 UI 设计稿，覆盖播放页、歌单与个人中心。",
      cover: WORKS + "w5.svg",
      images: [WORKS + "w5.svg", GAL + "g7.svg"],
      videos: [],
      files: [
        { name: "music-app.fig", size: "9 MB", type: "src" },
        { name: "design-spec.pdf", size: "2.1 MB", type: "pdf" },
      ],
      technologies: ["Figma", "UI/UX"],
      tags: ["UI", "Design"],
      github: "",
      demo: "",
      created_at: "2026-04-02",
      updated_at: today(),
      published: true,
      featured: false,
      content:
        "## 设计思路\n\n以「沉浸听歌」为核心，弱化控件视觉重量，让封面与歌词成为主角。\n\n## 页面清单\n\n- 播放页\n- 歌单页\n- 个人中心\n- 搜索页",
    },
    {
      id: "w6",
      title: "摄影 — 城市夜色系列",
      slug: "photography-city-night",
      category: "摄影",
      description: "一组城市夜景长曝光摄影作品，记录霓虹与车流的流动轨迹。",
      cover: WORKS + "w6.svg",
      images: [WORKS + "w6.svg", GAL + "g8.svg", GAL + "g9.svg"],
      videos: [],
      files: [],
      technologies: ["摄影", "长曝光", "Lightroom"],
      tags: ["摄影", "Design"],
      github: "",
      demo: "",
      created_at: "2026-03-15",
      updated_at: today(),
      published: true,
      featured: false,
      content:
        "## 系列说明\n\n在城市夜色的霓虹灯影之间，用长曝光记录光的轨迹。",
    },
  ];

  const projects = [
    {
      id: "p1",
      title: "星冕 VR3D 个人作品站",
      slug: "gigi-vr3d-website",
      description: "一个带 VR 3D 沉浸视觉系统的个人数字作品中心：前台 12 类页面 + 后台内容管理。",
      cover: PROJ + "p1.svg",
      screenshots: [PROJ + "p1.svg", GAL + "g1.svg", GAL + "g4.svg"],
      status: "进行中",
      technology: ["CSS 3D", "JavaScript", "Markdown"],
      github: "https://github.com/xingmian",
      demo: "",
      files: [],
      tags: ["Web", "Vue", "JavaScript"],
      start_date: "2026-07",
      end_date: "",
      created_at: "2026-08-01",
      published: true,
      content:
        "## 项目目标\n\n打造一个属于自己的个人数字作品中心，支持作品 / 项目 / 博客 / 媒体全流程管理。\n\n## 架构\n\nCSS 3D 构建空间感，DOM 负责交互，内容数据与后台 CRUD 本地持久化。\n\n## 开发过程\n\n1. 设计系统与 3D 视觉语言\n2. 前台页面与空间动效\n3. 后台内容管理",
    },
    {
      id: "p2",
      title: "数据可视化仪表盘",
      slug: "data-dashboard",
      description: "基于 Vue 3 + ECharts 的数据可视化仪表盘，支持多数据源接入与自定义看板。",
      cover: PROJ + "p2.svg",
      screenshots: [PROJ + "p2.svg", GAL + "g5.svg"],
      status: "已完成",
      technology: ["Vue 3", "ECharts", "TypeScript"],
      github: "",
      demo: "",
      files: [],
      tags: ["Vue", "JavaScript"],
      start_date: "2026-03",
      end_date: "2026-06",
      created_at: "2026-06-20",
      published: true,
      content:
        "## 项目目标\n\n为团队搭建统一的数据监控与可视化平台。\n\n## 功能\n\n- 多图表拖拽布局\n- 数据刷新与告警\n- 深色主题适配",
    },
    {
      id: "p3",
      title: "Blender 动画短片计划",
      slug: "blender-short-film",
      description: "使用 Blender 制作的 60 秒概念动画短片，探索低多边形风格叙事。",
      cover: PROJ + "p3.svg",
      screenshots: [PROJ + "p3.svg", GAL + "g2.svg", GAL + "g6.svg"],
      status: "规划中",
      technology: ["Blender", "AE"],
      github: "",
      demo: "",
      files: [],
      tags: ["Blender", "动画"],
      start_date: "2026-09",
      end_date: "",
      created_at: "2026-08-10",
      published: true,
      content:
        "## 概念\n\n一个关于「光与城市」的 60 秒动画短片。\n\n## 制作计划\n\n- 场景分镜\n- 低多边形建模\n- 动画与渲染\n- 后期合成",
    },
    {
      id: "p4",
      title: "Python 自动化脚本集",
      slug: "python-automation",
      description: "一套日常文件整理与网页抓取的 Python 自动化脚本集合。",
      cover: PROJ + "p4.svg",
      screenshots: [PROJ + "p4.svg"],
      status: "已完成",
      technology: ["Python", "Requests", "BeautifulSoup"],
      github: "https://github.com/xingmian",
      demo: "",
      files: [],
      tags: ["Python", "编程"],
      start_date: "2025-11",
      end_date: "2026-01",
      created_at: "2026-01-10",
      published: true,
      content:
        "## 脚本清单\n\n- 下载目录自动归档\n- 定时新闻抓取推送\n- 批量图片压缩",
    },
  ];

  const articles = [
    {
      id: "a1",
      title: "用 CSS 3D 打造沉浸式个人主页",
      slug: "css3d-immersive-homepage",
      description: "不依赖 WebGL，仅用 CSS perspective 与 translateZ，就能让网页产生 VR 空间感。本文记录核心思路。",
      cover: ART + "a1.svg",
      category: "前端",
      tags: ["CSS", "3D", "Web"],
      author: "星冕",
      created_at: "2026-09-05",
      updated_at: today(),
      published: true,
      content: `---
空间感的本质，是**层次**。
---

在传统网页中，所有元素都在同一个平面。而 CSS 3D 让我们可以沿 Z 轴摆放内容，产生"镜头进入空间"的感受。

## 第一步：建立透视

\`\`\`css
.scene3d {
  perspective: 1400px;
}
\`\`\`

透视值越小，空间感越强，但也更容易晕。推荐 1200 ~ 1600px。

## 第二步：让卡片悬浮

\`\`\`css
.work-card3d {
  transform-style: preserve-3d;
}
.work-card3d .title-layer {
  transform: translateZ(40px);
}
\`\`\`

这样标题就会"浮"在卡片上方，鼠标移动时产生视差。

## 第三步：镜头切换

点击卡片 → 从点击位置展开一个圆形遮罩 → 放大到全屏 → 进入新页面。这就是最朴素的"镜头推进"。

> 注意：动效是为了增强空间感，而不是炫技。流畅度永远优先于复杂度。

## 小结

| 技术 | 用途 |
| --- | --- |
| perspective | 建立 3D 视口 |
| preserve-3d | 保留子元素 3D |
| translateZ | Z 轴深度分层 |
| backdrop-filter | 玻璃拟态 |

对性能敏感时，记得监听 \`prefers-reduced-motion\`，为偏好减弱动效的用户降级。`,
    },
    {
      id: "a2",
      title: "Python 学习笔记：从数据清洗到可视化",
      slug: "python-data-notes",
      description: "记录 Pandas 数据处理与 Matplotlib 绘图过程中的常用套路与踩坑经验。",
      cover: ART + "a2.svg",
      category: "技术",
      tags: ["Python", "编程"],
      author: "星冕",
      created_at: "2026-08-18",
      updated_at: today(),
      published: true,
      content: `## 前言

数据工作里，80% 的时间花在**清洗**上。

## 常用清洗套路

\`\`\`python
import pandas as pd

df = pd.read_csv("data.csv")

# 缺失值
df = df.dropna(subset=["关键列"])

# 类型转换
df["日期"] = pd.to_datetime(df["日期"])

# 去重
df = df.drop_duplicates()
\`\`\`

## 快速出图

\`\`\`python
import matplotlib.pyplot as plt

df.groupby("类别")["金额"].sum().plot(kind="bar")
plt.tight_layout()
plt.savefig("out.png", dpi=150)
\`\`\`

## 踩过的坑

1. **读 Excel 慢**：大文件优先用 \`read_csv\`
2. **中文乱码**：指定 \`encoding="utf-8-sig"\`
3. **时区**：统一转 UTC 再比较

> 数据可视化前，先确认数据是可解释的。

## 总结

工具会变，但「先看结构 → 再清洗 → 再分析」的流程不会变。`,
    },
    {
      id: "a3",
      title: "Vue 3 组合式 API 实践记录",
      slug: "vue3-composition-practice",
      description: "从 Options API 迁移到 Composition API 的实践记录，以及几个实用的自定义 Hook。",
      cover: ART + "a3.svg",
      category: "前端",
      tags: ["Vue", "JavaScript"],
      author: "星冕",
      created_at: "2026-07-30",
      updated_at: today(),
      published: true,
      content: `## 为什么迁移

当组件逻辑超过一屏，Options API 的代码会被拆散到多个 option 里，难以维护。组合式 API 让**相关逻辑聚在一起**。

## 一个简单的 Hook

\`\`\`js
import { ref, onMounted, onUnmounted } from "vue";

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function move(e) {
    x.value = e.clientX;
    y.value = e.clientY;
  }

  onMounted(() => window.addEventListener("mousemove", move));
  onUnmounted(() => window.removeEventListener("mousemove", move));

  return { x, y };
}
\`\`\`

## 组织代码的经验

- 用 \`computed\` 派生状态，少写同步逻辑
- 大段副作用抽成 Hook
- watch 里只放「响应副作用」，别放「主动触发」

## 小结

组合式 API 不是银弹，但它让代码的**呼吸感**更好。`,
    },
    {
      id: "a4",
      title: "Blender 低多边形工作流分享",
      slug: "blender-lowpoly-workflow",
      description: "分享我常用的低多边形建模、材质与灯光工作流，以及提速的小技巧。",
      cover: ART + "a4.svg",
      category: "3D",
      tags: ["Blender", "3D"],
      author: "星冕",
      created_at: "2026-06-22",
      updated_at: today(),
      published: true,
      content: `## 为什么喜欢低多边形

低多边形不等于粗糙。它是**用最少的几何，表达清晰的形**。

## 工作流

1. 参考图 → 灰模（\`Shift+A\` 添加基础体）
2. 卡线 + 挤出塑造结构
3. 材质：单色 + 轻微粗糙度变化
4. 灯光：三点布光，加一个背光轮廓

## 提速技巧

- 用 \`Alt+Click\` 快速循环选择
- \`Ctrl+R\` 环切后配合 \`G\` 拉形
- 视图着色改为 MatCap，实时看光影

## 渲染

Cycles 渲染 + 简单后期（调色、暗角、颗粒），就能获得不错的质感。`,
    },
  ];

  const gallery = [
    { id: "g1", src: GAL + "g1.svg", title: "霓虹数据流", cat: "设计", type: "image", date: "2026-08" },
    { id: "g2", src: GAL + "g2.svg", title: "悬浮小岛", cat: "3D", type: "image", date: "2026-07" },
    { id: "g3", src: GAL + "g3.svg", title: "全息花朵", cat: "动画", type: "image", date: "2026-08" },
    { id: "g4", src: GAL + "g4.svg", title: "代码宇宙", cat: "设计", type: "image", date: "2026-06" },
    { id: "g5", src: GAL + "g5.svg", title: "粒子漩涡", cat: "动画", type: "image", date: "2026-05" },
    { id: "g6", src: GAL + "g6.svg", title: "极光山谷", cat: "3D", type: "image", date: "2026-04" },
    { id: "g7", src: GAL + "g7.svg", title: "界面草图", cat: "UI", type: "image", date: "2026-03" },
    { id: "g8", src: GAL + "g8.svg", title: "城市夜景", cat: "摄影", type: "image", date: "2026-02" },
    { id: "g9", src: GAL + "g9.svg", title: "霓虹街角", cat: "摄影", type: "image", date: "2026-01" },
  ];

  const videos = [
    {
      id: "v1",
      title: "Cyber Bloom 全息花朵 · 预览",
      category: "AE",
      description: "全息花朵动画的 12 秒预览，粒子与光效合成。",
      cover: WORKS + "w1.svg",
      date: "2026-08",
      videoUrl: "",
      poster: WORKS + "w1.svg",
    },
    {
      id: "v2",
      title: "低多边形小岛 · 环绕展示",
      category: "Blender",
      description: "Blender 场景环绕展示动画。",
      cover: WORKS + "w4.svg",
      date: "2026-05",
      videoUrl: "",
      poster: WORKS + "w4.svg",
    },
  ];

  const skills = [
    {
      group: "Programming",
      items: [
        { name: "Python", pct: 88 },
        { name: "JavaScript", pct: 85 },
        { name: "TypeScript", pct: 72 },
        { name: "Vue", pct: 80 },
        { name: "HTML / CSS", pct: 92 },
      ],
    },
    {
      group: "Design",
      items: [
        { name: "Photoshop", pct: 82 },
        { name: "After Effects", pct: 78 },
        { name: "Blender", pct: 74 },
        { name: "Figma", pct: 84 },
        { name: "UI/UX", pct: 76 },
      ],
    },
    {
      group: "Tools",
      items: [
        { name: "Git", pct: 86 },
        { name: "VS Code", pct: 95 },
        { name: "Docker", pct: 60 },
        { name: "Node.js", pct: 70 },
      ],
    },
  ];

  const timeline = [
    {
      year: "2026",
      items: [
        { title: "个人网站 VR3D 重构", desc: "CSS 3D 沉浸式展厅 + 内容管理系统" },
        { title: "Python 数据分析工具", desc: "命令行数据清洗与可视化" },
        { title: "AE 全息动画系列", desc: "Cyber Bloom 等霓虹动效作品" },
        { title: "Blender 低多边形场景", desc: "小岛 / 山谷系列场景" },
      ],
    },
    {
      year: "2025",
      items: [
        { title: "项目 A — 数据可视化仪表盘", desc: "Vue 3 + ECharts" },
        { title: "项目 B — UI 设计系统", desc: "Figma 组件库与设计规范" },
      ],
    },
  ];

  const profile = {
    avatar: AVATAR,
    name: "星冕",
    title: "Creator / Developer / Designer",
    tagline: "用代码、设计和创意记录我的创作过程。",
    bio: "你好，我是星冕。一名喜欢把想法变成作品的全栈向创作者 —— 写 Python 与前端，也做 AE 动效与 Blender 3D。这个网站是我的个人数字作品中心：作品、项目、技术博客与媒体档案都会沉淀在这里。",
    location: "中国",
    email: "hello@xingmian.dev",
    social: {
      github: "https://github.com/xingmian",
      instagram: "https://instagram.com/gigi",
      youtube: "https://youtube.com/@xingmian",
      bilibili: "https://space.bilibili.com/xingmian",
      twitter: "",
    },
    experience: [
      { role: "独立创作者", org: "星冕 Studio", range: "2024 — 至今" },
      { role: "前端开发", org: "某科技公司", range: "2022 — 2024" },
    ],
    skills,
    timeline,
  };

  const settings = {
    siteName: "星冕.",
    siteTitle: "星冕 Personal Digital Studio",
    siteDesc: "星冕 的个人数字作品中心 — 作品 / 项目 / 博客 / 媒体。",
    keywords: "星冕, portfolio, 作品集, 前端, Python, Blender, AE",
    theme: "dark", // dark | light | system
    reduceMotion: false,
    accent: "neon",
    footerText: "Creating things with code, design and imagination.",
    copyright: "© 2026 星冕. All Rights Reserved.",
    adminUser: "admin",
    adminPass: "gigi123",
    seo: {
      ogTitle: "星冕 Personal Digital Studio",
      ogDesc: "一个属于自己的个人数字作品中心。",
      ogImage: AVATAR,
      robots: "index, follow",
      sitemapEnabled: true,
    },
  };

  const statistics = {
    // 模拟访问统计（后台“数据统计”展示用）
    daily: { "2026-09-01": 320, "2026-09-02": 402, "2026-09-03": 288, "2026-09-04": 456, "2026-09-05": 520, "2026-09-06": 610, "2026-09-07": 486 },
    viewsTotal: 28430,
    visitorsTotal: 15203,
    sources: [
      { label: "直接访问", value: 46 },
      { label: "搜索引擎", value: 28 },
      { label: "社交媒体", value: 18 },
      { label: "外链", value: 8 },
    ],
    devices: [
      { label: "桌面端", value: 64 },
      { label: "移动端", value: 36 },
    ],
  };

  global.XINGMIAN_DATA = {
    works,
    projects,
    articles,
    gallery,
    videos,
    profile,
    settings,
    statistics,
    categories: {
      works: ["全部", "UI设计", "网站", "Python", "JavaScript", "Vue", "AE", "Blender", "视频", "摄影", "其他"],
      projects: ["全部", "Web", "Python", "3D", "设计"],
      articles: ["全部", "前端", "技术", "3D", "设计"],
      gallery: ["全部", "图片", "设计", "动画", "视频"],
    },
  };
})(window);
