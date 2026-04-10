require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/WMTSLayer",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/widgets/Legend",
  "esri/widgets/ScaleBar"
], function(Map, MapView, WMTSLayer, GraphicsLayer, Graphic, Legend, ScaleBar) {

  // 天地图矢量底图 - 球面墨卡托投影 (_w)
  const tiandituLayer = new WMTSLayer({
    url: "https://t0.tianditu.gov.cn/vec_w/wmts?tk=f9a6be249c46962bc2e45ddc8cabc856"
  });

  // 国际日期变更线 (EPSG:900913 坐标)
  const dateLineGraphics = new GraphicsLayer();

  // 国际日期变更线近似坐标 (转换成 Web Mercator)
  // 大致沿180度经线，在不同纬度处的x坐标
  const dateLinePath = [
    [20037508.34, 14480761.62],  // 65°N
    [20037508.34, 13189178.97],  // 60°N
    [20037508.34, 11903924.84],  // 55°N
    [20037508.34, 10626099.22],  // 50°N
    [20037508.34, 9355704.12],    // 45°N
    [20037508.34, 8091739.53],    // 40°N
    [20037508.34, 6850514.94],    // 35°N
    [20037508.34, 5629294.34],    // 30°N
    [20037508.34, 4416237.24],    // 25°N
    [20037508.34, 3209093.62],    // 20°N
    [20037508.34, 2005872.01],    // 15°N
    [20037508.34, 804672.87],     // 10°N
    [20037508.34, 0],             // 5°N
    [20037508.34, 0],            // 0°
    [-20037508.34, -557927.84],  // 5°S
    [-20037508.34, -1117855.68], // 10°S
    [-20037508.34, -1668783.52], // 15°S
    [-20037508.34, -2214711.36], // 20°S
    [-19493695.63, -2755639.20], // 25°S
    [-18949882.93, -3296567.04], // 30°S
    [-18406070.22, -3832494.88], // 35°S
    [-18406070.22, -4368422.72], // 40°S
    [-18724889.27, -4904350.56], // 45°S
    [-19493695.63, -5440278.40], // 50°S
    [-19493695.63, -5976206.24], // 55°S
    [-18949882.93, -6512134.08], // 60°S
    [-20037508.34, -7048061.92], // 65°S
    [-20037508.34, -7583989.76]  // 70°S
  ];

  const dateLineGraphic = new Graphic({
    geometry: {
      type: "polyline",
      paths: [dateLinePath],
      spatialReference: {
        wkid: 3857  // EPSG:900913
      }
    },
    symbol: {
      type: "simple-line",
      color: [255, 0, 0, 200],
      width: 2,
      style: "dash"
    }
  });

  dateLineGraphics.add(dateLineGraphic);

  // 创建地图对象
  const map = new Map({
    layers: [tiandituLayer, dateLineGraphics],
    spatialReference: {
      wkid: 3857
    }
  });

  // 创建地图视图 (使用 Web Mercator 坐标)
  const view = new MapView({
    container: "map",
    map: map,
    center: [12958350.39, 4853471.07],  // 北京 (Web Mercator)
    zoom: 12,
    spatialReference: {
      wkid: 3857
    },
    popup: {
      dockEnabled: true,
      dockOptions: {
        position: "top-right",
        breakpoint: false
      }
    }
  });

  // 添加图例
  const legend = new Legend({
    view: view,
    layerInfos: []
  });
  view.ui.add(legend, "bottom-left");

  // 添加比例尺
  const scaleBar = new ScaleBar({
    view: view,
    unit: "metric"
  });
  view.ui.add(scaleBar, "bottom-right");

  // 地图加载完成后打印信息
  view.when(function() {
    console.log("地图加载完成!");
    console.log("视图中心点:", view.center.x.toFixed(2), view.center.y.toFixed(2));
    console.log("缩放级别:", view.zoom);
  });

  // 点击地图获取坐标
  view.on("click", function(event) {
    const lat = event.mapPoint.latitude.toFixed(6);
    const lon = event.mapPoint.longitude.toFixed(6);
    console.log("点击位置:", lon, lat);
  });
});