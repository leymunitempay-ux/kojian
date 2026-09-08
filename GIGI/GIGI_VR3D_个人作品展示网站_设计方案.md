# GIGI 个人作品展示网站
## 完整设计方案与 HTML 页面层级划分

> 项目名称：GIGI Personal Portfolio  
> 项目定位：个人作品集 + 项目展示 + Markdown 博客 + 媒体中心 + 内容管理后台  
> 文档版本：V2.0 — VR 3D 沉浸式设计  
> 创建时间：2026-09-08

---

# 一、项目概述

本项目用于搭建一个属于个人的独立作品展示网站。

网站不仅用于展示个人信息，还需要支持：

- 上传个人作品
- 上传图片
- 上传视频
- 上传 PDF
- 上传项目文件
- 发布 Markdown 文章
- 创建项目
- 展示项目开发过程
- 展示设计作品
- 展示代码作品
- 管理个人资料
- 管理网站内容
- 搜索作品和文章
- 标签分类
- 暗色/亮色主题
- 响应式布局
- 后台内容管理

最终目标：

> 打造一个属于自己的「个人数字作品中心」。

---

# 二、网站定位

网站整体可以理解为：

```text
个人主页
    +
作品集
    +
项目展示
    +
博客
    +
媒体画廊
    +
文件中心
    +
内容管理后台
```

网站不是普通的个人介绍网站，而是一个可以长期维护的个人数字空间。

---

# 三、整体视觉风格

## 3.1 设计关键词

```text
Modern
Minimal
Creative
Premium
Technology
Personal
```

中文：

```text
现代
极简
高级
科技
创意
个人化
```

---

# 三点五、VR 眼镜式 3D 沉浸视觉系统

> 核心方向：网站不是传统的“平面网页”，而是让用户产生“戴上 VR 眼镜进入个人数字空间”的感觉。整体采用 **3D 空间、景深、透视、悬浮层、镜头运动、空间卡片** 构建沉浸式个人作品展厅。

## 3.5.1 核心视觉概念

```text
用户打开网站
      ↓
进入 3D 数字空间
      ↓
首页像一个虚拟展厅
      ↓
作品卡片悬浮在不同 Z 轴深度
      ↓
鼠标移动 = 视角轻微移动
滚轮滚动 = 穿越空间
点击作品 = 镜头推进
      ↓
进入作品详情的“空间房间”
```

设计关键词：

```text
VR / Immersive / Spatial / 3D / Depth / Holographic
沉浸 / 空间 / 景深 / 悬浮 / 透视 / 数字展厅 / 科技感
```

## 3.5.2 页面空间结构

页面不再只使用二维 X/Y 布局，而是加入 Z 轴：

```text
                    Z+ 远景
                     ↑
             背景粒子 / 星云 / 环境
                     │
             ┌──────────────┐
             │   作品层      │  ← Z: -200
             └──────────────┘
                     │
          ┌────────────────────┐
          │    主视觉作品       │  ← Z: 0
          └────────────────────┘
                     │
              用户交互层        ← Z: +100
                     │
                  镜头
```

## 3.5.3 VR 视差效果

桌面端通过鼠标移动模拟头部转动：

```text
鼠标向左移动
→ 背景向右产生轻微位移
→ 中景缓慢移动
→ 前景作品卡片移动幅度更大
→ 形成 Parallax 视差
```

建议参数：

```text
背景层：1x
中景层：3x
作品层：6x
前景装饰：10x

最大旋转：X ±4°
最大旋转：Y ±6°
缩放：0.98 ~ 1.04
过渡：0.4s ~ 0.8s
Easing：cubic-bezier / ease-out
```

## 3.5.4 3D 卡片

所有核心作品卡片建议采用真正的 3D Transform：

```css
.work-card {
    transform-style: preserve-3d;
    perspective: 1200px;
    transition: transform 0.6s cubic-bezier(.2,.8,.2,1);
}

.work-card:hover {
    transform: rotateX(3deg) rotateY(-5deg) translateZ(30px);
}
```

卡片内部继续分层：

