/* 星冕 VR3D — SVG 占位封面生成器（零依赖） */
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

// 调色板
const PALETTES = [
  ["#1b1440", "#6a3cff", "#ff6ec7"], // 紫
  ["#041424", "#0e9bd8", "#54e1ff"], // 蓝青
  ["#170b2e", "#8b5cf6", "#54e1ff"], // 紫青
  ["#1a0a24", "#d63c9e", "#ffb86c"], // 粉橙
  ["#03181f", "#00b8a9", "#7cffcb"], // 青绿
  ["#12081a", "#ff6ec7", "#8b7cff"], // 粉紫
  ["#061020", "#2d6cff", "#54e1ff"],
  ["#13121a", "#8b7cff", "#ff6ec7"],
  ["#052a2a", "#00d1c1", "#b9fbc0"],
];

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function rand(seed) {
  let t = seed;
  return () => {
    t = (t * 1664525 + 1013904223) >>> 0;
    return t / 4294967296;
  };
}

function coverSVG(id, title, subtitle, ratio = "16/10") {
  const [w, h] = ratio === "16/10" ? [640, 400] : [640, 640];
  const pal = PALETTES[hashStr(id) % PALETTES.length];
  const r = rand(hashStr(id));
  const angle = 120 + r() * 60;
  const circles = [];
  for (let i = 0; i < 26; i++) {
    const cx = r() * w, cy = r() * h, rad = 4 + r() * 80;
    const op = 0.05 + r() * 0.16;
    circles.push(`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${rad.toFixed(0)}" fill="${i % 2 ? pal[2] : pal[1]}" opacity="${op.toFixed(2)}"/>`);
  }
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const cx = w * (0.2 + r() * 0.6), cy = h * (0.15 + r() * 0.5);
    rings.push(`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(40 + r() * 90).toFixed(0)}" fill="none" stroke="${pal[2]}" stroke-width="1.2" opacity="0.35"/>`);
  }
  const gridLines = [];
  for (let x = 0; x <= w; x += 40) gridLines.push(`<line x1="${x}" y1="0" x2="${x * 0.4}" y2="${h}" stroke="#fff" stroke-width="0.5" opacity="0.06"/>`);
  for (let y = 0; y <= h; y += 40) gridLines.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y * 0.5}" stroke="#fff" stroke-width="0.5" opacity="0.06"/>`);

  const titleText = title.slice(0, 16);
  const subText = (subtitle || "XINGMIAN DIGITAL STUDIO").toUpperCase().slice(0, 26);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${pal[0]}"/>
      <stop offset="60%" stop-color="${pal[1]}"/>
      <stop offset="100%" stop-color="${pal[2]}" stop-opacity="0.85"/>
    </linearGradient>
    <radialGradient id="r${id}" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g${id})"/>
  <rect width="${w}" height="${h}" fill="url(#r${id})"/>
  ${gridLines.join("\n  ")}
  ${rings.join("\n  ")}
  ${circles.join("\n  ")}
  <g transform="translate(${w - 150}, 46)" opacity="0.9">
    <polygon points="0,26 22,0 44,26" fill="none" stroke="#fff" stroke-width="1.4" opacity="0.85"/>
    <polygon points="0,58 22,32 44,58" fill="none" stroke="#fff" stroke-width="1.4" opacity="0.5"/>
    <circle cx="22" cy="16" r="4" fill="#fff" opacity="0.9"/>
  </g>
  <text x="34" y="${h - 74}" font-family="Arial, Helvetica, sans-serif" font-size="15" letter-spacing="4" fill="#ffffff" opacity="0.65">${subText}</text>
  <text x="32" y="${h - 34}" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="26" fill="#ffffff">${titleText}</text>
</svg>`;
}

function avatarSVG() {
  const pal = PALETTES[0];
  const lines = [];
  for (let i = 0; i < 12; i++) {
    lines.push(`<circle cx="${(i * 73) % 420}" cy="${(i * 137) % 420}" r="${8 + (i % 5) * 9}" fill="#fff" opacity="0.08"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">
  <defs>
    <linearGradient id="ag" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${pal[0]}"/>
      <stop offset="100%" stop-color="${pal[1]}"/>
    </linearGradient>
  </defs>
  <rect width="480" height="480" fill="url(#ag)"/>
  ${lines.join("\n  ")}
  <circle cx="240" cy="240" r="150" fill="none" stroke="#fff" stroke-width="1" opacity="0.35"/>
  <circle cx="240" cy="240" r="120" fill="none" stroke="#fff" stroke-width="1" opacity="0.25"/>
  <text x="240" y="258" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="120" text-anchor="middle" fill="#ffffff">G</text>
  <text x="240" y="330" font-family="Arial, Helvetica, sans-serif" font-size="18" letter-spacing="10" text-anchor="middle" fill="#ffffff" opacity="0.75">XINGMIAN</text>
