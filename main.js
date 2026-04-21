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

    // Google 卫星影像图层
    const googleSatelliteLayer = new WebTileLayer({
        urlTemplate: "https://mt{subDomain}.google.com/vt/lyrs=s&x={col}&y={row}&z={level}",
        subDomains: ["0", "1", "2", "3"],
        copyright: "© Google",
    });

    // Google 街道图瓦片图层
    const googleStreetsLayer = new WebTileLayer({
        urlTemplate: "https://mt{subDomain}.google.com/vt/lyrs=m&x={col}&y={row}&z={level}",
        subDomains: ["0", "1", "2", "3"],
        copyright: "© Google",
    });

    // 卫星影像底图
    const satelliteBasemap = new Basemap({
        baseLayers: [googleSatelliteLayer],
        title: "Google Satellite",
        id: "google-satellite",
    });

    // 街道图底图
    const streetsBasemap = new Basemap({
        baseLayers: [googleStreetsLayer],
        title: "Google Streets",
        id: "google-streets",
    });

    // 建筑高亮图层 - 用于显示被点击建筑的描边
    const highlightLayer = new GraphicsLayer();

    // 创建地图对象 - 使用 Google 街道图底图
    const map = new Map({
        basemap: streetsBasemap,
        layers: [highlightLayer],
    });

    // 底图切换功能
    let isSatellite = false;
    function toggleBasemap() {
        isSatellite = !isSatellite;
        map.basemap = isSatellite ? satelliteBasemap : streetsBasemap;
        console.log("底图切换为:", isSatellite ? "卫星影像" : "街道图");
    }

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

    // 添加底图切换按钮
    const basemapToggle = document.createElement("button");
    basemapToggle.id = "basemap-toggle";
    basemapToggle.innerHTML = "🌏";
    basemapToggle.title = "切换底图";
    basemapToggle.style.cssText = `
        width: 36px;
        height: 36px;
        background: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        transition: all 0.2s;
    `;
    basemapToggle.onclick = function () {
        toggleBasemap();
        basemapToggle.innerHTML = isSatellite ? "🗺️" : "🌏";
    };
    basemapToggle.onmouseover = function() {
        this.style.background = "#f5f5f5";
    };
    basemapToggle.onmouseout = function() {
        this.style.background = "#fff";
    };
    toolbar.appendChild(basemapToggle);

    // 创建地图视图 - 中心在香港
    const view = new MapView({
        container: "map",
        map: map,
        center: [114.161693, 22.279088],
        zoom: 20,
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
