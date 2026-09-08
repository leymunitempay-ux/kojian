/* ============================================================
   星冕 VR3D — Store：localStorage 持久化（可降级内存）
   纯前端后台 = localStorage + 种子数据
   ============================================================ */
(function (global) {
  "use strict";

  const PREFIX = "xingmian_";

  let memory = {};
  let available = true;
  try {
    const t = "__xingmian_test__";
    global.localStorage.setItem(t, "1");
    global.localStorage.removeItem(t);
  } catch (e) {
    available = false;
  }

  function read(key) {
    if (!available) return memory[key] !== undefined ? memory[key] : null;
    try { return global.localStorage.getItem(PREFIX + key); } catch (e) { return null; }
  }
  function write(key, value) {
    if (!available) { memory[key] = value; return; }
    try { global.localStorage.setItem(PREFIX + key, value); } catch (e) { memory[key] = value; }
  }
  function remove(key) {
    if (!available) { delete memory[key]; return; }
    try { global.localStorage.removeItem(PREFIX + key); } catch (e) { delete memory[key]; }
  }

  const Store = {
    available() { return available; },

    getJSON(key, fallback) {
      const raw = read(key);
      if (raw === null || raw === undefined) return fallback;
      try { return JSON.parse(raw); } catch (e) { return fallback; }
    },
    setJSON(key, val) { write(key, JSON.stringify(val)); },
    get(key) { return read(key); },
    set(key, val) { write(key, String(val)); },
    removeKey: remove,

    /* ---- 内容集合：若从未初始化则以种子数据填充 ---- */
    initCollection(name, seed) {
      const raw = read(name);
      if (raw === null) {
        write(name, JSON.stringify(seed));
        return seed;
      }
      try { return JSON.parse(raw); } catch (e) { return seed; }
    },

    /* ---- 通用统计（前台浏览计数） ---- */
    bumpViews() {
      let v = Store.getJSON("views", { total: 0, today: 0, day: new Date().toDateString() });
      const now = new Date().toDateString();
      if (v.day !== now) { v.day = now; v.today = 0; }
      v.total += 1;
      v.today += 1;
      Store.setJSON("views", v);
      return v;
    },

    uid(prefix) {
      return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    },

    /* 清空本站所有本地数据（重置为种子数据） */
    clearAll() {
      if (available) {
        const keys = [];
        for (let i = 0; i < global.localStorage.length; i++) {
          const k = global.localStorage.key(i);
          if (k && k.indexOf(PREFIX) === 0) keys.push(k);
        }
        keys.forEach((k) => global.localStorage.removeItem(k));
      } else {
        memory = {};
      }
    },
  };

  global.XingMianStore = Store;
})(window);
