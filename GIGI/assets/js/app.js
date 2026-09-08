/* ============================================================
   星冕 VR3D — App：前台页面控制器
   依据 body[data-page] 分发渲染。页面静态壳 + JS 数据填充。
   ============================================================ */
(function (global) {
  "use strict";

  const U = global.XingMianUtils;
  const D = global.XingMianData;
  const Fx = global.XingMianFx;
  const Md = global.XingMianMarkdown;
  const Layout = global.XingMianLayout;
  const link = Layout.link;
  const page = document.body.dataset.page || "";

  /* ---------------- 通用 HTML 片段 ---------------- */
  function catBadge(cat) {
    return `<span class="badge badge--line">${U.escapeHtml(cat)}</span>`;
  }
  function tagHtml(tags) {
    return (tags || []).slice(0, 4).map((t) =>
      `<a class="tag" href="${link("pages/search.html?q=" + encodeURIComponent(t))}">#${U.escapeHtml(t)}</a>`).join(" ");
  }
  function coverImg(src, alt) {
    return `<img src="${U.escapeHtml(U.src(src))}" alt="${U.escapeHtml(alt)}" loading="lazy" onerror="this.onerror=null;this.src='${U.src("assets/images/backgrounds/fallback.svg")}'">`;
  }

  function workCard(w, extraCls) {
    return `
    <article class="card item-card reveal ${extraCls || ""}">
      <a class="card-media" href="${link("pages/work-detail.html?slug=" + encodeURIComponent(w.slug))}">
        ${catBadge(w.category)}
        ${coverImg(w.cover, w.title)}
      </a>
      <div class="card-body">
        <a href="${link("pages/work-detail.html?slug=" + encodeURIComponent(w.slug))}"><h3>${U.escapeHtml(w.title)}</h3></a>
        <p class="desc">${U.escapeHtml(w.description)}</p>
        <div>${tagHtml(w.tags)}</div>
        <div class="card-foot">
          <span>${U.fmtDate(w.created_at)}</span>
          <a class="go" href="${link("pages/work-detail.html?slug=" + encodeURIComponent(w.slug))}">查看 <span>→</span></a>
        </div>
      </div>
    </article>`;
  }

  function projectCard(p) {
    const statusCls = p.status === "已完成" ? "published" : p.status === "进行中" ? "draft" : "hidden";
    return `
    <article class="card item-card reveal">
      <a class="card-media" href="${link("pages/project-detail.html?slug=" + encodeURIComponent(p.slug))}">
        <span class="badge badge--line" style="position:absolute;top:14px;left:14px;z-index:3">${U.escapeHtml(p.status)}</span>
        ${coverImg(p.cover, p.title)}
      </a>
      <div class="card-body">
        <a href="${link("pages/project-detail.html?slug=" + encodeURIComponent(p.slug))}"><h3>${U.escapeHtml(p.title)}</h3></a>
        <p class="desc">${U.escapeHtml(p.description)}</p>
        <div class="tech-chips">${(p.technology || []).map((t) => `<span class="tag">${U.escapeHtml(t)}</span>`).join("")}</div>
        <div class="card-foot">
          <span>${U.fmtDate(p.start_date || p.created_at)}</span>
          <a class="go" href="${link("pages/project-detail.html?slug=" + encodeURIComponent(p.slug))}">进入项目 <span>→</span></a>
        </div>
      </div>
    </article>`;
  }

  function articleCard(a, row) {
    const mins = Md.readingTime(a.content);
    return `
    <article class="card ${row ? "item-card row-card" : "item-card"} reveal">
      <a class="card-media" href="${link("pages/article-detail.html?slug=" + encodeURIComponent(a.slug))}">
        ${catBadge(a.category)}
        ${coverImg(a.cover, a.title)}
      </a>
      <div class="card-body">
        <a href="${link("pages/article-detail.html?slug=" + encodeURIComponent(a.slug))}"><h3>${U.escapeHtml(a.title)}</h3></a>
        <p class="desc">${U.escapeHtml(a.description)}</p>
        <div class="flex items-center gap-sm small muted" style="margin-top:2px">
          <span>${U.escapeHtml(a.author || "星冕")}</span>·
          <span>${U.fmtDate(a.created_at)}</span>·
          <span>${mins} 分钟阅读</span>
        </div>
        <div class="card-foot">
          <div>${tagHtml(a.tags)}</div>
          <a class="go" href="${link("pages/article-detail.html?slug=" + encodeURIComponent(a.slug))}">阅读 <span>→</span></a>
        </div>
      </div>
    </article>`;
  }

  /* ---------------- 筛选条组件 ---------------- */
  function buildFilter(container, categories, onPick) {
    container.innerHTML = categories.map((c, i) =>
      `<button class="chip${i === 0 ? " is-active" : ""}" data-cat="${U.escapeHtml(c)}">${U.escapeHtml(c)}</button>`
    ).join("");
    container.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      U.qsa(".chip", container).forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      onPick(chip.dataset.cat);
    });
  }

  function emptyBox(text) {
    return `<div class="empty">${U.icon("search")}<p>${text || "暂无内容"}</p></div>`;
  }

  function paginate(list, pageNo, perPage) {
    const total = Math.max(1, Math.ceil(list.length / perPage));
    const p = Math.min(pageNo, total);
    return { items: list.slice((p - 1) * perPage, p * perPage), page: p, total };
  }

  function pagerHtml(page, total, perPage) {
    if (total <= 1) return "";
    return `<nav class="pager" data-page="${page}" data-total="${total}">
      ${page > 1 ? `<button class="chip" data-pg="${page - 1}">← 上一页</button>` : `<span></span>`}
      <span class="pager-info small muted">${page} / ${total}</span>
      ${page < total ? `<button class="chip" data-pg="${page + 1}">下一页 →</button>` : `<span></span>`}
    </nav>`;
  }

  /* ============================================================
     首页
     ============================================================ */
  function renderHome() {
    const profile = D.getProfile();
    const settings = D.getSettings();

    // Hero 文案
    const heroTitle = document.querySelector("[data-hero-title]");
    if (heroTitle) heroTitle.innerHTML = `你好 我是 <span class="grad-text">星冕</span>.`;
    const heroRole = document.querySelector("[data-hero-role]");
    if (heroRole) {
      heroRole.innerHTML = (profile.title || "Creator / Developer / Designer").split("/").map((r) =>
        `<span class="role-item">${r.trim()}</span>`).join("");
    }
    const heroTag = document.querySelector("[data-hero-tag]");
    if (heroTag) heroTag.textContent = profile.tagline || "";

    // 精选作品：首页 3D 悬浮
    const spatial = document.querySelector("#spatial-works");
    if (spatial) {
      const featured = D.sorted(D.published(D.works)).filter((w) => w.featured).slice(0, 3);
      spatial.innerHTML = featured.map((w, i) => {
        const pos = ["sw-card--left", "sw-card--center", "sw-card--right"][i];
        const depths = [-1.2, 0.3, 1.6];
        return `
        <article class="sw-card ${pos}" data-depth="${depths[i]}">
          <div class="sw-float float-y-slow">
            <a class="work-card3d tilt-el" data-tilt="6" href="${link("pages/work-detail.html?slug=" + encodeURIComponent(w.slug))}">
              <div class="card-cover sw-aspect">${coverImg(w.cover, w.title)}</div>
              <div class="glass-layer"></div>
              <div class="title-layer">
                <small class="micro" style="color:rgba(255,255,255,.75)">${U.escapeHtml(w.category)}</small>
                <h3 style="color:#fff;margin:6px 0 8px">${U.escapeHtml(w.title)}</h3>
                <div class="tags-layer">${(w.tags || []).slice(0, 3).map((t) => `<span class="tag" style="color:#fff;border-color:rgba(255,255,255,.35)">#${U.escapeHtml(t)}</span>`).join(" ")}</div>
              </div>
              <span class="icon-layer">${U.icon("arrowUp")}</span>
            </a>
          </div>
        </article>`;
      }).join("");
      Fx.Tilt.init(spatial);
    }

    // 沉浸模式进入/退出
    const enterBtn = document.querySelector("[data-enter-immersive]");
    if (enterBtn) {
      enterBtn.addEventListener("click", () => {
        document.documentElement.classList.add("immersive");
        const exit = document.createElement("button");
        exit.className = "btn btn-neon btn-sm exit-immersive";
        exit.textContent = "✕ 退出沉浸模式";
        exit.addEventListener("click", () => document.documentElement.classList.remove("immersive"));
        document.body.appendChild(exit);
        Fx.Starfield && Fx.Starfield.canvas && Fx.Starfield.resize();
      });
    }
    const exitBtn = document.querySelector(".exit-immersive");
    if (exitBtn) exitBtn.addEventListener("click", () => document.documentElement.classList.remove("immersive"));

    // 精选作品网格
    const fg = document.querySelector("#home-featured-works");
    if (fg) {
      const list = D.sorted(D.published(D.works)).slice(0, 6);
      fg.innerHTML = list.map((w) => workCard(w)).join("") || emptyBox();
    }
    // 最新项目
    const pg = document.querySelector("#home-projects");
    if (pg) {
      pg.innerHTML = D.sorted(D.published(D.projects)).slice(0, 3).map((p) => projectCard(p)).join("") || emptyBox();
    }
    // 最新文章
    const ag = document.querySelector("#home-articles");
    if (ag) {
      ag.innerHTML = D.sorted(D.published(D.articles)).slice(0, 3).map((a) => articleCard(a, true)).join("") || emptyBox();
    }

    // About 预览
    const aboutBox = document.querySelector("[data-about-preview]");
    if (aboutBox && profile.bio) {
      aboutBox.textContent = profile.bio;
    }
    const avatarImg = document.querySelector("[data-avatar]");
    if (avatarImg && profile.avatar) avatarImg.src = U.src(profile.avatar);

    // 技能跑马灯
    const strip = document.querySelector("#skill-strip");
    if (strip) {
      const all = profile.skills.flatMap((g) => g.items.map((i) => i.name));
      const doubled = [...all, ...all];
      strip.innerHTML = `<div class="skill-track">${doubled.map((s) => `<span>${U.escapeHtml(s)}</span>`).join("")}</div>`;
    }

    // 统计
    const stats = document.querySelector("#home-stats");
    if (stats) {
      const c = D.counts();
      const views = global.XingMianStore.getJSON("views", { total: 0 });
      const items = [
        { n: c.works, l: "作品", suffix: "+" },
        { n: c.projects, l: "项目" },
        { n: c.articles, l: "文章" },
        { n: c.media, l: "媒体素材" },
      ];
      stats.innerHTML = items.map((s, i) =>
        `<div class="stat-box glass reveal" style="--d:${i * .08}s"><div class="num"><span class="count" data-to="${s.n}">0</span>${s.suffix || ""}</div><div class="label">${s.l}</div></div>`
      ).join("");
    }

    // 联系数据
    const contactList = document.querySelector("[data-contact-links]");
    if (contactList) {
      const s = profile.social || {};
      const items = [
        s.github && { label: "GitHub", val: s.github, icon: "github" },
        s.bilibili && { label: "Bilibili", val: s.bilibili, icon: "play" },
        s.youtube && { label: "YouTube", val: s.youtube, icon: "play" },
        profile.email && { label: "Email", val: profile.email, icon: "mail" },
      ].filter(Boolean);
      contactList.innerHTML = items.map((it) =>
        `<a class="method-row" href="${it.val.startsWith("http") ? it.val : "mailto:" + it.val}" target="_blank" rel="noopener">
          <span class="mi">${U.icon(it.icon)}</span><div><b>${it.label}</b><span>${U.escapeHtml(it.val)}</span></div>
        </a>`).join("");
    }
  }

  /* ============================================================
     作品集（列表 + 筛选 + 搜索 + 分页）
     ============================================================ */
  function renderWorks() {
    const cats = D.categories.works || [];
    const filterBox = document.querySelector("#works-filter");
    const grid = document.querySelector("#works-grid");
    const searchInput = document.querySelector("#works-search");
    const pageWrap = document.querySelector("#works-pager");
    if (!grid) return;

    let state = { cat: "全部", q: "", page: 1 };
    const perPage = 9;

    function draw() {
      let list = D.sorted(D.published(D.works));
      if (state.cat !== "全部") list = list.filter((w) => w.category === state.cat);
      if (state.q) {
        const q = state.q.toLowerCase();
        list = list.filter((w) =>
          (w.title + w.description + w.category + (w.tags || []).join("") + (w.technologies || []).join("")).toLowerCase().includes(q));
      }
      const { items, page, total } = paginate(list, state.page, perPage);
      grid.innerHTML = items.map((w) => workCard(w)).join("") || emptyBox("没有符合条件的作品");
      pageWrap.innerHTML = pagerHtml(page, total, perPage);
      Fx.Reveal.init(grid);
      Fx.Tilt.init(grid);
      const countEl = document.querySelector("[data-works-count]");
      if (countEl) countEl.textContent = list.length + " 件作品";
    }

    if (filterBox) buildFilter(filterBox, cats, (cat) => { state.cat = cat; state.page = 1; draw(); });
    if (searchInput) searchInput.addEventListener("input", U.debounce((e) => { state.q = e.target.value; state.page = 1; draw(); }, 200));
    if (pageWrap) pageWrap.addEventListener("click", (e) => {
      const b = e.target.closest("[data-pg]");
      if (b) { state.page = parseInt(b.dataset.pg); draw(); window.scrollTo({ top: 260, behavior: "smooth" }); }
    });
    draw();
  }

  /* ============================================================
     作品详情
     ============================================================ */
  function renderWorkDetail() {
    const slug = new URLSearchParams(location.search).get("slug");
    const item = D.bySlug(D.published(D.works), slug);
    if (!item) { document.querySelector("#detail-root").innerHTML = emptyBox("未找到该作品"); return; }

    const root = document.querySelector("#detail-root");
    const imgs = (item.images && item.images.length ? item.images : [item.cover]).map((src, i) =>
      ({ src: U.src(src), title: i === 0 ? item.title : "" }));
    const files = item.files || [];
    const techs = item.technologies || [];
    const related = D.related(D.works, item, 3);

    root.innerHTML = `
      <nav class="breadcrumb">
        <a href="${link("index.html")}">首页</a><span class="sep">/</span>
        <a href="${link("pages/works.html")}">作品</a><span class="sep">/</span>
        <span>${U.escapeHtml(item.title)}</span>
      </nav>
      <div class="detail-hero" style="padding-top:0">
        <div class="container">
          <div class="badge badge--neon">${U.escapeHtml(item.category)}</div>
          <h1 class="h1" style="margin-top:16px">${U.escapeHtml(item.title)}</h1>
          <p class="lead" style="margin-top:12px;max-width:720px">${U.escapeHtml(item.description)}</p>
          <div class="flex wrap gap-md small muted" style="margin-top:18px">
            <span>📅 ${U.fmtDate(item.created_at)}</span>
            ${techs.length ? `<span>🛠 ${techs.join(" / ")}</span>` : ""}
            ${item.github ? `<a href="${item.github}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px">${U.icon("github")} GitHub</a>` : ""}
            ${item.demo ? `<a href="${item.demo}" target="_blank" rel="noopener">演示 ↗</a>` : ""}
          </div>
          <div class="detail-cover">${coverImg(item.cover, item.title)}</div>
        </div>
      </div>

      <div class="section--tight container">
        <div class="detail-layout">
          <div class="detail-main">
            <div class="md-body prose">${Md.render(Md.parseFrontMatter(item.content || "").body)}</div>
            <div class="flex wrap gap-sm" style="margin-top:34px">
              <span class="small muted">标签：</span>${tagHtml(item.tags)}
            </div>
            <div class="prose-section">
              <h2>作品画廊</h2>
              <div class="list-grid list-grid--2" id="gallery-thumbs">
                ${imgs.map((im, i) => `
                  <figure class="card item-card" style="cursor:zoom-in" data-gallery="${i}">
                    <div class="card-media" style="aspect-ratio:16/10">${coverImg(im.src, item.title)}</div>
                    <figcaption class="small muted" style="padding:10px 14px">${U.escapeHtml(im.title || "作品图 " + (i + 1))}</figcaption>
                  </figure>`).join("")}
              </div>
            </div>
            ${files.length ? `
            <div class="prose-section">
              <h2>项目文件</h2>
              <div class="file-list">
                ${files.map((f) => `
                  <div class="file-item">
                    <span class="fi ext-${U.escapeHtml(f.type || "src")}">${U.escapeHtml((f.type || "src").slice(0, 3).toUpperCase())}</span>
                    <span class="fi-name"><b>${U.escapeHtml(f.name)}</b><span>${U.fmtSize(f.size)}</span></span>
                    <a class="dl" href="#" title="下载（演示）">${U.icon("download")}</a>
                  </div>`).join("")}
              </div>
            </div>` : ""}
          </div>
          <aside class="aside-stack">
            <div class="info-card glass">
              <h4>作品信息</h4>
              <dl>
                <div class="info-row"><dt>分类</dt><dd>${U.escapeHtml(item.category)}</dd></div>
                <div class="info-row"><dt>发布日期</dt><dd>${U.fmtDate(item.created_at)}</dd></div>
                <div class="info-row"><dt>更新日期</dt><dd>${U.fmtDate(item.updated_at || item.created_at)}</dd></div>
                <div class="info-row"><dt>状态</dt><dd>${item.published ? "已发布" : "草稿"}</dd></div>
              </dl>
            </div>
            <div class="info-card glass">
              <h4>使用技术</h4>
              <div class="tech-chips">${techs.map((t) => `<span class="tag">${U.escapeHtml(t)}</span>`).join("")}</div>
            </div>
            ${related.length ? `
            <div class="info-card glass">
              <h4>相关作品</h4>
              ${related.map((r) => `
                <a href="${link("pages/work-detail.html?slug=" + encodeURIComponent(r.slug))}" style="display:flex;gap:10px;align-items:center;padding:7px 0;border-bottom:1px dashed var(--border-soft)">
                  <img src="${U.escapeHtml(U.src(r.cover))}" alt="" style="width:46px;height:34px;object-fit:cover;border-radius:8px">
                  <span class="small" style="font-weight:600">${U.escapeHtml(r.title)}</span>
                </a>`).join("")}
            </div>` : ""}
          </aside>
        </div>
      </div>`;

    // 画廊灯箱
    const thumbs = U.qsa("[data-gallery]", root);
    thumbs.forEach((el, i) => el.addEventListener("click", () => Fx.Lightbox.open(imgs, i)));

    // 页内图片代理灯箱
    U.qsa(".md-body img", root).forEach((el) => {
      el.style.cursor = "zoom-in";
      el.addEventListener("click", () => {
        const list = U.qsa(".md-body img", root).map((im) => ({ src: im.src, title: "" }));
        Fx.Lightbox.open(list, U.qsa(".md-body img", root).indexOf(el));
      });
    });

    document.title = item.title + " · 星冕";
  }

  /* ============================================================
     项目列表 & 详情
     ============================================================ */
  function renderProjects() {
    const cats = D.categories.projects || [];
    const filterBox = document.querySelector("#projects-filter");
    const grid = document.querySelector("#projects-grid");
    const pager = document.querySelector("#projects-pager");
    if (!grid) return;
    let state = { cat: "全部", page: 1 };
    const perPage = 6;

    function draw() {
      let list = D.sorted(D.published(D.projects));
      if (state.cat !== "全部") list = list.filter((p) => (p.tags || []).includes(state.cat) || p.status === state.cat);
      const { items, page, total } = paginate(list, state.page, perPage);
      grid.innerHTML = items.map((p) => projectCard(p)).join("") || emptyBox("暂无项目");
      pager.innerHTML = pagerHtml(page, total, perPage);
      Fx.Reveal.init(grid);
    }
    if (filterBox) buildFilter(filterBox, cats, (cat) => { state.cat = cat; state.page = 1; draw(); });
    pager.addEventListener("click", (e) => {
      const b = e.target.closest("[data-pg]");
      if (b) { state.page = +b.dataset.pg; draw(); window.scrollTo({ top: 260, behavior: "smooth" }); }
    });
    draw();
  }

  function renderProjectDetail() {
    const slug = new URLSearchParams(location.search).get("slug");
    const item = D.bySlug(D.published(D.projects), slug);
    if (!item) { document.querySelector("#detail-root").innerHTML = emptyBox("未找到该项目"); return; }
    const root = document.querySelector("#detail-root");
    const shots = item.screenshots && item.screenshots.length ? item.screenshots : [item.cover];

    root.innerHTML = `
      <nav class="breadcrumb">
        <a href="${link("index.html")}">首页</a><span class="sep">/</span>
        <a href="${link("pages/projects.html")}">项目</a><span class="sep">/</span>
        <span>${U.escapeHtml(item.title)}</span>
      </nav>
      <div class="detail-hero" style="padding-top:0">
        <div class="container">
          <div class="flex wrap items-center gap-sm">
            <span class="status-dot ${item.status === "已完成" ? "published" : item.status === "进行中" ? "draft" : "hidden"}">${U.escapeHtml(item.status)}</span>
            <span class="small muted">${U.fmtDate(item.start_date || item.created_at)}${item.end_date ? " — " + item.end_date : ""}</span>
          </div>
          <h1 class="h1" style="margin-top:16px">${U.escapeHtml(item.title)}</h1>
          <p class="lead" style="margin-top:12px;max-width:720px">${U.escapeHtml(item.description)}</p>
          <div class="flex wrap gap-md" style="margin-top:20px">
            ${item.github ? `<a class="btn btn-outline btn-sm" href="${item.github}" target="_blank" rel="noopener">${U.icon("github")} GitHub</a>` : ""}
            ${item.demo ? `<a class="btn btn-neon btn-sm" href="${item.demo}" target="_blank" rel="noopener">在线演示 ↗</a>` : ""}
          </div>
          <div class="detail-cover">${coverImg(item.cover, item.title)}</div>
        </div>
      </div>
      <div class="section--tight container">
        <div class="detail-layout">
          <div class="detail-main">
            <div class="md-body prose">${Md.render(Md.parseFrontMatter(item.content || "").body)}</div>
            <div class="prose-section">
              <h2>项目截图</h2>
              <div class="list-grid list-grid--2" id="shot-grid">
                ${shots.map((s, i) => `
                  <figure class="card item-card" style="cursor:zoom-in" data-shot="${i}">
                    <div class="card-media" style="aspect-ratio:16/10">${coverImg(s, item.title + " " + (i + 1))}</div>
                  </figure>`).join("")}
              </div>
            </div>
          </div>
          <aside class="aside-stack">
            <div class="info-card glass">
              <h4>项目信息</h4>
              <dl>
                <div class="info-row"><dt>状态</dt><dd>${U.escapeHtml(item.status)}</dd></div>
                <div class="info-row"><dt>开始</dt><dd>${item.start_date || "—"}</dd></div>
                <div class="info-row"><dt>结束</dt><dd>${item.end_date || "至今"}</dd></div>
                <div class="info-row"><dt>创建</dt><dd>${U.fmtDate(item.created_at)}</dd></div>
              </dl>
            </div>
            <div class="info-card glass">
              <h4>技术栈</h4>
              <div class="tech-chips">${(item.technology || []).map((t) => `<span class="tag">${U.escapeHtml(t)}</span>`).join("")}</div>
            </div>
          </aside>
        </div>
      </div>`;
    U.qsa("[data-shot]", root).forEach((el, i) =>
      el.addEventListener("click", () => Fx.Lightbox.open(shots.map((s) => ({ src: U.src(s) })), i)));
    document.title = item.title + " · 星冕";
  }

  /* ============================================================
     文章列表 & 详情
     ============================================================ */
  function renderArticles() {
    const grid = document.querySelector("#articles-list");
    const cats = D.categories.articles || [];
    const filterBox = document.querySelector("#articles-cat");
    if (!grid) return;
    let cat = "全部";

    function draw() {
      let list = D.sorted(D.published(D.articles));
      if (cat !== "全部") list = list.filter((a) => a.category === cat);
      grid.innerHTML = list.map((a) => articleCard(a, true)).join("") || emptyBox("暂无文章");
      Fx.Reveal.init(grid);
      const side = document.querySelector("#side-articles");
      if (side) {
        const tags = [...new Set(list.flatMap((a) => a.tags || []))];
        side.innerHTML = `<div class="side-card glass"><h4>标签云</h4><div class="flex wrap gap-sm">${
          tags.map((t) => `<a class="tag" href="${link("pages/search.html?q=" + encodeURIComponent(t))}">#${t}</a>`).join("")}</div></div>`;
      }
    }
    if (filterBox) buildFilter(filterBox, cats, (c) => { cat = c; draw(); });
    draw();

    // 侧栏分类
    const catList = document.querySelector("#side-cats");
    if (catList) {
      const all = D.sorted(D.published(D.articles));
      catList.innerHTML = cats.map((c) => {
        const n = c === "全部" ? all.length : all.filter((a) => a.category === c).length;
        return `<a href="#articles-list" data-cat-side="${U.escapeHtml(c)}" class="${c === "全部" ? "is-active" : ""}">${U.escapeHtml(c)}<span>${n}</span></a>`;
      }).join("");
      catList.addEventListener("click", (e) => {
        const a = e.target.closest("[data-cat-side]");
        if (!a) return;
        U.qsa("[data-cat-side]", catList).forEach((x) => x.classList.remove("is-active"));
        a.classList.add("is-active");
        cat = a.dataset.catSide;
        if (filterBox) { U.qsa(".chip", filterBox).forEach((c) => c.classList.toggle("is-active", c.dataset.cat === cat)); }
        draw();
      });
    }
  }

  function renderArticleDetail() {
    const slug = new URLSearchParams(location.search).get("slug");
    const item = D.bySlug(D.published(D.articles), slug);
    if (!item) { document.querySelector("#detail-root").innerHTML = emptyBox("未找到该文章"); return; }
    const root = document.querySelector("#detail-root");
    const mins = Md.readingTime(item.content);
    const toc = Md.extractToc(item.content);
    const { prev, next } = D.nextPrev(D.articles, item);

    root.innerHTML = `
      <nav class="breadcrumb">
        <a href="${link("index.html")}">首页</a><span class="sep">/</span>
        <a href="${link("pages/articles.html")}">文章</a><span class="sep">/</span>
        <span>${U.escapeHtml(item.title)}</span>
      </nav>
      <header class="detail-hero" style="padding-top:0">
        <div class="container" style="max-width:860px">
          <div class="flex wrap items-center gap-sm">
            <span class="badge badge--neon">${U.escapeHtml(item.category)}</span>
            <span class="small muted">${U.escapeHtml(item.author || "星冕")} · ${U.fmtDate(item.created_at)} · ${mins} 分钟阅读</span>
          </div>
          <h1 class="h1" style="margin-top:16px">${U.escapeHtml(item.title)}</h1>
          <p class="lead" style="margin-top:12px">${U.escapeHtml(item.description)}</p>
          ${item.cover ? `<div class="detail-cover" style="max-height:420px">${coverImg(item.cover, item.title)}</div>` : ""}
        </div>
      </header>
      <div class="section--tight container">
        <div class="article-wrap">
          <article class="article-main">
            <div class="md-body prose" id="article-content">${Md.render(Md.parseFrontMatter(item.content || "").body)}</div>
            <div class="flex wrap gap-sm" style="margin-top:30px">
              ${tagHtml(item.tags)}
            </div>
            <div class="article-pager">
              ${prev ? `
              <a class="pager-card card" href="${link("pages/article-detail.html?slug=" + encodeURIComponent(prev.slug))}">
                <small>← 上一篇</small><b>${U.escapeHtml(prev.title)}</b>
              </a>` : `<span></span>`}
              ${next ? `
              <a class="pager-card card pager-card--next" href="${link("pages/article-detail.html?slug=" + encodeURIComponent(next.slug))}">
                <small>下一篇 →</small><b>${U.escapeHtml(next.title)}</b>
              </a>` : ""}
            </div>
          </article>
          <aside class="article-side">
            ${toc.length ? `
            <div class="side-card glass">
              <h4>目录</h4>
              <nav class="toc-list" id="toc"></nav>
            </div>` : ""}
            <div class="side-card glass">
              <h4>关于作者</h4>
              <div class="flex items-center gap-md">
                <img src="${U.src("assets/images/avatar/avatar.svg")}" alt="avatar" style="width:56px;height:56px;border-radius:16px">
                <div><b>星冕</b><p class="small muted">Creator / Developer / Designer</p></div>
              </div>
            </div>
          </aside>
        </div>
      </div>`;

    // TOC
    const tocBox = document.querySelector("#toc");
    if (tocBox && toc.length) {
      tocBox.innerHTML = toc.map((t) =>
        `<a class="toc-h${t.level}" href="#h-${encodeURIComponent(t.title)}">${U.escapeHtml(t.title)}</a>`).join("");
      toc.forEach((t) => {
        const els = U.qsa(`#article-content h${t.level}`);
        const el = els.find((h) => h.textContent.trim() === t.title);
        if (el) { el.id = "h-" + encodeURIComponent(t.title); }
      });
      const links = U.qsa(".toc-list a");
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
          }
        });
      }, { rootMargin: "-15% 0px -75% 0px" });
      toc.forEach((t) => {
        const el = document.getElementById("h-" + encodeURIComponent(t.title));
        if (el) spy.observe(el);
      });
    }

    // 图片灯箱
    U.qsa(".md-body img", root).forEach((el) => {
      el.style.cursor = "zoom-in";
      el.addEventListener("click", () => {
        const imgs = U.qsa(".md-body img", root).map((im) => ({ src: im.src }));
        Fx.Lightbox.open(imgs, U.qsa(".md-body img", root).indexOf(el));
      });
    });
    document.title = item.title + " · 星冕";
  }

  /* ============================================================
     画廊 & 视频
     ============================================================ */
  function renderGallery() {
    const grid = document.querySelector("#gallery-grid");
    const cats = D.categories.gallery || [];
    const filter = document.querySelector("#gallery-filter");
    if (!grid) return;
    let cat = "全部";
    const catMap = { "设计": "设计", "动画": "动画", "3D": "设计", "UI": "设计", "摄影": "图片" };
    const items = D.gallery.map((g) => ({ ...g, cat2: catMap[g.cat] || "图片" }));

    function draw() {
      const list = cat === "全部" ? items : items.filter((g) => g.cat === cat || g.cat2 === cat || g.type === cat);
      grid.innerHTML = list.map((g) => `
        <div class="masonry-item reveal" data-lightbox="${g.id}">
          <span class="badge badge--line m-cat">${U.escapeHtml(g.cat)}</span>
          <img src="${U.escapeHtml(U.src(g.src))}" alt="${U.escapeHtml(g.title)}" loading="lazy">
          <div class="m-meta"><b>${U.escapeHtml(g.title)}</b></div>
        </div>`).join("") || emptyBox("该分类暂无内容");
      Fx.Reveal.init(grid);
      U.qsa("[data-lightbox]", grid).forEach((el) => {
        el.addEventListener("click", () => {
          Fx.Lightbox.open(list.map((g) => ({ src: U.src(g.src), title: g.title })), list.findIndex((g) => g.id === el.dataset.lightbox));
        });
      });
    }
    if (filter) buildFilter(filter, cats, (c) => { cat = c; draw(); });
    draw();
  }

  function renderVideos() {
    const grid = document.querySelector("#videos-grid");
    if (!grid) return;
    const videos = D.videos;
    grid.innerHTML = videos.map((v) => `
      <article class="card video-card reveal" data-video="${v.id}">
        <div class="vc-media">
          <img src="${U.escapeHtml(U.src(v.cover || v.poster))}" alt="${U.escapeHtml(v.title)}" loading="lazy">
          <span class="play-btn">${U.icon("play")}</span>
          <span class="badge badge--line" style="position:absolute;top:12px;right:12px;z-index:2">${U.escapeHtml(v.category)}</span>
        </div>
        <div class="vc-meta">
          <h3>${U.escapeHtml(v.title)}</h3>
          <p>${U.escapeHtml(v.description)}</p>
          <span class="small muted">${v.date || U.fmtDate(v.created_at) || ""}</span>
        </div>
      </article>`).join("") || emptyBox("暂无视频");
    U.qsa("[data-video]", grid).forEach((el) => {
      el.addEventListener("click", () => {
        const v = videos.find((x) => x.id === el.dataset.video);
        if (v) Fx.VideoModal.open(v);
      });
    });
  }

  /* ============================================================
     About
     ============================================================ */
  function renderAbout() {
    const p = D.getProfile();
    const avatar = document.querySelector("#about-avatar");
    if (avatar) avatar.src = U.src(p.avatar || "assets/images/avatar/avatar.svg");
    const name = document.querySelector("[data-name]");
    if (name) name.textContent = p.name;
    const title = document.querySelector("[data-title]");
    if (title) title.textContent = p.title;
    const bio = document.querySelector("[data-bio]");
    if (bio) bio.textContent = p.bio;
    const loc = document.querySelector("[data-location]");
    if (loc) loc.textContent = p.location || "";
    const exp = document.querySelector("[data-experience]");
    if (exp) {
      exp.innerHTML = (p.experience || []).map((e) => `
        <div class="info-row"><dt>${U.escapeHtml(e.range)}</dt><dd><b>${U.escapeHtml(e.role)}</b><br><small class="muted">${U.escapeHtml(e.org)}</small></dd></div>`).join("");
    }
    const skills = document.querySelector("#skills-list");
    if (skills) {
      skills.innerHTML = (p.skills || []).map((g) => `
        <div class="skill-block">
          <h3>${U.escapeHtml(g.group)}</h3>
          ${g.items.map((s) => `
            <div class="skill-row reveal">
              <span>${U.escapeHtml(s.name)}</span>
              <div class="bar"><i data-pct="${s.pct}"></i></div>
              <span class="pct">${s.pct}%</span>
            </div>`).join("")}
        </div>`).join("");
      Fx.Reveal.init(skills);
      Fx.initSkillBars(skills);
    }
    const tl = document.querySelector("#timeline");
    if (tl) {
      tl.innerHTML = (p.timeline || []).map((y) => `
        <div class="timeline">
          ${y.items.map((it, i) => `
            <div class="tl-item reveal" style="--d:${i * .06}s">
              <span class="tl-year">${U.escapeHtml(y.year)}</span>
              <h4>${U.escapeHtml(it.title)}</h4>
              <p>${U.escapeHtml(it.desc || "")}</p>
            </div>`).join("")}
        </div>`).join("");
      Fx.Reveal.init(tl);
    }
    // 联系信息
    const contactRoot = document.querySelector("[data-about-contact]");
    if (contactRoot) {
      const s = p.social || {};
      const items = [
        p.email && { label: "Email", val: p.email, icon: "mail" },
        s.github && { label: "GitHub", val: s.github, icon: "github" },
        s.bilibili && { label: "Bilibili", val: s.bilibili, icon: "play" },
        s.instagram && { label: "Instagram", val: s.instagram, icon: "external" },
        s.youtube && { label: "YouTube", val: s.youtube, icon: "play" },
      ].filter(Boolean);
      contactRoot.innerHTML = items.map((it) => `
        <a class="method-row" href="${it.val.startsWith("http") ? it.val : "mailto:" + it.val}" target="_blank" rel="noopener">
          <span class="mi">${U.icon(it.icon)}</span><div><b>${it.label}</b><span>${U.escapeHtml(it.val)}</span></div>
        </a>`).join("");
    }
  }

  /* ============================================================
     Contact
     ============================================================ */
  function renderContact() {
    const p = D.getProfile();
    const info = document.querySelector("#contact-info");
    if (info) {
      const s = p.social || {};
      const items = [
        p.email && { label: "Email", val: p.email, icon: "mail", extra: "回复最快" },
        s.github && { label: "GitHub", val: s.github, icon: "github", extra: "代码仓库" },
        s.bilibili && { label: "Bilibili", val: s.bilibili, icon: "play", extra: "视频动态" },
        s.youtube && { label: "YouTube", val: s.youtube, icon: "play", extra: "频道" },
        s.instagram && { label: "Instagram", val: s.instagram, icon: "external", extra: "日常" },
      ].filter(Boolean);
      info.innerHTML = items.map((it) => `
        <a class="method-row" href="${it.val.startsWith("http") ? it.val : "mailto:" + it.val}" target="_blank" rel="noopener">
          <span class="mi">${U.icon(it.icon)}</span><div><b>${it.label}</b><span>${it.extra} · ${U.escapeHtml(it.val)}</span></div>
        </a>`).join("");
    }
    const form = document.querySelector("#contact-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const f = new FormData(form);
        Fx.Toast.show(`感谢留言，${f.get("name") || "朋友"}！演示环境已记录你的消息（${f.get("subject") || "无主题"}）。`, "success");
        form.reset();
      });
    }
  }

  /* ============================================================
     Search
     ============================================================ */
  function renderSearch() {
    const q = new URLSearchParams(location.search).get("q") || "";
    const input = document.querySelector("#search-input");
    if (input) input.value = q;
    const results = document.querySelector("#search-results");
    function run(query) {
      if (!query.trim()) { results.innerHTML = `<div class="empty">${U.icon("search")}<p>输入关键词，搜索作品 / 项目 / 文章 / 标签</p></div>`; return; }
      const r = D.searchAll(query);
      const hl = (text) => {
        if (!text) return "";
        const i = text.toLowerCase().indexOf(query.toLowerCase());
        if (i < 0) return U.escapeHtml(text);
        return U.escapeHtml(text.slice(0, i)) + "<mark>" + U.escapeHtml(text.slice(i, i + query.length)) + "</mark>" + U.escapeHtml(text.slice(i + query.length));
      };
      let html = "";

      if (r.works.length) {
        html += `<section class="search-result-group reveal"><h2>作品 <span class="count">${r.works.length}</span></h2>` +
          r.works.slice(0, 5).map((w) => `
            <a class="search-result-item" href="${link("pages/work-detail.html?slug=" + encodeURIComponent(w.slug))}">
              <img class="thumb" src="${U.escapeHtml(U.src(w.cover))}" alt="">
              <div><b>${hl(w.title)}</b><small>${U.escapeHtml(w.category)} · ${U.fmtDate(w.created_at)}</small></div>
            </a>`).join("") + `</section>`;
      }
      if (r.projects.length) {
        html += `<section class="search-result-group reveal"><h2>项目 <span class="count">${r.projects.length}</span></h2>` +
          r.projects.slice(0, 5).map((p) => `
            <a class="search-result-item" href="${link("pages/project-detail.html?slug=" + encodeURIComponent(p.slug))}">
              <img class="thumb" src="${U.escapeHtml(U.src(p.cover))}" alt="">
              <div><b>${hl(p.title)}</b><small>${U.escapeHtml(p.status)} · ${U.fmtDate(p.created_at)}</small></div>
            </a>`).join("") + `</section>`;
      }
      if (r.articles.length) {
        html += `<section class="search-result-group reveal"><h2>文章 <span class="count">${r.articles.length}</span></h2>` +
          r.articles.slice(0, 6).map((a) => `
            <a class="search-result-item" href="${link("pages/article-detail.html?slug=" + encodeURIComponent(a.slug))}">
              <img class="thumb" src="${U.escapeHtml(U.src(a.cover))}" alt="">
              <div><b>${hl(a.title)}</b><small>${U.escapeHtml(a.category)} · ${U.fmtDate(a.created_at)}</small></div>
            </a>`).join("") + `</section>`;
      }
      if (r.tags.length) {
        html += `<section class="search-result-group reveal"><h2>标签 <span class="count">${r.tags.length}</span></h2><div class="flex wrap gap-sm">` +
          r.tags.map((t) => `<a class="tag" href="?q=${encodeURIComponent(t)}">#${hl(t)}</a>`).join("") + `</div></section>`;
      }
      if (!html) html = `<div class="empty">${U.icon("search")}<p>没有找到与 “${U.escapeHtml(query)}” 相关的内容</p></div>`;
      results.innerHTML = html;
      Fx.Reveal.init(results);
    }
    if (input) input.addEventListener("input", U.debounce((e) => run(e.target.value), 200));
    run(q);
  }

  /* ============================================================
     Boot
     ============================================================ */
  function boot() {
    Layout.mount();
    global.XingMianTheme.init();

    // Header 交互
    const header = document.getElementById("site-header");
    if (header) {
      header.querySelector(".theme-toggle").addEventListener("click", () => global.XingMianTheme.toggle());
      const searchOpen = header.querySelector(".search-open");
      if (searchOpen && global.__searchPanel) {
        searchOpen.addEventListener("click", () => global.__searchPanel.open());
      }
      const drawer = document.getElementById("mobile-drawer");
      if (drawer) {
        drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
          drawer.classList.remove("open");
          document.body.style.overflow = "";
        }));
      }
    }

    // 页面路由
    const router = {
      home: renderHome,
      works: renderWorks,
      "work-detail": renderWorkDetail,
      projects: renderProjects,
      "project-detail": renderProjectDetail,
      articles: renderArticles,
      "article-detail": renderArticleDetail,
      gallery: renderGallery,
      videos: renderVideos,
      about: renderAbout,
      contact: renderContact,
      search: renderSearch,
    };
    if (router[page]) router[page]();

    // 通用动效
    Fx.initHeaderScroll();
    Fx.initToTop();
    Fx.initDepthHud();
    Fx.Reveal.init(document);
    Fx.initCounters(document);
    Fx.initSkillBars(document);
    Fx.Tilt.init(document);
    Fx.LensTransition.init();
    Fx.Cursor.init();

    // 页面进场
    document.body.classList.add("page-enter");
    setTimeout(() => document.body.classList.remove("page-enter"), 800);

    // 星空
    if (document.body.dataset.star !== undefined) {
      Fx.Starfield.start({ count: parseInt(document.body.dataset.star || "90", 10) });
    }
    // 视差（首页自动开启）
    if (page === "home") Fx.Parallax.start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
