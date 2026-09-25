# 美国免税州地址生成器

生成美国免销售税州（Oregon、Delaware、Montana、New Hampshire、Alaska）的地址，用于注册美区 Apple ID。纯静态网页，不需要后端，手机和电脑都能用。

## 功能

- **5 个免税州**：俄勒冈 OR、特拉华 DE（推荐）、蒙大拿 MT、新罕布什尔 NH、阿拉斯加 AK，也可以随机选
- **城市、邮编、区号彼此匹配**：共 48 个城市、128 个邮编，全部对照 USPS 邮编库核实过（州、城市名、普通投递邮编）；电话区号用的是该城市本地区号
- **排除有地方税的地区**：蒙大拿的度假税区（Whitefish、Big Sky 等）不收录；阿拉斯加只用没有地方销售税的 Anchorage（含 Eagle River）和 Fairbanks
- **真实街道名**：每个城市用的都是当地真实的主干道，门牌号随机
- **点一下就复制**：字段顺序与 Apple ID 账单地址表单一致，点任意一行复制该字段，也可以一次复制全部
- **批量生成**：一次生成 5 个，挑一个用
- **历史记录**：复制过的地址会存在本机浏览器里，方便以后找回注册时填的信息
- 可以生成公寓号（第二行地址），支持深色模式，页面内附注册步骤说明

## 使用

直接用浏览器打开 `index.html` 就能用，不需要联网。

也可以部署到 GitHub Pages：仓库 **Settings → Pages**，Source 选 `Deploy from a branch`，分支选 `main`（或当前分支）的根目录，保存后几分钟就能通过 `https://<用户名>.github.io/<仓库名>/` 访问。

本地预览：

```bash
npm start            # 等同于 python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 生成结果示例

```
Name: Kevin Richardson
Street: 919 DuPont Blvd
City: Georgetown
State: DE (Delaware)
ZIP: 19947
Phone: (302) 786-5434
Country: United States
```

## 目录结构

```
index.html          页面
css/style.css       样式（含深色模式、移动端适配）
js/data.js          州 / 城市 / 邮编 / 街道 / 姓名数据
js/generator.js     地址生成逻辑（不依赖 DOM，可在 Node 中测试）
js/app.js           页面交互
test/               数据校验与生成逻辑测试
```

## 测试

```bash
npm test
```

测试内容：

- 每个邮编的前三位在该州的范围内，城市内和城市之间没有重复邮编
- 电话区号属于该州
- 随机生成 5000 条地址，检查街道和邮编来自同一区域、门牌号不越界、电话号码格式正确（排除 555 和 N11 交换码）
- 指定州或城市、公寓号、异常输入、格式化输出

## 添加城市

在 `js/data.js` 中对应州的 `cities` 里添加一项：

```js
{
  name: "Portland",            // 城市英文名，需与 USPS 邮编库中的城市名一致
  zh: "波特兰",
  areaCodes: ["503", "971"],   // 当地电话区号
  num: [100, 4999],            // 门牌号范围
  zones: [
    { zips: ["97214", "97215"], streets: ["SE Hawthorne Blvd", "SE Belmont St"] }
  ]
}
```

`zones` 用来把街道和邮编对应起来：同一个 zone 里的街道只会和该 zone 的邮编组合。改完运行 `npm test`。

## 声明

地址由真实的城市、邮编、街道名加随机门牌号组成，姓名和电话是随机生成的，不对应任何真实的人。仅供学习和测试使用，请遵守 Apple 服务条款和当地法律，不要用于任何违法用途。所有数据只在浏览器本地处理，不会上传。
