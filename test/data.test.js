const test = require("node:test");
const assert = require("node:assert/strict");
const DATA = require("../js/data.js");

// 各州 ZIP 前三位范围与本州电话区号（USPS / NANPA）
const RULES = {
  OR: { zip: [970, 979], areaCodes: ["503", "971", "541", "458"] },
  DE: { zip: [197, 199], areaCodes: ["302"] },
  MT: { zip: [590, 599], areaCodes: ["406"] },
  NH: { zip: [30, 38], areaCodes: ["603"] },
  AK: { zip: [995, 999], areaCodes: ["907"] }
};

test("包含全部 5 个免税州", () => {
  assert.deepEqual(DATA.states.map((s) => s.code).sort(), Object.keys(RULES).sort());
});

for (const state of DATA.states) {
  test(state.code + " 数据格式与邮编/区号范围", () => {
    const rule = RULES[state.code];
    assert.ok(state.name && state.zh && state.tax, "州信息不完整");
    assert.ok(state.cities.length > 0);

    const seenZip = new Map();
    const cityNames = new Set();
    for (const city of state.cities) {
      assert.ok(!cityNames.has(city.name), "城市重复: " + city.name);
      cityNames.add(city.name);
      assert.ok(city.zh, city.name + " 缺少中文名");
      assert.ok(city.areaCodes.length > 0);
      for (const ac of city.areaCodes) {
        assert.ok(rule.areaCodes.includes(ac), `${city.name} 的区号 ${ac} 不属于 ${state.code}`);
      }
      assert.ok(city.zones.length > 0);
      for (const zone of city.zones) {
        const range = zone.num || city.num;
        assert.ok(Array.isArray(range) && range.length === 2, city.name + " 缺少门牌号范围");
        assert.ok(Number.isInteger(range[0]) && range[0] >= 1 && range[1] > range[0], city.name + " 门牌号范围无效");

        assert.ok(zone.zips.length > 0);
        for (const zip of zone.zips) {
          assert.match(zip, /^\d{5}$/, `${city.name} 邮编格式错误: ${zip}`);
          const prefix = Number(zip.slice(0, 3));
          assert.ok(prefix >= rule.zip[0] && prefix <= rule.zip[1], `${zip} 不在 ${state.code} 的邮编范围内`);
          assert.ok(!seenZip.has(zip) || seenZip.get(zip) === city.name,
            `${zip} 同时出现在 ${seenZip.get(zip)} 和 ${city.name}`);
          seenZip.set(zip, city.name);
        }
        assert.equal(new Set(zone.zips).size, zone.zips.length, city.name + " 同一区域内邮编重复");

        assert.ok(zone.streets.length > 0);
        assert.equal(new Set(zone.streets).size, zone.streets.length, city.name + " 同一区域内街道重复");
        for (const st of zone.streets) {
          assert.match(st, /^[A-Za-z0-9 .'-]+$/, `${city.name} 街道名含非法字符: ${st}`);
          assert.equal(st.trim(), st);
        }
      }
    }
  });
}

test("姓名列表", () => {
  for (const list of [DATA.firstNames.male, DATA.firstNames.female, DATA.lastNames]) {
    assert.ok(list.length >= 20);
    assert.equal(new Set(list).size, list.length);
    for (const n of list) assert.match(n, /^[A-Z][a-z]+$/);
  }
});
