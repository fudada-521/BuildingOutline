/**
 * 建筑轮廓描边功能
 * 点击地图查询OpenStreetMap建筑轮廓并高亮显示
 *
 * @format
 */

function initBuildingOutline(view, highlightLayer) {
    // 创建提示框
    const toast = document.createElement("div");
    toast.id = "building-toast";
    toast.style.cssText = `
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #fff;
        color: #333;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        z-index: 1000;
        display: none;
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border: 1px solid #e0e0e0;
        max-width: 280px;
        text-align: center;
    `;

    // 加载动画 SVG
    const loadingSpinner = `<svg width="20" height="20" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:8px"><circle cx="12" cy="12" r="10" stroke="#2196F3" stroke-width="2" fill="none" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#2196F3" stroke-width="2" fill="none" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path></svg>`;

    view.container.appendChild(toast);

    // 显示提示信息
    function showToast(message, duration, isLoading) {
        toast.innerHTML = isLoading ? loadingSpinner + message : message;
        toast.style.display = "block";
        if (duration > 0) {
            setTimeout(function () {
                toast.style.display = "none";
            }, duration);
        }
    }

    // 点击地图查询建筑轮廓（使用OSM Overpass API）
    view.on("click", function (event) {
        const lat = event.mapPoint.latitude;
        const lon = event.mapPoint.longitude;
        console.log("点击位置:", lon.toFixed(6), lat.toFixed(6));

        // 清除之前的高亮
        highlightLayer.removeAll();

        // 显示加载中
        showToast("查询中...", 0, true);

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
                    showToast("找到 " + data.elements.length + " 个建筑", 2000);

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
                    showToast("该位置没有找到建筑", 2000);
                }
            })
            .catch(function (error) {
                console.error("查询建筑失败:", error);
                showToast("查询失败，请稍后重试", 2000);
            });
    });
}