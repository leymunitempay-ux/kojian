/* ============================================================
   星冕 VR3D — Theme 控制器（Dark / Light / System）
   默认从 settings.theme 读取，用户切换后存 localStorage
   ============================================================ */
(function (global) {
  "use strict";

  const store = global.XingMianStore;
  const settings = (store && store.getJSON ? store.getJSON("settings", global.XINGMIAN_DATA.settings) : global.XINGMIAN_DATA.settings);

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function resolveTheme(mode) {
    if (mode === "light") return "light";
    if (mode === "dark") return "dark";
    return systemPrefersDark() ? "dark" : "light";
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#0B0B0D" : "#F7F7F5";
    document.dispatchEvent(new CustomEvent("gigi:theme", { detail: theme }));
  }

  function currentMode() {
    const s = global.XingMianStore && global.XingMianStore.getJSON
      ? global.XingMianStore.getJSON("settings", settings)
      : settings;
    return s.theme || "dark";
  }

  function saveMode(mode) {
    const s = global.XingMianStore && global.XingMianStore.getJSON
      ? global.XingMianStore.getJSON("settings", settings)
      : settings;
    s.theme = mode;
    if (global.XingMianStore && global.XingMianStore.setJSON) global.XingMianStore.setJSON("settings", s);
  }

  function init() {
    apply(resolveTheme(currentMode()));

    // 系统主题变化时，system 模式跟随
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (currentMode() === "system") apply(resolveTheme("system"));
      });
    }
  }

  function toggle() {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    saveMode(next);
    apply(next);
  }

  global.XingMianTheme = { init, apply, toggle, resolveTheme, currentMode, saveMode };
})(window);
