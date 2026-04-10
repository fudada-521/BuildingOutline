/**
 * 可视化对比测试：验证 processGeometryAcrossIDL 功能
 * A线：未处理（断裂） B线：处理过（连续）
 *
 * @format
 */

function testIDLProcessing(map) {
    require(["esri/layers/GraphicsLayer", "esri/Graphic"], function (GraphicsLayer, Graphic) {
        // A线坐标：跨越IDL的原始坐标（纬度35-40）
        const coordsA = [
            [-165, 35], // 西经
            [-170, 37],
            [165, 37], // 东经（跨越IDL）
            [170, 35],
        ];

        // B线坐标：纬度30-35
        const coordsB = [
            [-165, 30], // 西经
            [-170, 32],
            [165, 32], // 东经（跨越IDL）
            [170, 30],
        ];

        // 用 processGeometryAcrossIDL 处理 B 线
        const processedB = processGeometryAcrossIDL({
            type: "polyline",
            paths: [coordsB],
            spatialReference: { wkid: 4326 },
        });

        // 创建图层
        const layerA = new GraphicsLayer();
        const layerB = new GraphicsLayer();
        map.add(layerA);
        map.add(layerB);

        // A：未处理 - 红色虚线
        layerA.add(
            new Graphic({
                geometry: {
                    type: "polyline",
                    paths: [coordsA],
                    spatialReference: { wkid: 4326 },
                },
                symbol: {
                    type: "simple-line",
                    color: [255, 0, 0, 255],
                    width: 1,
                },
            }),
        );

        // B：处理后 - 绿色实线
        layerB.add(
            new Graphic({
                geometry: processedB,
                symbol: {
                    type: "simple-line",
                    color: [0, 255, 0, 255],
                    width: 1,
                },
            }),
        );
    });
}
