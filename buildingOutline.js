/**
 * 建筑轮廓描边功能
 * 点击地图查询OpenStreetMap建筑轮廓并高亮显示
 * 支持单选/多选模式，多选模式下可检测建筑物相交
 *
 * @format
 */

function initBuildingOutline(view, highlightLayer) {
    // 多选模式状态
    let isMultiSelect = false;
    const selectedBuildings = []; // 存储选中的建筑 { geometry, element }

    // 获取工具栏容器（由 main.js 创建）
    const toolbar = document.getElementById("map-toolbar");

    /* 搜索和面板相关逻辑已禁用
    // 创建搜索容器
    const searchContainer = document.createElement("div");
    searchContainer.style.cssText = `
        display: flex;
        margin-right: 6px;
    `;

    // 搜索输入框
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "搜索地址...";
    searchInput.style.cssText = `
        width: 160px;
        height: 36px;
        padding: 0 10px;
        border: 1px solid #ddd;
        border-radius: 6px 0 0 6px;
        font-size: 13px;
        outline: none;
    `;
    searchInput.onfocus = function() {
        this.style.borderColor = "#2196F3";
    };
    searchInput.onblur = function() {
        this.style.borderColor = "#ddd";
    };

    // 搜索按钮
    const searchBtn = document.createElement("button");
    searchBtn.innerHTML = "搜索";
    searchBtn.style.cssText = `
        height: 36px;
        padding: 0 12px;
        background: #2196F3;
        color: #fff;
        border: none;
        border-radius: 0 6px 6px 0;
        cursor: pointer;
        font-size: 13px;
    `;
    searchBtn.onmouseover = function() {
        this.style.background = "#1976D2";
    };
    searchBtn.onmouseout = function() {
        this.style.background = "#2196F3";
    };

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchBtn);
    toolbar.insertBefore(searchContainer, toolbar.firstChild);

    // 搜索结果面板
    const searchResultsPanel = document.createElement("div");
    searchResultsPanel.id = "search-results-panel";
    searchResultsPanel.style.cssText = `
        display: none;
        position: absolute;
        top: 56px;
        left: 10px;
        width: 300px;
        max-height: 400px;
        overflow-y: auto;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        z-index: 101;
    `;
    document.getElementById("map").appendChild(searchResultsPanel);

    // 存储搜索结果
    let searchResults = [];

    // 搜索地址函数（使用 Nominatim API）
    function searchAddress(query) {
        if (!query || query.trim() === "") {
            return;
        }

        const nominatimUrl = "https://nominatim.openstreetmap.org/search";
        const params = new URLSearchParams({
            q: query,
            format: "json",
            limit: 5,
            addressdetails: "1",
        });

        fetch(`${nominatimUrl}?${params}`, {
            headers: {
                "Accept": "application/json",
            },
        })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                searchResults = data || [];
                renderSearchResults();
            })
            .catch(function(error) {
                console.error("搜索失败:", error);
                alert("搜索失败，请稍后重试");
            });
    }

    // 渲染搜索结果列表
    function renderSearchResults() {
        searchResultsPanel.innerHTML = "";
        searchResultsPanel.style.display = "block";

        if (searchResults.length === 0) {
            searchResultsPanel.innerHTML = '<div style="padding: 16px; color: #999; text-align: center;">未找到结果</div>';
            return;
        }

        searchResults.forEach(function(result, index) {
            const item = document.createElement("div");
            item.className = "search-result-item";
            item.style.cssText = `
                padding: 12px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;

            const info = document.createElement("div");
            info.style.cssText = `
                flex: 1;
                overflow: hidden;
            `;

            const name = document.createElement("div");
            name.style.cssText = `
                font-size: 13px;
                color: #333;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            `;
            name.textContent = result.display_name;

            const coords = document.createElement("div");
            coords.style.cssText = `
                font-size: 11px;
                color: #999;
                margin-top: 4px;
            `;
            coords.textContent = `${parseFloat(result.lat).toFixed(5)}, ${parseFloat(result.lon).toFixed(5)}`;

            info.appendChild(name);
            info.appendChild(coords);

            // 添加按钮（多选模式下显示）
            const addBtn = document.createElement("button");
            addBtn.innerHTML = "+";
            addBtn.title = "添加到检测列表";
            addBtn.style.cssText = `
                width: 28px;
                height: 28px;
                background: #2196F3;
                color: #fff;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                line-height: 1;
                flex-shrink: 0;
                display: none;
            `;

            item.appendChild(info);
            item.appendChild(addBtn);

            // 点击地图跳转
            item.onclick = function(e) {
                if (e.target === addBtn) return;
                const lat = parseFloat(result.lat);
                const lon = parseFloat(result.lon);
                view.goTo({
                    center: [lon, lat],
                    zoom: 18,
                });

                if (isMultiSelect) {
                    // 多选模式：显示+按钮
                    addBtn.style.display = "block";
                } else {
                    // 单选模式：直接查询建筑
                    addBtn.style.display = "none";
                    queryBuildingsAtLocation(lat, lon);
                }
            };

            // 点击+号添加到检测列表
            addBtn.onclick = function(e) {
                e.stopPropagation();
                const lat = parseFloat(result.lat);
                const lon = parseFloat(result.lon);
                queryBuildingsAtLocation(lat, lon);
            };

            item.onmouseover = function() {
                this.style.background = "#f5f5f5";
            };
            item.onmouseout = function() {
                this.style.background = "#fff";
            };

            searchResultsPanel.appendChild(item);
        });
    }

    // 点击外部关闭搜索结果面板
    document.addEventListener("click", function(e) {
        if (!searchContainer.contains(e.target) && !searchResultsPanel.contains(e.target)) {
            searchResultsPanel.style.display = "none";
        }
    });

    // 在指定坐标查询建筑
    function queryBuildingsAtLocation(lat, lon) {
        // 多选模式下不清除之前的建筑
        if (!isMultiSelect) {
            highlightLayer.removeAll();
            selectedBuildings.length = 0;
        }

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
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data.elements && data.elements.length > 0) {
                    console.log("找到建筑数量:", data.elements.length);

                    data.elements.forEach(function(element) {
                        if (element.geometry && element.geometry.length > 0) {
                            const coords = element.geometry.map(function(pt) {
                                return [pt.lon, pt.lat];
                            });
                            if (coords.length > 0) {
                                coords.push(coords[0]);
                            }

                            const polygon = {
                                type: "polygon",
                                rings: [coords],
                                spatialReference: { wkid: 4326 },
                            };

                            addBuildingToSelection(polygon, element);
                            updateBadge();
                        }
                    });
                } else {
                    console.log("该位置没有找到建筑");
                }
            })
            .catch(function(error) {
                console.error("查询建筑失败:", error);
            });
    }

    // 搜索按钮点击事件
    searchBtn.onclick = function() {
        searchAddress(searchInput.value);
    };

    // 回车搜索
    searchInput.onkeypress = function(event) {
        if (event.key === "Enter") {
            searchAddress(searchInput.value);
        }
    };
    */

    // 在指定坐标查询建筑
    function queryBuildingsAtLocation(lat, lon) {
        // 多选模式下不清除之前的建筑
        if (!isMultiSelect) {
            highlightLayer.removeAll();
            selectedBuildings.length = 0;
        }

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
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data.elements && data.elements.length > 0) {
                    console.log("找到建筑数量:", data.elements.length);

                    data.elements.forEach(function(element) {
                        if (element.geometry && element.geometry.length > 0) {
                            const coords = element.geometry.map(function(pt) {
                                return [pt.lon, pt.lat];
                            });
                            if (coords.length > 0) {
                                coords.push(coords[0]);
                            }

                            const polygon = {
                                type: "polygon",
                                rings: [coords],
                                spatialReference: { wkid: 4326 },
                            };

                            addBuildingToSelection(polygon, element);
                            updateBadge();
                        }
                    });
                } else {
                    console.log("该位置没有找到建筑");
                }
            })
            .catch(function(error) {
                console.error("查询建筑失败:", error);
            });
    }

    // 创建分段控制器容器
    const segmentContainer = document.createElement("div");
    segmentContainer.id = "mode-segment";
    segmentContainer.style.cssText = `
        display: flex;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        overflow: hidden;
    `;

    // 多选计数 badge（暂时移除）
    // const multiSelectBadge = document.createElement("span");
    // multiSelectBadge.innerHTML = "0";
    // multiSelectBadge.style.cssText = `
    //     display: none;
    //     position: absolute;
    //     background: #f44336;
    //     color: #fff;
    //     font-size: 10px;
    //     min-width: 18px;
    //     height: 18px;
    //     border-radius: 9px;
    //     text-align: center;
    //     line-height: 18px;
    //     padding: 0 4px;
    //     box-sizing: border-box;
    //     z-index: 101;
    // `;
    const multiSelectBadge = null;

    // 创建分段按钮
    function createSegmentBtn(text, isActive, onClick) {
        const btn = document.createElement("button");
        btn.innerHTML = text;
        btn.style.cssText = `
            padding: 8px 14px;
            background: ${isActive ? "#2196F3" : "#fff"};
            color: ${isActive ? "#fff" : "#333"};
            border: none;
            cursor: pointer;
            font-size: 13px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            transition: all 0.2s;
        `;
        btn.onclick = onClick;
        return btn;
    }

    // 单选按钮
    const singleSelectBtn = createSegmentBtn("单选", true, function() {
        if (isMultiSelect) {
            isMultiSelect = false;
            singleSelectBtn.style.background = "#2196F3";
            singleSelectBtn.style.color = "#fff";
            multiSelectBtn.style.background = "#fff";
            multiSelectBtn.style.color = "#333";
            multiSelectBadge && (multiSelectBadge.style.display = "none");
            actionBtns.style.display = "none";
            clearAllSelections();
            // 隐藏搜索结果中的+按钮
            document.querySelectorAll(".search-result-item button").forEach(function(btn) {
                btn.style.display = "none";
            });
        }
    });

    // 多选按钮
    const multiSelectBtn = createSegmentBtn("多选", false, function() {
        if (!isMultiSelect) {
            isMultiSelect = true;
            multiSelectBtn.style.background = "#2196F3";
            multiSelectBtn.style.color = "#fff";
            singleSelectBtn.style.background = "#fff";
            singleSelectBtn.style.color = "#333";
            multiSelectBadge && (multiSelectBadge.style.display = "inline-block");
            actionBtns.style.display = "flex";
            // 显示搜索结果中的+按钮
            document.querySelectorAll(".search-result-item button").forEach(function(btn) {
                btn.style.display = "block";
            });
        }
    });

    // 放置分段按钮（单选在前，多选在后）
    segmentContainer.appendChild(singleSelectBtn);
    segmentContainer.appendChild(multiSelectBtn);
    toolbar.appendChild(segmentContainer);

    // 操作按钮容器
    const actionBtns = document.createElement("div");
    actionBtns.style.cssText = `
        display: none;
        gap: 6px;
        margin-left: 6px;
    `;
    toolbar.appendChild(actionBtns);

    // 检测相交按钮
    const checkIntersectionBtn = document.createElement("button");
    checkIntersectionBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 1024 1024"><path d="M682.688 624.128h243.84a39.04 39.04 0 0 0 38.976-39.04V97.6a39.04 39.04 0 0 0-39.04-39.04H438.848a39.04 39.04 0 0 0-39.04 39.04v243.84h185.344c53.824 0 97.536 43.648 97.536 97.472v185.28z m-58.56 58.56H438.848a97.536 97.536 0 0 1-97.536-97.536V399.872h-243.84a39.04 39.04 0 0 0-38.976 39.04v487.552c0 21.568 17.472 39.04 39.04 39.04h487.616a39.04 39.04 0 0 0 39.04-39.04v-243.84zM341.312 341.312v-243.84C341.312 43.776 385.024 0 438.848 0h487.68C980.224 0 1024 43.648 1024 97.536v487.616c0 53.824-43.648 97.536-97.536 97.536h-243.84v243.84c0 53.76-43.648 97.472-97.472 97.472h-487.68A97.536 97.536 0 0 1 0 926.464V438.848c0-53.824 43.648-97.536 97.536-97.536h243.84z" fill="#666666"></path></svg>检测';
    checkIntersectionBtn.title = "检测相交";
    checkIntersectionBtn.style.cssText = `
        width: auto;
        min-width: 36px;
        height: 36px;
        background: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        transition: all 0.2s;
    `;
    checkIntersectionBtn.onclick = function () {
        checkIntersections();
    };
    checkIntersectionBtn.onmouseover = function() {
        this.style.background = "#ff9800";
        this.style.color = "#fff";
    };
    checkIntersectionBtn.onmouseout = function() {
        this.style.background = "#fff";
        this.style.color = "#333";
    };
    actionBtns.appendChild(checkIntersectionBtn);

    // 清除按钮
    const clearSelectionBtn = document.createElement("button");
    clearSelectionBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 1024 1024"><path d="M899.446275 982.832183c-6.72797-48.199785-51.871769-371.078348-59.151737-422.654118-11.575948-82.023635-82.343633-103.911537-122.767453-103.911537l-94.231581 0.191999V114.068052C622.663507 50.612335 571.751734-0.563437 506.928023 0.00456c-31.071862 0.319999-59.071737 13.103942-78.847649 35.99984-18.399918 21.279905-28.335874 49.831778-28.007876 80.039643v340.854482l-99.463557 0.199999c-46.903791 2.031991-136.279393 32.287856-138.815381 132.175412-0.903996 35.447842-25.807885 277.502764-38.847827 400.566216a30.895862 30.895862 0 0 0 30.719863 34.143848h716.036811a2.087991 2.087991 0 0 1 0.631997 0 30.879862 30.879862 0 0 0 29.111871-41.151817z m-437.598052-867.132138c-0.167999-15.471931 4.43198-29.423869 12.967943-39.303825 8.143964-9.423958 19.455913-14.479936 32.711854-14.615935 28.783872 0.271999 53.695761 23.463896 53.991759 52.599766v342.190476l-99.671556 0.199999V115.700045z m249.942887 846.52423l9.487958-170.759239a30.879862 30.879862 0 0 0-29.14387-32.543856c-17.167924-0.759997-31.607859 12.095946-32.543855 29.111871l-9.671957 174.191224H533.063906l9.735957-170.72724a30.879862 30.879862 0 0 0-29.079871-32.575855c-17.159924-0.663997-31.623859 12.063946-32.607854 29.079871l-9.927956 174.223224H360.608674l9.319959-170.791239a30.879862 30.879862 0 0 0-29.151871-32.511856c-17.023924-0.839996-31.599859 12.095946-32.527855 29.143871l-9.503957 174.167224H187.985443c9.543957-91.039595 34.583846-332.734518 35.559842-371.374346 1.671993-65.879707 71.91168-71.607681 78.47165-71.99968l415.974148-0.815996c9.01596 0 54.327758 2.439989 61.143727 50.759774 6.367972 45.215799 41.895813 299.222668 55.079755 393.430248H711.79111z" fill="#818283"></path></svg>清除';
    clearSelectionBtn.title = "清除选择";
    clearSelectionBtn.style.cssText = `
        width: auto;
        min-width: 36px;
        height: 36px;
        background: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        transition: all 0.2s;
    `;
    clearSelectionBtn.onclick = function () {
        clearAllSelections();
    };
    clearSelectionBtn.onmouseover = function() {
        this.style.background = "#f44336";
        this.style.color = "#fff";
    };
    clearSelectionBtn.onmouseout = function() {
        this.style.background = "#fff";
        this.style.color = "#333";
    };
    actionBtns.appendChild(clearSelectionBtn);

    // 更新 badge 计数（已禁用）
    function updateBadge() {
        // multiSelectBadge.innerHTML = selectedBuildings.length;
        // if (selectedBuildings.length > 0) {
        //     multiSelectBadge && (multiSelectBadge.style.display = "inline-block");
        // } else {
        //     multiSelectBadge && (multiSelectBadge.style.display = "none");
        // }
    }

    // 清除所有选择
    function clearAllSelections() {
        selectedBuildings.length = 0;
        highlightLayer.removeAll();
        updateBadge();
    }

    // 检测建筑物相交并计算最短距离
    function checkIntersections() {
        if (selectedBuildings.length < 2) {
            return;
        }

        require([
            "esri/geometry/geometryEngine",
            "esri/Graphic",
            "esri/symbols/TextSymbol",
            "esri/geometry/Point",
            "esri/Color",
            "esri/geometry/support/webMercatorUtils",
        ], function (geometryEngine, Graphic, TextSymbol, Point, Color, webMercatorUtils) {
            let intersectionCount = 0;
            const intersectingPairs = [];
            const distanceInfos = []; // 存储距离信息

            // 两两检查是否相交并计算距离
            for (let i = 0; i < selectedBuildings.length; i++) {
                for (let j = i + 1; j < selectedBuildings.length; j++) {
                    const geom1 = selectedBuildings[i].geometry;
                    const geom2 = selectedBuildings[j].geometry;

                    if (geometryEngine.intersects(geom1, geom2)) {
                        intersectionCount++;
                        intersectingPairs.push([i, j]);
                    }

                    // 手动计算最近点距离（使用地理坐标计算）
                    const result1 = geometryEngine.nearestCoordinate(geom1, geom2.centroid);
                    const result2 = geometryEngine.nearestCoordinate(geom2, geom1.centroid);

                    if (result1 && result2) {
                        // 将地理坐标转换为 Web Mercator 再计算距离
                        const pt1Mercator = webMercatorUtils.lngLatToXY(result1.coordinate.x, result1.coordinate.y);
                        const pt2Mercator = webMercatorUtils.lngLatToXY(result2.coordinate.x, result2.coordinate.y);
                        const distance = Math.sqrt(
                            Math.pow(pt2Mercator[0] - pt1Mercator[0], 2) +
                            Math.pow(pt2Mercator[1] - pt1Mercator[1], 2)
                        );

                        if (distance > 0) {
                            distanceInfos.push({
                                from: i,
                                to: j,
                                distance: distance,
                                pt1: result1.coordinate,
                                pt2: result2.coordinate
                            });
                        }
                    }
                }
            }

            // 重新绘制所有建筑
            highlightLayer.removeAll();
            selectedBuildings.forEach(function (item, idx) {
                const isIntersecting = intersectingPairs.some(function (pair) {
                    return pair[0] === idx || pair[1] === idx;
                });

                const graphic = new Graphic({
                    geometry: item.geometry,
                    symbol: {
                        type: "simple-line",
                        color: isIntersecting ? [255, 0, 0, 255] : [0, 255, 255, 255],
                        width: isIntersecting ? 3 : 1.5,
                    },
                });
                highlightLayer.add(graphic);
            });

            // 绘制距离线和标签
            distanceInfos.forEach(function(info) {
                if (info.pt1 && info.pt2) {
                    // 绘制连接线
                    const lineGraphic = new Graphic({
                        geometry: {
                            type: "polyline",
                            paths: [[
                                [info.pt1.x, info.pt1.y],
                                [info.pt2.x, info.pt2.y]
                            ]],
                            spatialReference: { wkid: 4326 }
                        },
                        symbol: {
                            type: "simple-line",
                            color: [255, 152, 0, 200],
                            width: 1.5,
                            style: "dash",
                        }
                    });
                    highlightLayer.add(lineGraphic);

                    // 计算中点
                    const midX = (info.pt1.x + info.pt2.x) / 2;
                    const midY = (info.pt1.y + info.pt2.y) / 2;

                    // 格式化距离显示
                    let distanceText;
                    if (info.distance < 1000) {
                        distanceText = info.distance.toFixed(1) + "m";
                    } else {
                        distanceText = (info.distance / 1000).toFixed(2) + "km";
                    }

                    // 添加距离标签
                    const labelGraphic = new Graphic({
                        geometry: new Point({
                            x: midX,
                            y: midY,
                            spatialReference: { wkid: 4326 }
                        }),
                        symbol: new TextSymbol({
                            text: distanceText,
                            color: new Color([255, 152, 0, 255]),
                            fontSize: 11,
                            haloColor: new Color([255, 255, 255, 200]),
                            haloSize: 2,
                            horizontalAlignment: "center",
                            verticalAlignment: "bottom",
                        })
                    });
                    highlightLayer.add(labelGraphic);
                }
            });
        });
    }

    // 添加建筑到选择列表
    function addBuildingToSelection(geometry, element) {
        // 将普通对象转换为 ArcGIS 几何对象（用于后续投影计算）
        require(["esri/geometry/Polygon", "esri/Graphic"], function (Polygon, Graphic) {
            const arcgisGeometry = new Polygon({
                type: "polygon",
                rings: geometry.rings,
                spatialReference: geometry.spatialReference,
            });

            selectedBuildings.push({ geometry: arcgisGeometry, element: element });

            const graphic = new Graphic({
                geometry: arcgisGeometry,
                symbol: {
                    type: "simple-line",
                    color: [0, 255, 255, 255],
                    width: 1.5,
                },
            });
            highlightLayer.add(graphic);
        });
    }

    // 点击地图查询建筑轮廓
    view.on("click", function (event) {
        const lat = event.mapPoint.latitude;
        const lon = event.mapPoint.longitude;
        console.log("点击位置:", lon.toFixed(6), lat.toFixed(6));
        queryBuildingsAtLocation(lat, lon);
    });
}