/**
 * 可视化对比测试：验证 processGeometryAcrossIDL 功能
 * A线：未处理（断裂） B线：处理过（连续）
 *
 * @format
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

        // A：端点标记
        coordsA.forEach(function (point) {
            layerA.add(
                new Graphic({
                    geometry: {
                        type: "point",
                        x: point[0],
                        y: point[1],
                        spatialReference: { wkid: 4326 },
                    },
                    symbol: {
                        type: "simple-marker",
                        color: [255, 0, 0, 255],
                        size: 8,
                        outline: { color: [255, 255, 255, 255], width: 2 },
                    },
                }),
            );
        });

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

        // B：端点标记
        processedB.paths[0].forEach(function (point) {
            layerB.add(
                new Graphic({
                    geometry: {
                        type: "point",
                        x: point[0],
                        y: point[1],
                        spatialReference: { wkid: 4326 },
                    },
                    symbol: {
                        type: "simple-marker",
                        color: [0, 255, 0, 255],
                        size: 8,
                        outline: { color: [255, 255, 255, 255], width: 2 },
                    },
                }),
            );
        });

        // 输出到控制台
        console.log("===== Polyline IDL 处理对比 =====");
        console.log("A线（未处理，断裂）:", JSON.stringify(coordsA));
        console.log("B线（原始坐标）:", JSON.stringify(coordsB));
        console.log("B线（process处理后）:", JSON.stringify(processedB.paths));
        console.log("================================");
    });
}
