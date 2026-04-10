/**
 * 可视化对比测试：验证 Polygon 跨越 IDL 的处理
 * A多边形：原始坐标（会断裂） B多边形：处理后（连续）
 */

function testPolygonIDL(map) {
    require(["esri/layers/GraphicsLayer", "esri/Graphic"], function (GraphicsLayer, Graphic) {

        // A多边形：从东经往西经跨越IDL
        const polygonA = {
            type: "polygon",
            rings: [[
                [170, 15],     // 右下
                [170, 25],     // 右上
                [-170, 25],    // 左上（跨越IDL）
                [-170, 15],    // 左下
                [170, 15],     // 闭合
            ]],
            spatialReference: { wkid: 4326 },
        };

        // B多边形：同样从东经往西经跨越IDL
        const polygonBOriginal = {
            type: "polygon",
            rings: [[
                [170, 0],      // 右下
                [170, 10],     // 右上
                [-170, 10],    // 左上（跨越IDL）
                [-170, 0],     // 左下
                [170, 0],      // 闭合
            ]],
            spatialReference: { wkid: 4326 },
        };

        // 处理 B 多边形
        const polygonBProcessed = idlProcessor.process(polygonBOriginal);

        // 创建图层
        const layerA = new GraphicsLayer();
        const layerB = new GraphicsLayer();
        map.add(layerA);
        map.add(layerB);

        // A多边形：红色半透明填充
        layerA.add(
            new Graphic({
                geometry: polygonA,
                symbol: {
                    type: "simple-fill",
                    color: [255, 0, 0, 100],
                    outline: {
                        color: [255, 0, 0, 255],
                        width: 2,
                        style: "dash",
                    },
                },
            })
        );

        // B多边形：绿色半透明填充（处理后）
        layerB.add(
            new Graphic({
                geometry: polygonBProcessed,
                symbol: {
                    type: "simple-fill",
                    color: [0, 255, 0, 100],
                    outline: {
                        color: [0, 255, 0, 255],
                        width: 2,
                    },
                },
            })
        );

        // 输出到控制台
        console.log("===== Polygon IDL 处理对比 =====");
        console.log("A多边形（未处理，断裂）:", JSON.stringify(polygonA.rings));
        console.log("B多边形（原始坐标）:", JSON.stringify(polygonBOriginal.rings));
        console.log("B多边形（process处理后）:", JSON.stringify(polygonBProcessed.rings));
        console.log("================================");
    });
}
