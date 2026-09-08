/* ============================================================
   星冕 VR3D — Admin 引擎
   登录守卫 / 侧边栏布局 / 页面路由（body[data-admin-page]）
   ============================================================ */
(function (global) {
  "use strict";

  const U = global.XingMianUtils;
  const D = global.XingMianData;
  const store = global.XingMianStore;

  const A = {
    page: document.body.dataset.adminPage || "",
    root() {
      let r = document.body.getAttribute("data-root") || "..";
      if (!r.endsWith("/")) r += "/";
      if (r === "./") r = "";
      return r;
    },
    link(path) { return this.root() + path; },

    SESSION_KEY: "xingmian_admin_session",

    login(user, pass) {
      const s = D.getSettings();
      if (user === s.adminUser && pass === s.adminPass) {
        store.set(this.SESSION_KEY, "1");
        return true;
      }
      return false;
    },
    logout() { store.removeKey(this.SESSION_KEY); window.location.href = this.link("admin/login.html"); },
    isAuthed() { return store.get(this.SESSION_KEY) === "1"; },

    guard() {
      if (this.page === "login") return;
      if (!this.isAuthed()) window.location.href = this.link("admin/login.html");
    },
  };

  /* ---------------- 侧边栏 ---------------- */
  const SIDEBAR_GROUPS = [
    {
      label: "概览",
      items: [
        { key: "dashboard", label: "Dashboard", icon: "grid", path: "admin/index.html" },
        { key: "statistics", label: "数据统计", icon: "eye", path: "admin/statistics.html" },
      ],
    },
    {
      label: "内容管理",
      items: [
        { key: "works-list", label: "作品管理", icon: "grid", path: "admin/works/index.html" },
        { key: "projects-list", label: "项目管理", icon: "file", path: "admin/projects/index.html" },
        { key: "articles-list", label: "文章管理", icon: "file", path: "admin/articles/index.html" },
        { key: "media-list", label: "媒体管理", icon: "img", path: "admin/media/index.html" },
        { key: "media-upload", label: "文件上传", icon: "download", path: "admin/media/upload.html" },
      ],
    },
    {
      label: "设置",
      items: [
        { key: "settings-site", label: "网站设置", icon: "link", path: "admin/settings/index.html" },
        { key: "settings-profile", label: "个人资料", icon: "eye", path: "admin/settings/profile.html" },
        { key: "settings-seo", label: "SEO 设置", icon: "search", path: "admin/settings/seo.html" },
      ],
    },
  ];

  const ACTIVE_MAP = {
    "works-list": "works-list", "work-form": "works-list",
    "projects-list": "projects-list", "project-form": "projects-list",
    "articles-list": "articles-list", "article-form": "articles-list",
    "media-list": "media-list", "media-upload": "media-upload",
    "settings-site": "settings-site", "settings-profile": "settings-profile", "settings-seo": "settings-seo",
  };

  function buildSidebar() {
    const active = ACTIVE_MAP[A.page] || A.page;
    let html = `
      <div class="side-logo">
        <a href="${A.link("admin/index.html")}" style="display:flex;align-items:center;gap:10px">
          <span class="logo" style="font-size:1.2rem">星冕<span class="dot">.</span></span>
        </a>
        <a class="to-site" href="${A.link("index.html")}" title="返回前台" target="_blank">${U.icon("external")}</a>
      </div>`;
    SIDEBAR_GROUPS.forEach((g) => {
      html += `<div class="side-group-label">${g.label}</div><nav class="side-nav">`;
      g.items.forEach((it) => {
        const isA = (it.key === active) || (A.page === "dashboard" && it.key === "dashboard");
        html += `<a class="side-link${isA ? " is-active" : ""}" href="${A.link(it.path)}">${U.icon(it.icon)}<span>${it.label}</span></a>`;
      });
      html += `</nav>`;
    });
    return html;
  }

  function buildAdminHeader() {
    const titleMap = {
      dashboard: "Dashboard", statistics: "数据统计",
      "works-list": "作品管理", "work-form": "编辑作品",
      "projects-list": "项目管理", "project-form": "编辑项目",
      "articles-list": "文章管理", "article-form": "编辑文章",
      "media-list": "媒体管理", "media-upload": "文件上传",
      "settings-site": "网站设置", "settings-profile": "个人资料", "settings-seo": "SEO 设置",
    };
    return `
      <button class="btn-icon admin-menu-btn" id="admin-menu-btn" aria-label="菜单">${U.icon("menu")}</button>
      <span class="ah-title">${titleMap[A.page] || "后台"}</span>
      <span class="spacer"></span>
      <button class="btn-icon theme-toggle" id="admin-theme" title="切换主题">
        <span class="icon-sun" style="display:contents">${U.icon("sun")}</span>
        <span class="icon-moon" style="display:contents">${U.icon("moon")}</span>
      </button>
      <a class="btn btn-ghost btn-sm" href="${A.link("index.html")}" target="_blank">${U.icon("external")} 查看前台</a>
      <button class="btn btn-outline btn-sm" id="admin-logout">${U.icon("trash")} 退出</button>`;
  }

  function mountShell() {
    const sidebar = document.getElementById("admin-sidebar");
    const headEl = document.getElementById("admin-header-inner");
    if (sidebar) sidebar.innerHTML = buildSidebar();
    if (headEl) headEl.innerHTML = buildAdminHeader();

    if (A.page !== "login") {
      const logout = document.getElementById("admin-logout");
      if (logout) logout.addEventListener("click", () => A.logout());
      const theme = document.getElementById("admin-theme");
      if (theme) theme.addEventListener("click", () => global.XingMianTheme.toggle());
      const menuBtn = document.getElementById("admin-menu-btn");
      if (menuBtn) menuBtn.addEventListener("click", () => sidebar && sidebar.classList.toggle("is-open"));
    }
  }

  /* ---------------- 通用：数据表格动作绑定 ---------------- */
  function wireTableActions(scope, entity) {
    U.qsa("[data-action]", scope).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const act = btn.dataset.action;
        const id = btn.dataset.id;
        if (act === "edit") window.location.href = btn.getAttribute("href");
        if (act === "delete") {
          const ok = confirm("确定删除这条记录？该操作不可撤销。");
          if (!ok) return;
          D.remove(entity, id);
          Fx_Toast("已删除", "success");
          location.reload();
        }
        if (act === "toggle") {
          const list = store.getJSON(entity, []);
          const it = list.find((x) => String(x.id) === String(id));
          if (it) {
            it.published = !it.published;
            store.setJSON(entity, list);
            Fx_Toast(it.published ? "已发布" : "已转为草稿", "success");
            location.reload();
          }
        }
      });
    });
  }

  function Fx_Toast(msg, type) {
    global.XingMianFx && global.XingMianFx.Toast.show(msg, type);
  }

  global.XingMianAdmin = A;
  global.AdminUI = { mountShell, wireTableActions, toast: Fx_Toast };

  // 访问计数（前台+后台页面都统计一次）
  store.bumpViews();

  // 登录页
  if (A.page === "login") {
    const form = document.getElementById("login-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = document.getElementById("login-user").value.trim();
        const pass = document.getElementById("login-pass").value;
        if (A.login(user, pass)) {
          window.location.href = A.link("admin/index.html");
        } else {
          const err = document.getElementById("login-error");
          if (err) { err.style.display = "block"; err.textContent = "账号或密码错误，请重试。"; }
        }
      });
      // 填充演示账号提示
      const s = D.getSettings();
      const hint = document.getElementById("login-hint");
      if (hint) hint.innerHTML = `演示账号：<code>${U.escapeHtml(s.adminUser)}</code><br>演示密码：<code>${U.escapeHtml(s.adminPass)}</code><br><small>可在「后台 → 网站设置」中修改。</small>`;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { A.guard(); mountShell(); });
  } else {
    A.guard(); mountShell();
  }
})(window);