```text
Card
├── Cover Image       Z: 0
├── Gradient Layer    Z: 10
├── Title             Z: 20
├── Tags              Z: 25
└── Floating Icon     Z: 40
```

## 3.5.5 玻璃拟态 + 全息效果

作品卡片可以采用轻量玻璃材质：

```text
半透明
Blur
细边框
柔和高光
内阴影
环境反射
```

但必须控制使用比例，避免整个网站变成“玻璃卡片堆叠”。核心作品、导航和关键数据使用即可。

## 3.5.6 VR 镜头式页面切换

传统页面：

```text
A 页面 → Fade → B 页面
```

本网站：

```text
A 页面
  ↓
镜头锁定作品
  ↓
作品放大
  ↓
背景产生景深
  ↓
镜头向 Z 轴推进
  ↓
进入 B 页面
```

推荐过渡时间：

```text
普通导航：500 ~ 700ms
作品进入：700 ~ 1200ms
大型场景切换：1000 ~ 1600ms
```

## 3.5.7 首页：3D 虚拟展厅

首页不建议直接使用普通 Hero Banner，而是设计成“数字展厅入口”：

```text
┌─────────────────────────────────────────┐
│ GIGI.                         MENU      │
│                                         │
│             GIGI DIGITAL STUDIO        │
│                                         │
│       我的作品 / 我的项目 / 我的世界     │
│                                         │
│       [ ENTER EXPERIENCE ]              │
│                                         │
│       作品卡片  ↗      作品卡片 ↖        │
│             作品卡片                     │
│                                         │
│        Scroll / Move to Explore        │
└─────────────────────────────────────────┘
```

## 3.5.8 3D 首页 HTML 层级

```html
<div class="vr-world">
    <div class="vr-background"></div>
    <div class="vr-grid"></div>
    <div class="vr-particles"></div>

    <header class="vr-header">
        <div class="logo">GIGI.</div>
        <nav class="vr-navigation"></nav>
    </header>

    <main class="vr-stage">
        <section class="vr-hero">
            <div class="hero-depth-layer"></div>
            <div class="hero-content"></div>
            <div class="hero-floating-object"></div>
        </section>

        <section class="spatial-works">
            <article class="work-card work-card--left"></article>
            <article class="work-card work-card--center"></article>
            <article class="work-card work-card--right"></article>
        </section>
    </main>

    <div class="vr-cursor"></div>
    <div class="depth-indicator"></div>
</div>
```

## 3.5.9 作品详情：进入“虚拟房间”

点击作品后，用户不是简单进入一个新的白色页面，而是进入对应作品的空间：

```text
作品封面
   ↓
镜头推进
   ↓
作品放大
   ↓
进入 Project Room
   ↓
┌───────────────────────────┐
│ 项目标题                   │
│                           │
│      大型作品展示          │
│                           │
│   项目介绍   技术栈        │
│                           │
│   图片 / 视频 / 文件       │
└───────────────────────────┘
```

## 3.5.10 空间背景

建议准备多套可切换空间主题：

```text
01 / Dark Space
黑色数字空间 + 微弱星点

02 / Digital Gallery
极简白色展厅 + 浮动作品

03 / Cyber Studio
深色 + 网格 + 全息光效

04 / Creative Room
柔和灰白 + 作品墙
```

后台可以增加：

```text
首页场景：Dark Space
作品页场景：Digital Gallery
项目页场景：Cyber Studio
```

## 3.5.11 3D 动效原则

3D 是为了增强“空间感”，不是为了炫技。

必须遵循：

```text
空间感 > 特效数量
流畅度 > 复杂度
内容 > 装饰
交互反馈 > 自动播放
```

避免：

```text
× 页面持续剧烈旋转
× 大量 WebGL 特效
× 过度粒子
× 无限滚动造成眩晕
× 所有元素都漂浮
```

## 3.5.12 技术实现建议

第一阶段优先使用浏览器原生能力：

```text
CSS perspective
CSS transform-style: preserve-3d
CSS translateZ
CSS rotateX / rotateY
backdrop-filter
requestAnimationFrame
```

第二阶段再加入：

