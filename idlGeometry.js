/**
 * 国际日期变更线几何处理工具
 *
 * 功能：处理跨越IDL的几何图形（Polyline和Polygon），使其在地图上显示连续
 */

/**
 * IDL几何处理类
 */
class IDLGeometry {

    /**
     * 处理跨越IDL的几何图形
     */
    static process(geometry) {
        if (!geometry) return geometry;

        if (geometry.type === "polyline") {
            return this.processPolyline(geometry);
        } else if (geometry.type === "polygon") {
            return this.processPolygon(geometry);
        } else {
            console.warn("不支持的几何图形类型:", geometry.type);
            return geometry;
        }
    }

    /**
     * 处理折线
     */
    static processPolyline(polyline) {
        if (!polyline.paths || polyline.paths.length === 0) return polyline;

        if (!this.hasCrossing(polyline.paths)) {
            return polyline;
        }

        return {
            type: "polyline",
            paths: polyline.paths.map(path => this.processCoords(path)),
            spatialReference: polyline.spatialReference,
        };
    }

    /**
     * 处理多边形
     */
    static processPolygon(polygon) {
        if (!polygon.rings || polygon.rings.length === 0) return polygon;

        if (!this.hasCrossing(polygon.rings)) {
            return polygon;
        }

        return {
            type: "polygon",
            rings: polygon.rings.map(ring => this.processCoords(ring)),
            spatialReference: polygon.spatialReference,
        };
    }

    /**
     * 处理坐标数组：将跨越IDL后的负经度转为>180的表示
     */
    static processCoords(coords) {
        let crossed = false;
        return coords.map((point, i) => {
            if (i > 0 && this.isCrossing(point[0], coords[i - 1][0])) {
                crossed = true;
            }
            return crossed && point[0] < 0 ? [point[0] + 360, point[1]] : point;
        });
    }

    /**
     * 检测坐标数组是否跨越IDL
     */
    static hasCrossing(coords) {
        for (let i = 1; i < coords.length; i++) {
            if (this.isCrossing(coords[i][0], coords[i - 1][0])) {
                return true;
            }
        }
        return false;
    }

    /**
     * 判断两点经度是否跨越IDL（经度差>180）
     */
    static isCrossing(lon1, lon2) {
        return Math.abs(lon2 - lon1) > 180;
    }
}

/**
 * 兼容旧API
 */
function processGeometryAcrossIDL(geometry) {
    return IDLGeometry.process(geometry);
}
