/**
 * 可视化对比测试：验证 processGeometryAcrossIDL 功能
 * A线：未处理（断裂） B线：处理过（连续）
 *
 * @format
 */

function testIDLProcessing(map) {
    require(["esri/layers/GraphicsLayer", "esri/Graphic"], function (GraphicsLayer, Graphic) {
        // A线坐标：跨越IDL的原始坐标（纬度20-25）
        const coordsA = [
            [-165, 20], // 西经
            [-170, 22],
            [165, 22], // 东经（跨越IDL）
            [170, 20],
        ];

        // B线坐标：纬度稍低（纬度15-20），错开显示
        const coordsB = [
            [-165, 15], // 西经
            [-170, 17],
            [165, 17], // 东经（跨越IDL）
            [170, 15],
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

        // A：端点标记
        coordsA.forEach(function (point) {
            layerA.add(
                new Graphic({
                    geometry: { type: "point", x: point[0], y: point[1], spatialReference: { wkid: 4326 } },
                    symbol: {
                        type: "simple-marker",
                        color: [255, 0, 0, 255],
                        size: 10,
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
                    geometry: { type: "point", x: point[0], y: point[1], spatialReference: { wkid: 4326 } },
                    symbol: {
                        type: "simple-marker",
                        color: [0, 255, 0, 255],
                        size: 10,
                        outline: { color: [255, 255, 255, 255], width: 2 },
                    },
                }),
            );
        });

        // 控制台输出
        console.log("===== IDL 处理对比测试 =====");
        console.log("A线（未处理，断裂）:", JSON.stringify(coordsA));
        console.log("B线（原始坐标）:", JSON.stringify(coordsB));
        console.log("B线（process处理后）:", JSON.stringify(processedB.paths));
        console.log("========================");
    });
}
