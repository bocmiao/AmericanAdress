const test = require("node:test");
const assert = require("node:assert/strict");
const DATA = require("../js/data.js");
const { createGenerator, formatAll, formatOneLine } = require("../js/generator.js");

// 可复现的伪随机数（mulberry32）
function seeded(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lookup(a) {
  const state = DATA.states.find((s) => s.code === a.state);
  const city = state.cities.find((c) => c.name === a.city);
  return { state, city };
}

test("随机生成的地址字段全部合法且相互匹配", () => {
  const gen = createGenerator(DATA, seeded(1));
  const statesSeen = new Set();
  for (let i = 0; i < 5000; i++) {
    const a = gen.generate({ state: "RANDOM" });
    statesSeen.add(a.state);
    const { state, city } = lookup(a);
    assert.ok(city, "城市不属于该州: " + a.city);

    // 街道与邮编必须来自同一区域，门牌号在区域范围内
    const m = a.street.match(/^(\d+) (.+)$/);
    assert.ok(m, "街道格式错误: " + a.street);
    const zone = city.zones.find((z) => z.zips.includes(a.zip) && z.streets.includes(m[2]));
    assert.ok(zone, `街道与邮编不匹配: ${a.street} ${a.zip}`);
    const range = zone.num || city.num;
    const n = Number(m[1]);
    assert.ok(n >= range[0] && n <= range[1], "门牌号越界: " + a.street);

    assert.ok(city.areaCodes.includes(a.areaCode));
    assert.match(a.phoneLocal, /^[2-9]\d{2}-\d{4}$/);
    const exchange = a.phoneLocal.slice(0, 3);
    assert.notEqual(exchange.slice(1), "11", "交换码不能是 N11");
    assert.notEqual(exchange, "555");
    assert.equal(a.phone, `(${a.areaCode}) ${a.phoneLocal}`);

    assert.equal(a.stateName, state.name);
    assert.equal(a.fullName, a.firstName + " " + a.lastName);
    assert.equal(a.line2, "");
    assert.equal(a.country, "United States");
    assert.ok(a.id);
  }
  assert.equal(statesSeen.size, DATA.states.length, "随机模式应覆盖所有州");
});

test("指定州和城市时只生成该城市的地址", () => {
  const gen = createGenerator(DATA, seeded(2));
  for (const state of DATA.states) {
    for (const city of state.cities) {
      for (let i = 0; i < 20; i++) {
        const a = gen.generate({ state: state.code, city: city.name });
        assert.equal(a.state, state.code);
        assert.equal(a.city, city.name);
      }
    }
  }
});

test("只指定州时城市覆盖该州全部城市", () => {
  const gen = createGenerator(DATA, seeded(3));
  const or = DATA.states.find((s) => s.code === "OR");
  const cities = new Set();
  for (let i = 0; i < 3000; i++) cities.add(gen.generate({ state: "OR" }).city);
  assert.equal(cities.size, or.cities.length);
});

test("开启公寓号时生成第二行地址", () => {
  const gen = createGenerator(DATA, seeded(4));
  for (let i = 0; i < 500; i++) {
    const a = gen.generate({ state: "DE", unit: true });
    assert.match(a.line2, /^(Apt|Unit) \d+[A-D]?$/);
  }
});

test("未知州代码抛出错误", () => {
  const gen = createGenerator(DATA, seeded(5));
  assert.throws(() => gen.generate({ state: "CA" }), /未知的州/);
});

test("未知城市名回退为该州随机城市", () => {
  const gen = createGenerator(DATA, seeded(6));
  const a = gen.generate({ state: "MT", city: "Nowhere" });
  assert.equal(a.state, "MT");
});

test("格式化输出", () => {
  const gen = createGenerator(DATA, seeded(7));
  const a = gen.generate({ state: "OR", city: "Portland", unit: true });
  const all = formatAll(a);
  assert.match(all, /^Name: /);
  assert.ok(all.includes("Street 2: " + a.line2));
  assert.ok(all.includes("State: OR (Oregon)"));
  assert.ok(all.includes("ZIP: " + a.zip));
  assert.equal(formatOneLine(a), `${a.street} ${a.line2}, Portland, OR ${a.zip}`);

  const b = gen.generate({ state: "OR" });
  assert.ok(!formatAll(b).includes("Street 2"));
  assert.equal(formatOneLine(b), `${b.street}, ${b.city}, OR ${b.zip}`);
});
