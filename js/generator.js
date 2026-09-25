/*
 * 地址生成逻辑（不依赖 DOM，可在浏览器和 Node 中使用）
 */
(function (root) {
  // 默认随机源：优先使用 crypto，退化到 Math.random
  function defaultRandom() {
    const c = root.crypto;
    if (c && typeof c.getRandomValues === "function") {
      const buf = new Uint32Array(1);
      c.getRandomValues(buf);
      return buf[0] / 4294967296;
    }
    return Math.random();
  }

  function createGenerator(data, random) {
    const rand = random || defaultRandom;

    const int = (min, max) => min + Math.floor(rand() * (max - min + 1));
    const pick = (arr) => arr[Math.floor(rand() * arr.length)];

    // 按权重选择，weightOf 返回非负数
    function pickWeighted(arr, weightOf) {
      const total = arr.reduce((s, x) => s + weightOf(x), 0);
      let r = rand() * total;
      for (const x of arr) {
        r -= weightOf(x);
        if (r < 0) return x;
      }
      return arr[arr.length - 1];
    }

    function findState(code) {
      return data.states.find((s) => s.code === code) || null;
    }

    // 7 位本地号码：交换码首位 2-9，排除 N11 与 555
    function localNumber() {
      let exchange;
      do {
        exchange = String(int(200, 999));
      } while (exchange.slice(1) === "11" || exchange === "555");
      const line = String(int(0, 9999)).padStart(4, "0");
      return exchange + "-" + line;
    }

    function unitLine() {
      const kind = pick(["Apt", "Apt", "Unit"]);
      const floor = int(1, 12);
      const room = int(1, 20);
      const style = int(0, 2);
      if (style === 0) return kind + " " + floor + String(room).padStart(2, "0");
      if (style === 1) return kind + " " + int(1, 40);
      return kind + " " + int(1, 30) + pick(["A", "B", "C", "D"]);
    }

    /**
     * @param {object} opts
     * @param {string} [opts.state]  州代码（如 "OR"），省略或 "RANDOM" 表示随机
     * @param {string} [opts.city]   城市英文名，省略表示在该州内随机
     * @param {boolean} [opts.unit]  是否生成第二行公寓号
     */
    function generate(opts) {
      const o = opts || {};
      const state = !o.state || o.state === "RANDOM" ? pick(data.states) : findState(o.state);
      if (!state) throw new Error("未知的州: " + o.state);

      const city = (o.city && state.cities.find((c) => c.name === o.city)) || pick(state.cities);
      const zone = pickWeighted(city.zones, (z) => z.zips.length);
      const zip = pick(zone.zips);
      const range = zone.num || city.num;
      const street = int(range[0], range[1]) + " " + pick(zone.streets);

      const female = rand() < 0.5;
      const firstName = pick(female ? data.firstNames.female : data.firstNames.male);
      const lastName = pick(data.lastNames);

      const areaCode = pick(city.areaCodes);
      const phoneLocal = localNumber();

      return {
        id: Date.now().toString(36) + "-" + int(0, 0xffffff).toString(36),
        firstName,
        lastName,
        fullName: firstName + " " + lastName,
        street,
        line2: o.unit ? unitLine() : "",
        city: city.name,
        cityZh: city.zh,
        state: state.code,
        stateName: state.name,
        stateZh: state.zh,
        zip,
        areaCode,
        phoneLocal,
        phone: "(" + areaCode + ") " + phoneLocal,
        country: "United States",
        createdAt: Date.now()
      };
    }

    return { generate, findState };
  }

  function formatAll(a) {
    const lines = [
      "Name: " + a.fullName,
      "Street: " + a.street
    ];
    if (a.line2) lines.push("Street 2: " + a.line2);
    lines.push(
      "City: " + a.city,
      "State: " + a.state + " (" + a.stateName + ")",
      "ZIP: " + a.zip,
      "Phone: " + a.phone,
      "Country: " + a.country
    );
    return lines.join("\n");
  }

  function formatOneLine(a) {
    return a.street + (a.line2 ? " " + a.line2 : "") + ", " + a.city + ", " + a.state + " " + a.zip;
  }

  const api = { createGenerator, formatAll, formatOneLine };
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.AddressGenerator = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
