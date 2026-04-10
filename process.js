
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
    
    const hasCrossed = detectIDLCrossing(polyline.paths);
    
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
    
    const hasCrossed = detectIDLCrossing(polygon.rings);
    
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
 * 检测坐标数组是否跨越国际日期变更线
 */
function detectIDLCrossing(coordinates) {
    for (const coords of coordinates) {
        for (let i = 0; i < coords.length - 1; i++) {
            const lonDiff = Math.abs(coords[i][0] - coords[i + 1][0]);
            if (lonDiff > 180) {
                return true;
            }
        }
    }
    return false;
}
