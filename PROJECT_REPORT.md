# 项目报告

## 项目概述

- **项目名称**: ArcGIS JS API - 国际日期变更线演示 / 建筑轮廓标注
- **版本**: 1.0.0
- **最后更新**: 2026-04-21
- **分支**: feature/building-outline

## 技术栈

### 核心框架

| 技术 | 版本 | 说明 |
|------|------|------|
| ArcGIS JS API | 4.18 | 地图应用核心框架 |

### 第三方 API / 服务

| 服务 | 厂商 | 用途 | 收费情况 |
|------|------|------|----------|
| Google Maps 瓦片 | Google LLC | 街道图底图 (`lyrs=m`) | 免费（瓦片服务无需API Key，仅限开发测试） |
| OpenStreetMap (Overpass API) | OpenStreetMap Foundation | 建筑轮廓数据查询 | 免费（社区维护，捐赠支持） |
| ArcGIS World Countries | Esri Inc. | 国界矢量图层 | 免费（公开服务，有请求限制） |
| ArcGIS World Cities | Esri Inc. | 城市地名标注 | 免费（公开服务，有请求限制） |

## 第三方服务详情

---

### 1. Google Maps Tile Service (Google Maps 瓦片服务)

| 属性 | 详情 |
|------|------|
| **厂商** | Google LLC |
| **官方网站** | https://maps.google.com |
| **服务地址** | `https://mt{subDomain}.google.com/vt/lyrs={type}&x={col}&y={row}&z={level}` |
| **API Key** | 无需（瓦片服务可直接访问） |
| **收费情况** | 免费使用（开发测试环境），生产环境需遵守 [Google Maps Platform 服务条款](https://cloud.google.com/maps-platform/terms) |
| **lyrs 参数说明** | |
| | `m` - 标准街道图 |
| | `s` - 卫星影像 |
| | `h` - 混合模式（街道+标注叠加层） |
| | `y` - 官方混合底图（卫星+街道+标注） |
| **使用限制** | 禁止大规模商业抓取，仅限正常使用 |
| **数据许可证** | Google Maps/Earth Additional Terms of Service |

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
| | - 允许自由使用、复制、分发数据 |
| | - 必须署名 (OpenStreetMap Contributors) |
| | - 必须保持相同许可证分发衍生数据 |
| **当前查询** | `way["building"](around:15,{lat},{lon})` - 15米范围内所有建筑 |

---

### 3. ArcGIS Online 公开服务 - World Countries

| 属性 | 详情 |
|------|------|
| **厂商** | Esri Inc. |
| **官方网站** | https://www.esri.com/ |
| **服务地址** | `https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Countries/FeatureServer/0` |
| **API Key** | 无需（公开服务） |
| **收费情况** | 免费（公开服务，有请求频率限制） |
| **使用限制** | 请求频率限制，大规模使用需考虑付费订阅 ArcGIS Online |
| **数据类型** | 全球国家边界矢量面 |
| **标注字段** | `COUNTRY` (国家名称) |
| **服务类型** | ArcGIS FeatureServer (REST API) |

---

### 4. ArcGIS Online 公开服务 - World Cities

| 属性 | 详情 |
|------|------|
| **厂商** | Esri Inc. |
| **官方网站** | https://www.esri.com/ |
| **服务地址** | `https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Cities/FeatureServer/0` |
| **API Key** | 无需（公开服务） |
| **收费情况** | 免费（公开服务，有请求频率限制） |
| **使用限制** | 请求频率限制，大规模使用需考虑付费订阅 ArcGIS Online |
| **数据类型** | 全球城市点要素 |
| **标注字段** | `CITY_NAME` (城市名称) |
| **筛选条件** | `POP_RANK <= 4` (仅显示主要城市) |
| **服务类型** | ArcGIS FeatureServer (REST API) |

---

## 功能特性

1. **地图底图**: Google 街道图 (WebTileLayer)
2. **国界显示**: ArcGIS World Countries 矢量图层 + 国名标注
3. **城市标注**: ArcGIS World Cities (仅大城市 POP_RANK ≤ 4)
4. **建筑轮廓**: 点击查询 OSM Overpass API，绘制描边高亮

## 运行方式

```bash
# Python
python -m http.server 8091

# Node
npx http-server -p 8091
```

访问 `http://localhost:8091`

## 地图配置

- **中心点**: [114.161693, 22.279088] (香港)
- **缩放级别**: 20
- **底图**: Google Streets (`lyrs=m`)
- **标注**: Google Hybrid (`lyrs=h`)

## 文件结构

```
arcgis-js-api-demo/
├── index.html           # 入口 HTML
├── main.js             # 主地图模块
├── process.js          # IDL 几何处理核心逻辑
├── addIDL.js           # 国际日期变更线图层
├── testIDL.js          # Polyline IDL 处理测试
├── testPolygon.js      # Polygon IDL 处理测试
├── buildingOutline.js  # 建筑轮廓点击查询功能
├── styles.css          # 样式
├── idl_merged.geojson  # IDL GeoJSON 数据
├── PROJECT_REPORT.md   # 项目报告
└── CLAUDE.md           # 项目指导文档
```

## 备注

- 项目无构建系统，直接通过 script 标签加载
- 使用 AMD 模块模式 (require/define)
- 建筑轮廓查询依赖网络请求，Overpass API 有频率限制
- 所有第三方服务均为免费公开服务，适合开发测试使用
- 生产环境部署需评估各服务的商业使用条款
