/* ============================================================
   星冕 VR3D — 欢迎进入开场（enter boot）
   - 星点粒子背景
   - 「正在唤醒场景…」→ 就绪后启用进入按钮
   - 点击进入：淡出开场，放行页面滚动并触发进场动画
   ============================================================ */
(function (global) {
  "use strict";

  const boot = document.getElementById("enter-boot");
  if (!boot) return;

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 星点粒子 ---------- */
  let canvas = document.getElementById("enter-stars");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "enter-stars";
    boot.insertBefore(canvas, boot.firstChild);
  }
  const ctx = canvas.getContext("2d");
  let stars = [], raf = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.min(140, Math.floor(canvas.width / 10));
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.4 + 0.4,
        tw: Math.random() * Math.PI * 2,
        sp: 0.002 + Math.random() * 0.004,
        hue: Math.random() > 0.75,
      });
    }
  }
  function tick() {
    if (boot.classList.contains("gone")) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.tw += 0.03;
      s.y -= s.sp;
      if (s.y < -0.02) { s.y = 1.02; s.x = Math.random(); }
      const a = 0.35 + 0.65 * Math.abs(Math.sin(s.tw));
      ctx.beginPath();
      ctx.fillStyle = s.hue
        ? `rgba(139,124,255,${a * 0.9})`
        : `rgba(220,228,255,${a * 0.7})`;
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });
  if (!reduceMotion) raf = requestAnimationFrame(tick);

  /* ---------- 就绪流程 ---------- */
  const statusEl = boot.querySelector(".enter-status");
  const enterBtn = boot.querySelector(".enter-btn");

  function ready() {
    if (statusEl) { statusEl.textContent = "✦ 场景已就绪，点击进入"; statusEl.classList.add("ready"); }
    if (enterBtn) enterBtn.disabled = false;
  }
  if (reduceMotion) {
    ready();
  } else {
    const t0 = performance.now();
    const iv = setInterval(() => {
      const p = (performance.now() - t0) / 1700;
      if (statusEl && p < 0.7) {
        const dots = ".".repeat(Math.floor(p * 3) % 3 + 1);
        statusEl.textContent = "正在唤醒场景" + dots;
      }
      if (p >= 1) {
        clearInterval(iv);
        ready();
      }
    }, 200);
  }

  /* ---------- 进入 ---------- */
  function enter() {
    cancelAnimationFrame(raf);
    boot.classList.add("gone");
    document.body.style.overflow = "";
    // 触发经典首页进场呼吸
    document.body.classList.add("page-enter");
    setTimeout(() => document.body.classList.remove("page-enter"), 900);
    // 播放轻量音效感（无音频，仅视觉）后移除
    setTimeout(() => boot.remove(), 950);
    document.dispatchEvent(new CustomEvent("gigi:entered"));
  }

  if (enterBtn) enterBtn.addEventListener("click", enter);
  const skip = boot.querySelector(".enter-skip");
  if (skip) skip.addEventListener("click", enter);

  // 就绪前锁定滚动
  document.body.style.overflow = "hidden";

  // 键盘：回车进入 / Esc 跳过
  document.addEventListener("keydown", function onKey(e) {
    if (!boot.isConnected || boot.classList.contains("gone")) {
      document.removeEventListener("keydown", onKey);
      return;
    }
    if (e.key === "Enter" && enterBtn && !enterBtn.disabled) enter();
    else if (e.key === "Escape") enter();
  });
})(window);
