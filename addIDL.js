/**
 * 添加国际日期变更线到地图
 *
 * @format
 * @param {Map} map - ArcGIS Map对象
 */

function addInternationalDateLine(map) {
    require(["esri/layers/GeoJSONLayer"], function (GeoJSONLayer) {
        const idlLayer = new GeoJSONLayer({
            url: "./idl_merged.geojson",
            renderer: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    color: [221, 21, 221, 221],
                    width: 1,
                },
            },
        });
        map.add(idlLayer);
    });
}
