/**
 * 可视化对比测试：验证 IDLGeometryProcessor 功能
 * A线：未处理（断裂） B线：处理过（连续）
 */

function testIDLProcessing(map) {
    require(["esri/layers/GraphicsLayer", "esri/Graphic"], function (GraphicsLayer, Graphic) {
        // A线：从西经往东经走，跨越IDL
        const coordsA = [
            [-170, 35],
            [-175, 37],
            [175, 37], // 跨越IDL
            [170, 35],
        ];

        // B线：从东经往西经走，跨越IDL后变成负经度
        const coordsB = [
            [170, 30],
            [175, 32],
            [-170, 32], // 跨越IDL
            [-165, 30],
        ];

        // 处理 B 线
        const processedB = idlProcessor.process({
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