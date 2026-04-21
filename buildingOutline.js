/**
 * 建筑轮廓描边功能
 * 点击地图查询OpenStreetMap建筑轮廓并高亮显示
 *
 * @format
 */

function initBuildingOutline(view, highlightLayer) {
    // 点击地图查询建筑轮廓（使用OSM Overpass API）
    view.on("click", function (event) {
        const lat = event.mapPoint.latitude;
        const lon = event.mapPoint.longitude;
        console.log("点击位置:", lon.toFixed(6), lat.toFixed(6));

        // 清除之前的高亮
        highlightLayer.removeAll();

        // 使用Overpass API查询OSM建筑数据
        const overpassUrl = "https://overpass-api.de/api/interpreter";
        const query = `
            [out:json][timeout:10];
            (
              way["building"](around:15,${lat},${lon});
            );
            out body geom;
        `;

        fetch(overpassUrl, {
            method: "POST",
            body: "data=" + encodeURIComponent(query),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.elements && data.elements.length > 0) {
                    console.log("找到建筑数量:", data.elements.length);

                    // 遍历所有找到的建筑，添加到高亮图层
                    data.elements.forEach(function (element) {
                        if (element.geometry && element.geometry.length > 0) {
                            // 构建多边形坐标（闭合环）
                            const coords = element.geometry.map(function (pt) {
                                return [pt.lon, pt.lat];
                            });
                            // 闭合多边形
                            if (coords.length > 0) {
                                coords.push(coords[0]);
                            }

                            const polygon = {
                                type: "polygon",
                                rings: [coords],
                                spatialReference: { wkid: 4326 },
                            };

                            require(["esri/Graphic"], function (Graphic) {
                                const highlightGraphic = new Graphic({
                                    geometry: polygon,
                                    symbol: {
                                        type: "simple-line",
                                        color: [0, 255, 255, 255], // 青色描边
                                        width: 1.5,
                                    },
                                });
                                highlightLayer.add(highlightGraphic);
                            });
                        }
                    });
                } else {
                    console.log("该位置没有找到建筑");
                }
            })
            .catch(function (error) {
                console.error("查询建筑失败:", error);
            });
    });
}
