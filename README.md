# 建筑轮廓标注演示

基于 ArcGIS JS API 4.18 的建筑轮廓点击标注功能。

## 功能特性

- **底图切换**: Google 街道图 ↔ 卫星影像（一键切换）
- **建筑轮廓**: 点击地图任意位置，查询并高亮显示该位置建筑轮廓
- **数据来源**: OpenStreetMap Overpass API（全球建筑数据）
- **高亮样式**: 青色描边（1.5px），无填充

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| ArcGIS JS API | 4.18 | 地图应用核心框架 |

## 第三方服务详情

---

### 1. Google Maps Tile Service (Google Maps 瓦片服务)

| 属性 | 详情 |
|------|------|
| **厂商** | Google LLC |
| **官方网站** | https://maps.google.com |
| **服务地址** | `https://mt{subDomain}.google.com/vt/lyrs={type}&x={col}&y={row}&z={level}` |
| **API Key** | 无需（瓦片服务可直接访问） |
| **收费情况** | 免费使用（开发测试环境），生产环境需遵守 Google Maps Platform 服务条款 |
| **lyrs 参数说明** | |
| | `m` - 标准街道图 |
| | `s` - 卫星影像 |
| **使用限制** | 禁止大规模商业抓取，仅限正常使用 |
| **数据许可证** | Google Maps/Earth Additional Terms of Service |
| **商用注意事项** | 生产环境使用需遵守 [Google Maps Platform 服务条款](https://cloud.google.com/maps-platform/terms)，大规模使用建议联系 Google 销售团队 |

---

### 2. OpenStreetMap - Overpass API

| 属性 | 详情 |
|------|------|
| **厂商/运营者** | OpenStreetMap Foundation (非营利组织) |
| **官方网站** | https://www.openstreetmap.org |
| **Overpass API 文档** | https://wiki.openstreetmap.org/wiki/Overpass_API |
| **服务地址** | `https://overpass-api.de/api/interpreter` |
| **备用服务器** | `https://overpass.kumi.systems/api/interpreter` |
| **API Key** | 无需 |
| **收费情况** | 免费（社区支持，非商业用途） |
| **使用限制** | 并发请求限制，建议添加 `timeout` 参数避免滥用 |
| **数据来源** | OpenStreetMap 全球贡献者数据 |
| **数据许可证** | ODbL (Open Database License) v1.0 |
| **当前查询** | `way["building"](around:15,{lat},{lon})` - 15米范围内所有建筑 |
| **商用注意事项** | 必须保持 ODbL 许可证，衍生数据必须开源；必须署名 "© OpenStreetMap Contributors"；商业产品建议评估法律风险 |

---

## 运行方式

```bash
# Python
python -m http.server 8091

# Node
npx http-server -p 8091
```

访问 `http://localhost:8091`

## 使用说明

1. 点击地图上任意有建筑的位置
2. 系统自动查询该位置 15 米范围内所有建筑轮廓
3. 建筑轮廓以青色描边高亮显示
4. 点击其他位置会清除上一次的高亮

## 文件结构

```
arcgis-js-api-demo/
├── index.html           # 入口 HTML
├── main.js              # 地图初始化、底图切换
├── buildingOutline.js   # 建筑轮廓查询功能
├── styles.css           # 样式
└── README.md            # 项目说明
```

## 地图配置

- **中心点**: [114.161693, 22.279088] (香港)
- **缩放级别**: 20
- **默认底图**: Google Streets (`lyrs=m`)
- **切换底图**: Google Satellite (`lyrs=s`)

## 备注

- 项目无构建系统，直接通过 script 标签加载
- 使用 AMD 模块模式 (require/define)
- 建筑轮廓查询依赖网络请求，Overpass API 有频率限制
- 所有第三方服务均为免费公开服务，适合开发测试使用
- 生产环境部署需评估各服务的商业使用条款