```text
Three.js
WebGL
GLSL Shader
3D Model
Post Processing
```

推荐架构：

```text
Vue 3
  │
  ├── CSS 3D / DOM 交互
  │
  ├── Three.js 3D 场景
  │
  └── GSAP 页面动画
```

## 3.5.13 性能策略

为了保证普通电脑也能流畅运行：

```text
默认：CSS 3D
高级设备：Three.js
低性能设备：降低粒子数量
移动端：关闭复杂 WebGL
用户开启“减少动态效果”：降低动画
```

建议目标：

```text
桌面端：60 FPS
移动端：30~60 FPS
首屏加载：尽量控制资源体积
3D 模型：按需加载
图片：WebP / AVIF
视频：懒加载
```

## 3.5.14 沉浸模式

首页增加：

```text
[ ENTER IMMERSIVE MODE ]
```

进入后：

```text
隐藏浏览器式多余视觉元素
扩大 3D 舞台
增强景深
启用空间鼠标跟随
启用镜头推进
```

同时保留明确的“退出沉浸模式”按钮，避免用户迷失。

---

---

# 四、视觉设计

## 4.1 页面整体感觉

网站采用：

- 大面积留白
- 大标题
- 简洁卡片
- 细边框
- 柔和阴影
- 微渐变
- 圆角
- 图片展示
- 微动画
- 流畅过渡

避免：

- 过多颜色
- 过多动画
- 复杂背景
- 花哨装饰
- 信息堆叠

---

# 五、颜色方案

## 5.1 Light Mode

```text
背景：#F7F7F5
卡片：#FFFFFF
主文字：#111111
辅助文字：#666666
边框：#E5E5E5
主要强调色：#111111
```

## 5.2 Dark Mode

```text
背景：#0B0B0D
卡片：#151518
主文字：#FFFFFF
辅助文字：#999999
边框：#29292D
强调色：#FFFFFF
```

---

# 六、字体

建议：

```text
中文：
Noto Sans SC
思源黑体

英文：
Inter
Helvetica
Arial
```

标题：

```text
font-weight: 600 ~ 800
```

正文：

```text
font-weight: 400
```

---

# 七、网站整体页面

网站分成两个部分：

```text
网站
│
├── 前台
│
└── 后台管理系统
```

---

# 八、前台页面

```text
01 首页
02 作品集
03 作品详情
04 项目
05 项目详情
06 文章
07 文章详情
08 媒体画廊
09 视频
10 关于我
11 联系我
12 搜索
```

---

# 九、后台页面

```text
01 登录
02 Dashboard
03 作品管理
04 创建作品
05 编辑作品
06 项目管理
07 创建项目
08 编辑项目
09 文章管理
10 Markdown编辑器
11 媒体管理
12 文件上传
13 网站设置
14 个人资料
15 SEO设置
16 数据统计
```

---

# 十、网站整体 HTML 层级

```text
Website
│
├── Header
│
├── Main
│   │
│   ├── Home
│   ├── Works
│   ├── Projects
│   ├── Articles
│   ├── Gallery
│   ├── About
│   ├── Contact
│   └── Search
│
└── Footer
```

---

# 十一、推荐项目目录

