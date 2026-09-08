/* ============================================================
   星冕 VR3D — 零依赖 Markdown 渲染器 + 轻量语法高亮
   支持：标题/粗斜/链接/图片/列表/表格/代码块/引用/分割线/行内码
   ============================================================ */
(function (global) {
  "use strict";

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ---------------- 轻量代码高亮（按语言做 token 着色） ---------------- */
  const HL = {
    comment: /(\/\/.*|#.*|<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|--.*)/g,
    string: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
    keyword: /\b(?:def|class|import|from|return|if|else|elif|for|while|in|not|and|or|try|except|finally|with|as|pass|break|continue|lambda|global|const|let|var|function|return|new|typeof|instanceof|of|export|default|async|await|yield|this|super|null|undefined|true|false|void|switch|case|do|static|extends|implements|interface|private|public|protected|struct|enum|print|require|module)\b/g,
    func: /\b([a-zA-Z_]\w*)(?=\s*\()/g,
    number: /\b(?:0x[\da-fA-F]+|\d+\.?\d*)\b/g,
  };

  function highlight(code, lang) {
    const langs = { js: 1, javascript: 1, ts: 1, typescript: 1, py: 1, python: 1, html: 1, xml: 1, css: 1, json: 1, bash: 1, sh: 1, sql: 1, cpp: 1, java: 1, vue: 1 };
    if (!langs[lang]) {
      // 无语言：仅转义
      return `<code class="hljs">${escapeHtml(code)}</code>`;
    }
    const esc = escapeHtml(code);
    // 按 token 分片着色（顺序：注释、字符串、关键字、函数、数字）
    const parts = [];
    const re = /(\/\/.*|#.*|<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|--.*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(def|class|import|from|return|if|else|elif|for|while|in|not|and|or|try|except|finally|with|as|pass|break|continue|lambda|global|const|let|var|function|new|typeof|instanceof|of|export|default|async|await|yield|this|super|null|undefined|true|false|void|switch|case|do|static|extends|implements|interface|private|public|protected|print|require|module)\b|([a-zA-Z_]\w*)(?=\s*\()|\b(0x[\da-fA-F]+|\d+\.?\d*)\b/g;
    let last = 0, m;
    while ((m = re.exec(esc))) {
      if (m.index > last) parts.push(esc.slice(last, m.index));
      const [full, c, s, k, f, n] = m;
      if (c) parts.push(`<span class="tok-c">${c}</span>`);
      else if (s) parts.push(`<span class="tok-s">${s}</span>`);
      else if (k) parts.push(`<span class="tok-k">${k}</span>`);
      else if (f) parts.push(`<span class="tok-f">${f}</span>`);
      else if (n) parts.push(`<span class="tok-n">${n}</span>`);
      else parts.push(full);
      last = m.index + full.length;
    }
    if (last < esc.length) parts.push(esc.slice(last));
    return `<code class="hljs language-${escapeHtml(lang)}">${parts.join("")}</code>`;
  }

  /* ---------------- 行内格式 ---------------- */
  function inline(s) {
    if (!s) return "";
    let out = escapeHtml(s);
    // 图片 ![alt](url "title")
    out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g,
      (m, alt, url, title) => `<img src="${url}" alt="${alt}"${title ? ` title="${title}"` : ""} loading="lazy">`);
    // 链接 [text](url)
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g,
      (m, text, url, title) => {
        const external = /^https?:\/\//.test(url) && !url.includes(location.hostname);
        return `<a href="${url}"${external ? ' target="_blank" rel="noopener"' : ""}${title ? ` title="${title}"` : ""}>${inlineText(text)}</a>`;
      });
    // 行内代码（在粗斜之前处理，避免冲突）
    out = out.replace(/`([^`]+)`/g, (m, code) => `<code>${code}</code>`);
    // 粗体与斜体
    out = out.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    out = out.replace(/__([^_]+)__/g, "<strong>$1</strong>");
    out = out.replace(/~~([^~]+)~~/g, "<del>$1</del>");
    return out;
  }
  function inlineText(s) {
    // 链接文本内不再递归图片
    return s;
  }

  /* ---------------- 块级解析 ---------------- */
  function renderTable(lines) {
    // lines: [header, separator, ...rows]
    const header = lines[0].split("|").map(c => c.trim()).filter((c, i, a) => !(i === 0 && c === "") && !(i === a.length - 1 && c === ""));
    let html = "<div style='overflow-x:auto'><table><thead><tr>";
    header.forEach(h => { html += `<th>${inline(h)}</th>`; });
    html += "</tr></thead><tbody>";
    for (let i = 2; i < lines.length; i++) {
      const cells = lines[i].split("|").map(c => c.trim()).filter((c, j, a) => !(j === 0 && c === "") && !(j === a.length - 1 && c === ""));
      html += "<tr>";
      cells.forEach(c => { html += `<td>${inline(c)}</td>`; });
      html += "</tr>";
    }
    html += "</tbody></table></div>";
    return html;
  }

  function renderMarkdown(src) {
    if (!src) return "";
    const lines = String(src).replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    const out = [];
    let i = 0;
    let inCode = false, codeBuf = [], codeLang = "";
    let listStack = []; // 0=ul 1=ol

    function closeLists(level) {
      while (listStack.length > level) {
        const t = listStack.pop();
        out.push(`</${t === 0 ? "ul" : "ol"}>`);
      }
    }

    while (i < lines.length) {
      const line = lines[i];

      // 代码围栏
      if (/^\s*(```|~~~)/.test(line)) {
        if (!inCode) {
          inCode = true;
          codeLang = (line.match(/^`{3,}|~{3,}([\w+-]*)/) || [])[1] || "";
          codeBuf = [];
        } else {
          out.push(`<pre>${highlight(codeBuf.join("\n"), codeLang)}</pre>`);
          inCode = false;
        }
        i++; continue;
      }
      if (inCode) { codeBuf.push(line); i++; continue; }

      // 空行
      if (!line.trim()) { closeLists(0); out.push(""); i++; continue; }

      // 标题
      const h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        closeLists(0);
        const lv = h[1].length;
        out.push(`<h${lv}>${inline(h[2])}</h${lv}>`);
        i++; continue;
      }

      // 分隔线
      if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { closeLists(0); out.push("<hr>"); i++; continue; }

      // 引用
      if (/^\s*>\s?/.test(line)) {
        closeLists(0);
        const buf = [];
        while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
          buf.push(lines[i].replace(/^\s*>\s?/, ""));
          i++;
        }
        out.push(`<blockquote>${inline(buf.join("\n"))}</blockquote>`);
        continue;
      }

      // 表格
      if (lines[i + 1] && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) && /^\s*\|.*\|/.test(line) && lines[i + 1].includes("-")) {
        closeLists(0);
        const tbl = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) { tbl.push(lines[i]); i++; }
        out.push(renderTable(tbl));
        continue;
      }

      // 列表
      const ul = line.match(/^\s*[-*+]\s+(.*)$/);
      const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
      if (ul || ol) {
        const isOl = !!ol;
        const indent = line.match(/^\s*/)[0].length;
        const level = Math.min(4, Math.floor(indent / 2));
        if (listStack.length === 0 || listStack[listStack.length - 1] !== (isOl ? 1 : 0)) {
          closeLists(level);
          out.push(isOl ? "<ol>" : "<ul>");
          listStack.push(isOl ? 1 : 0);
        }
        out.push(`<li>${inline((ul || ol)[1])}</li>`);
        i++; continue;
      }
      closeLists(0);

      // 图片独占一行（含标题）
      if (/^\s*!\[.*\]\(.*\)\s*$/.test(line)) {
        out.push(`<p>${inline(line.trim())}</p>`);
        i++; continue;
      }

      // 普通段落（累积连续行）
      const para = [];
      while (i < lines.length && lines[i].trim() && !/^\s*(#{1,6}\s|```|~~~|\s*>\s?|^\s*[-*+]\s|^\s*\d+[.)]\s|\s*(-{3,}|\*{3,}|_{3,})\s*$)/.test(lines[i]) && !(lines[i + 1] && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]))) {
        para.push(lines[i].trim());
        i++;
      }
      if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`);
      else i++;
    }
    closeLists(0);
    return out.join("\n");
  }

  /* ---------------- front-matter ---------------- */
  function parseFrontMatter(src) {
    const s = String(src).replace(/^\uFEFF/, "");
    if (s.startsWith("---")) {
      const end = s.indexOf("\n---", 3);
      if (end > 0) {
        const metaStr = s.slice(3, end);
        const body = s.slice(end + 4).replace(/^\n/, "");
        const meta = {};
        metaStr.split("\n").forEach((ln) => {
          const m = ln.match(/^([\w-]+):\s*(.*)$/);
          if (m) {
            let v = m[2].trim();
            if (v.startsWith("[") && v.endsWith("]")) {
              try { v = JSON.parse(v.replace(/'/g, '"')); } catch (e) { v = v.slice(1, -1).split(",").map(x => x.trim().replace(/^['"]|['"]$/g, "")); }
            } else {
              v = v.replace(/^['"]|['"]$/g, "");
            }
            meta[m[1]] = v;
          }
        });
        return { meta, body };
      }
    }
    return { meta: {}, body: s };
  }

  /* ---------------- TOC 提取 ---------------- */
  function extractToc(src) {
    const toc = [];
    const re = /^(#{2,4})\s+(.*)$/gm;
    let m;
    while ((m = re.exec(src))) {
      toc.push({ level: m[1].length, title: m[2].replace(/[*_`]/g, "").trim() });
    }
    return toc;
  }

  /* ---------------- 阅读时间 ---------------- */
  function readingTime(md) {
    const text = String(md).replace(/[#*`>!\[\]()\-|]/g, "").replace(/\s+/g, "");
    const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const other = text.length - cjk;
    const minutes = Math.max(1, Math.ceil(cjk / 400 + other / 800));
    return minutes;
  }

  global.XingMianMarkdown = {
    render: renderMarkdown,
    inline,
    highlight,
    parseFrontMatter,
    extractToc,
    readingTime,
    escapeHtml,
  };
})(window);
