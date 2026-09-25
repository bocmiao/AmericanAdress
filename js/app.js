(function () {
  "use strict";

  const DATA = window.TAX_FREE_DATA;
  const { createGenerator, formatAll, formatOneLine } = window.AddressGenerator;
  const gen = createGenerator(DATA);

  const HISTORY_KEY = "tfag.history.v1";
  const PREFS_KEY = "tfag.prefs.v1";
  const HISTORY_MAX = 30;
  const RANDOM = "RANDOM";

  const $ = (id) => document.getElementById(id);
  const el = {
    chips: $("state-chips"),
    city: $("city-select"),
    unit: $("unit-toggle"),
    generate: $("generate-btn"),
    batch: $("batch-btn"),
    stateTax: $("state-tax"),
    fields: $("fields"),
    copyAll: $("copy-all-btn"),
    mapLink: $("map-link"),
    batchSection: $("batch-section"),
    batchList: $("batch-list"),
    historyDetails: $("history-details"),
    historyList: $("history-list"),
    historyEmpty: $("history-empty"),
    historyCount: $("history-count"),
    clearHistory: $("clear-history-btn"),
    taxTable: $("tax-table-body"),
    toast: $("toast"),
    heroState: $("hero-state"),
    heroAddress: $("hero-address"),
    heroRefresh: $("hero-refresh"),
    heroCopy: $("hero-copy"),
    rcName: $("rc-name"),
    rcStreet: $("rc-street"),
    rcCity: $("rc-city"),
    rcState: $("rc-state")
  };

  // 字段顺序与 Apple ID 账单地址表单一致
  const FIELDS = [
    { key: "firstName", zh: "名", en: "First Name" },
    { key: "lastName", zh: "姓", en: "Last Name" },
    { key: "street", zh: "街道", en: "Street" },
    { key: "line2", zh: "街道 2", en: "Street 2", optional: true },
    { key: "city", zh: "城市", en: "City", extra: (a) => a.cityZh },
    { key: "state", zh: "州", en: "State", extra: (a) => a.stateName + " · " + a.stateZh },
    { key: "zip", zh: "邮编", en: "ZIP Code" },
    { key: "areaCode", zh: "区号", en: "Area Code" },
    { key: "phoneLocal", zh: "电话", en: "Phone", copy: (a) => a.phoneLocal.replace(/\D/g, "") },
    { key: "country", zh: "国家", en: "Country", extra: () => "美国" }
  ];

  // ---------- 本地存储（失败时静默降级） ----------
  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { /* 隐私模式等情况下忽略 */ }
  }

  // ---------- 状态 ----------
  const prefs = Object.assign({ state: "OR", city: "", unit: false, tab: "iphone", priceApp: "chatgpt" },
    load(PREFS_KEY, {}));
  if (prefs.state !== RANDOM && !gen.findState(prefs.state)) prefs.state = "OR";
  let history = load(HISTORY_KEY, []);
  if (!Array.isArray(history)) history = [];
  let current = null;

  // ---------- 复制 ----------
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(() => legacyCopy(text));
    }
    return legacyCopy(text);
  }
  function legacyCopy(text) {
    return new Promise((resolve, reject) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error("copy failed"));
    });
  }

  let toastTimer = null;
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove("show"), 1600);
  }

  function copyWithToast(text, label) {
    return copyText(text).then(
      () => toast("已复制" + (label ? " " + label : "") + "：" + text.split("\n")[0]),
      () => toast("复制失败，请长按手动复制")
    );
  }

  // ---------- 州与城市选择 ----------
  function renderChips() {
    el.chips.textContent = "";
    const options = DATA.states.map((s) => ({ value: s.code, text: s.zh, code: s.code, recommended: s.recommended }));
    options.push({ value: RANDOM, text: "随机" });
    for (const o of options) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.setAttribute("role", "radio");
      b.dataset.value = o.value;
      b.appendChild(document.createTextNode(o.text));
      if (o.code) {
        const c = document.createElement("span");
        c.className = "code";
        c.textContent = o.code;
        b.appendChild(c);
      }
      if (o.recommended) {
        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = "推荐";
        b.appendChild(badge);
      }
      b.addEventListener("click", () => {
        if (prefs.state === o.value) return;
        prefs.state = o.value;
        prefs.city = "";
        save(PREFS_KEY, prefs);
        syncControls();
        generateOne();
      });
      el.chips.appendChild(b);
    }
  }

  function syncControls() {
    for (const b of el.chips.children) {
      const on = b.dataset.value === prefs.state;
      b.setAttribute("aria-checked", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    }

    const state = gen.findState(prefs.state);
    el.city.textContent = "";
    const any = document.createElement("option");
    any.value = "";
    any.textContent = state ? "随机城市（" + state.cities.length + " 个）" : "随机（先选择州）";
    el.city.appendChild(any);
    if (state) {
      for (const c of state.cities) {
        const opt = document.createElement("option");
        opt.value = c.name;
        opt.textContent = c.name + " · " + c.zh;
        el.city.appendChild(opt);
      }
      if (!state.cities.some((c) => c.name === prefs.city)) prefs.city = "";
    } else {
      prefs.city = "";
    }
    el.city.value = prefs.city;
    el.city.disabled = !state;
    el.unit.checked = !!prefs.unit;

    el.stateTax.textContent = state
      ? state.zh + "（" + state.name + "）：" + state.tax
      : "从 " + DATA.states.length + " 个免税州中随机挑选。";
  }

  // 方向键在州选项之间切换（radiogroup 的标准键盘行为）
  el.chips.addEventListener("keydown", (e) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const chips = Array.from(el.chips.children);
    const i = chips.findIndex((b) => b.dataset.value === prefs.state);
    const next = chips[(i + keys[e.key] + chips.length) % chips.length];
    next.click();
    next.focus();
  });

  el.city.addEventListener("change", () => {
    prefs.city = el.city.value;
    save(PREFS_KEY, prefs);
    generateOne();
  });

  el.unit.addEventListener("change", () => {
    prefs.unit = el.unit.checked;
    save(PREFS_KEY, prefs);
    generateOne();
  });

  // ---------- 结果渲染 ----------
  function makeOptions() {
    return { state: prefs.state, city: prefs.city || undefined, unit: prefs.unit };
  }

  function renderCurrent(a) {
    current = a;
    el.fields.textContent = "";
    for (const f of FIELDS) {
      const value = a[f.key];
      if (f.optional && !value) continue;

      const li = document.createElement("li");
      const row = document.createElement("button");
      row.type = "button";
      row.className = "field-row";

      const label = document.createElement("span");
      label.className = "label";
      label.textContent = f.zh;
      const small = document.createElement("small");
      small.textContent = f.en;
      label.appendChild(small);

      const val = document.createElement("span");
      val.className = "value";
      val.textContent = value;
      if (f.extra) {
        const ex = document.createElement("span");
        ex.className = "extra";
        ex.textContent = f.extra(a);
        val.appendChild(ex);
      }

      const icon = document.createElement("span");
      icon.className = "copy-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = COPY_SVG;

      row.append(label, val, icon);
      const copyValue = f.copy ? f.copy(a) : String(value);
      row.setAttribute("aria-label", "复制" + f.zh + "：" + copyValue);
      row.addEventListener("click", () => {
        addToHistory(a);
        copyWithToast(copyValue, f.zh).then(() => {
          row.classList.add("copied");
          icon.innerHTML = CHECK_SVG;
          setTimeout(() => {
            row.classList.remove("copied");
            icon.innerHTML = COPY_SVG;
          }, 1200);
        });
      });

      li.appendChild(row);
      el.fields.appendChild(li);
    }

    el.mapLink.href = "https://www.bing.com/maps?q=" + encodeURIComponent(formatOneLine(a));
    renderHero(a);
  }

  // 首屏的地址胶囊和扣费示意卡跟随当前结果
  function renderHero(a) {
    el.heroState.textContent = a.state;
    el.heroAddress.textContent = formatOneLine(a);
    el.heroAddress.classList.remove("swap");
    void el.heroAddress.offsetWidth; // 重新触发切换动画
    el.heroAddress.classList.add("swap");

    el.rcName.textContent = a.fullName;
    el.rcStreet.textContent = a.street + (a.line2 ? " " + a.line2 : "");
    el.rcCity.textContent = a.city + ", " + a.state + " " + a.zip;
    el.rcState.textContent = a.state;
  }

  const COPY_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const CHECK_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

  function listItem(a, onClick) {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    b.className = "list-item";
    const l1 = document.createElement("div");
    l1.className = "line1";
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = a.state;
    l1.append(tag, document.createTextNode(a.fullName + " · " + a.phone));
    const l2 = document.createElement("div");
    l2.className = "line2";
    l2.textContent = formatOneLine(a);
    b.append(l1, l2);
    b.addEventListener("click", onClick);
    li.appendChild(b);
    return li;
  }

  // ---------- 历史（只记录复制过的地址，方便日后找回注册时用的信息） ----------
  function addToHistory(a) {
    if (history.length && history[0].id === a.id) return;
    history = history.filter((h) => h.id !== a.id);
    history.unshift(a);
    if (history.length > HISTORY_MAX) history.length = HISTORY_MAX;
    save(HISTORY_KEY, history);
    renderHistory();
  }

  function renderHistory() {
    el.historyList.textContent = "";
    for (const a of history) {
      el.historyList.appendChild(listItem(a, () => {
        renderCurrent(a);
        window.scrollTo({ top: 0, behavior: "smooth" });
        toast("已切换到：" + a.fullName);
      }));
    }
    el.historyEmpty.hidden = history.length > 0;
    el.clearHistory.hidden = history.length === 0;
    el.historyCount.textContent = history.length ? history.length + " 条" : "";
  }

  // 两步确认：第一次点击进入确认状态，3 秒内再点一次才清空（不依赖 confirm 弹窗）
  let clearTimer = null;
  function disarmClear() {
    clearTimeout(clearTimer);
    clearTimer = null;
    el.clearHistory.textContent = "清空历史";
    el.clearHistory.classList.remove("danger");
  }
  el.clearHistory.addEventListener("click", () => {
    if (!clearTimer) {
      el.clearHistory.textContent = "再点一次确认清空";
      el.clearHistory.classList.add("danger");
      clearTimer = setTimeout(disarmClear, 3000);
      return;
    }
    disarmClear();
    history = [];
    save(HISTORY_KEY, history);
    renderHistory();
    toast("历史记录已清空");
  });

  // ---------- 生成 ----------
  function generateOne() {
    renderCurrent(gen.generate(makeOptions()));
  }

  function generateBatch(n) {
    const items = [];
    for (let i = 0; i < n; i++) items.push(gen.generate(makeOptions()));
    el.batchList.textContent = "";
    for (const a of items) {
      el.batchList.appendChild(listItem(a, () => {
        renderCurrent(a);
        window.scrollTo({ top: 0, behavior: "smooth" });
        toast("已设为当前：" + a.fullName);
      }));
    }
    el.batchSection.hidden = false;
    renderCurrent(items[0]);
    el.batchSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  el.generate.addEventListener("click", generateOne);

  el.heroRefresh.addEventListener("click", () => {
    generateOne();
    el.heroRefresh.classList.remove("spin");
    void el.heroRefresh.offsetWidth;
    el.heroRefresh.classList.add("spin");
  });
  el.heroCopy.addEventListener("click", () => {
    if (!current) return;
    addToHistory(current);
    copyWithToast(formatOneLine(current), "地址").then(() => {
      el.heroCopy.classList.add("done");
      el.heroCopy.innerHTML = CHECK_SVG;
      setTimeout(() => {
        el.heroCopy.classList.remove("done");
        el.heroCopy.innerHTML = COPY_SVG;
      }, 1200);
    });
  });
  el.batch.addEventListener("click", () => generateBatch(5));
  el.copyAll.addEventListener("click", () => {
    if (!current) return;
    addToHistory(current);
    copyWithToast(formatAll(current), "全部信息");
  });

  // 桌面端快捷键：G 或空格重新生成（焦点在输入控件上时不响应）
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (/^(INPUT|SELECT|TEXTAREA|BUTTON|A|SUMMARY)$/.test(tag)) return;
    if (e.key === "g" || e.key === "G" || e.key === " ") {
      e.preventDefault();
      generateOne();
    }
  });

  // ---------- 免税州表格 ----------
  function renderTaxTable() {
    for (const s of DATA.states) {
      const tr = document.createElement("tr");
      const codes = new Set();
      s.cities.forEach((c) => c.areaCodes.forEach((x) => codes.add(x)));
      for (const text of [s.zh + (s.recommended ? " ★" : ""), s.code, Array.from(codes).join(" / "), s.tax]) {
        const td = document.createElement("td");
        td.textContent = text;
        tr.appendChild(td);
      }
      el.taxTable.appendChild(tr);
    }
  }

  // ---------- 注册教程标签页 ----------
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));

  function selectTab(name, focus) {
    if (!tabs.some((t) => t.dataset.tab === name)) name = tabs[0].dataset.tab;
    for (const t of tabs) {
      const on = t.dataset.tab === name;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      $(t.getAttribute("aria-controls")).hidden = !on;
      if (on && focus) t.focus();
    }
    if (prefs.tab !== name) {
      prefs.tab = name;
      save(PREFS_KEY, prefs);
    }
  }

  for (const t of tabs) t.addEventListener("click", () => selectTab(t.dataset.tab));
  tabs[0].parentElement.addEventListener("keydown", (e) => {
    const i = tabs.findIndex((t) => t.dataset.tab === prefs.tab);
    let next = null;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    selectTab(tabs[next].dataset.tab, true);
  });

  // ---------- 各地区价格（链接到 App Store 官方页面，价格实时） ----------
  const PRICE_APPS = [
    { key: "chatgpt", name: "ChatGPT", id: "6448311069", cheapest: "ph" },
    { key: "claude", name: "Claude", id: "6473753684", cheapest: "pk" }
  ];
  const PRICE_COUNTRIES = [
    { cc: "us", zh: "美国" }, { cc: "ph", zh: "菲律宾" }, { cc: "pk", zh: "巴基斯坦" },
    { cc: "jp", zh: "日本" }, { cc: "ca", zh: "加拿大" }, { cc: "eg", zh: "埃及" },
    { cc: "tr", zh: "土耳其" }, { cc: "ng", zh: "尼日利亚" }, { cc: "in", zh: "印度" },
    { cc: "br", zh: "巴西" }, { cc: "gb", zh: "英国" }, { cc: "sg", zh: "新加坡" }
  ];
  const priceChips = $("price-app-chips");
  const priceLinks = $("price-links");

  function renderPriceLinks() {
    const app = PRICE_APPS.find((a) => a.key === prefs.priceApp) || PRICE_APPS[0];
    for (const b of priceChips.children) {
      const on = b.dataset.value === app.key;
      b.setAttribute("aria-checked", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    }
    priceLinks.textContent = "";
    for (const c of PRICE_COUNTRIES) {
      const a = document.createElement("a");
      a.className = "country-link" + (c.cc === "us" ? " base" : "");
      a.href = "https://apps.apple.com/" + c.cc + "/app/id" + app.id;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", "在 App Store 查看 " + app.name + " 在" + c.zh + "的价格");
      const name = document.createElement("span");
      name.textContent = c.zh;
      a.appendChild(name);
      const tagText = c.cc === "us" ? "本工具" : c.cc === app.cheapest ? "8 月最低" : "";
      const tag = document.createElement("span");
      tag.className = tagText ? "badge" : "code";
      tag.textContent = tagText || c.cc.toUpperCase();
      a.appendChild(tag);
      priceLinks.appendChild(a);
    }
  }

  for (const app of PRICE_APPS) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.setAttribute("role", "radio");
    b.dataset.value = app.key;
    b.textContent = app.name;
    b.addEventListener("click", () => {
      prefs.priceApp = app.key;
      save(PREFS_KEY, prefs);
      renderPriceLinks();
    });
    priceChips.appendChild(b);
  }
  priceChips.addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
    e.preventDefault();
    const chips = Array.from(priceChips.children);
    const i = chips.findIndex((b) => b.dataset.value === prefs.priceApp);
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
    const next = chips[(i + step + chips.length) % chips.length];
    next.click();
    next.focus();
  });

  // ---------- 首屏统计数字（由数据计算，避免与数据不一致） ----------
  function renderStats() {
    let cities = 0;
    let zips = 0;
    for (const st of DATA.states) {
      cities += st.cities.length;
      for (const c of st.cities) for (const z of c.zones) zips += z.zips.length;
    }
    $("stat-states").textContent = DATA.states.length;
    $("stat-cities").textContent = cities;
    $("stat-zips").textContent = zips;
    $("stat-zips-eyebrow").textContent = zips;
  }

  // ---------- 初始化 ----------
  renderChips();
  syncControls();
  renderTaxTable();
  renderStats();
  renderHistory();
  selectTab(prefs.tab);
  renderPriceLinks();
  generateOne();
})();