```text
personal-website/
│
├── index.html
│
├── pages/
│   ├── works.html
│   ├── work-detail.html
│   ├── projects.html
│   ├── project-detail.html
│   ├── articles.html
│   ├── article-detail.html
│   ├── gallery.html
│   ├── videos.html
│   ├── about.html
│   ├── contact.html
│   └── search.html
│
├── admin/
│   ├── login.html
│   ├── index.html
│   │
│   ├── works/
│   │   ├── index.html
│   │   ├── create.html
│   │   └── edit.html
│   │
│   ├── projects/
│   │   ├── index.html
│   │   ├── create.html
│   │   └── edit.html
│   │
│   ├── articles/
│   │   ├── index.html
│   │   ├── create.html
│   │   └── edit.html
│   │
│   ├── media/
│   │   ├── index.html
│   │   └── upload.html
│   │
│   ├── settings/
│   │   ├── index.html
│   │   ├── profile.html
│   │   └── seo.html
│   │
│   └── statistics.html
│
├── assets/
│   ├── css/
│   │   ├── reset.css
│   │   ├── global.css
│   │   ├── header.css
│   │   ├── footer.css
│   │   ├── home.css
│   │   ├── works.css
│   │   ├── projects.css
│   │   ├── articles.css
│   │   ├── gallery.css
│   │   ├── about.css
│   │   ├── admin.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── main.js
│   │   ├── navigation.js
│   │   ├── theme.js
│   │   ├── search.js
│   │   ├── gallery.js
│   │   ├── markdown.js
│   │   └── upload.js
│   │
│   ├── images/
│   │   ├── avatar/
│   │   ├── works/
│   │   ├── projects/
│   │   ├── articles/
│   │   └── backgrounds/
│   │
│   ├── icons/
│   └── fonts/
│
├── content/
│   ├── articles/
│   └── projects/
│
├── uploads/
│   ├── images/
│   ├── videos/
│   ├── documents/
│   └── files/
│
└── README.md
```

---

# 十二、Header 设计

所有前台页面使用统一 Header。

```text
Header
│
├── Logo
├── Navigation
│   ├── 首页
│   ├── 作品
│   ├── 项目
│   ├── 文章
│   ├── 媒体
│   ├── 关于
│   └── 联系
├── Search
├── Language
├── Theme
└── Mobile Menu
```

HTML：

```html
<header class="site-header">
    <div class="header-container">

        <a href="/" class="logo">
            GIGI.
        </a>

        <nav class="main-nav">
            <a href="/">首页</a>
            <a href="/pages/works.html">作品</a>
            <a href="/pages/projects.html">项目</a>
            <a href="/pages/articles.html">文章</a>
            <a href="/pages/gallery.html">媒体</a>
            <a href="/pages/about.html">关于</a>
            <a href="/pages/contact.html">联系</a>
        </nav>

        <div class="header-actions">
            <button class="search-button">Search</button>
            <button class="theme-button">☾</button>
            <button class="menu-button">☰</button>
        </div>

    </div>
</header>
```

---

# 十三、首页设计

首页文件：

```text
index.html
```

首页结构：

```text
Home
│
├── Header
├── Hero
├── Featured Works
├── Latest Projects
├── Latest Articles
├── About Preview
├── Skills
├── Contact
└── Footer
```

---

# 十四、Hero 首屏

```text
┌──────────────────────────────────────────┐
│ GIGI.                    Works About ☾  │
│                                          │
│              HI, I'M GIGI               │
│                                          │
│       Creator / Developer / Designer     │
│                                          │
│   用代码、设计和创意记录我的创作过程。     │
│                                          │
│       [ 查看作品 ]   [ 关于我 ]           │
└──────────────────────────────────────────┘
```

HTML：

```html
<section class="hero">
    <div class="hero-content">

        <span class="hero-label">
            CREATOR · DEVELOPER · DESIGNER
        </span>

        <h1>
            Hi, I'm Gigi.
        </h1>

        <p>
            用代码、设计和创意记录我的创作过程。
        </p>

        <div class="hero-actions">
            <a href="/pages/works.html">查看作品</a>
            <a href="/pages/about.html">关于我</a>
        </div>

    </div>
</section>
```

---

# 十五、精选作品

```text
Featured Works
│
├── Work Card
├── Work Card
├── Work Card
└── View All
```

作品卡片：

```text
Work Card
│
├── Cover
├── Category
├── Title
├── Description
├── Tags
└── View
```

---

# 十六、作品集页面

文件：

```text
pages/works.html
```

结构：

```text
Works
│
├── Header
├── Page Hero
├── Search
├── Category Filter
├── Tag Filter
├── Works Grid
├── Pagination
└── Footer
```

分类：

```text
全部
UI设计
网站
Python
JavaScript
Vue
AE
Blender
视频
摄影
其他
```

---

# 十七、作品详情页

文件：

```text
pages/work-detail.html
```

结构：

