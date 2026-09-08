/* ============================================================
   星冕 VR3D — Layout 引擎：注入统一 Header / Footer / 搜索面板
   每页 body 需带 data-root（指向站点根目录的相对前缀）
   ============================================================ */
(function (global) {
  "use strict";

  const U = global.XingMianUtils;
  const store = global.XingMianStore;

  const NAV = [
    { key: "home", label: "首页", path: "index.html" },
    { key: "works", label: "作品", path: "pages/works.html" },
    { key: "projects", label: "项目", path: "pages/projects.html" },
    { key: "articles", label: "文章", path: "pages/articles.html" },
    { key: "gallery", label: "媒体", path: "pages/gallery.html" },
    { key: "about", label: "关于", path: "pages/about.html" },
    { key: "contact", label: "联系", path: "pages/contact.html" },
  ];

  const SUB = { work: "works", project: "projects", article: "articles", video: "gallery" };

  function root() {
    let r = document.body.getAttribute("data-root") || ".";
    if (!r.endsWith("/")) r += "/";
    if (r === "./") r = "";
    return r;
  }

  function link(path) {
    return root() + path;
  }

  function currentKey() {
    let k = document.body.getAttribute("data-page") || "";
    if (SUB[k]) k = SUB[k];
    return k;
  }

  function socials() {
    const profile = store ? store.getJSON("profile", global.XINGMIAN_DATA.profile) : global.XINGMIAN_DATA.profile;
    const s = profile.social || {};
    const list = [];
    const map = {
      github: { label: "GitHub", icon: "github" },
      bilibili: { label: "Bilibili", icon: "play" },
      youtube: { label: "YouTube", icon: "play" },
      instagram: { label: "Instagram", icon: "external" },
      twitter: { label: "Twitter", icon: "external" },
    };
    Object.keys(map).forEach((k) => {
      if (s[k]) list.push({ ...map[k], url: s[k] });
    });
    if (profile.email && list.length < 5) list.push({ label: "Email", icon: "mail", url: "mailto:" + profile.email });
    return list;
  }

  function buildHeader() {
    const active = currentKey();
    const navHtml = NAV.map((n) =>
      `<a class="nav-link${n.key === active ? " is-active" : ""}" href="${link(n.path)}" data-nav="${n.key}">${n.label}</a>`
    ).join("");

    const drawerLinks = NAV.map((n) =>
      `<a class="drawer-link" href="${link(n.path)}">${n.label}<small>0${NAV.indexOf(n) + 1}</small></a>`
    ).join("");

    const socialFoot = socials().map((s) => `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}">${U.icon(s.icon)}</a>`).join("");

    const header = document.createElement("header");
    header.className = "site-header";
    header.id = "site-header";
    header.innerHTML = `
      <div class="header-container">
        <a class="logo" href="${link("index.html")}" aria-label="星冕 home">星冕<span class="dot">.</span><span class="tagline">Digital Studio</span></a>
        <nav class="main-nav" aria-label="主导航">${navHtml}</nav>
        <div class="header-actions">
          <button class="btn-icon search-open" aria-label="搜索" title="搜索">${U.icon("search")}</button>
          <button class="btn-icon theme-toggle" aria-label="切换主题" title="切换主题">
            <span class="icon-sun" style="display:contents">${U.icon("sun")}</span>
            <span class="icon-moon" style="display:contents">${U.icon("moon")}</span>
          </button>
          <button class="btn-icon menu-button" aria-label="打开菜单" title="菜单">${U.icon("menu")}</button>
        </div>
      </div>
      <div class="mobile-drawer" id="mobile-drawer" aria-hidden="true">
        <div class="drawer-backdrop"></div>
        <div class="drawer-panel">
          <div class="flex items-center justify-between" style="margin-bottom:18px">
            <span class="logo">星冕<span class="dot">.</span></span>
            <button class="btn-icon drawer-close" aria-label="关闭菜单">${U.icon("close")}</button>
          </div>
          ${drawerLinks}
          <div class="drawer-footer-links">${socialFoot}</div>
        </div>
      </div>`;

    const mobileDrawer = header.querySelector("#mobile-drawer");
    const toggleDrawer = (open) => {
      mobileDrawer.classList.toggle("open", open);
      mobileDrawer.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
    };
    header.querySelector(".menu-button").addEventListener("click", () => toggleDrawer(true));
    header.querySelector(".drawer-close").addEventListener("click", () => toggleDrawer(false));
    header.querySelector(".drawer-backdrop").addEventListener("click", () => toggleDrawer(false));

    return { el: header, openDrawer: () => toggleDrawer(true), closeDrawer: () => toggleDrawer(false) };
  }

  function buildFooter() {
    const settings = store ? store.getJSON("settings", global.XINGMIAN_DATA.settings) : global.XINGMIAN_DATA.settings;
    const profile = store ? store.getJSON("profile", global.XINGMIAN_DATA.profile) : global.XINGMIAN_DATA.profile;
    const footerText = settings.footerText || "Creating things with code, design and imagination.";

    const footNav = NAV.filter((n) => ["home", "works", "projects", "articles", "about", "contact"].includes(n.key))
      .map((n) => `<li><a href="${link(n.path)}">${n.label}</a></li>`).join("");

    const socialsHtml = socials().map((s) =>
      `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}">${s.label}</a>`
    ).join("");

    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="footer-container">
        <div class="footer-brand">
          <h2>${settings.siteName || "星冕."}</h2>
          <p>${footerText}</p>
        </div>
        <div class="footer-col">
          <h4>导航</h4>
          <ul>${footNav}</ul>
        </div>
        <div class="footer-col">
          <h4>媒体</h4>
          <ul>
            <li><a href="${link("pages/gallery.html")}">图片画廊</a></li>
            <li><a href="${link("pages/videos.html")}">视频中心</a></li>
            <li><a href="${link("pages/search.html")}">搜索</a></li>
            <li><a href="${link("pages/projects.html")}">项目库</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>联系</h4>
          <div class="footer-social">${socialsHtml}</div>
          ${profile.email ? `<p class="small muted" style="margin-top:16px"><a href="mailto:${profile.email}">${profile.email}</a></p>` : ""}
        </div>
      </div>
      <div class="copyright container">
        <span>${settings.copyright || "© 2026 星冕. All Rights Reserved."}</span>
        <span><a class="admin-link" href="${link("admin/login.html")}" title="管理后台">管理后台 ↗</a></span>
      </div>`;
    return { el: footer };
  }

  /* ---------------- 全局搜索面板 ---------------- */
  function buildSearchPanel() {
    const panel = document.createElement("div");
    panel.className = "search-panel";
    panel.id = "search-panel";
    panel.innerHTML = `
      <div class="search-panel-backdrop"></div>
      <div class="search-panel-inner">
        <div class="search-panel-head">
          <h3>搜索内容</h3>
          <button class="btn-icon search-panel-close" aria-label="关闭搜索">${U.icon("close")}</button>
        </div>
        <div class="search-panel-input">
          ${U.icon("search")}
          <input id="search-panel-input" type="text" placeholder="搜索作品 / 项目 / 文章 / 标签…" autocomplete="off">
        </div>
        <div class="search-panel-results" id="search-panel-results"></div>
        <a class="search-panel-more" id="search-panel-more" href="">在搜索页查看全部结果 →</a>
      </div>`;

    const close = () => {
      panel.classList.remove("open");
      document.body.style.overflow = "";
    };

    function highlight(text, q) {
      if (!q) return U.escapeHtml(text);
      const idx = text.toLowerCase().indexOf(q.toLowerCase());
      if (idx < 0) return U.escapeHtml(text);
      return U.escapeHtml(text.slice(0, idx)) + "<mark>" + U.escapeHtml(text.slice(idx, idx + q.length)) + "</mark>" + U.escapeHtml(text.slice(idx + q.length));
    }

    function run(q) {
      const box = panel.querySelector("#search-panel-results");
      if (!q.trim()) { box.innerHTML = `<div class="empty small">输入关键词开始搜索</div>`; return; }
      const { works, projects, articles } = global.XingMianData.collections();
      const results = [];
      const push = (kind, icon, title, extra, href) => results.push({ kind, icon, title, extra, href });

      works.forEach((w) => {
        if ((w.title + w.description + (w.tags || []).join(" ") + w.category).toLowerCase().includes(q.toLowerCase()))
          push("作品", "grid", w.title, w.category, "pages/work-detail.html?slug=" + w.slug);
      });
      projects.forEach((p) => {
        if ((p.title + p.description + (p.technology || []).join(" ")).toLowerCase().includes(q.toLowerCase()))
          push("项目", "file", p.title, p.status, "pages/project-detail.html?slug=" + p.slug);
      });
      articles.forEach((a) => {
        if ((a.title + a.description + (a.tags || []).join(" ")).toLowerCase().includes(q.toLowerCase()))
          push("文章", "file", a.title, a.category, "pages/article-detail.html?slug=" + a.slug);
      });
      const tags = [...new Set([...works, ...projects, ...articles].flatMap((x) => x.tags || []))]
        .filter((t) => t.toLowerCase().includes(q.toLowerCase()));

      if (!results.length && !tags.length) {
        box.innerHTML = `<div class="empty">没有找到与 “${U.escapeHtml(q)}” 相关的内容</div>`;
        panel.querySelector("#search-panel-more").style.display = "none";
        return;
      }
      let html = results.slice(0, 8).map((r) => `
        <a class="sp-item" href="${link(r.href)}">
          <span class="sp-kind">${r.kind}</span>
          <span class="sp-title">${highlight(r.title, q)}</span>
          <span class="sp-extra">${U.escapeHtml(r.extra)}</span>
        </a>`).join("");
      if (tags.length) {
        html += `<div class="sp-tags"><span class="small muted">标签：</span>` + tags.slice(0, 6).map((t) =>
          `<a class="tag" href="${link("pages/search.html?q=" + encodeURIComponent(t))}">${highlight(t, q)}</a>`).join("") + `</div>`;
      }
      box.innerHTML = html || `<div class="empty">无匹配结果</div>`;
      panel.querySelector("#search-panel-more").href = link("pages/search.html?q=" + encodeURIComponent(q));
      panel.querySelector("#search-panel-more").style.display = "inline-flex";
    }

    panel.querySelector(".search-panel-backdrop").addEventListener("click", close);
    panel.querySelector(".search-panel-close").addEventListener("click", close);
    const input = panel.querySelector("#search-panel-input");
    input.addEventListener("input", U.debounce((e) => run(e.target.value), 160));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") window.location.href = link("pages/search.html?q=" + encodeURIComponent(input.value));
      if (e.key === "Escape") close();
    });

    document.body.appendChild(panel);
    return {
      open() {
        panel.classList.add("open");
        document.body.style.overflow = "hidden";
        setTimeout(() => input.focus(), 120);
      },
      close,
    };
  }

  /* ---------------- 挂载 ---------------- */
  function mount() {
    const headerAnchor = document.getElementById("site-header-anchor");
    if (headerAnchor) {
      const h = buildHeader();
      headerAnchor.replaceWith(h.el);
      global.__headerActions = h;
    }
    const footerAnchor = document.getElementById("site-footer-anchor");
    if (footerAnchor) {
      const f = buildFooter();
      footerAnchor.replaceWith(f.el);
    }
    global.__searchPanel = buildSearchPanel();
  }

  global.XingMianLayout = { mount, link, root, NAV };
})(window);
