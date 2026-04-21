/** @format */

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Legend",
    "esri/widgets/ScaleBar",
    "esri/Basemap",
    "esri/layers/WebTileLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
], function (Map, MapView, Legend, ScaleBar, Basemap, WebTileLayer, FeatureLayer, GraphicsLayer, Graphic) {
    // Google 标注图层（道路、地名）
    // const googleLabelsLayer = new WebTileLayer({
    //     urlTemplate: "https://mt{subDomain}.google.com/vt/lyrs=h&x={col}&y={row}&z={level}",
    //     subDomains: ["0", "1", "2", "3"],
    //     copyright: "© Google",
    // });

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

    // 建筑轮廓图层 - OSM Overpass API（不显示，只用于查询）
    // ArcGIS World Buildings服务无效，改用OpenStreetMap建筑数据

    // 建筑高亮图层 - 用于显示被点击建筑的描边
    const highlightLayer = new GraphicsLayer();

    // 创建地图对象 - 使用 Google 街道图底图
    const map = new Map({
        basemap: streetsBasemap,
        layers: [countriesLayer, citiesLayer, highlightLayer],
    });

    // 底图切换功能
    let isSatellite = false;
    function toggleBasemap() {
        isSatellite = !isSatellite;
        map.basemap = isSatellite ? satelliteBasemap : streetsBasemap;
        console.log("底图切换为:", isSatellite ? "卫星影像" : "街道图");
    }

    // 添加底图切换按钮
    const basemapToggle = document.createElement("button");
    basemapToggle.id = "basemap-toggle";
    basemapToggle.innerHTML = "🌏 卫星";
    basemapToggle.style.cssText = "position:absolute;top:10px;right:10px;z-index:100;padding:8px 12px;background:#fff;border:1px solid #ccc;border-radius:4px;cursor:pointer;font-size:14px;";
    basemapToggle.onclick = function () {
        toggleBasemap();
        basemapToggle.innerHTML = isSatellite ? "🗺️ 街道" : "🌏 卫星";
    };
    document.getElementById("map").appendChild(basemapToggle);

    // 添加国际日期变更线
    // initIDL(map);

    // 创建地图视图 - 中心在香港
    const view = new MapView({
        container: "map",
        map: map,
        center: [114.161693, 22.279088],
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

    // 地图加载完成后初始化功能
    view.when(function () {
        console.log("地图加载完成!");
        // 初始化建筑轮廓描边功能
        initBuildingOutline(view, highlightLayer);
    });
});