```text
Work Detail
│
├── Breadcrumb
├── Work Header
│   ├── Category
│   ├── Title
│   ├── Description
│   ├── Date
│   └── Tags
├── Cover
├── Project Introduction
├── Design Concept
├── Development Process
├── Gallery
├── Video
├── Technology
├── Files
├── Project Links
└── Related Works
```

---

# 十八、项目页面

文件：

```text
pages/projects.html
```

结构：

```text
Projects
│
├── Header
├── Page Hero
├── Filter
├── Project Grid
│   ├── Project Card
│   ├── Project Card
│   └── Project Card
├── Pagination
└── Footer
```

---

# 十九、项目详情页

文件：

```text
pages/project-detail.html
```

结构：

```text
Project Detail
│
├── Project Header
├── Project Cover
├── Introduction
├── Project Goals
├── Technology
├── Architecture
├── Development Process
├── Screenshots
├── Demo
├── GitHub
├── Download
└── Related Projects
```

---

# 二十、文章页面

文件：

```text
pages/articles.html
```

结构：

```text
Articles
│
├── Header
├── Page Hero
├── Search
├── Category
├── Tags
├── Article List
├── Pagination
└── Footer
```

文章卡片：

```text
Article Card
│
├── Cover
├── Category
├── Title
├── Description
├── Date
├── Reading Time
└── Read More
```

---

# 二十一、文章详情页

文件：

```text
pages/article-detail.html
```

结构：

```text
Article Detail
│
├── Header
├── Article Header
│   ├── Category
│   ├── Title
│   ├── Description
│   ├── Date
│   ├── Reading Time
│   └── Tags
├── Article Layout
│   ├── Article Content
│   └── Table Of Contents
├── Previous Article
├── Next Article
├── Related Articles
└── Footer
```

---

# 二十二、Markdown 系统

文章采用 Markdown。

目录：

```text
content/
└── articles/
    ├── python.md
    ├── vue.md
    ├── blender.md
    └── design.md
```

Markdown 格式：

```markdown
---
title: Python学习笔记
description: 我的Python学习记录
category: 技术
tags:
  - Python
  - 编程
cover: /assets/images/articles/python.jpg
date: 2026-09-08
---

# Python学习笔记

## 前言

这里记录我的Python学习过程。

## Python代码

```python
print("Hello World")
```

## 总结

记录学习成果。
```

---

# 二十三、Markdown 支持功能

支持：

```text
H1
H2
H3

粗体
斜体
引用
列表
表格
图片
视频
代码块
链接
LaTeX
HTML
```

代码高亮支持：

```text
Python
JavaScript
TypeScript
HTML
CSS
Vue
JSON
Bash
SQL
C++
Java
```

---

# 二十四、媒体画廊

文件：

```text
pages/gallery.html
```

结构：

```text
Gallery
│
├── Header
├── Page Hero
├── Category
│   ├── 全部
│   ├── 图片
│   ├── 设计
│   ├── 动画
│   └── 视频
├── Masonry Gallery
└── Footer
```

图片点击后：

```text
Lightbox
│
├── Previous
├── Image
├── Next
├── Zoom
└── Close
```

---

# 二十五、视频页面

文件：

```text
pages/videos.html
```

支持：

```text
MP4
WebM
MOV
```

视频卡片：

```text
Video Card
│
├── Thumbnail
├── Play Button
├── Title
├── Category
├── Description
└── Date
```

视频默认在网站内部播放。

---

# 二十六、关于我

文件：

```text
pages/about.html
```

页面：

```text
About
│
├── Profile
│   ├── Avatar
│   ├── Name
│   └── Introduction
├── About Me
├── Skills
├── Experience
├── Timeline
└── Contact
```

---

# 二十七、技能模块

```text
Programming
│
├── Python
├── JavaScript
├── TypeScript
├── Vue
├── HTML
└── CSS

Design
│
├── Photoshop
├── After Effects
├── Blender
├── Figma
└── UI/UX

Tools
│
├── Git
├── VS Code
└── Docker
```

---

# 二十八、个人经历时间线

```text
2026
│
├── 个人网站
├── Python项目
├── AE动画
└── Blender项目
│
2025
│
├── 项目A
└── 项目B
```

---

# 二十九、联系页面

