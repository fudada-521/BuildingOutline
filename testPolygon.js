/**
 * 验证 Polygon 跨越 IDL 的处理
 * A多边形：原始坐标（会断裂）
 * B多边形：process处理后（连续）
 *
 * @format
 */

function testPolygonIDL(map) {
    require(["esri/layers/GraphicsLayer", "esri/Graphic"], function (GraphicsLayer, Graphic) {
        // A多边形：跨越IDL的原始矩形（纬度10-20）
        const polygonA = {
            type: "polygon",
            rings: [
                [
                    [-170, 15], // 左下
                    [-170, 25], // 左上
                    [170, 25], // 右上（跨越IDL）
                    [170, 15], // 右下
                    [-170, 15], // 闭合
                ],
            ],
            spatialReference: { wkid: 4326 },
        };

        // B多边形：纬度0-10（Polyline B下方约10度）
        const polygonBOriginal = {
            type: "polygon",
            rings: [
                [
                    [-170, 0], // 左下
                    [-170, 10], // 左上
                    [170, 10], // 右上（跨越IDL）
                    [170, 0], // 右下
                    [-170, 0], // 闭合
                ],
            ],
            spatialReference: { wkid: 4326 },
        };

        // 用 processGeometryAcrossIDL 处理 B 多边形
        const polygonBProcessed = processGeometryAcrossIDL(polygonBOriginal);

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
                    color: [255, 0, 0, 100], // 红色半透明
                    outline: {
                        color: [255, 0, 0, 255],
                        width: 2,
                        style: "dash",
                    },
                },
            }),
        );

        // B多边形：绿色半透明填充（处理后）
        layerB.add(
            new Graphic({
                geometry: polygonBProcessed,
                symbol: {
                    type: "simple-fill",
                    color: [0, 255, 0, 100], // 绿色半透明
                    outline: {
                        color: [0, 255, 0, 255],
                        width: 2,
                    },
                },
            }),
        );
    });
}
