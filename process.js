/**
 * 处理跨越国际日期变更线的几何图形（Polyline和Polygon）
 */
class IDLGeometryProcessor {
    /**
     * 处理几何图形
     * @param {Object} geometry - ArcGIS JSAPI几何图形对象（Polyline或Polygon）
     * @returns {Object} 处理后的几何图形对象
     */
    process(geometry) {
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
     * 处理折线（Polyline）跨越国际日期变更线的情况
     */
    processPolyline(polyline) {
        if (!polyline.paths || polyline.paths.length === 0) return polyline;

        if (!this.detectCrossing(polyline.paths)) {
            return polyline;
        }

        const processedPaths = polyline.paths.map(path => {
            return path.map(point => this.normalizeLongitude(point));
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
    processPolygon(polygon) {
        if (!polygon.rings || polygon.rings.length === 0) return polygon;

        if (!this.detectCrossing(polygon.rings)) {
            return polygon;
        }

        const processedRings = polygon.rings.map(ring => {
            return ring.map(point => this.normalizeLongitude(point));
        });

        return {
            type: "polygon",
            rings: processedRings,
            spatialReference: polygon.spatialReference
        };
    }

    /**
     * 标准化经度坐标（负值加360）
     */
    normalizeLongitude(point) {
        const [x, y] = point;
        return [x < 0 ? x + 360 : x, y];
    }

    /**
     * 检测坐标数组是否跨越国际日期变更线
     */
    detectCrossing(coordinates) {
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
}

// 导出单例
const idlProcessor = new IDLGeometryProcessor();