文件：

```text
pages/contact.html
```

结构：

```text
Contact
│
├── Contact Header
├── Contact Information
│   ├── Email
│   ├── GitHub
│   ├── Instagram
│   ├── YouTube
│   └── Bilibili
└── Contact Form
    ├── Name
    ├── Email
    ├── Subject
    ├── Message
    └── Submit
```

---

# 三十、搜索页面

文件：

```text
pages/search.html
```

搜索内容：

```text
作品
项目
文章
标签
媒体
```

结构：

```text
Search
│
├── Search Input
├── Search Button
├── Works Results
├── Projects Results
├── Articles Results
└── Tags Results
```

---

# 三十一、Footer

所有前台页面统一 Footer。

```text
Footer
│
├── Logo
├── Description
├── Navigation
├── Social Links
├── Email
└── Copyright
```

HTML：

```html
<footer class="site-footer">

    <div class="footer-container">

        <div class="footer-brand">
            <h2>GIGI.</h2>
            <p>
                Creating things with code,
                design and imagination.
            </p>
        </div>

        <div class="footer-links">
            <a href="/">首页</a>
            <a href="/pages/works.html">作品</a>
            <a href="/pages/projects.html">项目</a>
            <a href="/pages/articles.html">文章</a>
            <a href="/pages/about.html">关于</a>
        </div>

        <div class="footer-social">
            <a href="#">GitHub</a>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
        </div>

    </div>

    <div class="copyright">
        © 2026 Gigi. All Rights Reserved.
    </div>

</footer>
```

---

# 三十二、后台管理系统

后台地址：

```text
/admin
```

后台与前台视觉风格保持一致，但是布局更加偏管理后台。

---

# 三十三、后台整体 HTML 层级

```text
Admin
│
├── Sidebar
├── Admin Header
└── Main Content
```

HTML：

```html
<div class="admin-layout">

    <aside class="admin-sidebar">

        Logo

        Dashboard

        Content
            Works
            Projects
            Articles
            Media

        Settings

        Statistics

    </aside>

    <div class="admin-main">

        <header class="admin-header">
            User
            Theme
            Logout
        </header>

        <main class="admin-content">
            Page Content
        </main>

    </div>

</div>
```

---

# 三十四、后台 Dashboard

文件：

```text
admin/index.html
```

结构：

```text
Dashboard
│
├── Header
├── Statistics
│   ├── Works
│   ├── Projects
│   ├── Articles
│   ├── Files
│   └── Views
├── Recent Works
├── Recent Articles
├── Recent Uploads
└── Activity
```

---

# 三十五、作品管理

文件：

```text
admin/works/index.html
```

结构：

```text
Works Management
│
├── Page Header
├── Search
├── Category Filter
├── Add Work
└── Work Table
    ├── Cover
    ├── Name
    ├── Category
    ├── Status
    ├── Date
    └── Actions
        ├── View
        ├── Edit
        └── Delete
```

---

# 三十六、创建作品

文件：

```text
admin/works/create.html
```

结构：

```text
Create Work
│
├── Basic Information
│   ├── Title
│   ├── Slug
│   ├── Category
│   ├── Description
│   └── Tags
├── Cover Upload
├── Content Editor
├── Technology
├── Project Links
├── Project Files
├── SEO
└── Actions
    ├── Save Draft
    ├── Preview
    └── Publish
```

---

# 三十七、Markdown 编辑器

文件：

```text
admin/articles/create.html
```

界面：

```text
┌────────────────────────────────────────────┐
│ 新建文章                                   │
├──────────────────────┬─────────────────────┤
│ Markdown             │ Preview             │
│                      │                     │
│ # 标题               │ 标题                │
│                      │                     │
│ ## 第一章            │ 第一章              │
│                      │                     │
│ 正文内容...          │ 正文内容...         │
│                      │                     │
│ ```python             │ Python代码         │
│ print()              │                     │
│ ```                  │                     │
├──────────────────────┴─────────────────────┤
│ [保存草稿] [预览] [发布文章]                │
└────────────────────────────────────────────┘
```

---

# 三十八、项目管理

