(function () {
    var app = angular.module("angularApp");
    app.controller(
        "PointCtrl",
        function ($scope, $rootScope, $uibModal, $http, fac) {
            document.title = "巡查点管理";
            $scope.pageModel = {};
            $scope.search = {};
            $scope.item = {};
            $scope.item.addr = "";
            $scope.isForm = true;
            $scope.flag = false; //是否展示设置按钮
            var mapCenter;
            var ovu2DMap;
            var map2dDraw;
            var CanvasLayer;
            $scope.item.pointRefItemList=[]
            app.modulePromiss.then(function () {
                $scope.$watch("dept.id", function (deptId, oldValue) {
                   
                    if (deptId) {
                        if (!$scope.dept.parkId) {
                            alert("请选择项目下的部门");
                            $scope.item.parkId && delete $scope.item.parkId;
                            $scope.item.parkName && delete $scope.item.parkName;
                            $scope.stageList = [];
                            $scope.mainMap.clearMap();
                            return;
                        }
                        $scope.mainMap.clearMap();
                        if ($scope.dept.parkId) {
                            $scope.item.parkId = $scope.dept.parkId;
                            $scope.item.parkName = $scope.dept.deptName;
                            $http
                                .post(
                                    "/ovu-base/system/park/stageList.do",
                                    {
                                        parkId: $scope.item.parkId,
                                    },
                                    fac.postConfig
                                )
                                .success(function (res) {
                                    $scope.stageList = res.data;
                                });
                            $scope.park = getPostion();

                            mapCenter = [
                                $scope.park["mapLng"],
                                $scope.park["mapLat"],
                            ];
                        } else {
                            $scope.item.parkName && delete $scope.item.parkName;
                            $scope.item.parkId && delete $scope.item.parkId;
                            $scope.item.stageId && delete $scope.item.stageId;
                            $scope.item.buildId && delete $scope.item.buildId;
                            $scope.item.unitNo && delete $scope.item.unitNo;
                            $scope.item.groundNo && delete $scope.item.groundNo;
                            $scope.item.houseId && delete $scope.item.houseId;
                            $scope.stageList && delete $scope.stageList;
                            $scope.buildList && delete $scope.buildList;
                            $scope.unitList && delete $scope.unitList;
                            $scope.groundList && delete $scope.groundList;
                            //
                            // 默认定位到武汉创意天地
                            mapCenter = [114.32233, 30.471139];
                        }
                        //画出图层
                        //地图需要参数
                        var topRight = $scope.park.trPosition
                            ? $scope.park.trPosition.split(",")
                            : undefined;
                        var bomLeft = $scope.park.blPosition
                            ? $scope.park.blPosition.split(",")
                            : undefined;

                        var mapProperties = $scope.park.director
                            ? $scope.park.director.split(",")
                            : [];
                        var width = mapProperties[0]
                            ? Number(mapProperties[0])
                            : 2000;
                        var height = mapProperties[1]
                            ? Number(mapProperties[1])
                            : 2000;
                        var zoom = mapProperties[2]
                            ? Number(mapProperties[2])
                            : 2.76;
                        if ($scope.park.airscapePath) {
                            if (
                                $scope.park.airscapePath.indexOf("http") == -1
                            ) {
                                $scope.park.airscapePath =
                                    "/ovu-base" + $scope.park.airscapePath;
                            }
                            ovu2DMap = new OvuMap();
                            map2dDraw = new Draw2DMap(
                                width,
                                height,
                                zoom,
                                undefined
                            );
                            ovu2DMap.loadTheme();
                            ovu2DMap.loadJson($scope.park.airscapePath);
                            var draw = function (argument) {
                                AMap.Util.requestAnimFrame(draw);
                                if (ovu2DMap.mapJson === undefined) {
                                    return;
                                }
                                var _curFloor = ovu2DMap.mapJson;
                                //地图绘制
                                map2dDraw.draw(_curFloor, $scope.mainMap);
                                //图层刷新
                                CanvasLayer.reFresh();
                            };
                            CanvasLayer = new AMap.CanvasLayer({
                                canvas: map2dDraw.canvas,
                                bounds: new AMap.Bounds(bomLeft, topRight),
                                zooms: [3, 18],
                            });
                            //把图层 存放到 地图中
                            CanvasLayer.setMap($scope.mainMap);

                            //绘图循环的核心方法
                            draw(23);
                        }

                        function getPostion() {
                            var position = [];

                            function getNode(nodes) {
                                nodes &&
                                    nodes.forEach(function (n) {
                                        if (n.id == $scope.dept.parkId) {
                                            position = n;
                                        } else {
                                            if (n.nodes && n.nodes.length) {
                                                getNode(n.nodes);
                                            }
                                        }
                                    });
                            }
                            getNode($rootScope.parkTree);
                            return position;
                        }
                        $scope.search.deptId = deptId;
                        $scope.find();
                    }

                    $scope.mainMap.setCenter(mapCenter);

                    if ($scope.item.type == 2) {
                        $scope.showOut();
                    } else {
                        $scope.showIn();
                    }
                });
            });
            $scope.item.pointRefItemList=[]
            $rootScope.menus.forEach(function (e) {
                if (e.text == "项目架构") {
                    $scope.powers = e.powers;
                } else {
                    getPower(e);
                }
                function getPower(e) {
                    e.nodes &&
                        e.nodes.forEach((v) => {
                            if (v.text == "项目架构") {
                                $scope.powers = v.powers;
                            } else {
                                getPower(v);
                            }
                        });
                }
            });
            //查询巡查点列表
            $scope.find = function (pageNo) {
                $scope.mainMap.clearMap();
                $.extend($scope.search, {
                    currentPage: pageNo || $scope.pageModel.currentPage || 1,
                    pageSize: $scope.pageModel.pageSize || 10,
                    deptId: $scope.search.deptId,
                    insType: 1,
                });
                if ($scope.selectedModel == 1) {
                    //地图
                    $http
                        .get(
                            "/ovu-pcos/pcos/inspection/inspoint/map?insType=" +
                                $scope.search.insType +
                                "&deptId=" +
                                $scope.search.deptId
                        )
                        .success(function (resp) {
                            if (resp.code == 0) {
                                if (resp.data.length !== 0) {
                                    // setMapBounds(resp.data);
                                    var markers = [];
                                    //设置中心点

                                    resp.data.forEach(function (da) {
                                        if (da.longitude && da.latitude) {
                                            var marker = addmainMarker(da);
                                            markers.push(marker);
                                        }
                                    });
                                    $scope.mainMarkers = markers;
                                }
                            } else {
                                alert(resp.msg);
                            }
                        });
                } else {
                    fac.getPageResult(
                        "/ovu-pcos/pcos/inspection/inspoint/page.do",
                        $scope.search,
                        function (data) {
                            $scope.pageModel = data;
                            // 地图显示
                            // 设置地图显示范围
                        }
                    );
                }
            };
            function isInArray(arr, value) {
                var f = -1;
                arr.length &&  arr.forEach(function (p, i) {
                    if (p.insItemId === value.insItemId) {
                        f = i;
                    }
                });
                return f;
            }
            function getInsName(){
                var arr = [];
                $scope.item.pointRefItemList.forEach((e) => {
                    arr.push(e.name);
                });
                $scope.item.itemName = arr.join(",");
            }
            $http
                .get("/ovu-pcos/pcos/inspection/insitemtype/tree.do", {
                    params: { parkId: $scope.item.parkId },
                })
                .success(function (resp) {
                    if (resp.code == 0) {
                        $scope.insitemTypeTree = resp.data;
                    }
                });
                $scope.searchItem={}
                $scope.pageModelItem={}
                //查询巡查项列表
                $scope.findItem = function (pageNo, insItemTypeId) {
                    if (angular.isDefined(insItemTypeId)) {
                        $scope.searchItem.insItemTypeId = insItemTypeId;
                    }
    
                    $.extend($scope.searchItem, {
                        currentPage: pageNo || 1,
                        pageSize: $scope.pageModel.pageSize || 10,
                        parkId: $scope.item.parkId,
                    });
                    fac.getPageResult(
                        "/ovu-pcos/pcos/inspection/insitem/page.do",
                        $scope.searchItem,
                        function (data) {
                             
                            $scope.pageModelItem = data;
                            $scope.pageModelItem.data &&
                                $scope.pageModelItem.data.forEach(function (v) {
                                    
                                    $scope.item.pointRefItemList && $scope.item.pointRefItemList.length && $scope.item.pointRefItemList.forEach(
                                        function (n) {
                                            if (n.insItemId == v.insItemId) {
                                                v.checked = true;
                                            }
                                        }
                                    );
                                });
                        }
                    );
                };
                $scope.getItem=function(search){
                   
                    $scope.findItem(1,search.insItemTypeId)
                }
                  //选中本页所有巡查项
            $scope.checkInsAll = function (arr) {
                arr.checked = !arr.checked;
                if (arr.checked) {
                    $scope.pageModelItem.data.map(function (n) {
                        n.checked = true;

                        var i = isInArray( $scope.item.pointRefItemList, n);
                        if (i === -1) {
                            var pointItem = {
                                insItemId: n.insItemId,
                                name: n.name,
                                insItemTypeId: n.insItemTypeId,
                                insItemName: n.name,
                            };
                             $scope.item.pointRefItemList.push(pointItem);
                        }
                        return n;
                    });
                } else {
                    $scope.pageModelItem.data.map(function (n) {
                        n.checked = false;
                        var i = isInArray( $scope.item.pointRefItemList, n);
                        if (i !== -1) {
                             $scope.item.pointRefItemList.splice(i, 1);
                        }
                        return n;
                    });
                }
                getInsName()
            };
             // 选择巡查项
             $scope.checkItem = function (n, arr) {
                //标记是否选择
                n.checked = !n.checked;
               
                var arrList = arr.data.reduce(function (ret, n) {
                    n.checked && ret.push(n);
                    return ret;
                }, []);
                if (arr && arr.data) {
                    if (arr.data.length == arrList.length) {
                        arr.checked = true;
                    } else {
                        arr.checked = false;
                    }
                }
                //加入选择组
                var i = isInArray( $scope.item.pointRefItemList, n);
                if (!n.checked && i !== -1) {
                     $scope.item.pointRefItemList.splice(i, 1);
                } else if (n.checked && i === -1) {
                    var pointItem = {
                        insItemId: n.insItemId,
                        name: n.name,
                        insItemTypeId: n.insItemTypeId,
                        insItemName: n.name,
                    };

                    $scope.item.pointRefItemList.push(pointItem);
                   
                }
                getInsName()
            };
            $scope.delSelectedItem = function (item) {
                var f = -1;
                $scope.item.pointRefItemList.forEach(function (p, i) {
                    if (p.insItemId === item.insItemId) {
                        f = i;
                    }
                });
                if (f !== -1) {
                    $scope.item.pointRefItemList.splice(f, 1);
                    $scope.findItem();
                 
                }
                getInsName()
            };
               
            //清除点位
            function clearMark() {
                $scope.mainMarkers &&
                    $scope.mainMarkers.length &&
                    $scope.mainMarkers.forEach((mk, i) => {
                        var data = mk.getExtData();
                        if (!data.insPointId) {
                            //清除没有保存的mark
                            $scope.mainMap.remove(mk);
                            $scope.mainMarkers.splice(
                                $scope.mainMarkers.indexOf(mk),
                                1
                            );
                        }
                    });
            }
             $scope.$watch('searchItem.name',function(newV){
                $scope.findItem() 
                
             },true)
            
           
            //室内点
            $scope.showIn = function () {
                clearMark();
                $scope.item.type=1
                $scope.item.latitude && delete $scope.item.latitude;
                $scope.item.longitude && delete $scope.item.longitude;
                $scope.item.addr && delete $scope.item.addr;
            };
            //室外点
            $scope.showOut = function () {
                clearMark();
                $scope.item.type=2
                $scope.item.stage && delete $scope.item.stage;
                $scope.item.build && delete $scope.item.build;

                $scope.item.unitNo && delete $scope.item.unitNo;
                $scope.item.groundNo && delete $scope.item.groundNo;
                $scope.item.houseId && delete $scope.item.houseId;
                $scope.item.addr && delete $scope.item.addr;
                $scope.item.houseName && delete $scope.item.houseName;
                $scope.item.latitude && delete $scope.item.latitude;
                $scope.item.longitude && delete $scope.item.longitude;
            };

            //删除
            $scope.del = function (id) {
                if (!id) {
                    alert("请选择巡查点");
                    return;
                }
                confirm("确认删除该巡查点?", function () {
                    $http
                        .post(
                            "/ovu-pcos/pcos/inspection/inspoint/delete.do",
                            {
                                insPointId: id,
                            },
                            fac.postConfig
                        )
                        .success(function (resp) {
                            if (resp.code == 0) {
                                msg(resp.msg);
                                if ($scope.selectedModel == 1) {
                                    $scope.mainMap.clearMap();
                                    $http
                                        .get(
                                            "/ovu-pcos/pcos/inspection/inspoint/map?deptId=" +
                                                $scope.dept.id
                                        )
                                        .success(function (resp) {
                                            if (resp.code == 0) {
                                                if (resp.data.length !== 0) {
                                                    // setMapBounds(resp.data);
                                                    var markers = [];
                                                    //设置中心点

                                                    resp.data.forEach(function (
                                                        da
                                                    ) {
                                                        if (
                                                            da.longitude &&
                                                            da.latitude
                                                        ) {
                                                            var marker = addmainMarker(
                                                                da
                                                            );
                                                            markers.push(
                                                                marker
                                                            );
                                                        }
                                                    });
                                                    $scope.mainMarkers = markers;
                                                }
                                            } else {
                                                alert(resp.msg);
                                            }
                                        });
                                        $scope.pageModelItem.data && $scope.pageModelItem.data.length && $scope.pageModelItem.data.forEach(function (n) {
                                            n.checked = false;
                                           
                                        });
                                } else {
                                    $scope.find(1);
                                }
                                // document.getElementById("form").reset();
                                $scope.isForm = false;
                                $scope.item = {};
                                $scope.item.type = 1;
                                $scope.item.parkName = $scope.dept.deptName;
                                $scope.item.parkId= $scope.dept.parkId;
                                $scope.item.pointRefItemList=[]
                              
                            } else {
                                alert(resp.msg);
                            }
                        });
                });
                $scope.form.$setPristine();
            };
            //新增或者修改弹出框
            $scope.showEditModal = function (item) {
                var copy = angular.extend(
                    {
                        deptId: $scope.search.deptId,
                        park: $scope.park,
                        powers: $scope.powers,
                        parkId:$scope.item.parkId,
                        parkName:$scope.item.parkName
                    },
                    item
                );
                copy = angular.extend(copy);
                var modal = $uibModal.open({
                    animation: false,
                    templateUrl:
                        "/view/inspection/point/modal.inspection.point.html",
                    controller: "PointAddOrEditModalCtrl",
                    size: "lg",
                    resolve: {
                        param: copy,
                    },
                });
                modal.result.then(function () {
                    $scope.find();
                });
            };

            
           
           

            //左侧大地图
            $scope.mainMapOptions = {
                toolbar: true,
                // map-self config
                resizeEnable: true,
                // ui map config
                uiMapCache: false,
                zoom: 15,
                //精简模式
                liteStyle: true,
                expandZoomRange: true,
            };

            //查看位置
            $scope.showLocation = function (item) {
                var modal = $uibModal.open({
                    animation: false,
                    size: "lg",
                    templateUrl:
                        "/view/quality/point/modal.point.getLocation.html",
                    controller: "GetLocationController",
                    resolve: {
                        param: {
                            latitude: item.latitude,
                            longitude: item.longitude,
                            park: $scope.park,
                        },
                    },
                });
                modal.result.then(function () {
                    $scope.find();
                });
            };
            AMapUI.loadUI(["misc/PoiPicker"], function (PoiPicker) {
                var poiPicker = new PoiPicker({
                    city: "",
                    input: "pickerInput",
                });

                //初始化poiPicker
                poiPickerReady(poiPicker);
            });

            function poiPickerReady(poiPicker) {
                window.poiPicker = poiPicker;
                var marker = new AMap.Marker();
                //选取了某个POI
                poiPicker.on("poiPicked", function (poiResult) {
                    var source = poiResult.source;
                    poi = poiResult.item;

                    marker.setMap($scope.mainMap);
                    $scope.mainMap.setCenter(poi.location);

                    $scope.item.addr = poi.name;
                    marker.setPosition(poi.location);
                });
            }

            //点击地图上的点
            // $scope.floorIshow = false;
            $scope.clickMainMap = function ($event, $params, marker) {
                $scope.floorIshow = false;
                clearMark()
               
                $scope.markerData = marker.getExtData(); //获取点的数据
                if ($scope.markerData.type == 1) {
                    //获取楼层
                    $http
                        .get(
                            "/ovu-pcos/pcos/inspection/inspoint/getIndoorFloor.do?insPointId=" +
                                $scope.markerData.insPointId
                        )
                        .success(function (resp) {
                            if (resp.code == 0) {
                                $scope.floorList = resp.data;
                                $scope.floorIshow = true;
                                $scope.floorList.forEach(function (v) {
                                    v.insPointId = $scope.markerData.insPointId;
                                });
                            } else {
                                alert(resp.msg);
                            }
                        });
                    //获取室内点位
                    $scope.getPointList = function (floor, index) {
                        $scope.pointList = [];
                        $scope.selectedFloor = index;
                        $http
                            .get(
                                "/ovu-pcos/pcos/inspection/inspoint/getIndoorPoint.do?insPointId=" +
                                    floor.insPointId +
                                    "&floorNum=" +
                                    floor.floorNum
                            )
                            .success(function (data) {
                                if (data.code == 0) {
                                    $scope.pointList = data.data;
                                    if ($scope.pointList.length !== 0) {
                                        $scope.myInfoWindow.open(
                                            $scope.mainMap,
                                            marker.getPosition()
                                        );
                                    } else {
                                        $scope.myInfoWindow.close();
                                    }
                                } else {
                                    alert(data.msg);
                                }
                            });
                    };
                    $scope.getPoint = function (insPointId, index) {
                        $scope.selectPoint = index;
                        $http
                            .get(
                                "/ovu-pcos/pcos/inspection/inspoint/get.do?insPointId=" +
                                    insPointId
                            )
                            .success(function (data, status, headers, config) {
                                if (fac.isNotEmpty(data.data)) {
                                    $scope.item = data.data;

                                    if ($scope.item.parkId) {
                                        $http
                                            .post(
                                                "/ovu-base/system/park/stageList.do",
                                                {
                                                    parkId: $scope.item.parkId,
                                                },
                                                fac.postConfig
                                            )
                                            .success(function (res) {
                                                $scope.stageList = res.data;

                                                if ($scope.item.stageId) {
                                                    $scope.item.stage = $scope.stageList.find(
                                                        function (n) {
                                                            return (
                                                                n.id ==
                                                                $scope.item
                                                                    .stageId
                                                            );
                                                        }
                                                    );
                                                    var param = {
                                                        stageId:
                                                            $scope.item.stage
                                                                .id ||
                                                            $scope.item.stageId,
                                                    };
                                                    if ($scope.item.buildId) {
                                                        $http
                                                            .get(
                                                                "/ovu-base/system/parkBuild/getBuilds.do",
                                                                {
                                                                    params: param,
                                                                }
                                                            )
                                                            .success(function (
                                                                res
                                                            ) {
                                                                $scope.buildList = res;
                                                                $scope.item.build = $scope.buildList.find(
                                                                    function (
                                                                        n
                                                                    ) {
                                                                        return (
                                                                            n.id ==
                                                                            $scope
                                                                                .item
                                                                                .buildId
                                                                        );
                                                                    }
                                                                );

                                                                $scope.geneUnit(
                                                                    $scope.item
                                                                        .build,
                                                                    true
                                                                );
                                                                if (
                                                                    $scope.item
                                                                        .unitNo
                                                                ) {
                                                                    $scope.geneGround(
                                                                        $scope.item,
                                                                        true
                                                                    );
                                                                    if (
                                                                        $scope
                                                                            .item
                                                                            .groundNo
                                                                    ) {
                                                                        $scope.getHouseList(
                                                                            $scope.item,
                                                                            true
                                                                        );
                                                                    }
                                                                }
                                                            });
                                                    }
                                                }
                                            });
                                    }
                                    var arr = [];
                                    data.data.pointRefItemList.forEach((e) => {
                                        arr.push(e.insItemName);
                                    });
                                    $scope.item.itemName = arr.join(",");
                                } else {
                                    alert();
                                }
                            });
                    };
                } else {
                    $http
                        .get(
                            "/ovu-pcos/pcos/inspection/inspoint/get.do?insPointId=" +
                                $scope.markerData.insPointId
                        )
                        .success(function (resp) {
                            if (resp.code == 0) {
                                if (resp.data.type == 2) {
                                    $scope.item = resp.data;
                                    var arr = [];
                                    resp.data.pointRefItemList.forEach((e) => {
                                        arr.push(e.insItemName);
                                    });
                                    $scope.item.itemName = arr.join(",");
                                }
                            } else {
                                alert(resp.msg);
                            }
                        });
                }
             
                $scope.findItem(1)

            };

            $scope.clickMap = function ($event, $params) {
                if ($scope.item.type == 1 || !$scope.canAdd) {
                    return;
                }

                $scope.item.longitude = $params[0].lnglat.lng;
                $scope.item.latitude = $params[0].lnglat.lat;

                clearMark();
                //当用户点击地图时，则在地图上打一个新的点，为了避免用户重复打点，则每次打点前，先清除之前没有保存在数据库的点，然后再追加一个新的点
                var marker = addmainMarker($scope.item);
                $scope.mainMarkers.push(marker);
            };

            function addmainMarker(data) {
                var imagePath;
                //判断是室内点还是室外点
                 if(!data.insPointId){
                    imagePath = "../res/img/mark_bs/mark_bs5.png";
                 }else{
                    if (data.type == 2) {
                        //室外点
                        imagePath = "../res/img/inspection/out.png";
                    } else {
                        imagePath = "../res/img/inspection/in.png";
                    }
                 }

                var icon = new AMap.Icon({
                    image: imagePath,
                    size: new AMap.Size(30, 30),
                    imageSize: new AMap.Size(26, 26),
                });

                var marker = new AMap.Marker({
                    position: [data.longitude, data.latitude],
                    map: $scope.mainMap,
                    icon: icon,
                    extData: data,
                });

                marker.setLabel({
                    //label默认蓝框白底左上角显示，样式className为：amap-marker-label
                    offset: new AMap.Pixel(10, 10), //修改label相对于maker的位置
                    content: data.name,
                });
                return marker;
            }

            //获取楼栋
            $scope.geneBuild = function (task) {
                $scope.buildList = [];
                $scope.unitList = [];
                $scope.groundList = [];
                $scope.houseList = [];
                $scope.item.latitude=''
                $scope.item.longitude=''
                clearMark();
                $scope.unitList = [];
                if (!task || !task.id) {
                    $scope.buildList = [];
                    return;
                }
                $scope.item.stageName = task.text || "";
                $scope.item.addr = $scope.item.stageName;
                var param = {
                    stageId: task.id,
                };

                $http
                    .get("/ovu-base/system/parkBuild/getBuilds.do", {
                        params: param,
                    })
                    .success(function (res) {
                        $scope.buildList = res;
                    });
            };

            //获取单元
            $scope.geneUnit = function (task, flag) {
                $scope.unitList = [];
                $scope.groundList = [];
                $scope.houseList = [];
                clearMark();
                if (!task) {
                    $scope.unitList = [];
                    return;
                }
                if (!flag) {
                    $scope.item.buildName = task.buildName || "";
                    $scope.item.addr = $scope.item.stage.text + task.buildName;
                }
                if (task.mapLg) {
                    $scope.item.longitude = task.mapLg;
                    $scope.item.latitude = task.mapLa;
                    //每次打点前，先清除之前没有保存在数据库的点，然后再追加一个新的点

                    var marker = addmainMarker($scope.item);
                    $scope.mainMarkers.push(marker);
                    $scope.flag = false;
                } else {
                    $scope.flag = true;
                    $scope.item.longitude = "";
                    $scope.item.latitude = "";
                }

                var param = {
                    pageSize: 1000,
                    pageIndex: 0,
                    buildId: task.id || "",
                };
                $http
                    .get("/ovu-base/system/parkHouse/listUnitNo_mute.do", {
                        params: param,
                    })
                    .success(function (resp) {
                        $scope.unitList = resp.data;
                    });
            };
            //获取楼层
            $scope.geneGround = function (task, flag) {
                $scope.groundList = [];
                $scope.houseList = [];

                if (!task.unitNo) {
                    $scope.groundList = [];
                    return;
                }
                if (!flag) {
                    $scope.item.addr =
                        $scope.item.stage.text +
                        task.build.buildName +
                        task.unitNo +
                        "单元";
                }
                var param = {
                    pageSize: 1000,
                    pageIndex: 0,
                    buildId: task.build.id || task.buildId,
                    unitNo: task.unitNo,
                };
                $http
                    .get("/ovu-base/system/parkHouse/listGroundNo_mute.do", {
                        params: param,
                    })
                    .success(function (resp) {
                        $scope.groundList = resp.data;
                    });
            };
            //获取房屋
            $scope.getHouseList = function (task, flag) {
                $scope.houseList = [];
                if (!task.groundNo) {
                    $scope.houseList = [];
                    return;
                }
                if (!flag) {
                    $scope.item.addr =
                        $scope.item.stage.text +
                        task.build.buildName +
                        task.unitNo +
                        "单元" +
                        task.groundNo +
                        "楼";
                }
                if (task.groundNo) {
                    $http
                        .post(
                            "/ovu-base/system/parkHouse/getHouses.do",
                            {
                                buildId: task.build.id || task.buildId,
                                unitNo: task.unitNo,
                                groundNo: task.groundNo,
                            },
                            fac.postConfig
                        )
                        .success(function (list) {
                            $scope.houseList = list.data;
                        });
                }
            };
            $scope.getHouseName = function (id) {
                if (!id) {
                    return;
                }

                $scope.houseList.forEach(function (house) {
                    if (house.id == id) {
                        $scope.item.houseName = house.houseName;
                    }
                });
                $scope.item.addr =
                    $scope.item.stage.text +
                    $scope.item.build.buildName +
                    $scope.item.unitNo +
                    "单元" +
                    $scope.item.groundNo +
                    "楼" +
                    $scope.item.houseName;
            };

           
            //绑定巡查项
            $scope.chooseInsitem = function (item) {
                if (!item.parkName) {
                    alert("请选择项目");
                    return;
                }
                if (!item.longitude || !item.latitude) {
                    alert("请选择位置");
                    return;
                }
                if (!item.name) {
                    alert("请输入巡查点名称");
                    return;
                }
                var copy = angular.extend({ park: $scope.park }, copy);
                angular.extend(copy, item);
                var modal = $uibModal.open({
                    animation: false,
                    size: "lg",
                    templateUrl:
                        "/view/inspection/point/modal.selector.insitem.html",
                    controller: "insitemSelectorBDCtrl",
                    resolve: {
                        data: copy,
                    },
                });
                modal.result.then(function (data) {
                    $scope.item.pointRefItemList = data.insItemSelected;
                    var arr = [];
                    data.insItemSelected.forEach((e) => {
                        arr.push(e.name);
                    });
                    $scope.item.itemName = arr.join(",");
                });
            };
            $scope.save = function (form, item) {
                $scope.mainMap.clearMap();

                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                var param = angular.copy(item);
                if (item.type == 1) {
                    param.stageId = param.stage.id;
                    param.buildId = param.build.id;
                }
                
                param.creatorId && delete param.creatorId;
                param.createTime && delete param.createTime;
                param.pid && delete param.pid;
                param.stage && delete param.stage;
                param.build && delete param.build;
                param.deptId = $scope.search.deptId;
                 if(item.type==2){
                    param.buildId && delete param.buildId;
                    param.stageId && delete param.stageId;
                   
                  
                 }
                $http
                    .post("/ovu-pcos/pcos/inspection/inspoint/edit", param)
                    .success(function (data, status, headers, config) {
                        if (data.code == 0) {
                            msg(data.msg);
                            $scope.item = {
                                type: 1,
                                parkName:$scope.dept.deptName,
                                parkId:$scope.dept.parkId,
                                 pointRefItemList:[]
                            };

                            $http
                                .get(
                                    "/ovu-pcos/pcos/inspection/inspoint/map?deptId=" +
                                        $scope.dept.id
                                )
                                .success(function (resp) {
                                    if (resp.code == 0) {
                                        if (resp.data.length !== 0) {
                                            // setMapBounds(resp.data);
                                            var markers = [];
                                            //设置中心点

                                            resp.data.forEach(function (da) {
                                                if (
                                                    da.longitude &&
                                                    da.latitude
                                                ) {
                                                    var marker = addmainMarker(
                                                        da
                                                    );
                                                    markers.push(marker);
                                                }
                                            });
                                            $scope.mainMarkers = markers;
                                        }
                                    } else {
                                        alert(resp.msg);
                                    }
                                });
                        } else {
                            alert(data.msg);
                        }
                    });
                   
                $scope.form.$setPristine();
                   
                 $scope.pageModelItem.data && $scope.pageModelItem.data.length && $scope.pageModelItem.data.forEach(function (n) {
                    n.checked = false;
                   
                });
                $scope.pageModelItem.checked=false
                $scope.searchItem={}
              
                
              
                
            };
            //取消
            $scope.cancel = function () {
               
                clearMark();
                $scope.canAdd = true;
                $scope.floorIshow = false;
                $scope.myInfoWindow.close();
                $scope.item = {
                    parkId: $scope.item.parkId,
                    parkName: $scope.item.parkName,
                    type:$scope.item.type || 1,
                    pointRefItemList:[]
                };
                
                $scope.form.$setPristine();
                $scope.pageModelItem.data && $scope.pageModelItem.data.length && $scope.pageModelItem.data.forEach(function (n) {
                    n.checked = false;
                   
                });
              
            };
        }
    );
    //新增修改巡查点弹出框控制器,
    app.controller(
        "PointAddOrEditModalCtrl",
        function (
            $scope,
            $http,
            $location,
            $uibModalInstance,
            $uibModal,
            $timeout,
            fac,
            param
        ) {
            var ovu2DMap1;
            var map2dDraw1;
            var CanvasLayers;
            $scope.item = param;
            $scope.powers = param.powers;

            $scope.item.addr = "";

            $scope.flag = false; //是否展示设置按钮
            // $scope.search={};
            function drawAirspace() {
                //画出图层
                //地图需要参数
               
                var topRight = param.park.trPosition
                    ? param.park.trPosition.split(",")
                    : undefined;
                var bomLeft = param.park.blPosition
                    ? param.park.blPosition.split(",")
                    : undefined;

                var mapProperties = param.park.director
                    ? param.park.director.split(",")
                    : [];
                var width = mapProperties[0] ? Number(mapProperties[0]) : 2000;
                var height = mapProperties[1] ? Number(mapProperties[1]) : 2000;
                var zoom = mapProperties[2] ? Number(mapProperties[2]) : 2.76;
                if (param.park.airscapePath) {
                    if (param.park.airscapePath.indexOf("http") == -1) {
                        param.park.airscapePath =
                            "/ovu-base" + param.park.airscapePath;
                    }
                    ovu2DMap1 = new OvuMap();
                    map2dDraw1 = new Draw2DMap(width, height, zoom, undefined);
                    ovu2DMap1.loadTheme();
                    ovu2DMap1.loadJson(param.park.airscapePath);
                    var draw1 = function (argument) {
                        AMap.Util.requestAnimFrame(draw1);
                        if (ovu2DMap1.mapJson === undefined) {
                            return;
                        }
                        var _curFloor = ovu2DMap1.mapJson;
                        //地图绘制
                        map2dDraw1.draw(_curFloor, $scope.myMap);
                        //图层刷新
                        CanvasLayers.reFresh();
                    };
                    CanvasLayers = new AMap.CanvasLayer({
                        canvas: map2dDraw1.canvas,
                        bounds: new AMap.Bounds(bomLeft, topRight),
                        zooms: [3, 18],
                    });
                    //把图层 存放到 地图中
                    CanvasLayers.setMap($scope.myMap);
                    //绘图循环的核心方法
                    draw1(22);
                }
            }
            $timeout(function () {
                $scope.myMap.setCenter([param.park.mapLng, param.park.mapLat]);
                if ($scope.item.type == 2) {
                    $scope.showOut();
                } else {
                    $scope.showIn();
                }   
                drawAirspace()      
            }, 200);
           
            
           
            $http
            .post(
                "/ovu-base/system/park/stageList.do",
                {
                    parkId: $scope.item.parkId,
                },
                fac.postConfig
            )
            .success(function (res) {
                $scope.stageList = res.data;
            });
          

            if (fac.isNotEmpty($scope.item.insPointId)) {
                $http
                    .get(
                        "/ovu-pcos/pcos/inspection/inspoint/get.do?insPointId=" +
                            param.insPointId
                    )
                    .success(function (data, status, headers, config) {
                        if (fac.isNotEmpty(data.data)) {
                            angular.extend($scope.item, data.data);
                            if ($scope.item.type == 2) {
                                $timeout(function () {
                                    data.data.longitude &&
                                        addMarker([
                                            data.data.longitude,
                                            data.data.latitude,
                                        ]);
                                   
                                }, 500);
                            }
                            if ($scope.item.parkId) {
                                $http
                                    .post(
                                        "/ovu-base/system/park/stageList.do",
                                        {
                                            parkId: $scope.item.parkId,
                                        },
                                        fac.postConfig
                                    )
                                    .success(function (res) {
                                        $scope.stageList = res.data || [];

                                        if ($scope.item.stageId) {
                                            $scope.item.stage =
                                                $scope.stageList &&
                                                $scope.stageList.find(function (
                                                    n
                                                ) {
                                                    return (
                                                        n.id ==
                                                        $scope.item.stageId
                                                    );
                                                });
                                            var param = {
                                                stageId:
                                                    $scope.item.stage.id ||
                                                    $scope.item.stageId,
                                            };
                                            if ($scope.item.buildId) {
                                                $http
                                                    .get(
                                                        "/ovu-base/system/parkBuild/getBuilds.do",
                                                        {
                                                            params: param,
                                                        }
                                                    )
                                                    .success(function (res) {
                                                        $scope.buildList = res;
                                                        $scope.item.build = $scope.buildList.find(
                                                            function (n) {
                                                                return (
                                                                    n.id ==
                                                                    $scope.item
                                                                        .buildId
                                                                );
                                                            }
                                                        );
                                                        $scope.item.build
                                                            .mapLg &&
                                                            addMarker([
                                                                $scope.item
                                                                    .build
                                                                    .mapLg,
                                                                $scope.item
                                                                    .build
                                                                    .mapLa,
                                                            ]);
                                                        $scope.geneUnit(
                                                            $scope.item.build,
                                                            true
                                                        );
                                                        $scope.item.unitNo &&
                                                            $scope.geneGround(
                                                                $scope.item,
                                                                true
                                                            );
                                                        $scope.item.groundNo &&
                                                            $scope.getHouseList(
                                                                $scope.item,
                                                                true
                                                            );
                                                    });
                                            }
                                        }
                                    });
                            }
                            var arr = [];
                            data.data.pointRefItemList.forEach((e) => {
                                arr.push(e.insItemName);
                            });
                            $scope.item.itemName = arr.join(",");
                        } else {
                            alert();
                        }
                    });
            }

            //点击地图
            $scope.clickMap = function ($event, $params) {
                if ($scope.item.type == 1) {
                    return;
                }
                $scope.item.longitude = $params[0].lnglat.lng;
                $scope.item.latitude = $params[0].lnglat.lat;
                addMarker($params[0].lnglat);
            };

            //右侧经纬度地图
            $scope.mapOptions1 = {
                toolbar: true,
                // map-self config
                resizeEnable: true,
                // ui map config
                uiMapCache: false,
                zoom: 18,
                //精简模式
                liteStyle: true,
                expandZoomRange: true,
            };

            //楼栋经纬度
            function addMarker(lnglat) {
                $scope.myMap.setCenter(lnglat);
                $scope.myMap.clearMap();
                $scope.markers1 = [];
                $scope.markers1.push(
                    new AMap.Marker({
                        map: $scope.myMap,
                        position: lnglat,
                    })
                );

                if (angular.isArray(lnglat)) {
                    //经度
                    $scope.item.longitude = lnglat[0];
                    //纬度
                    $scope.item.latitude = lnglat[1];
                } else {
                    //经度
                    $scope.item.longitude = lnglat.lng;
                    //纬度
                    $scope.item.latitude = lnglat.lat;
                }
            }

            AMapUI.loadUI(["misc/PoiPicker"], function (PoiPicker) {
                var poiPicker = new PoiPicker({
                    city: "",
                    input: "pickerInput",
                });

                //初始化poiPicker
                poiPickerReady(poiPicker);
            });

            function poiPickerReady(poiPicker) {
                window.poiPicker = poiPicker;

                var marker = new AMap.Marker();

                //选取了某个POI
                poiPicker.on("poiPicked", function (poiResult) {
                    var source = poiResult.source;
                    poi = poiResult.item;

                    marker.setMap($scope.myMap);
                    addMarker(poi.location);
                    $scope.item.addr = poi.name;

                    marker.setPosition(poi.location);
                });
            }

            $scope.geneBuild = function (task) {
                $scope.buildList = [];
                $scope.unitList = [];
                $scope.groundList = [];
                $scope.houseList = [];
                $scope.item.latitude=''
                $scope.item.longitude=''
                $scope.myMap.clearMap();
                $scope.unitList = [];
                if (!task || !task.id) {
                    $scope.buildList = [];
                    return;
                }
                $scope.item.stageName = task.text || "";
                $scope.item.addr = $scope.item.stageName;
                var param = {
                    stageId: task.id,
                };

                $http
                    .get("/ovu-base/system/parkBuild/getBuilds.do", {
                        params: param,
                    })
                    .success(function (res) {
                        $scope.buildList = res;
                    });
            };

            //获取单元
            $scope.geneUnit = function (task, flag) {
                $scope.unitList = [];
                $scope.groundList = [];
                $scope.houseList = [];
                // $scope.groundList = [];
                if (!task) {
                    $scope.unitList = [];
                    return;
                }
                if (!flag) {
                    $scope.item.buildName = task.buildName || "";
                    $scope.item.addr = $scope.item.stage.text + task.buildName;
                }
                if (task.mapLg) {
                    addMarker([task.mapLg, task.mapLa]);
                    $scope.item.longitude = task.mapLg;
                    $scope.item.latitude = task.mapLa;
                    $scope.flag = false;
                } else {
                    $scope.myMap.clearMap();
                    $scope.flag = true;
                    $scope.item.longitude = "";
                    $scope.item.latitude = "";
                }

                var param = {
                    pageSize: 1000,
                    pageIndex: 0,
                    buildId: task.id || "",
                };
                $http
                    .get("/ovu-base/system/parkHouse/listUnitNo_mute.do", {
                        params: param,
                    })
                    .success(function (resp) {
                        $scope.unitList = resp.data;
                    });
            };
            //获取楼层
            $scope.geneGround = function (task, flag) {
                $scope.groundList = [];
                $scope.houseList = [];
                // $scope.houseList = [];
                if (!task.unitNo) {
                    $scope.groundList = [];
                    return;
                }
                if (!flag) {
                    $scope.item.addr =
                        $scope.item.stage.text +
                        task.build.buildName +
                        task.unitNo +
                        "单元";
                }
                var param = {
                    pageSize: 1000,
                    pageIndex: 0,
                    buildId: task.build.id || task.buildId,
                    unitNo: task.unitNo,
                };
                $http
                    .get("/ovu-base/system/parkHouse/listGroundNo_mute.do", {
                        params: param,
                    })
                    .success(function (resp) {
                        $scope.groundList = resp.data;
                    });
            };
            //获取房屋
            $scope.getHouseList = function (task, flag) {
                $scope.houseList = [];
                if (!task.groundNo) {
                    $scope.houseList = [];
                    return;
                }
                if (!flag) {
                    $scope.item.addr =
                        $scope.item.stage.text +
                        task.build.buildName +
                        task.unitNo +
                        "单元" +
                        task.groundNo +
                        "楼";
                }
                if (task.groundNo) {
                    $http
                        .post(
                            "/ovu-base/system/parkHouse/getHouses.do",
                            {
                                buildId: task.build.id || task.buildId,
                                unitNo: task.unitNo,
                                groundNo: task.groundNo,
                            },
                            fac.postConfig
                        )
                        .success(function (list) {
                            $scope.houseList = list.data;
                        });
                }
            };
            $scope.getHouseName = function (id) {
                if (!id) {
                    return;
                }

                $scope.houseList.forEach(function (house) {
                    if (house.id == id) {
                        $scope.item.houseName = house.houseName;
                    }
                });
                $scope.item.addr =
                    $scope.item.stage.text +
                    $scope.item.build.buildName +
                    $scope.item.unitNo +
                    "单元" +
                    $scope.item.groundNo +
                    "楼" +
                    $scope.item.houseName;
            };

           
           
            //室内点
            $scope.showIn = function () {
                $scope.myMap.clearMap();
                
                $scope.item.latitude && delete $scope.item.latitude;
                $scope.item.longitude && delete $scope.item.longitude;
                $scope.item.addr && delete $scope.item.addr;
            };
            //室外点
            $scope.showOut = function () {
                $scope.myMap.clearMap();
             
                // $scope.item.stageName && delete param.stageName;
                // $scope.item.stageId && delete $scope.item.stageId
                // $scope.item.buildName && delete $scope.item.buildName;
                // $scope.item.buildId && delete $scope.item.buildId
                $scope.item.stage && delete $scope.item.stage;
                $scope.item.build && delete $scope.item.build;
                $scope.item.unitNo && delete $scope.item.unitNo;
                $scope.item.groundNo && delete $scope.item.groundNo;
                $scope.item.houseId && delete $scope.item.houseId;
                $scope.item.addr && delete $scope.item.addr;
                $scope.item.houseName && delete $scope.item.houseName;

                $scope.item.latitude && delete $scope.item.latitude;
                $scope.item.longitude && delete $scope.item.longitude;
            };
            //绑定巡查项
            $scope.chooseInsitem = function (item) {
                if (!item.parkName) {
                    alert("请选择项目");
                    return;
                }
                if (!item.longitude || !item.latitude) {
                    alert("请选择位置");
                    return;
                }
                if (!item.name) {
                    alert("请输入巡查点名称");
                    return;
                }
                var copy = angular.extend({ park: $scope.park }, copy);
                angular.extend(copy, item);
                var modal = $uibModal.open({
                    animation: false,
                    size: "lg",
                    templateUrl:
                        "/view/inspection/point/modal.selector.insitem.html",
                    controller: "insitemSelectorBDCtrl",
                    resolve: {
                        data: copy,
                    },
                });
                modal.result.then(function (data) {
                    // $scope.item.equipmentId = data.id;
                    // $scope.item.equipmentName = data.name; //设备名称
                    $scope.item.pointRefItemList = data.insItemSelected;
                    var arr = [];
                    data.insItemSelected.forEach((e) => {
                        arr.push(e.name);
                    });
                    $scope.item.itemName = arr.join(",");
                });
            };

            $scope.save = function (form, item) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                var param = angular.copy(item);
                if (item.type == 1) {
                    param.stageId = param.stage.id;
                    param.buildId = param.build.id;
                }
                param.creatorId && delete param.creatorId;
                param.createTime && delete param.createTime;

                param.pid && delete param.pid;
                param.stage && delete param.stage;
                param.build && delete param.build;
                if(item.type==2){
                    param.buildId && delete param.buildId;
                    param.stageId && delete param.stageId;
                   
                  
                 }
                $http
                    .post("/ovu-pcos/pcos/inspection/inspoint/edit", param)
                    .success(function (data, status, headers, config) {
                        if (data.code == 0) {
                            msg(data.msg);
                            $uibModalInstance.close();
                        } else {
                            alert(data.msg);
                        }
                    });
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss("cancel");
            };
        }
    );
   

    //绑定巡查项

    app.controller(
        "insitemSelectorBDCtrl",
        function (
            $scope,
            $rootScope,
            $http,
            $uibModal,
            $uibModalInstance,
            $timeout,
            $filter,
            fac,
            data
        ) {
            $scope.config = {
                edit: false,
            };
            $scope.search = {};
            $scope.search.insItemTypeId = "";
            $scope.item = data || {};
            $scope.pageModel = {};
            $scope.curItem = {};
            $scope.curItem.insItemSelected = $scope.item.pointRefItemList || [];
            if (data.insPointId) {
                if ($scope.item.pointRefItemList.length > 0) {
                    $scope.item.pointRefItemList.forEach((e) => {
                        e.name = e.insItemName;
                    });
                }
            }

            //绘制地图
            var ovu2DMap1;
            var map2dDraw1;
            var CanvasLayers;
            function drawAirspace() {
                //画出图层
                //地图需要参数
                var topRight = data.park.trPosition
                    ? data.park.trPosition.split(",")
                    : undefined;
                var bomLeft = data.park.blPosition
                    ? data.park.blPosition.split(",")
                    : undefined;
                // var width =  $scope.myMap.mapWidth ?  $scope.myMap.mapWidth :2000;
                //  var height =  $scope.myMap.mapHeight ?  $scope.myMap.mapHeight :1000;
                //  var zoom =  $scope.myMap.mapZoom ?  $scope.myMap.mapZoom :2.5;
                var mapProperties = data.park.director
                    ? data.park.director.split(",")
                    : [];
                var width = mapProperties[0] ? Number(mapProperties[0]) : 2000;
                var height = mapProperties[1] ? Number(mapProperties[1]) : 2000;
                var zoom = mapProperties[2] ? Number(mapProperties[2]) : 2.76;
                if (data.park.airscapePath) {
                    if (data.park.airscapePath.indexOf("http") == -1) {
                        data.park.airscapePath =
                            "/ovu-base" + data.park.airscapePath;
                    }
                    ovu2DMap1 = new OvuMap();
                    map2dDraw1 = new Draw2DMap(width, height, zoom, undefined);
                    ovu2DMap1.loadTheme();
                    ovu2DMap1.loadJson(data.park.airscapePath);
                    var draw1 = function (argument) {
                        AMap.Util.requestAnimFrame(draw1);
                        if (ovu2DMap1.mapJson === undefined) {
                            return;
                        }
                        var _curFloor = ovu2DMap1.mapJson;
                        //地图绘制
                        map2dDraw1.draw(_curFloor, $scope.myMap);
                        //图层刷新
                        CanvasLayers.reFresh();
                    };
                    CanvasLayers = new AMap.CanvasLayer({
                        canvas: map2dDraw1.canvas,
                        bounds: new AMap.Bounds(bomLeft, topRight),
                        zooms: [3, 18],
                    });
                    //把图层 存放到 地图中
                    CanvasLayers.setMap($scope.myMap);
                    //绘图循环的核心方法
                    draw1(22);
                }
            }
            $scope.mapOptions = {
                toolbar: true,
                // map-self config

                resizeEnable: true,
                // ui map config
                uiMapCache: false,
                zoom: 15,
                expandZoomRange: true,
            };
            $scope.markers = [];
            //添加标记
            function addMarker(lng, lat) {
                $scope.markers = [];
                var lnglat = new AMap.LngLat(lng, lat);
                $scope.myMap.setCenter(lnglat);
                $scope.myMap.clearMap();
                $scope.markers.push(
                    new AMap.Marker({
                        map: $scope.myMap,
                        position: lnglat,
                    })
                );
            }
            $timeout(function () {
                data.longitude && addMarker(data.longitude, data.latitude);
                drawAirspace();
            }, 500);

            $scope.find = function (pageNo, insItemTypeId) {
                if (angular.isDefined(insItemTypeId)) {
                    $scope.search.insItemTypeId = insItemTypeId;
                }

                $.extend($scope.search, {
                    currentPage: pageNo || 1,
                    pageSize: $scope.pageModel.pageSize || 10,
                    parkId: data.parkId,
                });
                fac.getPageResult(
                    "/ovu-pcos/pcos/inspection/insitem/page.do",
                    $scope.search,
                    function (data) {
                        $scope.pageModel = data;
                        $scope.pageModel.data &&
                            $scope.pageModel.data.forEach(function (v) {
                                $scope.curItem.insItemSelected.forEach(
                                    function (n) {
                                        if (n.insItemId == v.insItemId) {
                                            v.checked = true;
                                        }
                                    }
                                );
                            });
                    }
                );
            };
            $http
                .get("/ovu-pcos/pcos/inspection/insitemtype/tree.do", {
                    params: { parkId: data.parkId },
                })
                .success(function (resp) {
                    if (resp.code == 0) {
                        $scope.insitemTypeTree = resp.data;
                    }
                });
            $scope.find();
            function isInArray(arr, value) {
                var f = -1;
                arr.length &&  arr.forEach(function (p, i) {
                    if (p.insItemId === value.insItemId) {
                        f = i;
                    }
                });
                return f;
            }
            // 选择巡查项
            $scope.checkItem = function (n, arr) {
                //标记是否选择
                n.checked = !n.checked;
                var arrList = arr.data.reduce(function (ret, n) {
                    n.checked && ret.push(n);
                    return ret;
                }, []);
                if (arr && arr.data) {
                    if (arr.data.length == arrList.length) {
                        arr.checked = true;
                    } else {
                        arr.checked = false;
                    }
                }
                //加入选择组
                var i = isInArray($scope.curItem.insItemSelected, n);
                if (!n.checked && i !== -1) {
                    $scope.curItem.insItemSelected.splice(i, 1);
                } else if (n.checked && i === -1) {
                    var pointItem = {
                        insItemId: n.insItemId,
                        name: n.name,
                        insItemTypeId: n.insItemTypeId,
                        insItemName: n.name,
                    };

                    $scope.curItem.insItemSelected.push(pointItem);
                   
                }
            };
            //选中本页所有巡查项
            $scope.checkInsAll = function (arr) {
                arr.checked = !arr.checked;
                if (arr.checked) {
                    $scope.pageModel.data.map(function (n) {
                        n.checked = true;

                        var i = isInArray($scope.curItem.insItemSelected, n);
                        if (i === -1) {
                            var pointItem = {
                                insItemId: n.insItemId,
                                name: n.name,
                                insItemTypeId: n.insItemTypeId,
                                insItemName: n.name,
                            };
                            $scope.curItem.insItemSelected.push(pointItem);
                        }
                        return n;
                    });
                } else {
                    $scope.pageModel.data.map(function (n) {
                        n.checked = false;
                        var i = isInArray($scope.curItem.insItemSelected, n);
                        if (i !== -1) {
                            $scope.curItem.insItemSelected.splice(i, 1);
                        }
                        return n;
                    });
                }
            };
            $scope.delSelectedItem = function (item) {
                var f = -1;
                $scope.curItem.insItemSelected.forEach(function (p, i) {
                    if (p.insItemId === item.insItemId) {
                        f = i;
                    }
                });
                if (f !== -1) {
                    $scope.curItem.insItemSelected.splice(f, 1);
                    $scope.find();
                }
            };

            $scope.save = function () {
                if ($scope.curItem.insItemSelected.length == 0) {
                    alert("请选择巡查项！");
                } else {
                    $uibModalInstance.close($scope.curItem);
                }
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss("cancel");
            };
        }
    );
})();
