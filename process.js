/**
 * 处理跨越国际日期变更线的几何图形（Polyline和Polygon）
 *
 * 优化方案：只对跨越IDL后的点进行调整，而非所有负经度都+360
 * 原理：检测经度跳变（差值>180），跳变后的点+360保持连续
 *
 * @format
 */

/**
 * 主入口函数
 * @param {Object} geometry - ArcGIS几何对象（Polyline或Polygon）
 * @returns {Object} 处理后的几何对象
 */
function processGeometryAcrossIDL(geometry) {
    if (!geometry) return geometry;

    if (geometry.type === "polyline") {
        return processPolyline(geometry);
    } else if (geometry.type === "polygon") {
        return processPolygon(geometry);
    } else {
        console.warn("不支持的几何图形类型:", geometry.type);
        return geometry;
    }
}

/**
 * 处理折线
 */
function processPolyline(polyline) {
    if (!polyline.paths || polyline.paths.length === 0) return polyline;

    // 检查是否需要处理
    if (!detectCrossing(polyline.paths)) {
        return polyline;
    }

    // 处理每条路径
    const processedPaths = polyline.paths.map(path => processPath(path));

    return {
        type: "polyline",
        paths: processedPaths,
        spatialReference: polyline.spatialReference,
    };
}

/**
 * 处理多边形
 */
function processPolygon(polygon) {
    if (!polygon.rings || polygon.rings.length === 0) return polygon;

    // 检查是否需要处理
    if (!detectCrossing(polygon.rings)) {
        return polygon;
    }

    // 处理每个环
    const processedRings = polygon.rings.map(ring => processPath(ring));

    return {
        type: "polygon",
        rings: processedRings,
        spatialReference: polygon.spatialReference,
    };
}

/**
 * 处理单条路径/环
 * 核心逻辑：从第一个跨越IDL的点开始，后续所有负经度点+360
 */
function processPath(coords) {
    let hasCrossed = false;
    const result = [];

    for (let i = 0; i < coords.length; i++) {
        const point = coords[i];
        const [x, y] = point;

        if (i > 0) {
            const [prevX] = coords[i - 1];
            // 检测IDL跨越：相邻两点经度差绝对值>180
            if (Math.abs(x - prevX) > 180) {
                hasCrossed = true;
            }
        }

        // 跨越后，负经度转为>180的表示
        if (hasCrossed && x < 0) {
            result.push([x + 360, y]);
        } else {
            result.push(point);
        }
    }

    return result;
}

/**
 * 检测是否跨越IDL
 */
function detectCrossing(parts) {
    for (const part of parts) {
        for (let i = 0; i < part.length - 1; i++) {
            const lon1 = part[i][0];
            const lon2 = part[i + 1][0];
            if (Math.abs(lon2 - lon1) > 180) {
                return true;
            }
        }
    }
    return false;
}
