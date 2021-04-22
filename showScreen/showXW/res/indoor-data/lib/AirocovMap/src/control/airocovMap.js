const Scene = require("./scene");
const draw = require("./draw");
const MapData = require("./MapData");
const event = require("../models/event");
const helper = require("../models/helper");
const THREE = require("../vendor/Three");
const mapConfig = require("../models/config");
const GPS = require("../models/gps");

const config = function (config) {
    mapConfig.position = config.position || mapConfig.position;
    mapConfig.defaultFloor = config.defaultFloor || mapConfig.defaultFloor;
    mapConfig.count = config.count || mapConfig.count;
    mapConfig.defaultGap = config.defaultGap || mapConfig.defaultGap;
    mapConfig.showAllFloor = config.showAllFloor || mapConfig.showAllFloor;
    mapConfig.showViewMode = config.showViewMode || mapConfig.showViewMode;
}
//用户使用全局对象
var airocovMap = {
    VERSION: "1.0",
    Map: function (obj) {
        var mapData = new MapData(obj);
        console.log(mapData.geoJson);
        obj.container.style.position = 'relative';
        obj.container.style.overflow = 'hidden';
        var bubbleDom = null;
        obj.position = !helper.isEmpty(obj.position) ? obj.position : {x: 0, y: 200, z: 100};
        var scene = new Scene(obj.container, obj.position);
        var models = [];
        var render = function () {
            var map2dGeoJson = [],
                floor;
            mapData.getData().then(function (res) {
                models = [];
                mapData.getRemainData();
                mapData.mapDataHandle(res.mapList);
                scene.renderer.setClearColor(!helper.isEmpty(mapData.commonTheme) ? mapData.commonTheme.bgColor.color : 0xffffff);
                for (var i = 0; i < mapData.geoJson.length; i++) {
                    if(mapConfig.showViewMode  == "MODE_2D"){
                        map2dGeoJson = [];
                        mapData.geoJson[i].geoJson.forEach( function (value, n) {
                            map2dGeoJson[n] = JSON.parse(JSON.stringify(mapData.geoJson[i].geoJson[n]));
                            map2dGeoJson[n].height = 0;
                        })
                        floor = draw.draw(map2dGeoJson);
                        scene.control._2d = true;
                    }else {
                        floor = draw.draw(mapData.geoJson[i].geoJson);
                        floor.translateY(i * Number(mapConfig.defaultGap));
                    }
                    scene.add(floor);
                    models.push(mapData.geoJson[i]);
                }
            });
        };
        //显示所有地图
        var renderAllFloor = function () {
            models = [];
            for (let i = 0; i < mapData.geoJson.length; i++) {
                var floor = draw.draw(mapData.geoJson[i].geoJson);
                floor.translateY(i * Number(mapConfig.defaultGap));
                scene.add(floor);
                models.push(mapData.geoJson[i]);
            }
        };
        //显示指定楼层地图
        var renderFloor = function (floorName) {
            models = [];
            var floors = floorName || mapConfig.defaultFloor;
            var mapJson = mapData.geoJson.findIndex(values => values.name == floors);
            var floor = draw.draw(mapData.geoJson[mapJson].geoJson)
            scene.add(floor);
            models.push(mapData.geoJson[mapJson]);

        };
        var browserJudgment = function () {
            if (helper.webGL()) {
                render();
            }
        }
        browserJudgment();
        this.clear = function () {
            scene.clearMap();
        };
        this.mapTo2D = function () {
            scene.clearMap();
            for (var i = 0; i < models.length; i++) {
                var map2dGeojson = [];
                for (var n = 0; n < models[i].geoJson.length; n++) {
                    map2dGeojson[n] = JSON.parse(JSON.stringify(models[i].geoJson[n]));
                    map2dGeojson[n].height = 0;
                }
                var floor = draw.draw(map2dGeojson)
                floor.translateY(i * 10);
                scene.add(floor);
            }
            scene.setPosition(obj.position);
            scene.control._2d = true;
            if (bubbleDom) {
                obj.container.removeChild(bubbleDom);
                bubbleDom = null;
            }
        };
        this.mapTo3D = function () {
            scene.clearMap();
            draw.autoModels = [];
            for (var i = 0; i < models.length; i++) {
                var floor = draw.draw(models[i].geoJson)
                floor.translateY(i * 100);
                scene.add(floor);
            }
            scene.setPosition(obj.position);
            scene.control._2d = false;
            if (bubbleDom) {
                obj.container.removeChild(bubbleDom);
                bubbleDom = null;
            }
        };
        this.event = event;
        event.clear();
        //重新渲染数据
        this.resetRender = function (object) {
            if (bubbleDom) {
                event.off("onMouseMove");
                obj.container.removeChild(bubbleDom);
                bubbleDom = null;
            }
            ;
            mapData.geoJson.length = 0;
            if (object.themeUrl) {
                mapData.commonTheme.length = 0;
            }
            scene.clearMap();
            mapData.object.mapList = object.mapList ? object.mapList : mapData.object.mapList;
            mapData.object.themeUrl = object.themeUrl ? object.themeUrl : mapData.object.themeUrl;
            mapData.object.other = object.other ? object.other : mapData.object.other;
            mapData.object.pathUrl = object.pathUrl ? object.pathUrl : mapData.object.pathUrl;
            render();
        };
        //第三方点击模块高亮
        this.clickOutModel = function (id) {
            if (draw.highLightModel.length) {
                for (var i = draw.highLightModel.length - 1; 0 <= i; i--) {
                    draw.highLightModel[i].material.color.set(draw.highLightModel[i].info.fillcolor);
                    draw.highLightModel.pop();
                }
            }
            //设置点中的模块颜色
            for (var i = 0; i < draw.clickModels.length; i++) {
                if (draw.clickModels[i].info.id) {
                    if (draw.clickModels[i].info.id == id) {
                        if (!helper.isEmpty(draw.clickModels[i].info.splicing)) {
                            //多模块
                            for (var n = 0; n < draw.clickModels.length; n++) {
                                if (draw.clickModels[i].info.splicing == draw.clickModels[n].info.splicing) {
                                    draw.clickModels[n].material.color.set("#ff0000");
                                    draw.highLightModel.push(draw.clickModels[n]);
                                }
                            }
                        } else {
                            //单模块
                            draw.clickModels[i].material.color.set("#ff0000");
                            draw.highLightModel.push(draw.clickModels[i]);
                        }
                    }
                }
            }
        };
        // 添加 定位点 图标
        var isPosition = airocovMap.Utils.isPosition;
        this.addMarkerIcon = function (option) {
            var c = scene.scene.getObjectByName("click");
            scene.scene.remove(c);
            var icon = option.icon,
                position = option.position;
            if (!isPosition(position)) {
                console.error('position格式不正确');
                return;
            }
            var imgPath = icon || "./logos.png";
            var texture = new THREE.TextureLoader().load(imgPath);
            var spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                color: 0xffffff,
                transparent: false
            });
            var sprite = new THREE.Sprite(spriteMaterial);
            sprite.name = "click";
            sprite.scale.set(6, 6, 6);
            sprite.position.set(position.x, position.y + 3, position.z);
            scene.add(sprite);
        };
        // 定位气泡位置
        var positionInfowindow = function (bubble, positon) {

            var V = new THREE.Vector3(positon.x, positon.y, positon.z);
            var vector = V.project(scene.camera);
            var halfWidth = scene.renderer.domElement.width / 2;
            var halfHeight = scene.renderer.domElement.height / 2;
            var result = {
                x: Math.round(vector.x * halfWidth + halfWidth),
                y: Math.round(-vector.y * halfHeight + halfHeight)
            };
            bubble.style.position = "absolute";
            bubble.style.left = parseInt(result.x - bubble.offsetWidth / 2) + 'px';
            bubble.style.top = parseInt(result.y - bubble.offsetHeight) + 'px';

        }

        // 添加气泡
        this.addInfoWindow = function (option) {
            debugger;
            if (bubbleDom) {
                event.off("onMouseMove");
                obj.container.removeChild(bubbleDom);
                bubbleDom = null;
            }
            ;
            var options = {};
            for (var i = 0; i < draw.clickModels.length; i++) {
                if (draw.clickModels[i].type == "Sprite") {
                    if (draw.clickModels[i].info.id == option.id) {
                        options.position = draw.clickModels[i].position;
                    }
                }
            }
            var dom = document.createElement('div');
            bubbleDom = dom;
            dom.innerHTML = option.content;
            obj.container.appendChild(dom);

            var element = document.createElement('div');
            var element2 = document.createElement('div');

            var element_div = document.createElement('div');
            var element_div2 = document.createElement('div');

            dom.appendChild(element);
            dom.appendChild(element2);
            element.appendChild(element_div);
            element.appendChild(element_div2);


            element.style.position = "relactive";
            element.style.width = "100%";
            element.style.height = "16px";

            element2.innerHTML = "x";
            element2.style.color = "#ffffff";
            element2.style.position = "absolute";
            element2.style.top = "5px";
            element2.style.right = "5px";
            element2.style.width = "5px";
            element2.style.height = "5px";
            element2.style.lineHeight = "5px";
            element2.style.textAlign = "center";
            element2.style.cursor = "pointer";

            element_div.style.borderLeft = "20px solid transparent";
            element_div.style.borderRight = "20px solid transparent";
            element_div.style.borderTop = "16px solid #000000";
            element_div.style.opacity = ".8";
            element_div.style.position = "absolute";
            element_div.style.bottom = "0px";

            element_div2.style.borderLeft = "18px solid transparent";
            element_div2.style.borderRight = "18px solid transparent";
            element_div2.style.borderTop = "14px solid #000";
            element_div.style.opacity = "0";
            element_div2.style.position = "absolute";
            element_div2.style.bottom = "2px";

            element2.onclick = function () {
                event.off("onMouseMove");
                obj.container.removeChild(bubbleDom);
                bubbleDom = null;
            }
            positionInfowindow(dom, options.position);
            element_div2.style.left = (dom.clientWidth / 2) - 18 + "px";
            element_div.style.left = (dom.clientWidth / 2) - 20 + "px";
            var mouseMoveHandler = function () {
                positionInfowindow(dom, options.position);
            };
            event.on("onMouseMove", mouseMoveHandler);
            // // 返回的对象可以关闭气泡
            // return {
            //     close: function () {
            //         event.off("onMouseMove", mouseMoveHandler);
            //         obj.container.removeChild(bubbleDom);
            //         bubbleDom = null;
            //     }
            // };
        };

        this.showAllFloor = function () {
            scene.clearMap();
            renderAllFloor();
        };

        this.showFloor = function (floorName) {
            scene.clearMap();
            renderFloor(floorName);
        }

        // 删除气泡
        this.closeInfoWindow = function () {
            if (bubbleDom) {
                event.off("onMouseMove");
                obj.container.removeChild(bubbleDom);
                bubbleDom = null;
            }
            ;
        };
    },
    Utils: {
        //获取dom元素距离屏幕左边的距离
        getOffsetLeft: function (obj) {
            var tmp = obj.offsetLeft;
            var val = obj.offsetParent;
            while (val != null) {
                tmp += val.offsetLeft;
                val = val.offsetParent;
            }
            return tmp;

        }
        ,
        //获取dom元素距离屏幕顶部的距离
        getOffsetTop: function (obj) {
            var tmp = obj.offsetTop;
            var val = obj.offsetParent;
            while (val != null) {
                tmp += val.offsetTop;
                val = val.offsetParent;
            }
            return tmp;

        }
        ,
        isPosition: function (position) {
            if (typeof position.x == 'number' && typeof position.y == 'number' && typeof position.z == 'number') {
                return true;
            }
            return false;
        },
        GPS: GPS
    },
    config: config

}

module.exports = airocovMap;