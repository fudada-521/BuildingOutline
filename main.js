/** @format */

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/ScaleBar",
    "esri/Basemap",
    "esri/layers/WebTileLayer",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
], function (Map, MapView, ScaleBar, Basemap, WebTileLayer, GraphicsLayer, Graphic) {
    // =============================================
    // Google 底图图层
    // =============================================
    const googleSatelliteLayer = new WebTileLayer({
        urlTemplate: "https://mt{subDomain}.google.com/vt/lyrs=s&x={col}&y={row}&z={level}",
        subDomains: ["0", "1", "2", "3"],
        copyright: "© Google",
    });

    const googleStreetsLayer = new WebTileLayer({
        urlTemplate: "https://mt{subDomain}.google.com/vt/lyrs=m&x={col}&y={row}&z={level}",
        subDomains: ["0", "1", "2", "3"],
        copyright: "© Google",
    });

    // =============================================
    // 高德底图图层
    // =============================================
    const gaodeStreetsLayer = new WebTileLayer({
        urlTemplate:
            "https://webrd0{subDomain}.is.autonavi.com/appmaptile?x={col}&y={row}&z={level}&lang=zh_cn&size=1&scale=1&style=8",
        subDomains: ["1", "2", "3", "4"],
        copyright: "© 高德地图",
    });

    const gaodeSatelliteLayer = new WebTileLayer({
        urlTemplate: "https://webst0{subDomain}.is.autonavi.com/appmaptile?x={col}&y={row}&z={level}&style=6",
        subDomains: ["1", "2", "3", "4"],
        copyright: "© 高德地图",
    });

    // =============================================
    // 天地图底图图层 (需要在天地图官网申请key)
    // =============================================
    // 请替换为您的天地图API Key
    const TIANDITU_KEY = "6ad185fadd6012a1b89063b1a887e77c";

    const tiandituStreetsLayer = new WebTileLayer({
        urlTemplate:
            "https://t{subDomain}.tianditu.gov.cn/DataServer?T=vec_w&x={col}&y={row}&z={level}&tk=" + TIANDITU_KEY,
        subDomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
        copyright: "© 天地图",
    });

    const tiandituSatelliteLayer = new WebTileLayer({
        urlTemplate:
            "https://t{subDomain}.tianditu.gov.cn/DataServer?T=img_w&x={col}&y={row}&z={level}&tk=" + TIANDITU_KEY,
        subDomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
        copyright: "© 天地图",
    });

    // =============================================
    // 创建底图
    // =============================================
    const basemaps = [
        new Basemap({ baseLayers: [googleStreetsLayer], title: "Google 街道图", id: "google-streets" }),
        new Basemap({ baseLayers: [googleSatelliteLayer], title: "Google 卫星影像", id: "google-satellite" }),
        new Basemap({ baseLayers: [gaodeStreetsLayer], title: "高德街道图", id: "gaode-streets" }),
        new Basemap({ baseLayers: [gaodeSatelliteLayer], title: "高德卫星影像", id: "gaode-satellite" }),
        new Basemap({ baseLayers: [tiandituStreetsLayer], title: "天地图街道图", id: "tianditu-streets" }),
        new Basemap({ baseLayers: [tiandituSatelliteLayer], title: "天地图卫星影像", id: "tianditu-satellite" }),
    ];

    // 建筑高亮图层 - 用于显示被点击建筑的描边
    const highlightLayer = new GraphicsLayer();

    // 创建地图对象 - 使用第一个底图(Google街道图)
    const map = new Map({
        basemap: basemaps[0],
        layers: [highlightLayer],
    });

    // 当前底图索引
    let currentBasemapIndex = 0;

    // 创建工具栏容器
    const toolbar = document.createElement("div");
    toolbar.id = "map-toolbar";
    toolbar.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 100;
        display: flex;
        gap: 6px;
        align-items: center;
    `;
    document.getElementById("map").appendChild(toolbar);

    // 添加底图下拉选择器
    const basemapSelect = document.createElement("select");
    basemapSelect.id = "basemap-select";
    basemapSelect.style.cssText = `
        height: 32px;
        padding: 0 8px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        outline: none;
    `;

    // 填充选项
    basemaps.forEach((bm, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.text = bm.title;
        basemapSelect.appendChild(option);
    });

    basemapSelect.onchange = function () {
        currentBasemapIndex = parseInt(this.value);
        map.basemap = basemaps[currentBasemapIndex];
        console.log("底图切换为:", basemaps[currentBasemapIndex].title);
    };
    toolbar.appendChild(basemapSelect);

    // 创建地图视图 - 中心在香港
    const view = new MapView({
        container: "map",
        map: map,
        center: [114.161693, 22.279088],
        zoom: 17,
    });

    // 添加比例尺
    const scaleBar = new ScaleBar({
        view: view,
        unit: "metric",
    });
    view.ui.add(scaleBar, "bottom-right");

    // 地图加载完成后初始化功能
    view.when(function () {
        console.log("地图加载完成!");
        // 初始化建筑轮廓描边功能
        initBuildingOutline(view, highlightLayer);
    });
});
