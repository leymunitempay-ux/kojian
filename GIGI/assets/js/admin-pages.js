/* ============================================================
   星冕 VR3D — Admin 页面逻辑（渲染 #page-root）
   body[data-admin-page] 分发
   ============================================================ */
(function (global) {
  "use strict";

  const U = global.XingMianUtils;
  const D = global.XingMianData;
  const store = global.XingMianStore;
  const Md = global.XingMianMarkdown;
  const Admin = global.XingMianAdmin;
  const link = (p) => Admin.link(p || "");
  const esc = U.escapeHtml;
  const toast = (m, t) => global.XingMianFx.Toast.show(m, t);
  const root = document.getElementById("page-root");

  const entityLabel = { works: "作品", projects: "项目", articles: "文章" };

  function coverThumb(item) {
    return `<img class="thumb" src="${esc(U.src(item.cover || "assets/images/backgrounds/fallback.svg"))}" alt="">`;
  }
  function statusCell(item) {
    const cls = item.published === false ? "draft" : "published";
    const label = item.published === false ? "草稿" : "已发布";
    return `<span class="status-dot ${cls}">${label}</span>`;
  }
  function actionsRow(entity, item) {
    const editPath = `admin/${entity}/edit.html?id=${item.id}`;
    return `<div class="row-actions">
      <a class="action-btn" data-action="toggle" data-id="${esc(item.id)}" title="发布/下线">${U.icon("eye")}</a>
      <a class="action-btn" href="${Admin.link(editPath)}" data-action="edit" title="编辑">${U.icon("edit")}</a>
      <a class="action-btn danger" href="#" data-action="delete" data-id="${esc(item.id)}" title="删除">${U.icon("trash")}</a>
    </div>`;
  }

  /* ================= 列表页渲染 ================= */
  function renderListPage(entity) {
    const cols = {
      works: { label: "作品", cat: "分类", date: "日期" },
      projects: { label: "项目", cat: "状态", date: "开始" },
      articles: { label: "文章", cat: "分类", date: "日期" },
    }[entity];
    const catField = entity === "projects" ? "status" : "category";
    const list = store.getJSON(entity, []);
    const categories = entity === "projects"
      ? ["全部", ...new Set(list.map((x) => x.status))].filter(Boolean)
      : ["全部", ...(D.categories[entity === "works" ? "works" : "articles"] || []).filter((c) => c !== "全部")];

    root.innerHTML = `
      <div class="page-head">
        <div><h1>${esc(entityLabel[entity])}管理</h1><div class="ph-sub">共 <b id="list-count">${list.length}</b> 条 · ${esc(cols.label)}内容</div></div>
        <span class="spacer"></span>
        <a class="btn btn-neon" href="${Admin.link("admin/" + entity + "/create.html")}">${U.icon("plus")} 新建${entityLabel[entity]}</a>
      </div>
      <div class="panel">
        <div class="panel-head">
          <div class="flex wrap gap-sm" id="list-filter">
            ${categories.map((c, i) => `<button class="chip${i === 0 ? " is-active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}
          </div>
          <span class="spacer"></span>
          <input class="input" id="list-search" placeholder="搜索 ${entityLabel[entity]}…" style="max-width:220px">
        </div>
        <div class="panel-body--flush" style="overflow-x:auto">
          <table class="data-table">
            <thead><tr>
              <th>${esc(cols.label)}</th><th>${esc(cols.cat)}</th><th>标签</th><th>${esc(cols.date)}</th><th>状态</th><th style="text-align:right">操作</th>
            </tr></thead>
            <tbody id="list-body"></tbody>
          </table>
          <div id="list-empty" style="display:none"></div>
        </div>
      </div>`;

    const body = document.getElementById("list-body");
    const empty = document.getElementById("list-empty");
    const filter = document.getElementById("list-filter");
    const search = document.getElementById("list-search");
    const countEl = document.getElementById("list-count");

    function draw() {
      const cat = (filter.querySelector(".chip.is-active") || {}).dataset?.cat || "全部";
      const q = (search.value || "").toLowerCase();
      let rows = list.filter((x) => {
        const okCat = cat === "全部" || String(x[catField]) === cat || (x.tags || []).includes(cat);
        const okQ = !q || (x.title + x.description + (x.tags || []).join("")).toLowerCase().includes(q);
        return okCat && okQ;
      });
      countEl.textContent = rows.length;
      if (!rows.length) {
        body.innerHTML = "";
        empty.style.display = "block";
        empty.innerHTML = `<div class="empty">${U.icon("file")}<p>没有符合条件的${entityLabel[entity]}</p></div>`;
        return;
      }
      empty.style.display = "none";
      body.innerHTML = rows.map((x) => `
        <tr>
          <td><div class="cell-title">${coverThumb(x)}<div><b>${esc(x.title)}</b><small>${esc(x.slug || "")}</small></div></div></td>
          <td><span class="tag">${esc(x[catField] || "—")}</span></td>
          <td><div class="flex wrap gap-sm">${(x.tags || []).slice(0, 3).map((t) => `<span class="tag">#${esc(t)}</span>`).join("")}</div></td>
          <td class="small muted">${esc(U.fmtDate(x.created_at) || "—")}</td>
          <td>${statusCell(x)}</td>
          <td>${actionsRow(entity, x)}</td>
        </tr>`).join("");
      AdminUI.wireTableActions(root, entity);
    }
    filter.addEventListener("click", (e) => {
      const c = e.target.closest(".chip");
      if (!c) return;
      U.qsa(".chip", filter).forEach((x) => x.classList.remove("is-active"));
      c.classList.add("is-active");
      draw();
    });
    search.addEventListener("input", U.debounce(draw, 200));
    draw();
  }

  /* ================= 编辑表单 ================= */
  function renderFormPage(entity) {
    const id = new URLSearchParams(location.search).get("id");
    const isEdit = !!id;
    const list = store.getJSON(entity, []);
    const item = isEdit ? list.find((x) => String(x.id) === String(id)) : null;

    const catOptions = entity === "projects"
      ? ["进行中", "已完成", "规划中"]
      : (D.categories[entity === "works" ? "works" : "articles"] || []).filter((c) => c !== "全部");

    root.innerHTML = `
      <div class="page-head">
        <div><h1>${isEdit ? "编辑" : "新建"}${entityLabel[entity]}</h1>
        <div class="ph-sub">${isEdit ? "ID: " + esc(item?.id || "") : "填写信息后保存或发布"}</div></div>
        <span class="spacer"></span>
        <a class="btn btn-ghost btn-sm" href="${Admin.link("admin/" + entity + "/index.html")}">← 返回列表</a>
      </div>
      <form id="entity-form" class="grid" style="gap:22px;max-width:1100px">
        <div class="panel"><div class="panel-head"><h3>基本信息</h3></div><div class="panel-body form-grid">
          <div class="form-row">
            <div class="field"><label>标题 *</label><input class="input" id="f-title" required value="${esc(item?.title || "")}"></div>
            <div class="field"><label>Slug（链接标识）</label><input class="input" id="f-slug" value="${esc(item?.slug || "")}" placeholder="留空自动生成"></div>
          </div>
          <div class="form-row">
            <div class="field"><label>${entity === "projects" ? "状态" : "分类"} *</label>
              <select class="select" id="f-cat">${catOptions.map((c) => `<option ${item && (item.category || item.status) === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>
            </div>
            <div class="field"><label>发布日期</label><input class="input" type="date" id="f-date" value="${esc((item?.created_at || "").slice(0, 10))}"></div>
          </div>
          <div class="field"><label>描述</label><textarea class="textarea" id="f-desc" rows="2">${esc(item?.description || "")}</textarea></div>
          <div class="field"><label>标签（逗号分隔）</label><input class="input" id="f-tags" value="${esc((item?.tags || []).join(", "))}"></div>
        </div></div>

        <div class="panel"><div class="panel-head"><h3>封面与链接</h3></div><div class="panel-body">
          <div class="form-row">
            <div class="field"><label>封面图片</label>
              <input class="input" id="f-cover" value="${esc(item?.cover || "")}" placeholder="图片地址或留空">
              <div style="margin-top:10px"><img id="cover-preview" src="${esc(U.src(item?.cover || "assets/images/backgrounds/fallback.svg"))}" alt="" style="width:220px;aspect-ratio:16/9;object-fit:cover;border-radius:12px;border:1px solid var(--border-soft)"></div>
              <label class="check" style="margin-top:10px"><input type="checkbox" id="f-upload-local"> 从本地上传一张图片（自动转 DataURL）</label>
              <input type="file" id="f-cover-file" accept="image/*" hidden>
            </div>
            <div class="grid" style="gap:16px">
              ${entity !== "articles" ? `
              <div class="form-row">
                <div class="field"><label>技术栈（逗号分隔）</label><input class="input" id="f-techs" value="${esc((item?.technologies || item?.technology || []).join(", "))}"></div>
              </div>` : `<div class="field"><label>作者</label><input class="input" id="f-author" value="${esc(item?.author || (D.getProfile().name))}"></div>`}
              <div class="form-row">
                <div class="field"><label>GitHub 链接</label><input class="input" id="f-github" value="${esc(item?.github || "")}"></div>
                <div class="field"><label>演示地址</label><input class="input" id="f-demo" value="${esc(item?.demo || "")}"></div>
              </div>
              ${entity === "projects" ? `
              <div class="form-row">
                <div class="field"><label>开始时间</label><input class="input" type="month" id="f-start" value="${esc(item?.start_date || "")}"></div>
                <div class="field"><label>结束时间</label><input class="input" type="month" id="f-end" value="${esc(item?.end_date || "")}"></div>
              </div>` : ""}
            </div>
          </div>
        </div></div>

        <div class="panel"><div class="panel-head"><h3>${entity === "articles" ? "Markdown 正文（左侧编辑 · 右侧预览）" : "正文内容（支持 Markdown）"}</h3></div>
        <div class="panel-body">
          ${entity === "articles"
            ? `<div class="editor-split">
                <div class="editor-pane"><div class="pane-label"><span>Markdown</span><span class="micro">.md</span></div>
                  <textarea id="f-content" spellcheck="false">${esc(item?.content || "")}</textarea></div>
                <div class="editor-pane"><div class="pane-label"><span>预览 Preview</span></div>
                  <div class="editor-preview md-body" id="md-preview"></div></div>
              </div>`
            : `<textarea class="textarea" id="f-content" rows="14" placeholder="支持 Markdown…">${esc(item?.content || "")}</textarea>`}
        </div></div>

        <div class="panel"><div class="panel-body flex items-center gap-md wrap">
          <label class="check"><input type="checkbox" id="f-published" ${item?.published === false ? "" : "checked"}> 立即发布</label>
          <label class="check"><input type="checkbox" id="f-featured" ${item?.featured ? "checked" : ""}> 设为精选（首页展示）</label>
          <span class="spacer"></span>
          <button type="button" class="btn btn-ghost" id="btn-cancel">取消</button>
          <button type="submit" class="btn btn-primary">${isEdit ? "保存修改" : "创建"}</button>
        </div></div>
      </form>`;

    // 封面本地上传
    const coverInput = document.getElementById("f-cover");
    const coverFile = document.getElementById("f-cover-file");
    const coverChk = document.getElementById("f-upload-local");
    const coverPrev = document.getElementById("cover-preview");
    if (coverInput) coverInput.addEventListener("input", () => { coverPrev.src = U.src(coverInput.value) || U.src("assets/images/backgrounds/fallback.svg"); });
    if (coverChk) coverChk.addEventListener("change", () => { if (coverChk.checked) coverFile.click(); });
    if (coverFile) coverFile.addEventListener("change", () => {
      const f = coverFile.files[0];
      if (!f) return;
      if (f.size > 1200 * 1024) { toast("图片过大（>1.2MB），请压缩后上传", "error"); return; }
      const rd = new FileReader();
      rd.onload = () => { coverInput.value = rd.result; coverPrev.src = rd.result; toast("封面已载入", "success"); };
      rd.readAsDataURL(f);
    });

    // Markdown 实时预览
    if (entity === "articles") {
      const ta = document.getElementById("f-content");
      const prev = document.getElementById("md-preview");
      const upd = () => { prev.innerHTML = Md.render(ta.value); };
      ta.addEventListener("input", U.debounce(upd, 160));
      upd();
    }

    // Slug 自动生成
    const t = document.getElementById("f-title");
    const s = document.getElementById("f-slug");
    if (t && s) t.addEventListener("input", () => {
      if (!s.dataset.touched) s.value = U.toSlug(t.value);
    });
    s.addEventListener("input", () => { s.dataset.touched = "1"; });

    const form = document.getElementById("entity-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const now = new Date().toISOString().slice(0, 10);
      const catKey = entity === "projects" ? "status" : "category";
      const payload = {
        title: document.getElementById("f-title").value.trim(),
        slug: (document.getElementById("f-slug").value.trim() || U.toSlug(document.getElementById("f-title").value)),
        [catKey]: document.getElementById("f-cat").value,
        description: document.getElementById("f-desc").value.trim(),
        cover: coverInput.value || "assets/images/backgrounds/fallback.svg",
        tags: document.getElementById("f-tags").value.split(/[,，]/).map((x) => x.trim()).filter(Boolean),
        content: document.getElementById("f-content").value,
        github: (document.getElementById("f-github")?.value || "").trim(),
        demo: (document.getElementById("f-demo")?.value || "").trim(),
        published: document.getElementById("f-published").checked,
        featured: document.getElementById("f-featured")?.checked || false,
        updated_at: now,
      };
      if (entity === "works") payload.technologies = (document.getElementById("f-techs").value.split(/[,，]/).map((x) => x.trim()).filter(Boolean));
      if (entity === "projects") payload.technology = (document.getElementById("f-techs").value.split(/[,，]/).map((x) => x.trim()).filter(Boolean));
      if (entity === "projects") { payload.start_date = document.getElementById("f-start").value; payload.end_date = document.getElementById("f-end").value; }
      if (entity === "articles") payload.author = document.getElementById("f-author").value.trim() || "星冕";
      if (!payload.title) { toast("标题不能为空", "error"); return; }

      if (isEdit && item) {
        D.update(entity, item.id, payload);
        toast("已保存修改", "success");
      } else {
        payload.id = store.uid(entity.slice(0, 1));
        payload.created_at = document.getElementById("f-date").value || now;
        payload.images = [];
        payload.videos = [];
        payload.files = [];
        payload.screenshots = [];
        D.create(entity, payload);
        toast("创建成功", "success");
      }
      setTimeout(() => window.location.href = Admin.link("admin/" + entity + "/index.html"), 600);
    });
    const cancel = document.getElementById("btn-cancel");
    if (cancel) cancel.addEventListener("click", () => window.location.href = Admin.link("admin/" + entity + "/index.html"));
  }

  /* ================= Dashboard ================= */
  function renderDashboard() {
    const c = D.counts();
    const views = store.getJSON("views", { total: 0, today: 0 });
    const recentWorks = store.getJSON("works", []).slice(0, 5);
    const recentArticles = store.getJSON("articles", []).slice(0, 4);
    const recentMedia = store.getJSON("media", []).slice(0, 6);

    root.innerHTML = `
      <div class="page-head">
        <div><h1>Dashboard</h1><div class="ph-sub">欢迎回来，星冕！这是你的内容概览。</div></div>
      </div>
      <div class="stat-grid">
        ${[
          { n: c.works, l: "作品", href: "admin/works/index.html", icon: "grid" },
          { n: c.projects, l: "项目", href: "admin/projects/index.html", icon: "file" },
          { n: c.articles, l: "文章", href: "admin/articles/index.html", icon: "file" },
          { n: c.media, l: "媒体文件", href: "admin/media/index.html", icon: "img" },
          { n: views.today, l: "今日访问", href: "admin/statistics.html", icon: "eye" },
          { n: c.tags, l: "标签", href: "pages/search.html", icon: "search" },
        ].map((s) => `
          <a class="stat-card glass" href="${Admin.link(s.href)}">
            <span class="sc-icon">${U.icon(s.icon)}</span>
            <div class="sc-num">${s.n}</div><div class="sc-label">${s.l}</div>
          </a>`).join("")}
      </div>

      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:24px">
        <div class="panel"><div class="panel-head"><h3>最近作品</h3><span class="spacer"></span>
          <a class="small" href="${Admin.link("admin/works/index.html")}">查看全部 →</a></div>
          <div class="panel-body--flush" style="overflow-x:auto"><table class="data-table">
            <thead><tr><th>作品</th><th>分类</th><th>状态</th><th></th></tr></thead><tbody>
            ${recentWorks.length ? recentWorks.map((w) => `<tr>
              <td><div class="cell-title">${coverThumb(w)}<b>${esc(w.title)}</b></div></td>
              <td><span class="tag">${esc(w.category)}</span></td><td>${statusCell(w)}</td>
              <td><a class="action-btn" href="${Admin.link("admin/works/edit.html?id=" + w.id)}">${U.icon("edit")}</a></td>
            </tr>`).join("") : `<tr><td colspan="4"><div class="empty">暂无作品，<a href="${Admin.link("admin/works/create.html")}">去创建 →</a></div></td></tr>`}
            </tbody></table></div></div>

        <div class="panel"><div class="panel-head"><h3>最近文章</h3><span class="spacer"></span>
          <a class="small" href="${Admin.link("admin/articles/index.html")}">查看全部 →</a></div>
          <div class="panel-body--flush" style="overflow-x:auto"><table class="data-table">
            <thead><tr><th>文章</th><th>分类</th><th>状态</th><th></th></tr></thead><tbody>
            ${recentArticles.length ? recentArticles.map((a) => `<tr>
              <td><div class="cell-title">${coverThumb(a)}<b>${esc(a.title)}</b></div></td>
              <td><span class="tag">${esc(a.category)}</span></td><td>${statusCell(a)}</td>
              <td><a class="action-btn" href="${Admin.link("admin/articles/edit.html?id=" + a.id)}">${U.icon("edit")}</a></td>
            </tr>`).join("") : `<tr><td colspan="4"><div class="empty">暂无文章</div></td></tr>`}
            </tbody></table></div></div>

        <div class="panel"><div class="panel-head"><h3>最近上传</h3><span class="spacer"></span>
          <a class="small" href="${Admin.link("admin/media/index.html")}">媒体库 →</a></div>
          <div class="panel-body">
            ${recentMedia.length ? `<div class="media-grid">${recentMedia.map((m) => `
              <div class="media-tile" title="${esc(m.name)}">
                ${m.kind === "image" && m.url ? `<img src="${esc(U.src(m.url))}" alt="">` : `<div class="mt-type">${esc((m.ext || m.type || "FILE").toUpperCase())}</div>`}
              </div>`).join("")}</div>` : `<div class="empty">暂无上传，<a href="${Admin.link("admin/media/upload.html")}">去上传 →</a></div>`}
          </div></div>
      </div>`;
  }

  /* ================= 媒体管理 ================= */
  function renderMedia() {
    const list = store.getJSON("media", []);
    root.innerHTML = `
      <div class="page-head">
        <div><h1>媒体管理</h1><div class="ph-sub">共 ${list.length} 个文件 · 图片 / 视频 / 文档 / 项目文件</div></div>
        <span class="spacer"></span>
        <a class="btn btn-neon" href="${Admin.link("admin/media/upload.html")}">${U.icon("plus")} 上传文件</a>
      </div>
      <div class="flex wrap gap-sm" style="margin-bottom:20px" id="media-filter">
        ${["全部", "图片", "视频", "文档", "项目", "设计", "其他"].map((c, i) => `<button class="chip${i === 0 ? " is-active" : ""}" data-cat="${c}">${c}</button>`).join("")}
      </div>
      <div class="media-grid" id="media-grid"></div>
      <div id="media-empty" style="display:none"></div>`;

    const grid = document.getElementById("media-grid");
    const empty = document.getElementById("media-empty");
    const filter = document.getElementById("media-filter");
    const TYPE_MAP = { 图片: ["image", "图片"], 视频: ["video", "视频"], 文档: ["pdf", "doc", "md", "txt"], 项目: ["zip", "rar", "7z", "py", "js", "vue", "ts"], 设计: ["psd", "ai", "aep", "blend", "fig"] };
    function catOf(m) {
      const ext = (m.ext || "").toLowerCase();
      for (const k of Object.keys(TYPE_MAP)) if (TYPE_MAP[k].includes(m.kind) || TYPE_MAP[k].includes(ext)) return k;
      return "其他";
    }
    function draw() {
      const cat = filter.querySelector(".chip.is-active").dataset.cat;
      const list2 = cat === "全部" ? list : list.filter((m) => catOf(m) === cat);
      empty.style.display = list2.length ? "none" : "block";
      empty.innerHTML = list2.length ? "" : `<div class="empty">${U.icon("file")}<p>该分类暂无文件</p></div>`;
      grid.innerHTML = list2.map((m) => `
        <div class="media-tile" data-id="${esc(m.id)}" title="${esc(m.name)}">
          ${m.kind === "image" && m.url ? `<img src="${esc(U.src(m.url))}" alt="${esc(m.name)}" loading="lazy">`
            : m.kind === "video" && m.url ? `<video src="${esc(U.src(m.url))}" muted preload="metadata"></video><div class="mt-type">MP4</div>`
            : `<div class="mt-type">${esc((m.ext || "FILE").toUpperCase())}</div>`}
          <button class="mt-del" data-del="${esc(m.id)}" title="删除">${U.icon("trash")}</button>
        </div>`).join("") || "";
    }
    filter.addEventListener("click", (e) => {
      const c = e.target.closest(".chip");
      if (!c) return;
      U.qsa(".chip", filter).forEach((x) => x.classList.remove("is-active"));
      c.classList.add("is-active");
      draw();
    });
    grid.addEventListener("click", (e) => {
      const del = e.target.closest("[data-del]");
      if (!del) return;
      if (!confirm("删除该文件？")) return;
      store.setJSON("media", list.filter((x) => String(x.id) !== String(del.dataset.del)));
      toast("已删除", "success");
      setTimeout(() => location.reload(), 400);
    });
    draw();
  }

  /* ================= 上传 ================= */
  function renderUpload() {
    root.innerHTML = `
      <div class="page-head">
        <div><h1>文件上传</h1><div class="ph-sub">支持图片 / 视频 / 文档 / 项目文件。演示环境：小文件转 DataURL 存入本地，大文件仅记录元数据。</div></div>
        <span class="spacer"></span>
        <a class="btn btn-ghost btn-sm" href="${Admin.link("admin/media/index.html")}">← 媒体库</a>
      </div>
      <div class="panel"><div class="panel-body">
        <div class="dropzone" id="dropzone">
          <div class="dz-icon">${U.icon("download")}</div>
          <h3>Drag & Drop Files</h3>
          <p class="muted" style="margin-top:6px">将文件拖拽到此处，或点击选择文件（建议单张 ≤ 1.2MB）</p>
          <input type="file" id="file-input" multiple hidden>
        </div>
        <div id="upload-progress" class="upload-progress" style="display:none"><i></i></div>
      </div></div>
      <div class="panel"><div class="panel-head"><h3>上传队列</h3><span class="spacer"></span><span class="small muted" id="queue-count">0 个文件</span></div>
        <div class="panel-body" id="queue-list"><div class="empty">还没有选择文件</div></div>
      </div>`;

    const dropzone = document.getElementById("dropzone");
    const input = document.getElementById("file-input");
    const listEl = document.getElementById("queue-list");
    const countEl = document.getElementById("queue-count");
    const progress = document.getElementById("upload-progress");
    const bar = progress.querySelector("i");
    let queue = [];

    dropzone.addEventListener("click", () => input.click());
    ["dragenter", "dragover"].forEach((ev) => dropzone.addEventListener(ev, (e) => { e.preventDefault(); dropzone.classList.add("is-drag"); }));
    ["dragleave", "drop"].forEach((ev) => dropzone.addEventListener(ev, (e) => { e.preventDefault(); dropzone.classList.remove("is-drag"); }));
    dropzone.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));
    input.addEventListener("change", () => addFiles(input.files));

    function extOf(name) { return (name.split(".").pop() || "").toLowerCase(); }
    function kindOf(ext, type) {
      if (type && type.startsWith("image")) return "image";
      if (type && type.startsWith("video")) return "video";
      if (["pdf", "doc", "docx", "md", "txt"].includes(ext)) return "doc";
      if (["zip", "rar", "7z"].includes(ext)) return "archive";
      if (["psd", "ai", "aep", "blend", "fig", "sketch"].includes(ext)) return "design";
      return "code";
    }

    function addFiles(files) {
      [...files].forEach((f) => {
        const ext = extOf(f.name);
        const kind = kindOf(ext, f.type);
        const entry = {
          id: store.uid("m"),
          name: f.name, size: f.size, ext,
          kind: kind === "image" ? "image" : kind === "video" ? "video" : "file",
          type: kind === "image" ? "图片" : kind === "video" ? "视频" : kind === "doc" ? "文档" : kind === "archive" ? "项目" : kind === "design" ? "设计" : "其他",
          date: new Date().toISOString().slice(0, 10),
          url: "",
        };
        queue.push({ f, entry, status: "pending" });
      });
      renderQueue();
    }

    function renderQueue() {
      countEl.textContent = queue.length + " 个文件";
      listEl.innerHTML = queue.map((q, i) => `
        <div class="file-item" style="margin-bottom:10px">
          <span class="fi ext-${q.entry.kind === "image" ? "src" : esc(q.entry.ext)}">${esc(q.entry.type.slice(0, 2).toUpperCase())}</span>
          <span class="fi-name"><b>${esc(q.entry.name)}</b><span>${U.fmtSize(q.entry.size)} · ${esc(q.entry.type)}</span></span>
          <span class="small" data-st="${i}">${q.status === "done" ? "✅ 已存入媒体库" : q.status === "skip" ? "⚠️ 体积过大，仅记录元数据" : "等待"}</span>
        </div>`).join("");
    }

    function process(i) {
      if (i >= queue.length) return;
      const q = queue[i];
      const mark = (status) => { q.status = status; const el = listEl.querySelector(`[data-st="${i}"]`); if (el) el.textContent = status === "done" ? "✅ 已存入媒体库" : status === "skip" ? "⚠️ 仅记录元数据" : "失败"; };
      const saveAndNext = (entry) => {
        const media = store.getJSON("media", []);
        media.unshift(entry);
        store.setJSON("media", media);
        progress.style.display = "block";
        bar.style.width = ((i + 1) / queue.length * 100) + "%";
        mark("done");
        setTimeout(() => process(i + 1), 120);
      };

      const isImage = q.f.type && q.f.type.startsWith("image");
      if (isImage && q.f.size <= 1200 * 1024) {
        const rd = new FileReader();
        rd.onload = () => saveAndNext({ ...q.entry, url: rd.result, kind: "image" });
        rd.readAsDataURL(q.f);
      } else if (q.f.type && q.f.type.startsWith("video") && q.f.size <= 2000 * 1024) {
        const rd = new FileReader();
        rd.onload = () => saveAndNext({ ...q.entry, url: rd.result, kind: "video" });
        rd.readAsDataURL(q.f);
      } else {
        // 仅记录元数据
        const media = store.getJSON("media", []);
        media.unshift({ ...q.entry });
        store.setJSON("media", media);
        progress.style.display = "block";
        bar.style.width = ((i + 1) / queue.length * 100) + "%";
        mark("skip");
        setTimeout(() => process(i + 1), 120);
      }
    }
    // 添加即处理
    const origAdd = addFiles;
    addFiles = function (files) { origAdd(files); setTimeout(() => process(0), 300); };
  }

  /* ================= 设置：网站 / 个人资料 / SEO ================= */
  function field(name, label, value, opts) {
    opts = opts || {};
    return `<div class="field"><label>${label}</label>
      ${opts.type === "textarea" ? `<textarea class="textarea" id="set-${name}" rows="${opts.rows || 3}">${esc(value || "")}</textarea>`
        : opts.type === "select" ? `<select class="select" id="set-${name}">${opts.options.map((o) => `<option ${value === o ? "selected" : ""}>${o}</option>`).join("")}</select>`
        : `<input class="input" id="set-${name}" value="${esc(value || "")}" ${opts.type === "password" ? 'type="password"' : ""}>`}
      ${opts.hint ? `<small class="muted">${opts.hint}</small>` : ""}
    </div>`;
  }

  function renderSettingsSite() {
    const s = D.getSettings();
    const seo = s.seo || {};
    root.innerHTML = `
      <div class="page-head"><div><h1>网站设置</h1><div class="ph-sub">名称、描述、主题、账号与 SEO 基础信息</div></div></div>
      <form id="settings-form" class="grid" style="gap:22px;max-width:860px">
        <div class="panel"><div class="panel-head"><h3>站点信息</h3></div><div class="panel-body form-grid">
          <div class="form-row">
            ${field("siteName", "网站名称", s.siteName)}
            ${field("siteTitle", "站点标题", s.siteTitle)}
          </div>
          ${field("siteDesc", "网站描述", s.siteDesc, { type: "textarea", rows: 2 })}
          ${field("footerText", "Footer 标语", s.footerText, { type: "textarea", rows: 2 })}
          ${field("copyright", "版权文字", s.copyright)}
        </div></div>
        <div class="panel"><div class="panel-head"><h3>外观与账号</h3></div><div class="panel-body form-grid">
          <div class="form-row">
            ${field("theme", "默认主题", s.theme, { type: "select", options: ["dark", "light", "system"] })}
            <div class="field"><label>&nbsp;</label><div class="check" style="padding-top:12px"><input type="checkbox" id="set-reduce" ${s.reduceMotion ? "checked" : ""}> 默认减少动态效果</div></div>
          </div>
          <div class="form-row">
            ${field("adminUser", "后台账号", s.adminUser)}
            ${field("adminPass", "后台密码", s.adminPass, { type: "password", hint: "演示环境明文存储，正式部署请使用后端加密" })}
          </div>
        </div></div>
        <div class="panel"><div class="panel-head"><h3>SEO</h3></div><div class="panel-body form-grid">
          ${field("ogTitle", "OG 标题", seo.ogTitle)}
          ${field("ogDesc", "OG 描述", seo.ogDesc, { type: "textarea", rows: 2 })}
          ${field("ogImage", "OG 图片", seo.ogImage)}
          <div class="form-row">
            ${field("robots", "Robots", seo.robots || "index, follow")}
            ${field("keywords", "关键词", s.keywords)}
          </div>
        </div></div>
        <div><button class="btn btn-primary" type="submit">保存设置</button></div>
      </form>`;

    document.getElementById("settings-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const read = (id) => document.getElementById(id).value;
      const ns = {
        siteName: read("set-siteName"), siteTitle: read("set-siteTitle"),
        siteDesc: read("set-siteDesc"), footerText: read("set-footerText"),
        copyright: read("set-copyright"), theme: read("set-theme"),
        adminUser: read("set-adminUser"), adminPass: read("set-adminPass"),
        reduceMotion: document.getElementById("set-reduce").checked,
        keywords: read("set-keywords"),
        seo: { ogTitle: read("set-ogTitle"), ogDesc: read("set-ogDesc"), ogImage: read("set-ogImage"), robots: read("set-robots"), sitemapEnabled: s.seo.sitemapEnabled },
      };
      D.saveSettings(ns);
      if (ns.theme) global.XingMianTheme.apply(global.XingMianTheme.resolveTheme(ns.theme));
      toast("设置已保存", "success");
    });
  }

  function renderProfile() {
    const p = D.getProfile();
    const socialKeys = ["github", "instagram", "youtube", "bilibili", "twitter"];
    root.innerHTML = `
      <div class="page-head"><div><h1>个人资料</h1><div class="ph-sub">前台「关于我」页数据源</div></div></div>
      <form id="profile-form" class="grid" style="gap:22px;max-width:900px">
        <div class="panel"><div class="panel-head"><h3>基础信息</h3></div><div class="panel-body form-grid">
          <div class="flex items-center gap-lg">
            <img id="pf-avatar" src="${esc(U.src(p.avatar || "assets/images/avatar/avatar.svg"))}" alt="avatar" style="width:96px;height:96px;border-radius:22px;object-fit:cover;border:1px solid var(--border-soft)">
            <div class="grid gap-sm">
              <input type="file" id="pf-avatar-file" accept="image/*" hidden>
              <button type="button" class="btn btn-outline btn-sm" id="pf-avatar-btn">更换头像</button>
              <small class="muted">≤ 1MB 的图片会转为 DataURL 本地保存</small>
            </div>
          </div>
          <div class="form-row">
            ${field("name", "姓名", p.name)}
            ${field("title", "头衔", p.title)}
          </div>
          ${field("tagline", "标语", p.tagline)}
          ${field("bio", "个人简介", p.bio, { type: "textarea", rows: 4 })}
          <div class="form-row">
            ${field("email", "邮箱", p.email)}
            ${field("location", "位置", p.location || "")}
          </div>
        </div></div>
        <div class="panel"><div class="panel-head"><h3>社交链接</h3></div><div class="panel-body form-grid">
          <div class="form-row">
            ${socialKeys.map((k) => field("social-" + k, k.toUpperCase(), (p.social || {})[k] || "")).join("")}
          </div>
        </div></div>
        <div class="panel"><div class="panel-head"><h3>经历</h3></div><div class="panel-body" id="exp-rows">
          ${(p.experience || []).map((e, i) => `
            <div class="form-row" style="margin-bottom:14px" data-exp="${i}">
              <input class="input" data-exp-role value="${esc(e.role)}" placeholder="职位">
              <input class="input" data-exp-org value="${esc(e.org)}" placeholder="公司/组织">
              <input class="input" data-exp-range value="${esc(e.range)}" placeholder="2022 — 2024">
            </div>`).join("")}
        </div>
        <div class="panel-body" style="padding-top:0"><button type="button" class="btn btn-ghost btn-sm" id="exp-add">+ 添加经历</button></div></div>
        <div><button class="btn btn-primary" type="submit">保存资料</button></div>
      </form>`;

    document.getElementById("pf-avatar-btn").addEventListener("click", () => document.getElementById("pf-avatar-file").click());
    document.getElementById("pf-avatar-file").addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      if (f.size > 1000 * 1024) { toast("图片过大", "error"); return; }
      const rd = new FileReader();
      rd.onload = () => { document.getElementById("pf-avatar").src = rd.result; document.getElementById("pf-avatar").dataset.dataurl = rd.result; };
      rd.readAsDataURL(f);
    });
    document.getElementById("exp-add").addEventListener("click", () => {
      const rows = document.getElementById("exp-rows");
      const i = rows.children.length;
      rows.insertAdjacentHTML("beforeend", `
        <div class="form-row" style="margin-bottom:14px" data-exp="${i}">
          <input class="input" data-exp-role placeholder="职位"><input class="input" data-exp-org placeholder="公司/组织"><input class="input" data-exp-range placeholder="2022 — 2024">
        </div>`);
    });

    document.getElementById("profile-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const read = (id) => document.getElementById(id).value;
      const exp = U.qsa("[data-exp]", document).map((row) => ({
        role: row.querySelector("[data-exp-role]").value.trim(),
        org: row.querySelector("[data-exp-org]").value.trim(),
        range: row.querySelector("[data-exp-range]").value.trim(),
      })).filter((x) => x.role);
      const social = {};
      socialKeys.forEach((k) => { social[k] = read("set-social-" + k).trim(); });
      const np = {
        ...p,
        name: read("set-name"), title: read("set-title"), tagline: read("set-tagline"),
        bio: read("set-bio"), email: read("set-email").trim(), location: read("set-location"),
        social, experience: exp,
      };
      const av = document.getElementById("pf-avatar");
      if (av.dataset.dataurl) np.avatar = av.dataset.dataurl;
      D.saveProfile(np);
      toast("个人资料已保存", "success");
    });
  }

  function renderSeo() {
    const s = D.getSettings();
    const seo = s.seo || {};
    root.innerHTML = `
      <div class="page-head"><div><h1>SEO 设置</h1><div class="ph-sub">这些信息会渲染到每个页面的 meta 标签与 sitemap</div></div></div>
      <form id="seo-form" class="grid" style="gap:22px;max-width:860px">
        <div class="panel"><div class="panel-head"><h3>全局 SEO</h3></div><div class="panel-body form-grid">
          ${field("ogTitle", "默认标题", seo.ogTitle)}
          ${field("ogDesc", "默认描述", seo.ogDesc, { type: "textarea" })}
          ${field("ogImage", "分享图（OG Image）", seo.ogImage)}
          <div class="form-row">
            ${field("robots", "robots 指令", seo.robots || "index, follow")}
            ${field("keywords", "关键词", s.keywords || "")}
          </div>
          <label class="check"><input type="checkbox" id="seo-sitemap" ${seo.sitemapEnabled !== false ? "checked" : ""}> 启用 sitemap.xml</label>
        </div></div>
        <div><button class="btn btn-primary" type="submit">保存 SEO 设置</button></div>
      </form>`;
    document.getElementById("seo-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const read = (id) => document.getElementById(id).value;
      s.keywords = read("set-keywords");
      s.seo = { ogTitle: read("set-ogTitle"), ogDesc: read("set-ogDesc"), ogImage: read("set-ogImage"), robots: read("set-robots"), sitemapEnabled: document.getElementById("seo-sitemap").checked };
      D.saveSettings(s);
      toast("SEO 设置已保存", "success");
    });
  }

  /* ================= 数据统计 ================= */
  function renderStatistics() {
    const stat = D.getStatistics();
    const views = store.getJSON("views", { total: 0, today: 0, day: "" });
    const c = D.counts();
    const days = Object.entries(stat.daily || {}).sort((a, b) => a[0].localeCompare(b[0])).slice(-14);
    const maxDay = Math.max(1, ...days.map(([, v]) => v));

    root.innerHTML = `
      <div class="page-head"><div><h1>数据统计</h1><div class="ph-sub">访问量（演示为本地计数）与内容概况</div></div></div>
      <div class="stat-grid">
        ${[
          { n: views.today, l: "今日访问" },
          { n: stat.viewsTotal + views.total, l: "总访问量" },
          { n: stat.visitorsTotal, l: "独立访客（模拟）" },
          { n: c.works + c.projects + c.articles, l: "内容总数" },
        ].map((s) => `<div class="stat-card glass"><div class="sc-num"><span class="count" data-to="${s.n}">0</span></div><div class="sc-label">${s.l}</div></div>`).join("")}
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:24px">
        <div class="panel"><div class="panel-head"><h3>近 ${days.length} 天访问趋势</h3></div><div class="panel-body">
          <div class="mini-bars">${days.map(([d, v]) => `
            <div class="bar-col" title="${d}: ${v}">
              <span class="small">${v}</span><div class="bar" style="height:${(v / maxDay * 100).toFixed(1)}%"></div>
              <span>${d.slice(5)}</span>
            </div>`).join("")}</div>
        </div></div>
        <div class="panel"><div class="panel-head"><h3>内容统计</h3></div><div class="panel-body">
          ${[["作品", c.works], ["项目", c.projects], ["文章", c.articles], ["媒体文件", c.media], ["标签", c.tags]].map(([l, n]) => `
            <div class="info-row"><dt>${l}</dt><dd>${n}</dd></div>`).join("")}
        </div></div>
        <div class="panel"><div class="panel-head"><h3>访问来源（模拟）</h3></div><div class="panel-body">
          ${(stat.sources || []).map((s) => `
            <div class="skill-row"><span>${esc(s.label)}</span><div class="bar"><i data-pct="${s.value}" style="width:${s.value}%"></i></div><span class="pct">${s.value}%</span></div>`).join("")}
        </div></div>
        <div class="panel"><div class="panel-head"><h3>设备占比（模拟）</h3></div><div class="panel-body">
          ${(stat.devices || []).map((d) => `
            <div class="skill-row"><span>${esc(d.label)}</span><div class="bar"><i data-pct="${d.value}" style="width:${d.value}%"></i></div><span class="pct">${d.value}%</span></div>`).join("")}
        </div></div>
      </div>`;
    global.XingMianFx.initCounters(document);
  }

  /* ================= Boot 分发 ================= */
  function boot() {
    const map = {
      "works-list": () => renderListPage("works"),
      "work-form": () => renderFormPage("works"),
      "projects-list": () => renderListPage("projects"),
      "project-form": () => renderFormPage("projects"),
      "articles-list": () => renderListPage("articles"),
      "article-form": () => renderFormPage("articles"),
      dashboard: renderDashboard,
      "media-list": renderMedia,
      "media-upload": renderUpload,
      "settings-site": renderSettingsSite,
      "settings-profile": renderProfile,
      "settings-seo": renderSeo,
      statistics: renderStatistics,
    };
    if (map[Admin.page]) map[Admin.page]();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
