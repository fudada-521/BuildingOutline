/** @format */

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Legend",
    "esri/widgets/ScaleBar",
    "esri/Basemap",
    "esri/layers/WebTileLayer",
    "esri/layers/FeatureLayer",
], function (Map, MapView, Legend, ScaleBar, Basemap, WebTileLayer, FeatureLayer) {
    // Google 卫星影像瓦片图层
    const googleSatelliteLayer = new WebTileLayer({
        urlTemplate: "https://mt{subDomain}.google.com/vt/lyrs=s&x={col}&y={row}&z={level}",
        subDomains: ["0", "1", "2", "3"],
        copyright: "© Google",
    });

    // Google 标注图层（道路、地名）
    // const googleLabelsLayer = new WebTileLayer({
    //     urlTemplate: "https://mt{subDomain}.google.com/vt/lyrs=h&x={col}&y={row}&z={level}",
    //     subDomains: ["0", "1", "2", "3"],
    //     copyright: "© Google",
    // });

    // 用 Google 卫星影像 + 标注创建自定义底图
    const googleBasemap = new Basemap({
        baseLayers: [googleSatelliteLayer],
        title: "Google Satellite",
        id: "google-satellite",
    });

    // 国界图层 - ArcGIS World Nations
    const countriesLayer = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Countries/FeatureServer/0",
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-fill",
                color: [255, 255, 255, 0],
                outline: {
                    color: [100, 100, 100, 200],
                    width: 1,
                },
            },
        },
        labelingInfo: [
            {
                labelExpression: "[COUNTRY]",
                labelPlacement: "always-horizontal",
                symbol: {
                    type: "text",
                    color: [255, 255, 255, 230],
                    font: {
                        family: "Arial",
                        size: 10,
                        weight: "bold",
                    },
                    haloColor: [0, 0, 0, 150],
                    haloSize: 1,
                },
            },
        ],
    });

    // 城市地名图层 - ArcGIS World Cities
    const citiesLayer = new FeatureLayer({
        url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Cities/FeatureServer/0",
        renderer: {
            type: "simple",
            // symbol: {
            //     type: "simple-marker",
            //     color: [255, 255, 0, 255],
            //     size: 4,
            // },
        },
        labelingInfo: [
            {
                labelExpression: "[CITY_NAME]",
                labelPlacement: "above-right",
                where: "POP_RANK <= 4", // 只显示大城市
                symbol: {
                    type: "text",
                    color: [255, 255, 100, 255],
                    font: {
                        family: "Arial",
                        size: 11,
                    },
                    haloColor: [0, 0, 0, 200],
                    haloSize: 1,
                },
            },
        ],
    });

    // 创建地图对象 - 使用 Google 卫星影像底图
    const map = new Map({
        basemap: googleBasemap,
        layers: [countriesLayer, citiesLayer],
    });

    // 添加国际日期变更线
    // initIDL(map);

    // 创建地图视图 - 中心在吉隆坡/新加坡附近
    const view = new MapView({
        container: "map",
        map: map,
        center: [101.822559, 2.965304],
        zoom: 20,
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
        // initTestIDL(map);
        // 运行Polygon IDL处理可视化对比测试
        // initTestPolygon(map);
    });

    // 点击地图获取坐标
    view.on("click", function (event) {
        const lat = event.mapPoint.latitude.toFixed(6);
        const lon = event.mapPoint.longitude.toFixed(6);
        console.log("点击位置:", lon, lat);
    });
});