文件：

```text
admin/projects/index.html
```

功能：

```text
创建项目
编辑项目
删除项目
发布项目
隐藏项目
搜索项目
分类项目
```

---

# 三十九、媒体管理

文件：

```text
admin/media/index.html
```

显示：

```text
图片
视频
PDF
ZIP
Markdown
PSD
AI
AEP
BLEND
其他文件
```

---

# 四十、文件上传

文件：

```text
admin/media/upload.html
```

支持拖拽：

```text
┌─────────────────────────────────┐
│                                 │
│       Drag & Drop Files         │
│                                 │
│       或点击选择文件            │
│                                 │
└─────────────────────────────────┘
```

上传后：

```text
文件名称
文件类型
文件大小
上传时间
上传状态
删除
```

---

# 四十一、网站设置

文件：

```text
admin/settings/index.html
```

设置：

```text
网站名称
网站描述
Logo
Favicon
主题
强调色
背景
导航
Footer
社交链接
```

---

# 四十二、个人资料

文件：

```text
admin/settings/profile.html
```

字段：

```text
头像
姓名
个人简介
个人职位
技能
邮箱
GitHub
Instagram
YouTube
Bilibili
```

---

# 四十三、SEO 设置

文件：

```text
admin/settings/seo.html
```

设置：

```text
Title
Description
Keywords
OG Image
Sitemap
Robots
```

---

# 四十四、数据统计

文件：

```text
admin/statistics.html
```

统计：

```text
今日访问
昨日访问
本周访问
本月访问
总访问量
独立访客
热门作品
热门文章
访问来源
设备
```

---

# 四十五、作品数据结构

```text
Work
│
├── id
├── title
├── slug
├── category
├── description
├── content
├── cover
├── images
├── videos
├── files
├── technologies
├── tags
├── github
├── demo
├── created_at
├── updated_at
├── published
└── featured
```

---

# 四十六、文章数据结构

```text
Article
│
├── id
├── title
├── slug
├── description
├── content
├── cover
├── category
├── tags
├── author
├── created_at
├── updated_at
└── published
```

---

# 四十七、项目数据结构

```text
Project
│
├── id
├── title
├── description
├── cover
├── status
├── technology
├── screenshots
├── github
├── demo
├── files
├── start_date
├── end_date
└── created_at
```

---

# 四十八、标签系统

标签：

```text
#Python
#Vue
#JavaScript
#Web
#UI
#Animation
#Blender
#AE
#Design
```

点击标签后显示：

```text
作品
项目
文章
```

---

# 四十九、响应式设计

必须支持：

```text
1920px
1440px
1200px
992px
768px
576px
375px
```

---

# 五十、PC 端布局

最大内容宽度：

```text
1440px
```

左右留白：

```text
40px ~ 80px
```

作品：

```text
3列
4列
```

---

# 五十一、移动端布局

移动端：

```text
单列
```

Header：

```text
Logo
+
Menu
```

导航：

```text
☰
```

展开：

```text
首页
作品
项目
文章
媒体
关于
联系
```

---

# 五十二、动画系统

页面：

```text
Fade In
Slide Up
```

卡片：

```text
Hover
TranslateY
Scale
```

图片：

```text
Zoom
```

页面切换：

```text
Fade
```

要求：

> 动画以微交互为主，不影响网站性能。

---

# 五十三、Dark Mode

支持：

```text
Light
Dark
System
```

自动读取系统主题。

---

# 五十四、SEO

每个页面需要：

```html
<title></title>
<meta name="description" content="">
<meta name="keywords" content="">
<meta property="og:title" content="">
<meta property="og:description" content="">
<meta property="og:image" content="">
```

网站增加：

```text
sitemap.xml
robots.txt
```

---

# 五十五、文件类型

## 图片

```text
JPG
JPEG
PNG
WEBP
GIF
SVG
```

## 视频

```text
MP4
WEBM
MOV
```

## 文档

```text
PDF
MD
TXT
```

## 项目

```text
ZIP
RAR
7Z
```

## 设计

```text
PSD
AI
AEP
BLEND
```

## 代码

