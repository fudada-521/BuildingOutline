/**
 * ArcGIS JS API - 国际日期变更线演示
 *
 * 功能：
 * 1. 显示多种底图选择
 * 2. 绘制真实的国际日期变更线
 * 3. 验证 processGeometryAcrossIDL 处理跨越 IDL 的几何图形
 */

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/ScaleBar",
], function (Map, MapView, ScaleBar) {

    // 创建地图 - 使用预定义底图
    const map = new Map({
        basemap: "dark-gray",
    });

    // 添加国际日期变更线
    addInternationalDateLine(map);

    // 创建地图视图
    const view = new MapView({
        container: "map",
        map: map,
        center: [180, 0],  // 国际日期变更线
        zoom: 3,
    });

    // 添加比例尺
    view.ui.add(
        new ScaleBar({
            view: view,
            unit: "metric",
        }),
        "bottom-right"
    );

    // 地图加载完成后运行测试
    view.when(function () {
        console.log("地图加载完成!");
        testIDLProcessing(map);    // Polyline 跨越 IDL 测试
        testPolygonIDL(map);       // Polygon 跨越 IDL 测试
    });

    // 点击获取坐标
    view.on("click", function (event) {
        const lat = event.mapPoint.latitude.toFixed(6);
        const lon = event.mapPoint.longitude.toFixed(6);
        console.log("点击位置:", lon, lat);
    });
});
