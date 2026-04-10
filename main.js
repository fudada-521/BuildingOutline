/** @format */

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/OpenStreetMapLayer",
    "esri/widgets/Legend",
    "esri/widgets/ScaleBar",
], function (Map, MapView, OpenStreetMapLayer, Legend, ScaleBar) {
    // OpenStreetMap 底图
    const osmLayer = new OpenStreetMapLayer();

    // 创建地图对象
    const map = new Map({
        layers: [osmLayer],
    });

    // 创建地图视图 - 中心在太平洋（国际日期变更线附近）
    const view = new MapView({
        container: "map",
        map: map,
        center: [180, 0], // 国际日期变更线
        zoom: 3,
    });

    // 添加图例
    const legend = new Legend({
        view: view,
    });
    view.ui.add(legend, "bottom-left");

    // 添加比例尺
    const scaleBar = new ScaleBar({
        view: view,
        unit: "metric",
    });
    view.ui.add(scaleBar, "bottom-right");

    // 地图加载完成后打印信息
    view.when(function () {
        console.log("地图加载完成!");
    });

    // 点击地图获取坐标
    view.on("click", function (event) {
        const lat = event.mapPoint.latitude.toFixed(6);
        const lon = event.mapPoint.longitude.toFixed(6);
        console.log("点击位置:", lon, lat);
    });
});
