
/**
 * 处理跨越国际日期变更线的几何图形（Polyline和Polygon）
 * @param {Object} geometry - ArcGIS JSAPI几何图形对象（Polyline或Polygon）
 * @returns {Object} 处理后的几何图形对象
 */
function processGeometryAcrossIDL(geometry) {
    if (!geometry) return geometry;
    
    // 检查几何图形类型并分别处理
    if (geometry.type === "polyline") {
        return processPolylineAcrossIDL(geometry);
    } else if (geometry.type === "polygon") {
        return processPolygonAcrossIDL(geometry);
    } else {
        console.warn("不支持的几何图形类型:", geometry.type);
        return geometry;
    }
}

/**
 * 处理折线（Polyline）跨越国际日期变更线的情况
 */
function processPolylineAcrossIDL(polyline) {
    if (!polyline.paths || polyline.paths.length === 0) return polyline;
    
    const hasCrossed = detectIDLCrossingForPaths(polyline.paths);
    
    if (!hasCrossed) {
        return polyline;
    }
    
    // 处理所有路径中的坐标点
    const processedPaths = polyline.paths.map(path => {
        return path.map(point => {
            const [x, y] = point;
            // 处理经度坐标（假设第一个坐标是经度）
            const processedX = x < 0 ? x + 360 : x;
            return [processedX, y];
        });
    });
    
    return {
        type: "polyline",
        paths: processedPaths,
        spatialReference: polyline.spatialReference
    };
}

/**
 * 处理多边形（Polygon）跨越国际日期变更线的情况
 */
function processPolygonAcrossIDL(polygon) {
    if (!polygon.rings || polygon.rings.length === 0) return polygon;
    
    const hasCrossed = detectIDLCrossingForRings(polygon.rings);
    
    if (!hasCrossed) {
        return polygon;
    }
    
    // 处理所有环中的坐标点
    const processedRings = polygon.rings.map(ring => {
        return ring.map(point => {
            const [x, y] = point;
            // 处理经度坐标
            const processedX = x < 0 ? x + 360 : x;
            return [processedX, y];
        });
    });
    
    return {
        type: "polygon",
        rings: processedRings,
        spatialReference: polygon.spatialReference
    };
}

/**
 * 检测折线路径是否跨越国际日期变更线
 */
function detectIDLCrossingForPaths(paths) {
    for (const path of paths) {
        for (let i = 0; i < path.length - 1; i++) {
            const currentPoint = path[i];
            const nextPoint = path[i + 1];
            const currentLon = currentPoint[0];
            const nextLon = nextPoint[0];
            
            const lonDiff = Math.abs(currentLon - nextLon);
            if (lonDiff > 180) {
                return true;
            }
        }
    }
    return false;
}

/**
 * 检测多边形环是否跨越国际日期变更线
 */
function detectIDLCrossingForRings(rings) {
    for (const ring of rings) {
        for (let i = 0; i < ring.length - 1; i++) {
            const currentPoint = ring[i];
            const nextPoint = ring[i + 1];
            const currentLon = currentPoint[0];
            const nextLon = nextPoint[0];
            
            const lonDiff = Math.abs(currentLon - nextLon);
            if (lonDiff > 180) {
                return true;
            }
        }
    }
    return false;
}

// ==================== 使用示例 ====================
require([
    "esri/geometry/Polyline",
    "esri/geometry/Polygon"
], function(Polyline, Polygon) {

    // 示例1：跨越国际日期变更线的折线
    const crossingPolyline = new Polyline({
        paths: [[
            [-170, 30],  // 西经
            [170, 30]    // 东经（跨越日期变更线）
        ]],
        spatialReference: { wkid: 4326 }
    });

    // 示例2：跨越国际日期变更线的多边形（环太平洋区域）
    const crossingPolygon = new Polygon({
        rings: [[
            [-170, 30],
            [-170, 40],
            [170, 40],   // 跨越日期变更线
            [170, 30],
            [-170, 30]   // 闭合环
        ]],
        spatialReference: { wkid: 4326 }
    });

    // 示例3：未跨越国际日期变更线的几何图形
    const normalPolyline = new Polyline({
        paths: [[
            [-100, 30],
            [-80, 30]    // 完全在西半球
        ]],
        spatialReference: { wkid: 4326 }
    });

    console.log("处理前 - 跨越日期变更线的折线:", crossingPolyline.paths);
    const processedPolyline = processGeometryAcrossIDL(crossingPolyline);
    console.log("处理后 - 跨越日期变更线的折线:", processedPolyline.paths);

    console.log("处理前 - 跨越日期变更线的多边形:", crossingPolygon.rings);
    const processedPolygon = processGeometryAcrossIDL(crossingPolygon);
    console.log("处理后 - 跨越日期变更线的多边形:", processedPolygon.rings);

    console.log("未跨越日期变更线的折线处理结果:", 
        processGeometryAcrossIDL(normalPolyline).paths);
});
