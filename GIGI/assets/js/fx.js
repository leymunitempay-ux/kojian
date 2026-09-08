/* ============================================================
   星冕 VR3D — FX 引擎
   - 星空粒子背景（Canvas，多深度视差）
   - 场景镜头跟随鼠标（视差层 data-depth）
   - 3D 卡片倾斜 + 高光跟随（data-tilt）
   - 镜头式页面切换（LensTransition）
   - 滚动显现（.reveal）、计数（.count）、进度 HUD
   - 自定义光标、Lightbox、视频弹层
   ============================================================ */
(function (global) {
  "use strict";

  const U = global.XingMianUtils;
  const reduceMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = () => window.matchMedia("(pointer: coarse)").matches;

  /* ================= 星空粒子 ================= */
  const Starfield = {
    canvas: null,
    ctx: null,
    stars: [],
    raf: 0,
    mouse: { x: 0, y: 0, tx: 0, ty: 0 },

    start(opts) {
      if (this.canvas) return;
      if (reduceMotion()) return;
      const canvas = document.createElement("canvas");
      canvas.id = "starfield";
      const count = opts && opts.count ? opts.count : 90;
      document.body.appendChild(canvas);
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.resize();
      window.addEventListener("resize", () => this.resize(), { passive: true });
      window.addEventListener("mousemove", (e) => {
        this.mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        this.mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });

      for (let i = 0; i < count; i++) {
        this.stars.push({
          x: Math.random(), y: Math.random(),
          r: Math.random() * 1.9 + 0.5,
          d: Math.random() * 0.8 + 0.2,       // depth
          tw: Math.random() * Math.PI * 2,     // twinkle phase
          sp: Math.random() * 0.0004 + 0.0001, // drift
          hue: Math.random() > 0.8,
        });
      }
      this.loop();
    },

    resize() {
      this.canvas.width = window.innerWidth * devicePixelRatio;
      this.canvas.height = window.innerHeight * devicePixelRatio;
      this.canvas.style.width = window.innerWidth + "px";
      this.canvas.style.height = window.innerHeight + "px";
      this.ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    },

    loop() {
      const c = this.ctx, w = window.innerWidth, h = window.innerHeight;
      c.clearRect(0, 0, w, h);
      this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.04;
      this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.04;
      for (const s of this.stars) {
        s.x -= s.sp * s.d;
        if (s.x < -0.02) s.x = 1.02;
        s.tw += 0.025;
        const px = s.x * w + this.mouse.x * s.d * 26;
        const py = s.y * h + this.mouse.y * s.d * 18;
        const alpha = 0.45 + 0.55 * Math.abs(Math.sin(s.tw));
        c.beginPath();
        c.fillStyle = s.hue
          ? `rgba(139,124,255,${alpha})`
          : `rgba(220,230,255,${alpha * 0.85})`;
        c.arc(px, py, s.r, 0, Math.PI * 2);
        c.fill();
      }
      this.raf = requestAnimationFrame(() => this.loop());
    },

    stop() { cancelAnimationFrame(this.raf); if (this.canvas) this.canvas.remove(); this.canvas = null; this.stars = []; },
  };

  /* ================= 3D 镜头视差 ================= */
  const Parallax = {
    layers: [],
    raf: 0,
    mx: 0, my: 0, tx: 0, ty: 0,
    enabled: false,

    start() {
      if (reduceMotion() || coarse()) return;
      this.layers = U.qsa("[data-depth]");
      if (!this.layers.length) return;
      this.enabled = true;
      const rotY = parseFloat(document.body.dataset.rotY || "4");
      const rotX = parseFloat(document.body.dataset.rotX || "3");
      const scene = document.querySelector(".scene3d");

      window.addEventListener("mousemove", (e) => {
        this.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        this.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });

      const tick = () => {
        this.mx += (this.tx - this.mx) * 0.06;
        this.my += (this.ty - this.my) * 0.06;
        if (scene) {
          scene.style.transform =
            `rotateY(${(this.mx * rotY).toFixed(2)}deg) rotateX(${(-this.my * rotX).toFixed(2)}deg)`;
        }
        for (const el of this.layers) {
          const d = parseFloat(el.dataset.depth || "0");
          const x = this.mx * d * 18;
          const y = this.my * d * 14;
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translateZ(${(d * 24).toFixed(0)}px)`;
        }
        this.raf = requestAnimationFrame(tick);
      };
      tick();
    },
  };

  /* ================= 3D 卡片倾斜 ================= */
  const Tilt = {
    init(scope) {
      if (reduceMotion() || coarse()) return;
      U.qsa("[data-tilt]", scope).forEach((el) => {
        const max = parseFloat(el.dataset.tilt || "8");
        const els = el.classList.contains("work-card3d") ? el : el;
        el.addEventListener("mousemove", (e) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          els.style.transform =
            `perspective(1200px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(10px)`;
          el.classList.add("tilt-active");
        });
        el.addEventListener("mouseleave", () => {
          els.style.transform = "";
          el.classList.remove("tilt-active");
        });
      });
    },
  };

  /* ================= 滚动显现 ================= */
  const Reveal = {
    io: null,
    init(scope) {
      if (!("IntersectionObserver" in window)) {
        U.qsa(".reveal", scope).forEach((el) => el.classList.add("in"));
        return;
      }
      this.io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            this.io.unobserve(en.target);
            en.target.dispatchEvent(new CustomEvent("revealed"));
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      U.qsa(".reveal", scope).forEach((el) => this.io.observe(el));
    },
  };

  /* ================= 滚动显现计数器（.count data-to） ================= */
  function initCounters(scope) {
    U.qsa(".count", scope).forEach((el) => {
      const target = parseFloat(el.dataset.to || el.textContent) || 0;
      const suffix = el.dataset.suffix || "";
      const dec = el.dataset.decimals ? parseInt(el.dataset.decimals) : (target % 1 ? 1 : 0);
      el.addEventListener("revealed", () => {
        if (reduceMotion()) { el.textContent = target + suffix; return; }
        const t0 = performance.now();
        const dur = 1600;
        const step = (now) => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(dec) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
      // 若元素已可见（无 reveal 包裹），直接触发
      if (!el.closest(".reveal")) el.dispatchEvent(new CustomEvent("revealed"));
    });
  }

  /* ================= 技能条填充 ================= */
  function initSkillBars(scope) {
    U.qsa(".skill-row .bar i", scope).forEach((bar) => {
      bar.addEventListener("revealed", () => {
        bar.style.width = bar.dataset.pct + "%";
      });
      if (!bar.closest(".reveal")) bar.style.width = bar.dataset.pct + "%";
    });
  }

  /* ================= 镜头式页面切换 ================= */
  const LensTransition = {
    el: null,
    init() {
      if (this.el) return;
      const el = document.createElement("div");
      el.className = "lens-transition";
      el.innerHTML = `<div class="lens-fill"></div>`;
      document.body.appendChild(el);
      this.el = el;
      this.fill = el.querySelector(".lens-fill");

      // 拦截站内普通链接（排除下载/外链/锚点/按钮）
      document.addEventListener("click", (e) => {
        const a = e.target.closest("a[href]");
        if (!a) return;
        const href = a.getAttribute("href");
        if (a.target === "_blank" || href.startsWith("http") || href.startsWith("mailto:") ||
          href.startsWith("tel:") || href.startsWith("#") || href.startsWith("javascript:") ||
          a.dataset.noLens !== undefined || href.includes("download")) return;
        // 同页锚点
        if (href.includes("#")) return;
        e.preventDefault();
        this.go(href, a);
      });
    },

    go(href, fromEl) {
      if (reduceMotion()) { window.location.href = href; return; }
      const r = fromEl ? fromEl.getBoundingClientRect() : null;
      const x = r ? (r.left + r.width / 2) : window.innerWidth / 2;
      const y = r ? (r.top + r.height / 2) : window.innerHeight / 2;
      this.el.style.setProperty("--lx", x + "px");
      this.el.style.setProperty("--ly", y + "px");
      this.el.style.setProperty("--ls", "0px");
      this.el.classList.add("is-enter");
      document.body.classList.add("page-exit");
      requestAnimationFrame(() => {
        this.el.style.setProperty("--ls", "120vmax");
        setTimeout(() => { window.location.href = href; }, 700);
      });
    },
  };

  /* ================= 自定义光标 ================= */
  const Cursor = {
    dot: null, ring: null,
    init() {
      if (coarse() || reduceMotion()) return;
      document.documentElement.classList.add("has-cursor");
      this.dot = document.createElement("div");
      this.ring = document.createElement("div");
      this.dot.className = "vr-cursor vr-cursor-dot";
      this.ring.className = "vr-cursor vr-cursor-ring";
      document.body.appendChild(this.dot);
      document.body.appendChild(this.ring);
      let dx = -100, dy = -100, rx = -100, ry = -100;
      window.addEventListener("mousemove", (e) => {
        dx = e.clientX; dy = e.clientY;
        this.dot.style.transform = `translate(${dx - 3}px, ${dy - 3}px)`;
      }, { passive: true });
      const loop = () => {
        rx += (dx - rx) * 0.16;
        ry += (dy - ry) * 0.16;
        this.ring.style.transform = `translate(${rx - 17}px, ${ry - 17}px)`;
        requestAnimationFrame(loop);
      };
      loop();

      document.addEventListener("mousedown", () => this.ring.classList.add("is-down"));
      document.addEventListener("mouseup", () => this.ring.classList.remove("is-down"));
      document.addEventListener("mouseover", (e) => {
        if (e.target.closest("a, button, [data-tilt], input, textarea, .work-card3d"))
          this.ring.classList.add("is-hover");
        else this.ring.classList.remove("is-hover");
      });
    },
  };

  /* ================= Lightbox ================= */
  const Lightbox = {
    el: null,
    open(items, index, opts) {
      opts = opts || {};
      if (!this.el) {
        const el = document.createElement("div");
        el.className = "lightbox";
        el.innerHTML = `
          <div class="lb-backdrop"></div>
          <button class="lb-btn lb-close" aria-label="关闭">${U.icon("close")}</button>
          <button class="lb-btn lb-prev" aria-label="上一张">${U.icon("chevL")}</button>
          <div class="lb-stage">
            <img class="lb-media" src="" alt="">
            <div class="lb-caption"></div>
          </div>
          <button class="lb-btn lb-next" aria-label="下一张">${U.icon("chevR")}</button>`;
        document.body.appendChild(el);
        this.el = el;
        el.querySelector(".lb-backdrop").addEventListener("click", () => this.close());
        el.querySelector(".lb-close").addEventListener("click", () => this.close());
        el.querySelector(".lb-prev").addEventListener("click", () => this.show(this.i - 1));
        el.querySelector(".lb-next").addEventListener("click", () => this.show(this.i + 1));
        document.addEventListener("keydown", (e) => {
          if (!this.el.classList.contains("is-open")) return;
          if (e.key === "Escape") this.close();
          if (e.key === "ArrowLeft") this.show(this.i - 1);
          if (e.key === "ArrowRight") this.show(this.i + 1);
        });
      }
      this.items = items;
      this.i = index;
      this.el.classList.add("is-open");
      document.body.style.overflow = "hidden";
      this.show(index);
    },
    show(i) {
      if (!this.items || !this.items.length) return;
      this.i = (i + this.items.length) % this.items.length;
      const it = this.items[this.i];
      const img = this.el.querySelector(".lb-media");
      const cap = this.el.querySelector(".lb-caption");
      if (typeof it === "string") {
        img.src = it; cap.textContent = "";
      } else {
        img.src = it.src || it.url || it;
        cap.textContent = it.title || it.caption || "";
      }
      this.el.querySelector(".lb-prev").style.display = this.items.length > 1 ? "" : "none";
      this.el.querySelector(".lb-next").style.display = this.items.length > 1 ? "" : "none";
    },
    close() {
      if (!this.el) return;
      this.el.classList.remove("is-open");
      document.body.style.overflow = "";
    },
  };

  /* ================= 视频弹层 ================= */
  const VideoModal = {
    el: null,
    open(video) {
      if (!this.el) {
        const el = document.createElement("div");
        el.className = "video-modal";
        el.innerHTML = `
          <div class="vm-backdrop"></div>
          <button class="lb-btn lb-close" aria-label="关闭">${U.icon("close")}</button>
          <div class="vm-frame">
            ${video.videoUrl
              ? `<video controls autoplay playsinline src="${video.videoUrl}" poster="${video.poster || ""}"></video>`
              : `<div class="center" style="height:100%;color:#aaa;flex-direction:column;gap:14px">
                   ${U.icon("video")}<p>该视频尚未上传源文件<br><small>请到后台「媒体 → 上传」添加 MP4 后在此播放</small></p>
                 </div>`}
          </div>`;
        document.body.appendChild(el);
        this.el = el;
        el.querySelector(".vm-backdrop").addEventListener("click", () => this.close());
        el.querySelector(".lb-close").addEventListener("click", () => this.close());
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && this.el.classList.contains("is-open")) this.close();
        });
      }
      this.el.querySelector(".vm-frame").innerHTML = video.videoUrl
        ? `<video controls autoplay playsinline src="${video.videoUrl}" poster="${video.poster || ""}"></video>`
        : `<div class="center" style="height:100%;color:#aaa;flex-direction:column;gap:14px">
             ${U.icon("video")}<p>该视频尚未上传源文件<br><small>请到后台「媒体 → 上传」添加 MP4 后在此播放</small></p>
           </div>`;
      this.el.classList.add("is-open");
      document.body.style.overflow = "hidden";
    },
    close() {
      if (!this.el) return;
      this.el.classList.remove("is-open");
      document.body.style.overflow = "";
      const v = this.el.querySelector("video");
      if (v) v.pause();
    },
  };

  /* ================= Toast ================= */
  const Toast = {
    el: null,
    show(msg, type) {
      if (!this.el) {
        this.el = document.createElement("div");
        this.el.id = "toast";
        this.el.style.cssText =
          "position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);z-index:3000;" +
          "background:var(--card);border:1px solid var(--glass-border);color:var(--text);padding:12px 22px;" +
          "border-radius:14px;box-shadow:var(--shadow-2);font-size:.92rem;opacity:0;transition:all .35s var(--ease);" +
          "pointer-events:none;max-width:90vw;text-align:center";
        document.body.appendChild(this.el);
      }
      this.el.textContent = msg;
      this.el.style.background = type === "success" ? "var(--neon-grad)" : type === "error" ? "#ff6b6b" : "var(--card)";
      this.el.style.color = type ? "#fff" : "var(--text)";
      requestAnimationFrame(() => {
        this.el.style.opacity = "1";
        this.el.style.transform = "translateX(-50%) translateY(0)";
      });
      clearTimeout(this._t);
      this._t = setTimeout(() => {
        this.el.style.opacity = "0";
        this.el.style.transform = "translateX(-50%) translateY(20px)";
      }, 2600);
    },
  };

  /* ================= Header 滚动状态 & 回到顶部 ================= */
  function initHeaderScroll() {
    const header = document.getElementById("site-header");
    if (!header) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("is-solid", y > 40);
      header.classList.toggle("is-hidden", y > 500 && y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initToTop() {
    let btn = document.getElementById("to-top");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "to-top";
      btn.className = "btn-icon";
      btn.setAttribute("aria-label", "回到顶部");
      btn.innerHTML = U.icon("arrowUp");
      document.body.appendChild(btn);
      btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
    window.addEventListener("scroll", () => {
      btn.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });
  }

  /* ================= 深度进度 HUD ================= */
  function initDepthHud() {
    if (coarse() || reduceMotion()) return;
    let hud = document.querySelector(".depth-hud");
    if (!hud) {
      hud = document.createElement("div");
      hud.className = "depth-hud";
      hud.innerHTML = `<span>DEPTH</span><div class="depth-track"><i></i></div>`;
      document.body.appendChild(hud);
    }
    const bar = hud.querySelector("i");
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `translateY(${p * 250}%)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  global.XingMianFx = {
    Starfield, Parallax, Tilt, Reveal, LensTransition, Cursor, Lightbox, VideoModal, Toast,
    initHeaderScroll, initToTop, initDepthHud, initCounters, initSkillBars,
    reduceMotion, coarse,
  };
})(window);
