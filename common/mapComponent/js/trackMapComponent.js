/**
 * 自定义 angular组件
 */
(function () {
    'use strict';
    var app = angular.module("angularApp");
    app.component('trackMapComponent', {
        templateUrl: '/common/mapComponent/component/mapTrack.html',
        bindings: {
            mapData: '<',
            onBim: '&',
            isAddWay: '<'
        },
        controller: ['$scope', '$rootScope', '$timeout', '$http', 'AppService', 'indoorService', '$state', function ($scope, $rootScope, $timeout, $http, AppService, indoorService, $state) {
            var $ctrl = this;
            //组件挂载后发事件
            var animateTween;

            $ctrl.$postLink = function () {
                $scope.$emit("indoorMapEnd");
            }
            // 地图配置
            AirocovMap.Config.set({
                // 楼层间距200
                showAllFloor: false,
                count: 100,
                zoom: 2,
                // defaultFloor: "武汉创意天地",
                showViewMode: "MODE_2D",
                defaultGap: 18,//楼层间距
                showMenu: false //不显示楼层选择
            });
            var parkName = AppService.park.parkName;//园区名称
            var parkNo = AppService.parkNo; //园区编号
            var onlyIndoorMap = AppService.onlyIndoorMap; //是否只有园区地图
            var mapList = [];    //地图渲染数据
            var map;             //map
            var bubble;
            var bubble2;
            var clickNum = 0;
            $ctrl.startRange = false;
            $ctrl.curMarkType = {
                name: "xian.png",
                url: "/res/img/xian.png"
            }
            $ctrl.curScheme = {
                markers: []
            }        //气泡弹框

            $ctrl.$onInit = function () {
                console.log('indoor map init...');
                // 返回园区
                $ctrl.showParkMap = true;  //是否展示园区地图

                $ctrl.selectNo = 0;
                //NoShowFloor  代表不进入到该楼层
                $ctrl.groundClick = function (item, index, NoShowFloor) {
                    //清除气泡
                    bubble && bubble.close();

                    $ctrl.selectNo = index;
                    !NoShowFloor && $timeout(function () {
                        map.showFloor(item.name);
                    }, 1000)
                    // 广播事件
                    var floor = indoorService.getFloorById(parkName, $ctrl.floorId);
                    var state = {
                        floorName: floor.name,
                        name: item.name,
                        id: parseInt(item.name.substring(1))
                    };
                    $scope.$emit('toGround', state);
                };

                //重新加载地图
                $scope.$on("reloadMap"+window.location.hash, function () {
                    $timeout(function () {
                        loadMap();
                    });
                });
            };

            //单向绑定数据发生变化时
            $ctrl.$onChanges = function (changes) {
                //根据父数据渲染地图
                //console.log(changes.mapData.currentValue);
                //readerMap(changes.mapData.currentValue);
            };

            //获取项目地图数据 parkName
            $timeout(function () {
                loadMap();
            });
            function loadMap() {
                console.log('loading map...');
                //地图变量重新加载
                $ctrl.show2DMode = true;
                $ctrl.showParkMap = true;
                $ctrl.selectNo = 0;
                mapList = [];//地图数据
                parkName = AppService.park.parkName;//园区名称
                parkNo = AppService.parkNo; //园区编号
               

                indoorService.getMapData(parkNo, parkName).then(function (res) {
                    var mapData = res;
                    if (mapData.name) {
                        if ($ctrl.mapData && $ctrl.mapData.name) {
                            mapData.name = $ctrl.mapData.name
                            mapData.timeStr = $ctrl.mapData.timeStr || ''
                        }
                        mapList.push(mapData);
                    }
                    
                    if (mapList.length == 0) {
                        map = null;
                        document.querySelector('#mapTrackBox').innerHTML = '';
                        return;
                    }
                    map = null
                    document.querySelector('#mapTrackBox').innerHTML = '';    
                    map = new AirocovMap.Map({
                        container: document.querySelector('#mapTrackBox'),
                        // mapList: mapList,
                        mapList: JSON.parse(JSON.stringify(mapList)),
                        themeUrl: "/common/mapComponent/json/indoorMapData/theme/fillcolor.json",
                        position: {//设置相机位置
                            x: 0,
                            y: 300,
                            z: 0
                        }
                    });


                    // 地图点击事件
                    map.event.on("loaded", function () {
                        //清除气泡
                        bubble && bubble.close();
                        var mapObj = {
                            map: map,
                            addCameraMarker: addCameraMarker,
                            addRangesMarker: addRangesMarker,
                            addWayLine: addWayLine,
                            addMarker: addMarker,
                            drawPointPath: drawPointPath,
                            addBubble2: addBubble2

                        }
                        $rootScope.$emit("trackLoadCompleteMap" + mapList[0].timeStr, mapObj);
                        console.log("地图渲染完成" + new Date().toLocaleString());
                    });
                    map.event.on("trackLoadCompleteMap", function (e) {
                        //console.log("地图加载完成"+new Date().toLocaleString());
                    });
                })
            }


            //
            $scope.$on("showCamera", function (event, obj, drawPath) {

            });
            function addBubble2(title, position) {
                bubble2 && bubble2.close();
                bubble2 = new AirocovMap.Controls.InfoWindow({
                    content: `<div class='col-sm-12 panel panel-default' style='max-width:400px;padding:0;margin-bottom:0;'>${title}</div>`,
                    // id: e.target.info.properties.userData.id, //传入返回的设备ID
                    // floor: e.target.info.floor,
                    position: map.screenCoordinates(position),  //三维场景坐标的投影到屏幕的坐标
                    positionXYZ: position  //三维场景坐标
                });
                map.addControl(bubble2);
                bubble2.positioning();
            }
            function addMarker(marker, fn) {
                //若marker 已有描点，清除此描点
                marker.objId && map.clearLayer(mapList[0].name, marker.objId);
                if (marker.points.length == 0) {
                    return
                }
                let PolyLine = new AirocovMap.Markers.PolyLine();
                let points = marker.points;
                let len = points.length - 1

                if (!$ctrl.curMarker.curPoint && points.length > 3) {
                    let xdis = Math.abs(points[len][0] - points[0][0])
                    let zdis = Math.abs(points[len][1] - points[0][1])
                    if (xdis <= 3 && zdis <= 3) {
                        points[len][0] = points[0][0]
                        points[len][1] = points[0][1]
                        $ctrl.startRange = false
                        drawFence($ctrl.curMarker, $ctrl.curMarker.objId);
                        fn && fn();
                        return
                    }
                }
                if (points.length == 1) {
                    points = points.concat(points);

                }
                let arr = [];
                points.forEach(v => {
                    arr.push([v[0] * .02, v[1] * .02])
                });
                //创建路径
                let config = {
                    //线段的高度
                    height: 70,
                    //路径的宽度
                    radius: 0.02,
                    //自定义贴图
                    imgUrl: marker.imgMarker,
                    //运动速度
                    speed: 1,
                    //单节长度
                    sinLength: 0.2,
                    lineType: 'straight'
                }
                //创建路径
                let path = PolyLine.drawPath(arr, config)
                path.scale.x = 50;
                path.scale.z = 50;
                marker.objId = path.id;
                //添加到对应楼层中图层 // marker.objId
                map.addToLayer(path, mapList[0].name, marker.objId, true)

                //每个转角添加了一个数字标注
                if ($ctrl.startRange) {
                    $ctrl.curMarker && $ctrl.curMarker.points.forEach((point, index) => addTextMark(map, $ctrl.curMarker.objId, { x: point[0], y: 101, z: point[1] }, index + 1))
                }
                fn && fn();
            }
            function addWayLine(marker) {
                //若marker 已有描点，清除此描点
                map.clearLayer(mapList[0].name, "lineG");
                let points = [[111.16738173738122, 101.63833816815168], [170.72293369099498, 164.7188977357], [-137.59076634421945, 67.95742691168562]];
                if (points.length <= 1) {
                    return
                }
             
                let PolyLine = new AirocovMap.Markers.PolyLine();
                let arr = [];
                points.forEach(v => {
                    arr.push([v[0] * .02, v[1] * .02])
                });

                //创建路径
                let config = {
                    //线段的高度
                    height: 80,
                    //路径的宽度
                    radius: 0.05,
                    //自定义贴图
                    imgUrl: "/res/img/arrow.png",
                    //运动速度
                    speed: 1,
                    //单节长度
                    sinLength: 1,
                    lineType: 'straight'
                }
                //创建路径
                let path = PolyLine.drawPath(arr, config)
                path.scale.x = 50;
                path.scale.z = 50;
                map.addToLayer(path, mapList[0].name, "lineG", true)
            };
            //创建围栏
            function drawFence(curMarker, name) {
                let polyline = new AirocovMap.Markers.PolyLine();
                //围栏的配置
                var config = {

                    height: 70, //围栏高度
                    color: curMarker.isSel ? "#FF0000" : "#ffff00", //围栏平面颜色
                    opacity: curMarker.isSel ? 0.5 : 0.2, //围栏平面透明度
                    lineColor: curMarker.isSel ? "#009900" : "#ff0000", //围栏线的颜色
                }
                //创建围栏，传入围栏坐标及配置，返回围栏对象
                var fence = polyline.drawWordsFence(curMarker.points, config)
                fence.info.properties.userData = {
                    equipmentId: curMarker.equipmentId,
                    equipmentName: curMarker.equipmentName,
                    bindCameraId: curMarker.bindCameraId,
                    bindCameraName: curMarker.bindCameraName,
                    // bindEquipmentName:curMarker.bindEquipmentName||"",
                    id: Math.floor(Math.random() * 10000),
                    points: curMarker.points,
                };
                //添加到对应楼层中图层
                map.addToLayer(fence, mapList[0].name, name, true);

            }
            $scope.xyz = [];
            function addCameraMarker(data, map) {
                //清除气泡
                //bubble && bubble.close();
                var arrowPoints = [];
                var _y = $ctrl.showParkMap ? 100 : 1;
                map.clearLayer(mapList[0].name, "otherGroup");
                // map.clearFloorLayer(currPoint, false);
                return new Promise(resolve => {
                    Array.isArray(data) && data.forEach(function (value) {
                        new AirocovMap.Markers.ImageMarker({
                            imgMarker: value.url ? value.url : value.avatarPhoto, //图片路径
                            size: 5,
                            // lnglat: [v.lon, v.lat], //经纬度坐标
                            lnglat: [value.longitude, value.latitude], //经纬度坐标
                            y: _y, //三维坐标系坐标y值
                            mapCenter: map.getMapCenter(mapList[0].name), //地图中心点,
                            userData: {
                                id: value.id || Math.floor(Math.random() * 10000),
                                value: value,
                                field: value.field,
                            },
                            callback: function (imgMark) {
                                // resolve(imgMark.position)
                                $scope.xyz.push([imgMark.position.x, imgMark.position.z]);
                                //将图片标注添加到地图
                                map.addToLayer(imgMark, mapList[0].name, "otherGroup", true);
                            }
                        });
                        arrowPoints.push([value.longitude, value.latitude])
                    });
                    resolve($scope.xyz);
                });
                // fn && fn(arrowPoints);
            }
            var aCount = 0;
            function drawPointPath(map, points, paths, floorName) {
                //删除指定图层
                // if (aCount != 0) {
                //   animateTween.kill();
                // }
                if (animateTween != undefined) {
                    animateTween.kill();
                };
                aCount++;
                map.clearLayer(mapList[0].name, "lineG");
                map.clearLayer(mapList[0].name, "lineG");
                map.clearLayer(mapList[0].name, "testlinelayer");
                // animate.kill()
                var pathAttay = [];
                var walkPoints = [];
                if (points.length > 1) {
                    for (var i = 0; i < points.length - 1; i++) {
                    
                        let getPath = AirocovMap.Tools.findingPath(
                            points[i],
                            points[i + 1],
                            paths
                        );
                        pathAttay = pathAttay.concat(getPath);
                    }
                };
                //画框的基本属性
                var config = {
                    //高度
                    height: 5.2,
                    //颜色
                    lineColor: "#00FF00",
                    //宽度
                    lineWidth: 0.01,
                    //是否有方向标记
                    direction: true
                };

                //用于画线的对象
                var PolyLine = new AirocovMap.Markers.PolyLine();
                //创建路径
                var road = PolyLine.drawMeshLine(pathAttay, config);
              
                //加载到地图
                map.addToLayer(road, mapList[0].name, "lineG", true);
                // //获取路径
                // var pathPoints = road.geometry.parameters.path.points.map(function (point) {
                //    return [point.x, point.z];
                // })

                var pathPoints = pathAttay;

                // createLine();

                //加载模型
                map.addJSONModel({
                    src: "../view/facesSetting/json/man2.json",
                    size: 24,
                    position: [pathPoints[0][0], 1, pathPoints[0][1]],
                    callback: function (man) {
                        map.addToLayer(man, mapList[0].name, "lineG");
                        animate(1, 40, pathPoints, man);
                    }
                });

                //循环运行
                function animate(step, speed, positionData, model) {
                    if (step <= positionData.length - 1) {
                        let next_V = new map.THREE.Vector2(
                            positionData[step][0] - model.position.x,
                            positionData[step][1] - model.position.z
                        );
                        let t = next_V.length() / speed;
                        animateTween = TweenMax.to(model.position, t, {
                            x: positionData[step][0],
                            z: positionData[step][1],
                            ease: Power0.easeNone,
                            onStart: function () {
                                if (step == 1) {
                                    createLine(
                                        [points[0][0], points[0][1]],
                                        [points[0][0], points[0][1] + 0.0005]
                                    );
                                }
                                model.rotation.y = getAngle(new map.THREE.Vector2(0, 1), next_V);
                            },
                            onUpdate: function (e) {
                                if (step != 1) {
                                    updateLine([
                                        positionData[step - 1][0],
                                        positionData[step - 1][1]
                                    ]);
                                }
                            },
                            onComplete: function () {
                                step++;
                                animate(step, speed, positionData, model);
                            }
                        });
                    } else {
                        model.position.x = positionData[0][0];
                        model.position.z = positionData[0][1];
                        //线清空
                        animate(1, speed, positionData, model);
                    }
                }

                //计算夹角
                function getAngle(v1, v2) {
                    //获取余旋值
                    var cosTheta = v1.dot(v2) / (v1.length() * v2.length());
                    if (cosTheta > 1) {
                        cosTheta = 1;
                    } else if (cosTheta < -1) {
                        cosTheta = -1;
                    }
                    var theta = Math.acos(cosTheta);
                    return v1.x * v2.y - v1.y * v2.x > 0 ? -theta : theta;
                }

                function createLine(Points1, Points2) {
                    walkPoints = [];
                    //
                    walkPoints.push(Points1);
                    walkPoints.push(Points2);

                    map.clearLayer("F1", "testlinelayer");

                    //meshLine的配置
                    var config = {
                        //高度
                        height: 5.2,
                        //颜色
                        lineColor: "#FF0000",
                        //宽度
                        lineWidth: 0.01,
                        //是否有方向标记
                        direction: true
                    };

                    //创建meshLine
                    var meshLine = PolyLine.drawMeshLine(walkPoints, config);
                    //添加到对应楼层中图层

                    // debugger;

                    var meshLineId = map.addToLayer(meshLine, mapList[0].name, "lineG", true);
                }

                function updateLine(Points1) {
                    walkPoints.push(Points1);

                    map.clearLayer("F1", "testlinelayer");

                    //meshLine的配置
                    var config = {
                        //高度
                        height: 5.2,
                        //颜色
                        lineColor: "#FF0000",
                        //宽度
                        lineWidth: 0.01,
                        //是否有方向标记
                        direction: true
                    };

                    //创建meshLine
                    var meshLine = PolyLine.drawMeshLine(walkPoints, config);
                    //添加到对应楼层中图层

                    // debugger;

                    var meshLineId = map.addToLayer(meshLine, mapList[0].name, "lineG", true);
                }
            };
            function addRangesMarker(ranges, map) {
                map.clearLayer(mapList[0].name, "fenceGroup");
                if ($ctrl.curMarker && $ctrl.curMarker.objId) {
                    map.clearLayer(mapList[0].name, $ctrl.curMarker.objId, true);
                }
                ranges.forEach(po => { drawFence(po, "fenceGroup") })
                // if(selCameraInfo&&selCameraInfo.position){
                //     addBubble2(selCameraInfo.title,selCameraInfo.position)
                // }
            }
            function subPlus1(name) {
                let matches = (name + "").match(/\d+$/);
                if (matches) {
                    return name.substr(0, matches.index) + (parseInt(matches[0]) + 1);
                }
                return name + 1;
            }
            function addTextMark(map, layerName, position, text) {
                //生成文字标注
                let textMark = new AirocovMap.Markers.TextMarker({
                    text: text,  //标注内容
                    zoom: 1, //文字大小缩放系数
                    color: "purple", //文字颜色
                    position: position, //三维坐标系位置
                    userData: {
                    },
                    callback: function (textMark) {
                        //将文字标注添加到指定楼层的指定图层中
                        map.addToLayer(textMark, mapList[0].name, layerName, true);
                    }
                });
            }
            $ctrl.addLightRange = function (equipment) {
                if (!$ctrl.startRange) {
                    $scope.$apply(function () {
                        $ctrl.startRange = true
                        $rootScope.$emit("changeMarker" + mapList[0].timeStr, equipment.equipmentId);
                    });
                } else {
                    if ($ctrl.curMarker && $ctrl.curMarker.equipmentId && $ctrl.curMarker.equipmentId == equipment.equipmentId) {//选中同一个
                        $scope.$apply(function () {
                            $ctrl.startRange = false;
                            bubble && bubble.close()
                            $rootScope.$emit("changeMarker" + mapList[0].timeStr, "");


                        });
                    } else {
                        $rootScope.$emit("changeMarker" + mapList[0].timeStr, equipment.equipmentId);
                    }
                }
                if ($ctrl.curMarker && $ctrl.curMarker.objId) {
                    map.clearLayer(mapList[0].name, $ctrl.curMarker.objId, true);
                    $scope.$apply(function () {
                        $ctrl.curMarker = {}
                    });

                }
                if (!$ctrl.startRange) {
                    return
                }
                var markType = {
                    icons: [{
                        name: "xian.png",
                        url: "/res/img/xian.png"
                    }],
                    open: true,
                    title: "划线",
                    type: "path"
                }

                let marker = {
                    name: '测试',
                    type: markType.type,
                    points: [],
                    imgMarker: $ctrl.curMarkType.url,
                    equipmentId: equipment.equipmentId,
                    equipmentName: equipment.content,
                    bindCameraId: "",
                    bindCameraName: "",
                };
                //$ctrl.curScheme.markers.push(marker);
                $ctrl.curMarker = marker;
                return;
            }
            $ctrl.selectPoint = function (marker, point) {
                if (marker.curPoint == point) {
                    delete marker.curPoint;
                } else {
                    marker.curPoint = point
                }
            }
            $ctrl.delPoint = function (point) {
                event.stopPropagation();
                if ($ctrl.curMarker.curPoint == point) {
                    delete $ctrl.curMarker.curPoint;
                }
                $ctrl.curMarker.points.splice($ctrl.curMarker.points.indexOf(point), 1)
                addMarker($ctrl.curMarker)
            }
            //转墨卡托坐标
            function coordinatesToMercato(dinatesArr) {
                var dinatesToMercato = dinatesArr.slice(0);
                dinatesToMercato = dinatesToMercato instanceof Array ? dinatesToMercato : [];
                dinatesToMercato[0] = Number.parseFloat(dinatesToMercato[0]) * 20037508.34 / 180;
                dinatesToMercato[1] = Math.log(Math.tan((90 + Number.parseFloat(dinatesToMercato[1])) * Math.PI / 360)) / (Math.PI / 180);
                dinatesToMercato[1] = -Number.parseFloat(dinatesToMercato[1]) * 20037508.34 / 180;
                return dinatesToMercato;
            }


            //经纬度转换到三维坐标系中的坐标
            function coordinatesToCoordinates3(mapCenter, dinatesArr) {
                var coordinatesThreeArr = [];
                if (!(dinatesArr[0] instanceof Array)) {
                    var centerMercato = coordinatesToMercato(dinatesArr);
                    coordinatesThreeArr[0] = centerMercato[0] - mapCenter[0];
                    coordinatesThreeArr[1] = centerMercato[1] - mapCenter[1];
                } else {
                    dinatesArr.forEach(function (item) {
                        var dinatesToMercato = coordinatesToMercato(item);
                        var dinatesDiff = [];
                        dinatesDiff[0] = dinatesToMercato[0] - mapCenter[0];
                        dinatesDiff[1] = dinatesToMercato[1] - mapCenter[1];
                        coordinatesThreeArr.push(dinatesDiff);
                    })
                }
                return coordinatesThreeArr;
            }
        }]
    });


    app.service('indoorService', function ($q, $http) {
        var that = this;
      
        //根据项目no获取json数据，这里做了一个判断，为了防止同一个项目切换页面时候的重复加载;

        this.getMapData = function (parkName,parkId) {
            var deferred = $q.defer();
            that.mapData=that.mapData?that.mapData:{};
            
            if (that.mapData.name != parkName) {
                if(parkId){
                    $http.get("/ovu-base/system/park/get?id="+parkId).success(function (resp) {
                   
                        if(resp.data.parkEmapPath){
                           if (resp.data.parkEmapPath.indexOf("http") == -1) {
                              
                               that.mapData =  {
                                   mapUrl: "/ovu-base" + resp.data.parkEmapPath,
                                   name: parkName
                               };
                           }else{
                               that.mapData =  {
                                   mapUrl: resp.data.parkEmapPath,
                                   name: parkName
                               };
                           }
                           deferred.resolve(that.mapData);
                        }else{
                            that.mapData={}
                            deferred.resolve(that.mapData);
                        }
                      
                   })
                } else{
                    that.mapData={}
                    deferred.resolve(that.mapData);
                }
            } else {
                setTimeout(function () {
                    deferred.resolve(that.mapData);
                });
            }
            

        var getParkItem = function (name) {
            if (Array.isArray(that.mapData)) {
                return that.mapData.find(function (data) {
                    return data.name == name;
                })
            }
            return that.mapData;
        };

        // 获取园区信息( 这个需求是要展示 能源站和园区地图，所以当onlyIndoorMap为true时，显示园区，否则就是能源站地图)
        this.getPark = function (name, onlyIndoorMap) {
            var park = getParkItem(name) || {};
            return {
                name: park.park_name || park.name,
                mapUrl: park.mapUrl,
                themeUrl: park.themeUrl
            }
        };
        // 获取楼栋
        this.getFloor = function (parkName, floorName) {
            var park = getParkItem(parkName);
            var floor = park.list.filter(function (item) {
                return item.name === floorName;
            })[0];
            return floor;
        };

        // 根据id获取楼栋
        this.getFloorById = function (parkName, id) {
            var park = getParkItem(parkName);
            var floor = park.list.find(function (item) {
                // return item.id === parseInt(id);
                return item.bimId == id;
            });
            return floor;
        };

        // 获取楼层
        this.getGround = function (parkName, floorName, groundName) {
            var floor = this.getFloor(parkName, floorName);
            var ground = floor.list.filter(function (item) {
                return item.name === groundName;
            })[0];
            return ground;
        };
    }
    })
   
})();
