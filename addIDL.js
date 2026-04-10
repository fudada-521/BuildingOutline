/**
 * 添加国际日期变更线到地图
 */

function addInternationalDateLine(map) {
    require(["esri/layers/GeoJSONLayer"], function (GeoJSONLayer) {
        const idlLayer = new GeoJSONLayer({
            url: "./idl_merged.geojson",
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    color: [255, 0, 0, 255],
                    width: 2,
                },
            },
        });
        map.add(idlLayer);
    });
}