```text
PY
JS
TS
HTML
CSS
VUE
JSON
```

---

# 五十六、网站核心内容流程

```text
登录后台
      ↓
创建作品
      ↓
上传封面
      ↓
填写作品信息
      ↓
上传图片/视频/文件
      ↓
添加标签
      ↓
保存
      ↓
预览
      ↓
发布
      ↓
数据库
      ↓
前台自动显示
```

---

# 五十七、Markdown 文章流程

```text
登录后台
      ↓
创建文章
      ↓
Markdown编辑
      ↓
实时预览
      ↓
添加封面
      ↓
添加标签
      ↓
保存草稿
      ↓
发布
      ↓
文章页面
```

---

# 五十八、前后台关系

```text
                    GIGI WEBSITE
                         │
             ┌───────────┴───────────┐
             │                       │
            前台                     后台
             │                       │
       ┌─────┼─────┐          ┌──────┼──────┐
       │     │     │          │      │      │
      作品   项目   文章      作品    项目    文章
       │     │     │          │      │      │
       └─────┼─────┘          └──────┼──────┘
             │                       │
             └───────────┬───────────┘
                         ↓
                      Database
                         ↓
                    File Storage
```

---

# 五十九、技术架构建议

前端：

```text
Vue 3
TypeScript
Vite
```

UI：

```text
Tailwind CSS
```

后端：

```text
Node.js
Express
```

数据库：

```text
SQLite
```

后期：

```text
PostgreSQL
```

文件存储：

```text
Local Storage
```

后期：

```text
S3
Cloudflare R2
OSS
```

---

# 六十、开发阶段

## Phase 1：前端页面

```text
HTML页面
CSS
响应式
Header
Footer
首页
作品
项目
文章
关于
联系
```

## Phase 2：交互

```text
JavaScript
搜索
主题切换
图片预览
视频播放
页面动画
```

## Phase 3：内容系统

```text
Markdown
文章系统
标签系统
分类系统
```

## Phase 4：后台

```text
登录
作品管理
项目管理
文章管理
文件管理
```

## Phase 5：后端

```text
数据库
API
文件上传
数据统计
```

## Phase 6：部署

```text
域名
HTTPS
SEO
云存储
数据备份
```

---

# 六十一、最终网站结构

```text
                    GIGI.
                      │
          ┌───────────┼───────────┐
          │           │           │
        作品          项目        文章
          │           │           │
       作品详情     项目详情     文章详情
          │           │           │
          └───────────┼───────────┘
                      │
                  媒体中心
                      │
             ┌────────┼────────┐
             │        │        │
            图片      视频      文件
             │        │        │
             └────────┼────────┘
                      │
                   关于我
                      │
                   联系我
                      │
                  Admin后台
                      │
             ┌────────┼────────┐
             │        │        │
           内容管理   媒体管理   网站设置
             │        │        │
             └────────┼────────┘
                      │
                    数据库
                      │
                   文件存储
```

---

# 六十二、最终目标

```text
✓ 有自己的个人品牌
✓ 有漂亮的首页
✓ 可以展示作品
✓ 可以展示项目
✓ 可以发布文章
✓ 支持 Markdown
✓ 可以上传图片
✓ 可以上传视频
✓ 可以上传 PDF
✓ 可以上传项目文件
✓ 可以管理作品
✓ 可以管理文章
✓ 可以管理项目
✓ 可以后台登录
✓ 可以搜索
✓ 可以分类
✓ 可以使用标签
✓ 支持 Dark Mode
✓ 支持 PC
✓ 支持手机
✓ 支持 SEO
✓ 支持数据统计
✓ 支持后期云存储
✓ 支持后期扩展
```

---

# 六十三、最终产品定位

最终不要把它做成一个简单的「个人介绍网站」。

而应该做成：

# GIGI PERSONAL DIGITAL STUDIO

一个属于个人的：

```text
作品集
+
项目库
+
技术博客
+
设计作品库
+
媒体中心
+
文件中心
+
个人主页
+
内容管理系统
```

最终实现：

> 只需要登录后台，就可以持续上传和管理自己的所有作品与内容。