</svg>`;
}

function fallbackSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
  <defs>
    <linearGradient id="fg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#151518"/>
      <stop offset="100%" stop-color="#29292D"/>
    </linearGradient>
  </defs>
  <rect width="640" height="400" fill="url(#fg)"/>
  <path d="M0 340 L120 240 L220 300 L360 160 L500 260 L640 120 L640 400 L0 400Z" fill="#8b7cff" opacity="0.18"/>
  <text x="320" y="212" font-family="Arial" font-size="22" fill="#8b7cff" text-anchor="middle" opacity="0.9">星冕.</text>
</svg>`;
}

const jobs = {
  "assets/images/works/w1.svg": coverSVG("w1", "Cyber Bloom", "AE ANIMATION"),
  "assets/images/works/w2.svg": coverSVG("w2", "Vue3 Portfolio", "WEB DESIGN"),
  "assets/images/works/w3.svg": coverSVG("w3", "Python Data Tool", "PYTHON"),
  "assets/images/works/w4.svg": coverSVG("w4", "Lowpoly Island", "BLENDER 3D"),
  "assets/images/works/w5.svg": coverSVG("w5", "Music App UI", "UI DESIGN"),
  "assets/images/works/w6.svg": coverSVG("w6", "City Night", "PHOTOGRAPHY"),
  "assets/images/projects/p1.svg": coverSVG("p1", "星冕 VR3D Website", "CSS 3D · WEB"),
  "assets/images/projects/p2.svg": coverSVG("p2", "Data Dashboard", "VUE · ECHARTS"),
  "assets/images/projects/p3.svg": coverSVG("p3", "Blender Short Film", "BLENDER · 3D"),
  "assets/images/projects/p4.svg": coverSVG("p4", "Python Automation", "PYTHON SCRIPTS"),
  "assets/images/articles/a1.svg": coverSVG("a1", "CSS 3D 沉浸式主页", "FRONT-END"),
  "assets/images/articles/a2.svg": coverSVG("a2", "Python 学习笔记", "PYTHON"),
  "assets/images/articles/a3.svg": coverSVG("a3", "Vue3 组合式 API", "VUE 3"),
  "assets/images/articles/a4.svg": coverSVG("a4", "Blender 低多边形", "BLENDER 3D"),
  "assets/images/gallery/g1.svg": coverSVG("g1", "霓虹数据流", "DESIGN"),
  "assets/images/gallery/g2.svg": coverSVG("g2", "悬浮小岛", "BLENDER"),
  "assets/images/gallery/g3.svg": coverSVG("g3", "全息花朵", "AE"),
  "assets/images/gallery/g4.svg": coverSVG("g4", "代码宇宙", "DESIGN"),
  "assets/images/gallery/g5.svg": coverSVG("g5", "粒子漩涡", "AE"),
  "assets/images/gallery/g6.svg": coverSVG("g6", "极光山谷", "BLENDER"),
  "assets/images/gallery/g7.svg": coverSVG("g7", "界面草图", "UI"),
  "assets/images/gallery/g8.svg": coverSVG("g8", "城市夜景", "PHOTO"),
  "assets/images/gallery/g9.svg": coverSVG("g9", "霓虹街角", "PHOTO"),
};

for (const [file, svg] of Object.entries(jobs)) {
  const p = path.join(root, file);
  mkdirSync(path.dirname(p), { recursive: true });
  writeFileSync(p, svg, "utf8");
  console.log("✓", file);
}
mkdirSync(path.join(root, "assets/images/avatar"), { recursive: true });
writeFileSync(path.join(root, "assets/images/avatar/avatar.svg"), avatarSVG(), "utf8");
console.log("✓ assets/images/avatar/avatar.svg");
mkdirSync(path.join(root, "assets/images/backgrounds"), { recursive: true });
writeFileSync(path.join(root, "assets/images/backgrounds/fallback.svg"), fallbackSVG(), "utf8");
console.log("✓ assets/images/backgrounds/fallback.svg");
console.log("done");
