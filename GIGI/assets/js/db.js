/* ============================================================
   星冕 VR3D — XingMianData：统一数据访问层
   集合：works / projects / articles / gallery / videos / media
   首次访问以种子数据填充 localStorage，之后后台 CRUD 均读 localStorage
   ============================================================ */
(function (global) {
  "use strict";

  const store = global.XingMianStore;
  const seed = global.XINGMIAN_DATA;

  /* 提供 ?reset=1 一键重置演示数据 */
  if (/[?&]reset=1\b/.test(location.search)) {
    store.clearAll();
    const url = location.origin + location.pathname;
    history.replaceState(null, "", url);
  }

  /* ---------- 初始化集合（含媒体库） ---------- */
  const works = store.initCollection("works", seed.works);
  const projects = store.initCollection("projects", seed.projects);
  const articles = store.initCollection("articles", seed.articles);
  const gallery = store.initCollection("gallery", seed.gallery);
  const videos = store.initCollection("videos", seed.videos);
  const media = store.initCollection("media", seed.gallery.map((g) => ({
    id: g.id, name: g.title + ".svg", type: "图片", ext: "svg",
    kind: "image", url: g.src, size: 0, date: g.date,
  })));
  const profile = store.initCollection("profile", seed.profile);
  const settings = store.initCollection("settings", seed.settings);
  const statistics = store.initCollection("statistics", seed.statistics);

  function save(name, data) { store.setJSON(name, data); }
  function bySlug(list, slug) { return list.find((x) => x.slug === slug || x.id === slug); }
  function byId(list, id) { return list.find((x) => String(x.id) === String(id)); }
  function featured(list) { return list.filter((x) => x.featured); }
  function published(list) { return list.filter((x) => x.published !== false); }
  function sorted(list) { return [...list].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))); }
  function related(list, item, n) {
    const tags = item.tags || [];
    return list.filter((x) => x.id !== item.id && x.published !== false)
      .map((x) => ({ x, score: (x.tags || []).filter((t) => tags.includes(t)).length + (x.category === item.category ? 1 : 0) }))
      .filter((r) => r.score > 0).sort((a, b) => b.score - a.score).slice(0, n).map((r) => r.x);
  }
  function nextPrev(list, item) {
    const arr = sorted(published(list));
    const i = arr.findIndex((x) => x.id === item.id);
    return { prev: i > 0 ? arr[i - 1] : null, next: i < arr.length - 1 ? arr[i + 1] : null };
  }
  function searchAll(q) {
    const query = String(q || "").toLowerCase().trim();
    if (!query) return { works: [], projects: [], articles: [], tags: [] };
    const match = (obj, fields) => fields.some((f) => String(obj[f] || "").toLowerCase().includes(query)) ||
      (obj.tags || []).some((t) => t.toLowerCase().includes(query)) ||
      (obj.technologies || []).some((t) => t.toLowerCase().includes(query)) ||
      (obj.technology || []).some((t) => t.toLowerCase().includes(query));
    const w = published(works).filter((x) => match(x, ["title", "description", "category", "content"]));
    const p = published(projects).filter((x) => match(x, ["title", "description", "status", "content"]));
    const a = published(articles).filter((x) => match(x, ["title", "description", "category", "content"]));
    const tagSet = new Set();
    [...w, ...p, ...a].forEach((x) => (x.tags || []).forEach((t) => tagSet.add(t)));
    return { works: w, projects: p, articles: a, tags: [...tagSet] };
  }

  function getTags() {
    const s = new Set();
    [...works, ...projects, ...articles].forEach((x) => (x.tags || []).forEach((t) => s.add(t)));
    return [...s];
  }

  function counts() {
    return {
      works: published(works).length,
      projects: published(projects).length,
      articles: published(articles).length,
      gallery: gallery.length,
      videos: videos.length,
      media: media.length,
      tags: getTags().length,
    };
  }

  /* CRUD helpers（后台用） */
  function create(name, data) {
    const list = store.getJSON(name, []);
    list.unshift(data);
    save(name, list);
    return data;
  }
  function update(name, id, patch) {
    const list = store.getJSON(name, []);
    const i = list.findIndex((x) => String(x.id) === String(id));
    if (i < 0) return null;
    list[i] = { ...list[i], ...patch };
    save(name, list);
    return list[i];
  }
  function remove(name, id) {
    const list = store.getJSON(name, []);
    const next = list.filter((x) => String(x.id) !== String(id));
    save(name, next);
    return next;
  }

  global.XingMianData = {
    collections() {
      return {
        works: store.getJSON("works", []),
        projects: store.getJSON("projects", []),
        articles: store.getJSON("articles", []),
        gallery: store.getJSON("gallery", []),
        videos: store.getJSON("videos", []),
        media: store.getJSON("media", []),
      };
    },
    getProfile() { return store.getJSON("profile", profile); },
    saveProfile(p) { save("profile", p); },
    getSettings() { return store.getJSON("settings", settings); },
    saveSettings(s) { save("settings", s); },
    getStatistics() { return store.getJSON("statistics", statistics); },
    saveStatistics(s) { save("statistics", s); },
    counts,
    works, projects, articles, gallery, videos, media, profile, settings, statistics,
    bySlug, byId, featured, published, sorted, related, nextPrev, searchAll, getTags,
    create, update, remove, save,
    categories: seed.categories,
  };
})(window);
