# 建筑轮廓标注演示

基于 ArcGIS JS API 4.18 的建筑轮廓点击标注功能。

## 功能特性

- **底图切换**: Google 街道图 ↔ 卫星影像（一键切换）
- **建筑轮廓**: 点击地图任意位置，查询并高亮显示该位置建筑轮廓
- **数据来源**: OpenStreetMap Overpass API（全球建筑数据）
- **高亮样式**: 青色描边（1.5px），无填充

## 技术栈

| 技术 | 说明 |
|------|------|
| ArcGIS JS API | 4.18 | 地图核心框架 |
| Google Maps 瓦片 | 底图 (街道/卫星) |
| Overpass API | 建筑轮廓数据查询 |

## 第三方服务

| 服务 | 厂商 | 收费 |
|------|------|------|
| Google Maps 瓦片 | Google LLC | 免费（开发测试） |
| Overpass API | OpenStreetMap Foundation | 免费（社区维护） |

## 运行方式

```bash
python -m http.server 8091
```

访问 `http://localhost:8091`

## 使用说明

1. 点击地图上任意有建筑的位置
2. 系统自动查询该位置 15 米范围内所有建筑轮廓
3. 建筑轮廓以青色描边高亮显示
4. 点击其他位置会清除上一次的高亮

## 文件结构

```
├── index.html           # 入口 HTML
├── main.js             # 地图初始化、底图切换
├── buildingOutline.js   # 建筑轮廓查询功能
├── styles.css           # 样式
└── README.md            # 项目说明
```
