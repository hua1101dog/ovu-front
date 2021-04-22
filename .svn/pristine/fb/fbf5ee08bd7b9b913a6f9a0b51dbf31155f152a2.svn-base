(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.service("AppService", function ($http, fac) {
        var that = this;
        this.park = { parkNo: "", parkName: "" };
        //项目编号
        this.parkNo = "";
        this.isStop = true;
        this.onlyIndoorMap = true;
    });
    app.controller("ruleCreationCtrl", function (
        $scope,
        $rootScope,
        $interval,
        $http,
        $filter,
        $uibModal,
        fac,
        AppService
    ) {
        $scope.dealCameras = [];
        $scope.cameras = [];
        $scope.search = {
            name: "",
        };
        $scope.mapData = {
            name: "cytdRange" + new Date().getTime(),
            timeStr: new Date().getTime(),
        };
        $scope.param = {
            domain_id: "14bdbea59d2c4b0a96594fb94382901e",
            park_id: $scope.search.parkId,
            in_out_door: "2",
        };
        $scope.pageModel = {};
        $scope.pageModel2 = {};
        $scope.map = null;
        $scope.rule = {
            ruleName: "",
            brand: "",
            equipSimpleName: "",
        };
        $scope.lists = [
            // {
            //   dataType: 'VehiclePicking',
            //   name: '1号工坊摄像头',
            //   time: '2019-12-02 09:36:01',
            //   picA: 'http://imagetest.ovuems.com/986d9498-11be-11ea-bb50-04d4c491fc7f.jpg',
            //   picB: 'http://imagetest.ovuems.com/941f6858-11be-11ea-8b9e-04d4c491fc7f.jpg',
            //   id: 5
            // }
        ];
        $scope.scrollTop = 0;
        $scope.scrollLeft = 0;
        $scope.imgList = [];
        $scope.imgItem = null;
        $scope.item = null;
        $scope.switcherMap = 0;
        $scope.switcherType = 0;
        $scope.circuitPopout = 0;
        $scope.react = [];
        $scope.image = null;
        $scope.myCanvas = null;
        $scope.context = null;
        $scope.img = null;
        $scope.patrolType = 0;
        $scope.typeList = [
            { name: "大华", id: 1 },
            { name: "宇视", id: 2 },
            { name: "海康", id: 3 },
            { name: "旷视", id: 4 },
            { name: "大华dvr", id: 5 },
            { name: "臻识", id: 6 },
            { name: "其他", id: 7 },
        ];
        $scope.find = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
            });
            fac.getPageResult(
                "/ovu-pcos/pcos/equipment/bigScreen/rtspCameraInfo/query",
                $scope.search,
                function (data) {
                    $scope.pageModel = data;
                    $scope.imgList = $scope.pageModel.data;
                }
            );
        };
        $scope.find(1);
        AppService.park = { parkNo: "", parkName: "" };
        var iconList = [
            "/res/img/noCamer.png",
            "/res/img/singleCamer.png",
            "/res/img/mutilCamer.png",
            "/res/img/selSingleCamer.png",
            "/res/img/selMutilCamer.png",
        ];
        AppService.parkNo = "";
        function reloadMap() {
            //加载地图
            var parkNo = "";
            var parkName = "";
            if (fac.hasSpecialPark($scope.search)) {
                parkNo = "04201110001CYTD";
                parkName = "创意天地";
            } else {
                parkNo = "";
                parkName = $scope.search.parkName;
            }
            AppService.isAddWay = false;
            AppService.park = { parkNo: parkNo, parkName: parkName };
            //项目编号
            //$scope.parkNo=parkNo;
            AppService.parkNo = parkNo;
            $scope.$broadcast("reloadMap"+window.location.hash);
        }
        app.modulePromiss.then(function () {
            $rootScope.$watch("dept.id", function (deptId, oldValue) {
                if (deptId) {
                    var parkDept = fac.getParkDept(null, deptId);
                    if (parkDept) {
                        $scope.search.parkId = parkDept.parkId;
                        $scope.search.parkName = parkDept.parkName;
                    } else {
                        $scope.search.parkId = "";
                        $scope.search.parkName = "";
                    }
                    reloadMap();
                }
                $scope.find2();
            });
        });
        $rootScope.$on(
            "loadCompleteMap" + $scope.mapData.timeStr,
            (evt, map) => {
                $rootScope.mapObjRule = map;
                map && $scope.drawCamera();
            }
        );
        $scope.goSearchImgList = function () {
            $scope.find(1);
        };
        $scope.goMessage = function (item) {
            $rootScope.mapObjRule.addWindowInfo(
                item.id,
                item.name,
                $rootScope.mapObjRule.map
            );
        };
        $scope.find2 = function (pageNo) {
            $scope.search ={
                domainId:'14bdbea59d2c4b0a96594fb94382901e',
                inOutDoor:2,
                parkId:$scope.search.parkId,
                model_id:'1500625624144',
                equip_status:1,
                in_out_door:2,
                NAME:$scope.rule.ruleName,
                equipSimpleName:$scope.rule.equipSimpleName,
                brand:$scope.rule.brand
            };
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel2.currentPage || 1,
                pageSize: $scope.pageModel2.pageSize || 10,
            });
            fac.getPageResult(
                "/ovu-pcos/pcos/equipment/bigScreen/queryRtspForDaping",
                $scope.search,
                function (data) {
                    $scope.pageModel2 = data;
                    let datas = $scope.pageModel2.data;
                    for (let i = 0; i < datas.length; i++) {
                        for (let j = 0; j < $scope.imgList.length; j++) {
                            if (
                                $scope.imgList[j].name ==
                                datas[i].equip_simple_name
                            ) {
                                datas[i].operation = "已划分区域";
                            }
                        }
                    }
                    $scope.rulesList = datas;
                }
            );
        };
        //绑定摄像头
        $scope.drawCamera = function (switcherMap) {
            let param = {
                pageSize: 1000,
                pageIndex: 0,
            };
            $http
                .post(
                    `/ovu-pcos/pcos/equipment/bigScreen/rtspCameraInfo/query`,
                    angular.extend(param),
                    fac.postConfig
                )
                .success(function (resp) {
                    $scope.datas = [];
                    $scope.ranges = [];
                    resp.data.data.forEach((item) => {
                        if (item.longitude && item.latitude) {
                            $scope.datas.push({
                                id: item.id,
                                equipmentName: item.name,
                                name: item.name,
                                rtsp: item.rtsp,
                                in_out_door: item.in_out_door,
                                frame: item.frame,
                                park_id: item.park_id,
                                equipmentId: item.domain_id,
                                domain_id: item.domain_id,
                                floor: "创意天地",
                                longitude:
                                    parseFloat(item.longitude) -
                                    0.00544400142515,
                                latitude:
                                    parseFloat(item.latitude) +
                                    0.00248701216297,
                                content: item.name,
                                monitoring_range: item.monitoring_range,
                                icon: iconList[3],
                                imgUrl: item.imgUrl,
                            });
                            $scope.ranges.push({
                                equipmentName: item.name,
                                equipmentId: item.domain_id,
                                bindCameraId: item.domain_id,
                                bindCameraName: item.name,
                                points: item.monitoring_range
                                    ? JSON.parse(item.monitoring_range)
                                    : [],
                            });
                        }
                    });
                    $rootScope.mapObjRule.addCameraMarker(
                        $scope.datas,
                        $rootScope.mapObjRule.map
                    );
                    $rootScope.mapObjRule.addRangesMarker(
                        $scope.ranges,
                        $rootScope.mapObjRule.map,
                        switcherMap
                    );
                });
        };
        $scope.equipmentTable = function () {
            equipmentList();
        };
        $rootScope.$on(
            "bindCamera" + $scope.mapData.timeStr,
            (evt, pointInfo) => {
                openbindCamera(pointInfo);
            }
        );
        // 选中or取消灯杆，改变灯杆图标
        $rootScope.$on(
            "changeMarker" + $scope.mapData.timeStr,
            (evt, selEquipmentId) => {
                // refreshMarker(selEquipmentId)
            }
        );
        $scope.editRuleImg = function (index, item) {
            $scope.imgItem = item;
            console.log("$scope.imgItem :", $scope.imgItem);
            $scope.myCanvas = document.getElementById("canvasImges");
            $scope.context = $scope.myCanvas.getContext("2d");
            var img = new Image();
            img.src = item.imgUrl;
            $scope.myCanvas.width = img.width;
            $scope.myCanvas.height = img.height;
            $scope.img = img;
            $scope.context.drawImage(img, 0, 0);
            $scope.drawPoint(JSON.parse(item.frame));
            $scope.react = JSON.parse(item.frame);
            for (let i = 1; i < JSON.parse(item.frame).length; i++) {
                $scope.drawLine(
                    JSON.parse(item.frame)[i - 1],
                    JSON.parse(item.frame)[i]
                );
            }
            $("#exampleModalScrollable").modal("show"); //打开模态框
        };
        $scope.goMap = function () {
            //地图
            $scope.switcherMap = 1;
            $scope.drawCamera($scope.switcherMap);
        };
        $scope.goType = function () {
            //添加类型
            $scope.patrolType = 1;
        };
        $scope.goList = function () {
            //列表
            $scope.switcherMap = 0;
            $scope.imgItem = null;
            $scope.find(1);
        };
        $scope.goType = function () {
            //添加类型
            $scope.switcherType = !$scope.switcherType;
        };
        $scope.goPath = function () {
            //添加路线弹框
            $scope.circuitPopout = 1;
        };
        $scope.circuitClose = function () {
            //保存/编辑
            $scope.circuitPopout = 0;
        };
        $scope.drawMonitoring = function (item) {
            //划分检测区域

            //debugger
            console.log('开始弹出信息..')

            $scope.react = [];
            $scope.imgItem = null;
            $scope.snapPicture(item);
        };
        $(".modal-body").scroll(function () {
            console.log("123 :", 123);
            //为了保证兼容性，这里取两个值，哪个有值取哪一个
            //scrollTop就是触发滚轮事件时滚轮的高度
            $scope.scrollTop = $(".modal-body").scrollTop();
            $scope.scrollLeft = $(".modal-body").scrollLeft();
        });
        $scope.canvasTouch = function (e) {
            let modalHeight = document.getElementById("modalHeader")
                .offsetHeight;
            // if ($scope.react.length > 2) {
            // let GreatCircleDistance = getGreatCircleDistance($scope.react[0][1], $scope.react[0][0], $scope.react[$scope.react.length - 1][1], $scope.react[$scope.react.length - 1][0]);
            // if (GreatCircleDistance > 4000) {
            $scope.react.push([
                e.clientX - e.target.offsetLeft + $scope.scrollLeft,
                e.clientY - e.target.offsetTop - modalHeight + $scope.scrollTop,
            ]);
            // } else {
            // $scope.react.push($scope.react[0]);
            // }
            // } else {
            //     $scope.react.push([
            //         e.clientX - e.target.offsetLeft + $scope.scrollLeft,
            //         e.clientY - e.target.offsetTop - modalHeight + $scope.scrollTop
            //     ]);
            // }
        };
        $scope.$watch(
            "react",
            function (current, prev) {
                //监听数组的变化
                if (current.length > 0) {
                    $scope.clearDraw();
                    $scope.drawPoint($scope.react);
                    for (let i = 1; i < $scope.react.length; i++) {
                        $scope.drawLine($scope.react[i - 1], $scope.react[i]);
                    }
                }
            },
            true
        );
        $scope.goMapList = function () {
            $scope.switcherMap = 2;
            $scope.find(1);
        };
        $scope.goSearch = function () {
            $scope.find2();
        };
        $scope.$watch("img", function (current, prev) {
            let img = new Image();
            img.src = $scope.image;
            img.onload = () => {
                $scope.canvas.width = img.width;
                $scope.canvas.height = img.height;
                $scope.context.drawImage(img, 0, 0);
                $scope.img = img;
            };
        });
        $scope.clearDraw = function () {
            //清除画布
            $scope.context.clearRect(
                0,
                0,
                $scope.myCanvas.width,
                $scope.myCanvas.height
            );
            $scope.context.drawImage($scope.img, 0, 0);
        };
        $scope.drawPoint = function (points = []) {
            for (let point of points) {
                $scope.context.fillStyle = "orange";
                $scope.context.fillRect(point[0] - 2, point[1] - 2, 4, 4);
                $scope.context.font = "18px bold 宋体";
                $scope.context.fillText(
                    "(" + point[0] + "," + point[1] + ")",
                    point[0],
                    point[1]
                );
            }
        };
        $scope.drawLine = function (start, end) {
            let ctx = $scope.context;
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.moveTo(start[0], start[1]);
            ctx.lineTo(end[0], end[1]);
            ctx.stroke();
        };
        $scope.saveMap = function () {
            //保存/修改,绘制的图片信息
            if ($scope.react.length == 0)
                return layer.msg("保存失败!", {
                    //失败
                    time: 2000,
                    icon: 5,
                });
            if ($scope.react.length <= 3)
                return layer.msg("路径不全,请绘制闭合!", {
                    //失败
                    time: 2000,
                    icon: 5,
                });
            $scope.drawLine(
                $scope.react[0],
                $scope.react[$scope.react.length - 1]
            );
            let param;
            if ($scope.imgItem == null) {
                param = {
                    name: $scope.item.equip_simple_name,
                    rtsp: $scope.item.rtspRule,
                    in_out_door: "2",
                    latitude: $scope.item.map_lat,
                    longitude: $scope.item.map_lng,
                    frame: JSON.stringify($scope.react),
                    park_id: $scope.item.park_id,
                    domain_id: $scope.item.domain_id,
                    imgUrl: $scope.img.src,
                    code: $scope.item.regi_code,
                };
            } else {
                param = {
                    id: $scope.imgItem.id,
                    name: $scope.imgItem.name,
                    rtsp: $scope.imgItem.rtsp,
                    in_out_door: $scope.imgItem.in_out_door,
                    latitude: $scope.imgItem.latitude,
                    longitude: $scope.imgItem.longitude,
                    frame: JSON.stringify($scope.react),
                    monitoring_range: $scope.imgItem.monitoring_range,
                    park_id: $scope.search.parkId,
                    domain_id: "14bdbea59d2c4b0a96594fb94382901e",
                    imgUrl: $scope.img.src,
                    code: $scope.imgItem.code,
                };
            }
            console.log("param :", param);
            $http
                .post(
                    `/ovu-pcos/pcos/equipment/bigScreen/rtspCameraInfo/save`,
                    angular.extend(param),
                    fac.postConfig
                )
                .success(function (resp) {
                    if (resp.data !== undefined) {
                        msg(resp.data + "!");
                    } else {
                        layer.msg(resp.msg, {
                            //失败
                            time: 2000,
                            icon: 5,
                        });
                    }
                    $scope.find(1);
                });
        };
        $scope.snapPicture = function (item) {
            //console.log('item...',item)
            $http.get(
                '/ovu-iot/api/v1/liveqinghardware/page?deviceName='+item.regi_code+'&pageIndex=0&pageSize=1'
            ).success(function (resp) {
                   item.rtspRule = resp.data.data[0].rtsp
                   //console.log('data.data[0].rtsp...',item.rtspRule)
                   $("#exampleModalScrollable").modal("show");
                   $http.get('/ovu-pcos/pcos/equipment/bigScreen/getImageByRtsp?rtspUrl='+item.rtspRule)
                   .success(function (resp) {
                       $scope.imges = resp.data;
                       $scope.item = item;
                       console.log("$scope.item :", $scope.item);
                       $scope.myCanvas = document.getElementById("canvasImges");
                       $scope.context = $scope.myCanvas.getContext("2d");
                       var img = new Image();
                       img.src = $scope.imges;
                       if (resp.data == "") $scope.imges = "/image/no-img.png";
   
                       img.onload = function (argument) {
                           $scope.myCanvas.width = this.width;
                           $scope.myCanvas.height = this.height;
   
                           //这里就是上传图片的宽和高了
                           $scope.img = img;
                           $scope.context.drawImage(img, 0, 0);
                       };
                   });
               $scope.drawCamera();
            });

        };
        $scope.deleteImg = function (index, id) {
            confirm("确认删除该条记录吗?", function () {
                $http
                    .get(
                        `/ovu-pcos/pcos/equipment/bigScreen/rtspCameraInfo/delete?id=${id}`
                    )
                    .success(function (res) {
                        msg(res.data + "!");
                        $scope.find(1);
                    });
            });
        };
        // function getGreatCircleDistance(lat1, lng1, lat2, lng2) {//判断两个坐标点的距离
        //     var EARTH_RADIUS = 6378137.0;
        //     var PI = Math.PI;
        //     function getRad(d) {
        //         return d * PI / 180.0;
        //     }
        //     var radLat1 = getRad(lat1);
        //     var radLat2 = getRad(lat2);
        //     var a = radLat1 - radLat2;
        //     var b = getRad(lng1) - getRad(lng2);

        //     var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        //     s = s * EARTH_RADIUS;
        //     s = Math.round(s * 10000) / 10000.0;
        //     return s;    // 公里数
        // };
        // 方法定义 lat,lng
        // function getGreatCircleDistance(lat1, lng1, lat2, lng2) {
        //     var radLat1 = lat1 * Math.PI / 180.0;
        //     var radLat2 = lat2 * Math.PI / 180.0;
        //     var a = radLat1 - radLat2;
        //     var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
        //     var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        //         Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        //     s = s * 6378.137;// EARTH_RADIUS;
        //     s = Math.round(s * 10000) / 10000;
        //     return s;
        // }
        $scope.prevDraw = function () {
            //上一步
            if ($scope.react.length > 0) {
                $scope.react.pop();
                $scope.clearDraw();
                $scope.drawPoint($scope.react);
            } else {
                layer.msg("已经是最后一个绘图点了!", {
                    //失败
                    time: 2000,
                    icon: 5,
                });
            }
        };
        const socket = new SockJS("/ovu-pcos/pcos/sayhello", null, {
            transports: "websocket",
            timeout: 20000,
        });
        socket.onopen = function () {
            console.log("Info: connection opened.");
        };

        socket.onmessage = (event) => {
            let data = JSON.parse(event.data).data;
            console.log("data :", data);
            if (data == undefined) return;
            $http
                .post(
                    `/iot/middleware/api/vvidalarm/vehiclePicking`,
                    JSON.stringify(data)
                )
                .success(function (res) {
                    // msg(res.data + "!");
                });
            if (data && data.dataType === "VehiclePicking") {
                $scope.lists.unshift(data);
                if ($scope.lists.length > 20) {
                    $scope.lists.pop();
                }
                if (!$scope.dealCameras.includes(data.id)) {
                    $scope.datasRange = $scope.datas;
                    let longAdh = 0;
                    let latAdh = 0;
                    if ($scope.datas.length == 0) return;
                    $scope.datas.forEach((item, j) => {
                        if (item.id == data.id) {
                            if (item.monitoring_range == undefined) return;
                            let monitoringRange = JSON.parse(
                                item.monitoring_range
                            );
                            monitoringRange.forEach((it, i) => {
                                longAdh = longAdh + it[0];
                                latAdh = latAdh + it[1];
                            });
                            let longitude = longAdh / monitoringRange.length;
                            let latitude = latAdh / monitoringRange.length;
                            let imgList = {
                                longitude: longitude,
                                latitude: latitude,
                            };
                            $rootScope.mapObjRule.addStopCar(
                                imgList,
                                $rootScope.mapObjRule.map
                            );
                            $scope.datasRange.splice(j, 1);
                        }
                    });
                    $scope.ranges = [];
                    $scope.datasRange.forEach((item) => {
                        $scope.ranges.push({
                            equipmentName: item.name,
                            equipmentId: item.domain_id,
                            bindCameraId: item.domain_id,
                            bindCameraName: item.name,
                            points: item.monitoring_range
                                ? JSON.parse(item.monitoring_range)
                                : [],
                        });
                    });
                    // $rootScope.mapObjRule.addRangesMarker($scope.ranges, $rootScope.mapObjRule.map);
                    // $rootScope.mapObjRule.addWindow($scope.cameras[data.id], '此处有违停', $rootScope.mapObjRule.map,data.id);
                    $scope.dealCameras.push(data.id);
                }
            }
        };

        $scope.$on("cloneSocket", () => {
            socket.close();
        });
        socket.onclose = (event) => {
            console.log("Info: connection closed.");
        };
    });
})();
