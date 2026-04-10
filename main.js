/** @format */

require(["esri/Map", "esri/views/MapView", "esri/widgets/Legend", "esri/widgets/ScaleBar"], function (
    Map,
    MapView,
    Legend,
    ScaleBar,
) {
    // 创建地图对象 - 使用预定义底图
    const map = new Map({
        // 可选底图类型：
        // basemap: "streets",                      // 街道图
        // basemap: "satellite",                    // 卫星影像
        // basemap: "hybrid", // 影像+标注
        // basemap: "terrain",                      // 地形
        // basemap: "topo",                         // 地形图
        // basemap: "gray", // 灰色底图
        // basemap: "dark-gray",                    // 深灰底图
        // basemap: "light-gray",                   // 浅灰底图
        // basemap: "oceans",                       // 海洋底图
        // basemap: "national-geographic",         // 国家地理
        basemap: "osm", // OpenStreetMap
        // basemap: "arcgis-imagery",               // ArcGIS影像
        // basemap: "arcgis-light-gray",            // ArcGIS浅灰
        // basemap: "arcgis-dark-gray",             // ArcGIS深灰
        // basemap: "arcgis-navigation",            // ArcGIS导航
        // basemap: "arcgis-navigation-night",      // ArcGIS导航夜行
        // basemap: "arcgis-streets", // ArcGIS街道
        // basemap: "dark-gray", // 深灰底图
    });

    // 添加国际日期变更线
    addInternationalDateLine(map);

    // 创建地图视图 - 中心在太平洋（国际日期变更线附近）
    const view = new MapView({
        container: "map",
        map: map,
        center: [180, 0], // 国际日期变更线
        zoom: 3,
    });

    // 添加图例
    // const legend = new Legend({
    //     view: view,
    // });
    // view.ui.add(legend, "bottom-left");

    // 添加比例尺
    const scaleBar = new ScaleBar({
        view: view,
        unit: "metric",
    });
    view.ui.add(scaleBar, "bottom-right");

    // 地图加载完成后打印信息并运行IDL处理测试
    view.when(function () {
        console.log("地图加载完成!");
        // 运行IDL处理可视化对比测试
        testIDLProcessing(map);
        // 运行Polygon IDL处理可视化对比测试
        testPolygonIDL(map);
    });

    // 点击地图获取坐标
    view.on("click", function (event) {
        const lat = event.mapPoint.latitude.toFixed(6);
        const lon = event.mapPoint.longitude.toFixed(6);
        console.log("点击位置:", lon, lat);
    });
});
