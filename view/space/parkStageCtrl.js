/**
 * Created by Administrator on 2017/7/20.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('parkStageCtl', function ($scope, $rootScope, $http, $filter, $uibModal, $timeout, fac) {
        document.title = "OVU-项目空间管理";
        $scope.pageModel = {};
        $scope.isPropOrg = app.domain.orgType == 'propertyManagement' ? true : false;

        $scope.search = {};
        var park;
        app.modulePromiss.then(function () {
           
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    // debugger;
                    var parkDept = fac.getParkDept(null, deptId);
                    if (parkDept) {
                        $scope.search.parkId = parkDept.parkId;
                        $scope.search.parkName = parkDept.parkName;
                        $scope.loadHouseTree();
                        initDic();
                        if ($scope.search.parkId) {
                            getParkDetail($scope.search.parkId);
                        } else {
                            park = undefined;
                        }
                    } else {
                        $scope.search = {};
                    }
                } else {
                    $scope.search = {};
                }
               
            })
        });

        function getParkDetail(parkId) {
            $http.post("/ovu-base/system/park/getWithPath", { ids: $scope.search.parkId }, fac.postConfig).
                success(function (resp) {
                    if (resp.data && resp.data.length > 0) {
                        park = resp.data[0];
                        //初始化调整参数
                        var mapProperties = park.director ? park.director.split(","):[];
                        park.mapWidth = mapProperties[0]?Number(mapProperties[0]):2000;
                        park.mapHeight = mapProperties[1]?Number(mapProperties[1]):2000;
                        park.mapZoom = mapProperties[2]?Number(mapProperties[2]):2.5;
                    }
                })
        }

        function initDic() {
            $http.post("/ovu-base/system/dictionary/get", {}, fac.postConfig).success(function (resp) {
                $rootScope.houseTypeTree = resp.data.HOUSE_TYPE;
                $rootScope.dicData = resp.data;
                $scope.find(1);
            });
        }

        $scope.find = function (pageNo) {
            if (!fac.hasOnlyPark($scope.search)) {
                $scope.search = {};
                delete $rootScope.parkStagetreeData;
                delete $scope.parkStagetreeData;
                $scope.pageModel = {};
                return;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                houseSource:1 // 不查询拆合空间
            });
            $scope.search.spacePropertyType = '-2';
            fac.getPageResult("/ovu-base/system/parkHouse/listByGrid", $scope.search, function (data) {
                $scope.pageModel = data;
                $scope.pageModel.data.forEach(function (v) {
                    if (v.rmCat && v.rmType) {
                        var houseItem = $rootScope.dicData[v.rmCat].find(function (item) {
                            return item.id === v.rmType;
                        });
                        v.houseType = houseItem ? houseItem.dicItem : "";
                    } else {
                        v.houseType = ""
                    }


                })
                /*console.log($rootScope.houseTypeTree);*/
            });
        };

        //批量删除
        $scope.delAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.id);
                return ret
            }, []);
            if (ids.length == 0) {
                alert("请选择要删除的房屋！");
                return;
            }
            dodel(ids.join());
        };
        $scope.del = function (item) {
            //dodel(item.ID);
            dodel(item.id);
        };
        //批量设置房屋状态
        $scope.setStatusAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.id);
                return ret
            }, []).join();
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: 'space/modal.setStatus.html',
                controller: 'setStatusCtrl',
                resolve: {
                    statu: {
                        ids: ids
                    }
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });


        }
        function dodel(ids) {
            confirm("确认删除房屋吗?", function () {
                //$.post("/ovu-base/system/parkHouse/removes.do", { "ids": ids }, function(msg) {
                $.post("/ovu-base/system/parkHouse/removes", { "ids": ids }, function (msg) {
                    // if (msg == 'success') {
                    if (msg.code == 0) {
                        $scope.find();
                    } else {
                        alert(msg.msg);
                    }
                });
            });
        }


        $scope.editNode = function (node) {
            //if (node.floorId) {
            /*if (node.id) {
             var stage = $rootScope.treeData.find(function(n) {
             return n.stageId === node.stageId
             });
             $scope.editFloor(stage, node);
             } else {
             $scope.editStage(node);
             }*/
            if (node.level === 2) {
                var stage = $scope.parkStagetreeData.find(function (n) {
                    return n.id === node.parentId;
                });
                $scope.editFloor(stage, node);
            }
            else if (node.level === 3) {//编辑单元
                var build = $scope.getParentNode(node);
                if (build) {
                    $scope.editFloor(build, node);
                }
            } else if (node.level === 4) {
                var unit = $scope.getParentNode(node);
                if (unit) {
                    $scope.editFloor(unit, node);
                }
            }
            //level为1表示分期，为2表示楼栋
            else if (node.level === 1) {
                $scope.editStage(node);
            }
        }

        /**
         * 获取选中节点的父节点
         * 迭代实现版本
         * @author huangyuan
         */
        $scope.getParentNode = function (node) {
            var ret;
            var flag = false;
            //使用array模拟栈
            var stack = new Array();
            var nodes = $rootScope.parkStagetreeData;
            for (let i = 0; i < nodes.length; i++) {
                stack.push(nodes[i]);
            }
            while (stack.length > 0 && !flag) {
                //出栈
                var curNode = stack.pop();
                if (curNode.id === node.parentId) {
                    ret = curNode;
                    flag = true;
                    break;
                }
                if (!flag && curNode.nodes && curNode.nodes.length > 0) {
                    for (let j = 0; j < curNode.nodes.length; j++) {
                        stack.push(curNode.nodes[j]);
                    }
                }
            }
            return ret;
        }

        //在只知道节点id下，获取节点完整信息
        $rootScope.getNode = function (node) {
            var ret;
            var flag = false;
            //使用array模拟栈
            var stack = new Array();
            var nodes = $rootScope.parkStagetreeData;
            for (let i = 0; i < nodes.length; i++) {
                stack.push(nodes[i]);
            }
            while (stack.length > 0 && !flag) {
                //出栈
                var curNode = stack.pop();
                if (curNode.id === node.id) {
                    ret = curNode;
                    flag = true;
                    break;
                }
                if (!flag && curNode.nodes && curNode.nodes.length > 0) {
                    for (let j = 0; j < curNode.nodes.length; j++) {
                        stack.push(curNode.nodes[j]);
                    }
                }
            }
            return ret;
        }

        //时间戳转时间 xxxx-xx-xx xx:xx:xx
        $rootScope.timestampToTime = function (timestamp) {
            if (!timestamp) {
                return;
            }
            Y = date.getFullYear() + '-';
            M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            D = date.getDate() + ' ';
            h = date.getHours() + ':';
            m = date.getMinutes() + ':';
            s = date.getSeconds();
            return Y + M + D + h + m + s;
        }

        //对象深度克隆
        $rootScope.cloneObj = function (obj) {
            var newObj = obj.constructor === Array ? [] : {};
            if (typeof obj != 'object') {
                return obj;
            }
            if (window.JSON) {
                let str = JSON.stringify(obj);
                newObj = JSON.parse(str);
            } else {
                for (let i in obj) {
                    newObj[i] = typeof obj[i] == 'object' ? $rootScope.cloneObj(obj[i]) : obj[i];
                }
            }
            return newObj;
        };

        $scope.delNode = function (node) {
            //if (node.floorId) {
            if (node.level == 2) {
                //$http.get("/ovu-base/system/parkBuild/hasHouses?id=" + node.id).success(function (resp) {
                $http.get("/ovu-base/system/parkBuild/hasUnits?id=" + node.id).success(function (resp) {
                    if (resp.code == 0) {
                        if (resp.data) {
                            //alert('此楼栋已存在房屋，不能删除！');
                            alert('此楼栋已存在单元，不能删除！');
                            return;
                        }
                        else {
                            msg(resp.msg);
                            $scope.find();
                        }

                    }
                    confirm("是否确定删除 " + node.text, function () {
                        //$.post("/ovu-base/system/parkFloor/removes.do", { ids: node.floorId }, function(ret) {
                        $.post("/ovu-base/system/parkBuild/removes", { ids: node.id }, function (ret) {
                            //if (ret == "success") {
                            if (ret.code == 0) {
                                if ($scope.curNode == node) {
                                    delete $scope.curNode;
                                }
                                var stage = $scope.parkStagetreeData.find(function (n) {
                                    //return n.stageId == node.stageId
                                    return n.id == node.parentId;
                                });
                                if (stage) {
                                    stage.nodes.splice(stage.nodes.indexOf(node), 1)
                                }
                                msg(ret.msg);
                                $scope.$apply();
                            } else {
                                //alert('删除失败！');
                                alert(ret.msg);
                            }
                        })
                    });
                })
            }
            else if (node.level == 3) {
                $scope.delUnit(node);
            } else if (node.level == 4) {
                $scope.delTrueFloor(node);
            }
            else {
                if (node.nodes && node.nodes.length) {
                    alert("此分期已存在楼栋，不能删除！");
                    return;
                }
                confirm("是否确定删除 " + node.text, function () {
                  
                    $.post("/ovu-base/system/parkStage/removes", { ids: node.id }, function (ret) {
                        if (ret.code == 0) {
                            if ($scope.curNode == node) {
                                delete $scope.curNode;
                            }
                            $scope.parkStagetreeData.splice($scope.parkStagetreeData.indexOf(node), 1);
                            $scope.$apply();
                            msg(ret.msg);
                        } else {
                            alert(ret.msg);
                        }
                    })
                })
            }
        }

        //删除单元
        $scope.delUnit = function (node) {
            if (node && node.nodes && node.nodes.length > 0) {
                alert('此单元已存在楼层，不能删除！');
                return;
            }
            confirm("是否确定删除 " + node.text, function () {
                //$.post("/ovu-base/system/parkFloor/removes.do", { ids: node.floorId }, function(ret) {
                $.post("/ovu-base/system/parkUnit/removes", { ids: node.id }, function (ret) {
                    //if (ret == "success") {
                    if (ret.code == 0) {
                        if ($scope.curNode == node) {
                            delete $scope.curNode;
                        }
                        var build = $scope.getParentNode(node)
                        if (build) {
                            build.nodes.splice(build.nodes.indexOf(node), 1)
                        }
                        msg(ret.msg);
                        $scope.$apply();
                    } else {
                        //alert('删除失败！');
                        alert(ret.msg);
                    }
                })
            });
        }

        //删除楼层
        $scope.delTrueFloor = function (node) {
            $http.get("/ovu-base/system/parkFloor/hasHouses?id=" + node.id).success(function (resp) {
                if (resp.code == 0) {
                    if (resp.data) {
                        alert('此楼层已存在房屋，不能删除！');
                        return;
                    }
                    else {
                        msg(resp.msg);
                        $scope.find();
                    }

                }
                confirm("是否确定删除 " + node.text, function () {
                    //$.post("/ovu-base/system/parkFloor/removes.do", { ids: node.floorId }, function(ret) {
                    $.post("/ovu-base/system/parkFloor/removes", { ids: node.id }, function (ret) {
                        //if (ret == "success") {
                        if (ret.code == 0) {
                            if ($scope.curNode == node) {
                                delete $scope.curNode;
                            }
                            var unit = $scope.getParentNode(node)
                            if (unit) {
                                unit.nodes.splice(unit.nodes.indexOf(node), 1)
                            }
                            msg(ret.msg);
                            $scope.$apply();
                        } else {
                            //alert('删除失败！');
                            alert(ret.msg);
                        }
                    })
                });
            })
        }

       

        //选中节点
        $scope.selectNode = function (search, node) {
            
            if (node.state.selected) {
                $scope.curNode = node;
                //              if(node.nodes){
                if (node.level === 1) {
                    $scope.search.stageId = node.id;

                    delete $scope.search.buildId;
                    delete $scope.search.unitId;
                    delete $scope.search.floorId;
                }
                else if (node.level === 2) {
                    $scope.search.stageId = node.parentId;
                    $scope.search.buildId = node.id;

                    delete $scope.search.unitId;
                    delete $scope.search.floorId;
                }
                else if (node.level === 3) {
                    $scope.search.buildId = node.parentId;
                    $scope.search.unitId = node.id;
                    var build = $rootScope.getNode({ id: node.parentId });
                    $scope.search.stageId = build.parentId;

                    delete $scope.search.floorId;
                }
                else {
                    $scope.search.unitId = node.parentId;
                    $scope.search.floorId = node.id;
                    var unit = $rootScope.getNode({ id: node.parentId });
                    $scope.search.buildId = unit.parentId;
                    var build = $rootScope.getNode({ id: unit.parentId });
                    $scope.search.stageId = build.parentId;
                }
            } else {
                delete $scope.curNode;
                delete $scope.search.stageId;
                delete $scope.search.buildId;
                //delete $scope.unitList;
                //delete $scope.groundList;
                delete $scope.search.unitId;
                delete $scope.search.floorId;
            }
            $scope.find(1);
        }

        $scope.editStage = $scope.addTopNode = function (stage) {
            if (!fac.hasOnlyPark($scope.search)) {
                return;
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: 'space/modal.editStage.html',
                controller: 'editStageCtrl',
                resolve: {
                    stage: function () {
                        if (stage) {
                            // return angular.extend({}, stage);
                            return angular.extend({ parkId: $scope.search.parkId,parkStagetreeData:$scope.parkStagetreeData}, stage);
                        } else {
                            return { parkId: $scope.search.parkId,parkStagetreeData:$scope.parkStagetreeData };
                        }
                    }
                }
            });
            modal.result.then(function (data) {
                // $scope.loadHouseTree();
                if (stage) {
                    
                    angular.extend(stage, data)
                } else {
                    
                    if (!$scope.parkStagetreeData) {
                        $scope.parkStagetreeData = [];
                    }
                    data.data=data
                    $scope.parkStagetreeData.push(data);
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });


        }

        // 实例化点标记
        var markers = [];
        var imap;
        var ovu2DMap;
        var map2dDraw;
        $rootScope.showCusmap = function (item, floor) {
            var mapConfig = { resizeEnable: true, zoom: 15 };
            //如果传入有BL_POSITION，设为地图默认地点
            if (item.blPosition) {
                mapConfig.center = item.blPosition.split(",");
            } else if (park.position && park.position[0]) {
                mapConfig.center = park.position;
            }
            imap = new AMap.Map('container', mapConfig);
            //传入floor 进行初始化打点标记
            addMarker(floor);

            //-------------------------------------------------------------------------------
            //-------------------------------------------------------------------------------
            //画出图层
            //地图需要参数
            var topRight = park.trPosition ? park.trPosition.split(",") : undefined;
            var bomLeft = park.blPosition ? park.blPosition.split(",") : undefined;
            var points;
            if (topRight && bomLeft) {
                var centerLng = (Number(topRight[0]) + Number(bomLeft[0])) / 2;
                var centerLat = (Number(topRight[1]) + Number(bomLeft[1])) / 2;
                points = [[Number(bomLeft[0]), Number(bomLeft[1])],
                [Number(topRight[0]), Number(topRight[1])]];
            }
            var width = park.mapWidth ? park.mapWidth : 2000;
            var height = park.mapHeight ? park.mapHeight : 1000;
            var zoom = park.mapZoom ? park.mapZoom : 2.5;
            /* $rootScope.processImgUrl(copy.parkIcon, 'origin'),*/
            var mapUrl = park.airscapePath;
            if (mapUrl) {
                if (mapUrl.indexOf("http") == -1) {
                    mapUrl = "/ovu-base" + mapUrl;
                }
                ovu2DMap = new OvuMap();
                map2dDraw = new Draw2DMap(width, height, zoom, undefined);
                ovu2DMap.loadTheme();
                ovu2DMap.loadJson(mapUrl);
                var draw = function (argument) {
                    AMap.Util.requestAnimFrame(draw);
                    if (ovu2DMap.mapJson === undefined) {
                        return;
                    }
                    var _curFloor = ovu2DMap.mapJson;
                    //地图绘制
                    map2dDraw.draw(_curFloor, imap)
                    //图层刷新
                    imap.CanvasLayer.reFresh();
                }

                imap.CanvasLayer = new AMap.CanvasLayer({
                    canvas: map2dDraw.canvas,
                    bounds: new AMap.Bounds(
                        new AMap.LngLat(points[0][0], points[0][1]),
                        new AMap.LngLat(points[1][0], points[1][1])
                    ),
                    zooms: [3, 18],
                });
                //把图层 存放到 地图中
                imap.CanvasLayer.setMap(imap);
                //绘图循环的核心方法
                draw(23);
            }
            //-------------------------------------------------------------------------------
            //-------------------------------------------------------------------------------

            //为地图注册click事件获取鼠标点击出的经纬度坐标
            var clickEventListener = imap.on('click', function (e) {
                // console.log(e.lnglat);
                // if(item.map_active){
                floor.MAP_POSITION = e.lnglat.lng + "," + e.lnglat.lat;
                addMarker(floor);
                $scope.$apply();
                // }
                //document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
            });

            function addMarker(item) {
                imap.remove(markers);
                if (item.MAP_POSITION) {
                    item.mapLg = item.MAP_POSITION.split(',')[0];
                    item.mapLa = item.MAP_POSITION.split(',')[1];
                    var marker = new AMap.Marker({
                        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                        position: item.MAP_POSITION.split(",")
                    });
                    marker.setMap(imap);
                    markers.push(marker);
                }
                //--------------------------------------------------------------------------------------
                //--------------------------------------------------------------------------------------
                //描项目点
                if (park.trPosition) {
                    var marker = new AMap.Marker({
                        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
                        position: park.trPosition.split(",")
                    });
                    marker.setMap(imap);
                }
                if (park.blPosition) {
                    var marker = new AMap.Marker({
                        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
                        position: park.blPosition.split(",")
                    });
                    marker.setMap(imap);
                }
                //--------------------------------------------------------------------------------------
                //--------------------------------------------------------------------------------------
            }
        };

        //添加、编辑楼栋
        /*
         * 2017/07/27
         * 包括对楼层，单元的新增都是再此方法处理；
         * 后期期望将方法名改为EditNode();
         */
        $scope.editFloor = $scope.addSon = function (parent, floor) {
            // debugger;
        	/*
			 * 2018/09/10
			 * 新增逻辑，支持对单元以及楼层的维护
			 * 对于新增单元以及楼层做单独的处理
			 * @author huanyuan begin
			 */

            if (parent && parent.level === 2) {
                console.log("新增单元");
                $scope.addSonUnit(parent, floor);
                return;
            } else if (parent && parent.level === 3) {
                console.log("新增楼层");
                $scope.addSonTrueFloor(parent, floor);
                return;
            }
			/*
			 * @author huanyuan end
			 */

             if(!parent){
                parent=floor.parent
             }
            //var data = { stageId: parent.stageId };
            var data = { stageId: parent.id };
            if (floor) {
                data = angular.extend({ parkId: $scope.search.parkId }, floor);
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'max',
                templateUrl: 'space/modal.editFloor.html',
                controller: 'editFloorCtrl',
                resolve: {
                    floor: function () {
                        return data;
                    },
                    stage: parent
                }
            });
            modal.result.then(function (data) {
                // $scope.loadHouseTree();
                if (floor) {
                    angular.extend(floor, data);
                } else {
                    parent.nodes = parent.nodes || [];
                    data.data=data
                    parent.nodes.push(data);
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });

            modal.rendered.then(function () {
                // console.log("Modal rendered");

                // modal框出来自动定位到项目地址位置

                $timeout(function () {
                    //把data数据传到地图中
                    $scope.showCusmap(park, data);
                }, 500);

                // wjlong BEGIN添加地图搜索功能
                AMap.plugin(['AMap.Autocomplete'], function () {
                    // 如果是编辑界面 获取已选城市 搜索范围锁定在该城市  选中了武汉市 搜索建设银行 优先显示武汉的建设银行
                    var city = '';
                    // if (arr && arr[1]) {
                    //     // var arr = copy.CITY.split(',');
                    //     var arr = [];
                    //     city = arr[1];
                    // }
                    var autoOptions = {
                        city: city, //城市，默认全国
                        input: "map-keyword" //使用联想输入的input的id
                    };
                    var autocomplete = new AMap.Autocomplete(autoOptions);

                    // 搜索点 每次打点之前 先把以前搜索出来的点清除了
                    var searchMarkers = [];

                    function addSearchMarker(map, position, title) {
                        map.remove(searchMarkers);
                        var marker = new AMap.Marker({
                            position: position,
                            title: title,
                            map: map,
                            icon: '/res/img/mark_bs/mark_bs5.png'
                        });
                        searchMarkers.push(marker);
                    }
                    function autoSelect(e) {
                        var location = e.poi.location;
                        var adcode = e.poi.adcode;
                        // setCity 有一些点不能正常设置  搜索王元(公交站) adcode 320812 不能正常设置
                        // copy.map.setCity(e.poi.adcode);
                        // console.log(e.poi);
                        if (location) {
                            // copy.map.setCenter(location);
                            imap.setCenter(location);
                            var position = [location.lng, location.lat];
                            var title = e.poi.name;
                            addSearchMarker(imap, position, title);
                        } else if (e.poi.adcode) {
                            imap.setCity(adcode);
                            console.log('该poi点没有具体的经纬度坐标,不能添加marker点,搜索的极有可能是一个市或者更大的范围');
                        }

                    }
                    AMap.event.addListener(autocomplete, "select", autoSelect);
                    AMap.event.addListener(autocomplete, "choose", function (e) {
                        $('#map-keyword').one('keydown', function (event) {
                            if (event.keyCode == 13) {
                                $('.amap-sug-result').css({
                                    visibility: 'hidden',
                                    display: 'none'
                                });
                                autoSelect(e);
                            }
                        })
                    });
                    // 如果选择了行政区，就设置所在城市
                    $rootScope.$on('选择了行政区', function (e, data) {
                        var arr = data.split(',');
                        if (arr[1]) {
                            autocomplete.setCity(arr[1]);
                        }
                    });
                });
                // wjlong END


            });
        };

		/*
		 * 新增单元
		 */
        $scope.addSonUnit = function (parent, unit) {
            var data = { buildId: parent.id };
            if (unit) {
                data = angular.extend({}, unit);
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: 'space/modal.editUnit.html',
                controller: 'editUnitCtrl',
                resolve: {
                    unit: function () {
                        return data;
                    },
                    build: parent
                }
            });
            modal.result.then(function (data) {
                // $scope.loadHouseTree();
                if (unit) {
                    angular.extend(unit, data);
                } else {
                    parent.nodes = parent.nodes || [];
                    
                    data.data=data
                
                
                    parent.nodes.push(data);
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

		/**
		 * 新增楼层
		 */
        $scope.addSonTrueFloor = function (parent, floor) {
            var data = { unitId: parent.id };
            if (floor) {
                data = angular.extend({}, floor);
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: 'space/modal.editTrueFloor.html',
                controller: 'editTrueFloorCtrl',
                resolve: {
                    floor: function () {
                        return data;
                    },
                    unit: parent
                }
            });
            modal.result.then(function (data) {
               
                if (floor) {
                    angular.extend(floor, data);
                   
                } else {
                    parent.nodes = parent.nodes || [];
                    data.data=data
                    parent.nodes.push(data);
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //新增楼栋
        $scope.showAddModal = function () {
            if (!fac.hasOnlyPark($scope.search)) {
                return;
            }
          
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: 'space/modal.editHouse.html',
                controller: 'editHouseCtrl',
                resolve: { house: { parkId: $scope.search.parkId,parkStagetreeData:$scope.parkStagetreeData } }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.showEditModal = function (house) {
            if (!fac.hasOnlyPark($scope.search)) {
                return;
            }
            let rentsaleData = [];
            $http.get("/ovu-base/system/parkHouse/getSpacePropertyType").then(function (response) {
               
                if (response.status == 200) {
                    rentsaleData = response.data;
                    house = house || angular.extend({}, $scope.search);
                    //if (("ID" in house) && house.ID !== "") {
                    if (("id" in house) && house.id !== "") {
                        //$http.post('/ovu-base/system/parkHouse/getHouseUnionDetailInfo.do', { "houseId": house.ID }, fac.postConfig).success(function(resp) {
                        $http.post('/ovu-base/system/parkHouse/getHouseUnionDetailInfo', { "id": house.id }, fac.postConfig).success(function (resp) {
                            if (resp.code == 0) {
                                house.isDecoration = resp.data.isDecoration + "";
                                house.houseTheme = resp.data.houseTheme + "";
                                house.rmStatus = resp.data.rmStatus + "";
                                var copy = angular.extend({ parkId: $scope.search.parkId, rentsaleData: rentsaleData,parkStagetreeData:$scope.parkStagetreeData }, house);
                                var modal = $uibModal.open({
                                    animation: false,
                                    size: 'lg',
                                    templateUrl: 'space/modal.editHouse.html',
                                    controller: 'editHouseCtrl',
                                    resolve: { house: copy }
                                });
                                modal.result.then(function () {
                                    $scope.find();
                                }, function () {
                                    console.info('Modal dismissed at: ' + new Date());
                                });
                            } else {
                                alert(resp.msg);
                            }
                        });
                    }
                }
            })

        };

        $scope.loadHouseTree = function () {

           
            fac.getParkStageTree({
                parkId: $scope.search.parkId,
                //level:2
                //新增对单元以及楼层管理，展示到第四层级
                level: 4
            },$scope)
        };

    });

    app.controller('editStageCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, stage) {
        $scope.item = {};
        $scope.parkStagetreeData=stage.parkStagetreeData
        var oldStageHelpNo = '';

        $http.get("/ovu-base/system/park/get?id=" + stage.parkId).success(function (park) {

            /*$scope.item.parkName = park.parkName;
             $scope.item.parkId = park.id;
             $scope.item.parkNo = park.parkNo;
             $scope.item.yeTai = park.yeTai;*/
            $scope.item.parkName = park.data.parkName;
            $scope.item.parkNo = park.data.parkNo;
            $scope.item.yeTai = park.data.yeTai;
            //if (stage.stageId) {
            if (stage.id) {
                //$http.get("/ovu-base/system/parkStage/get?id=" + stage.stageId).success(function(stage) {
                $http.get("/ovu-base/system/parkStage/get?id=" + stage.id).success(function (stage) {
                    angular.extend($scope.item, stage);

                    oldStageHelpNo = $scope.item.stageHelpNo =
                        stage.stageNo.substring(stage.stageNo.length - 2, stage.stageNo.length);
                })
            } else {
                //设置分期编码
                var index = $scope.parkStagetreeData.length + 1 + "";
                while (index.length < 2) {
                    index = "0" + index;
                }
                //$scope.item.STAGE_NO = $scope.item.PARK_NO + $scope.item.YE_TAI + index;
                $scope.item.stageNo = $scope.item.parkNo + $scope.item.yeTai + index;

                oldStageHelpNo = $scope.item.stageHelpNo = index;
            }

        })
        //辅助码更新
        $scope.stageHelpNoChange = function () {
            if (!$scope.item.stageHelpNo) {
                return;
            }
            if (stage.id && oldStageHelpNo != $scope.item.stageHelpNo) {
                msg("分期编码改变，该分期下面的所有的空间数据的分期编码部分都将同步修改，请谨慎操作！");
            }
            $scope.item.stageNo = $scope.item.parkNo + $scope.item.yeTai + $scope.item.stageHelpNo;
        }

        $scope.save = function (form, item) {
            item.parkId = stage.parkId;
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("/ovu-base/system/parkStage/save", item, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code == 0) {
                    var ret = {
                        parkId: data.data.parkId,
                        id: data.data.id,
                        stageNo: data.data.stageNo,
                        stageName: data.data.stageName,
                        text: data.data.stageName,
                        level: 1
                    };
                    $uibModalInstance.close(ret);
                    msg(data.msg);
                } else {
                    alert(data.msg);
                    $scope.item.stageHelpNo =oldStageHelpNo
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('editFloorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, floor, stage) {
        // debugger;
        $scope.item = floor;
        
        $scope.auths = [];
        $scope.orgTree = [];
        var oldFloor = {};

        //获取运营公司
        $rootScope.searchOrg(null, 'hotel,art').then(function (data) {
            $scope.auths = data;
        })

        $scope.buildSaleState = [{ "text": "在建", "value": 0 }, { "text": "热卖", "value": 1 }, { "text": "售罄", "value": 2 }];
        $scope.structure = [{ "text": "框剪", "value": 0 }];
      

        // 获取产业功能区下拉列表
        $scope.industryDomainList = function () {
            $http.get('/ovu-base/system/parkBuild/queryIndustrialFunctional?parkId=' + $scope.item.parkId).then(function (response) {
            
                if (response.data.code == 0) {
                    $scope.industryDomain = response.data.data;
                }
            })
        }
        $scope.industryDomainList();
        var oldBuildHelpNo = '';
        if (stage) {
           
            $scope.item.stageNo = stage.data.stageNo;
            
            $scope.item.text = stage.text;
        }
     
        if (floor.level == 2) {
            $http.get("/ovu-base/system/parkBuild/get?id=" + floor.id).success(function (resp) {
                if (resp.designImage) {
                    resp.designImageArr = resp.designImage.split(',');
                }
                if (resp.realImage) {
                    resp.realImageArr = resp.realImage.split(',');
                }
                if (resp.planImage) {
                    resp.planImageArr = resp.planImage.split(',');
                }
                if (resp.facadeImage) {
                    resp.facadeImageArr = resp.facadeImage.split(',');
                }
                if (resp.profileImage) {
                    resp.profileImageArr = resp.profileImage.split(',');
                }
                if (!(resp.mapLg && resp.mapLa)) {
                    $scope.item.MAP_POSITION = '';
                } else {
                    $scope.item.MAP_POSITION = resp.mapLg + ',' + resp.mapLa;
                }
                angular.extend($scope.item, resp);
                angular.extend(oldFloor, resp);

                oldBuildHelpNo = $scope.item.buildHelpNo =
                    $scope.item.buildNo.substring($scope.item.buildNo.length - 3, $scope.item.buildNo.length);
            })
        } else {
            //设置楼栋编码
            var index = "" + (stage.nodes ? stage.nodes.length + 1 : 1);
            while (index.length < 3) {
                index = "0" + index;
            }
            //$scope.item.FLOOR_NO = $scope.item.STAGE_NO + index;
            $scope.item.buildNo = $scope.item.stageNo + index;

            oldBuildHelpNo = $scope.item.buildHelpNo = index;
        }
        //辅助码更新
        $scope.buildHelpNoChange = function () {
            if (!$scope.item.buildHelpNo) {
                return;
            }
            if (floor.id && oldBuildHelpNo != $scope.item.buildHelpNo) {
                msg("楼栋编码改变，该楼栋下面的所有的空间数据的楼栋编码部分都将同步修改，请谨慎操作！");
            }
            $scope.item.buildNo = $scope.item.stageNo + $scope.item.buildHelpNo;
        }

        //更改运营公司
        $scope.changeOperatorCompany = function (authOrgId) {
            if (authOrgId) {
                getOrgTree(authOrgId);
            } else {
                $scope.item.authOrgId = null;
                $scope.item.authOrgName = null;
                $scope.item.authOrgDeptId = null;
                $scope.item.authOrgDeptName = null;
                $scope.orgTree = [];
            }
        }
        function getOrgTree(domainId) {
            $rootScope.searchOrgDeptTree(domainId).then(function (data) {
                $scope.orgTree = data;
            });
        }

        $scope.addPositionPic = function (item) {
            fac.upload({ url: "/ovu-base/uploadFile" }, function (resp) {
                if (resp.success) {
                    var respData = resp.data;
                    item.positionImg = respData.url;
                    $scope.item = item;
                    $scope.$apply();
                } else {
                    alert(resp.error);
                }
            });
        }


        /**
         * 上传图片
         * */
        $scope.uploadPic = function (item, param) {
            var flag = 0;
           

            fac.upload({ url: "/ovu-base/uploadFile" }, function (resp) {
                if (resp.success) {
                    var respData = resp.data;
                   
                    var getImageArr = function (imageArr) {
                        
                        imageArr == undefined ? imageArr = [] : imageArr;
                        if (imageArr.length < 3) {
                            imageArr.push(respData.url);
                        }
                        else {
                            alert('图片最大限制3张');
                        }
                        return imageArr;
                    }
                    if (param == 0) {
                        $scope.item.designImageArr = getImageArr(item.designImageArr);
                       
                    }
                    if (param == 1) {
                        $scope.item.realImageArr = getImageArr(item.realImageArr);
                    }
                    if (param == 2) {
                        $scope.item.planImageArr = getImageArr(item.planImageArr);
                    }
                    if (param == 3) {
                        $scope.item.facadeImageArr = getImageArr(item.facadeImageArr);
                    }
                    if (param == 4) {
                        $scope.item.profileImageArr = getImageArr(item.profileImageArr);
                    }
                    $scope.$apply();
                } else {
                    alert(resp.error);
                }
            })
        }
        /**
         * 删除图片
         **/
        $scope.delPhoto = function (photos, p) {
           
            photos.splice(photos.indexOf(p), 1);
            
        }

        $scope.save = function (form, item) {
            
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (item.designImageArr) {
                item.designImage = item.designImageArr.join(',');
            }
            if (item.realImageArr) {
                item.realImage = item.realImageArr.join(',');
            }
            if (item.planImageArr) {
                item.planImage = item.planImageArr.join(',');
            }
            if (item.facadeImageArr) {
                item.facadeImage = item.facadeImageArr.join(',');
            }
            if (item.profileImageArr) {
                item.profileImage = item.profileImageArr.join(',');
            }

            //授权重置
            if (oldFloor && oldFloor.authOrgDeptId && !item.authOrgDeptId) {
                item.resetAuth = 1;
            } else {
                delete item.resetAuth;
            }
            $http.post("/ovu-base/system/parkBuild/save", item, fac.postConfig).success(function (data, status, headers, config) {
                //if (data.success) {
                if (data.code == 0) {
                    var ret = {
                        stageId: data.data.stageId,
                        id: data.data.id,
                        buildNo: data.data.buildNo,
                        buildName: data.data.buildName,
                        unitNum: data.data.unitNum,
                        ugroundNum: data.data.ugroundNum,
                        cgroundNum: data.data.cgroundNum,
                        ogroundNum: data.data.ogroundNum,
                        text: data.data.buildName,
                        level: 2,
                        parent:stage,
                        parentId:stage.id
                    };
                    $uibModalInstance.close(ret);
                    msg("保存成功!");
                } else {
                    alert(data.msg);
                    $scope.item.buildHelpNo=oldBuildHelpNo
                   
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

    //编辑单元控制器
    app.controller('editUnitCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, unit, build) {
        $scope.item = unit;

        var oldUnitNo = '';
        if (build) {
            /*$scope.item.STAGE_NAME = stage.stageName;
             $scope.item.STAGE_ID = stage.stageId;
             $scope.item.STAGE_NO = stage.stageNo;*/
            $scope.item.buildNo = build.data.buildNo;
            //end
            $scope.item.text = build.text;
        }
        if (unit.id) {//编辑
         
            $scope.saveUnit = unit.data;
            $scope.saveUnit.createTime = $rootScope.timestampToTime(unit.data.createTmie);
            $scope.saveUnit.updateTime = undefined;
            oldUnitNo = $scope.saveUnit.unitNo;
        } else {//新增
            $scope.saveUnit = {};
            $scope.saveUnit.buildId = $scope.item.buildId;
            $scope.saveUnit.unitNo = '';
            $scope.saveUnit.unitName = '';
            $scope.saveUnit.unitCode = $scope.item.buildNo;
            $scope.saveUnit.floorNum;
        }
        //当unitNo改变时，同步改变unitCode的值
        $scope.unitNoChange = function () {
            if (!$scope.saveUnit.unitNo) {
                return;
            }
            if (unit.id && oldUnitNo != $scope.saveUnit.unitNo) {
                msg("单元编码改变，该单元下面的所有的空间数据的单元编码部分都将同步修改，请谨慎操作！");
            }
            $scope.saveUnit.unitCode = $scope.item.buildNo + $scope.saveUnit.unitNo;
        }

        $scope.save = function (form, saveUnit) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("/ovu-base/system/parkUnit/save", saveUnit, fac.postConfig).success(function (data, status, headers, config) {
                //if (data.success) {
                if (data.code == 0) {
                    var ret = {
                        buildId: data.data.buildId,
                        id: data.data.id,
                        unitNo: data.data.unitNo,
                        unitName: data.data.unitName,
                        floorNum: data.data.floorNum,
                        text: data.data.unitName,
                        unitCode: data.data.unitCode,
                        isLeaf: false,
                        level:3,
                        parentId:build.id
                    };
                    $uibModalInstance.close(ret);
                    msg("保存成功!");
                } else if (data.msg) {
                    alert(data.msg);
                    $scope.saveUnit.unitNo=oldUnitNo
                } else {
                    alert(data.error);
                    $scope.saveUnit.unitNo=oldUnitNo
                }
            })
        }

        $scope.cancelUnit = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

    /**
     * 编辑楼层控制器
     */
    app.controller('editTrueFloorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, $timeout, floor, unit) {
        $scope.item = floor;
        var oldImg = "";
        var oldFloorNo = '';
        if (unit) {
            $scope.item.unitCode = unit.data.unitCode;
            //end
            $scope.item.text = unit.text;
        }
        if (floor.id) {
            $scope.saveFloor = floor.data
            $scope.saveFloor.createTime = $rootScope.timestampToTime(floor.data.createTmie);
            $scope.saveFloor.updateTime = undefined;

            oldImg = $scope.saveFloor.img;

            oldFloorNo = $scope.saveFloor.floorNo;
        } else {
            $scope.saveFloor = {};
            $scope.saveFloor.unitId = $scope.item.unitId;
            $scope.saveFloor.floorNo = '';
            $scope.saveFloor.floorName = '';
            $scope.saveFloor.floorCode = $scope.item.unitCode;
            /*	        $scope.saveFloor.isInterlayer;
                        $scope.saveFloor.area ;
                        $scope.saveFloor.layerHeight ;
                        $scope.saveFloor.houseNum ;
                        $scope.saveFloor.businessArea ;*/
        }
        //是否夹层选择
        $scope.isInterlayerOps = [{ value: 1, text: '是' }, { value: 0, text: '否' }]
        //当unitNo改变时，同步改变unitCode的值
        $scope.floorNoChange = function () {
            if (!$scope.saveFloor.floorNo) {
                return;
            }
            if (floor.id && oldFloorNo != $scope.saveFloor.floorNo) {
                msg("楼层编码改变，该楼栋下面的所有的空间数据的楼层编码部分都将同步修改，请谨慎操作！");
            }
            $scope.saveFloor.floorCode = $scope.item.unitCode + $scope.saveFloor.floorNo;
        }

        $scope.save = function (form, saveFloor) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("/ovu-base/system/parkFloor/save", saveFloor, fac.postConfig).success(function (data, status, headers, config) {
              
                if (data.code == 0) {
                    $scope.parseFloorImg(data.data.img);
                    
                    var copy = angular.extend({parentId:unit.id,
                        level:4, text: data.data.floorName,isLeaf: true},data.data);
                    $uibModalInstance.close(copy);
                    msg("保存成功!");
                } else if (data.msg) {
                    alert(data.msg);
                    
                    $scope.saveFloor.floorNo=oldFloorNo
                } else {
                    $scope.saveFloor.floorNo=oldFloorNo
                    alert(data.error);
                }
            })
        }

        $scope.cancelFloor = function () {
            $uibModalInstance.dismiss('cancel');
        };

        //上传文件
        $scope.refresh = true;
        $scope.uploadFile = function () {
            $rootScope.addLimitFileCallBack($scope.saveFloor, "img", "imgName", [".geojson", ".json"], $scope.refreshFun)
        }
        $scope.refreshFun = function () {
            $scope.refresh = false;
            $timeout(function () {
                $scope.refresh = true;
            })
        }
        $scope.deleteFile = function () {
            $scope.saveFloor.img = "";
            $scope.saveFloor.imgName = "";
        }

        $scope.parseFloorImg = function (img) {
            if (!img ||
                oldImg == $scope.saveFloor.img ||
                $scope.saveFloor.img.indexOf("http") != -1
            ) {
                return;
            }
            $http.post("/ovu-pcos/pcos/equipment/parse/parseFloor", { qiniuUrl: img }, fac.postConfig).success(function (data) {
                if (data.code == 0) {
                    return;
                } else {
                    alert(data.msg);
                }
            })
        }
    });

    app.controller('editHouseCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $timeout, fac, house) {
        let editStatus = false;
        $scope.parkStagetreeData=house.parkStagetreeData
        $scope.planPurposeList=[]
        $scope.planPurposeListCopy =[]
        $scope.spaceRentListCopy=[]
        $scope.spaceRentList=[]
        $scope.item ={}
        if (house.id) {
            if (house.rentsaleData) {
                $scope.spaceRentList = house.rentsaleData;
                $scope.spaceRentListCopy = angular.copy($scope.spaceRentList);
            }
            
            $scope.item = house;
           
            $scope.item.housePlanPurposes += '';
            $scope.item.spacePropertyType += '';
            $scope.spaceRentListCopy.length && $scope.spaceRentListCopy.forEach((v, i) => {
                if (v.code == $scope.item.rentsaleCharacter) {
                    $scope.planPurposeList = v.nodes;
                }
            })
            $scope.planPurposeListCopy = angular.copy($scope.planPurposeList);
            $scope.planPurposeListCopy.length && $scope.planPurposeListCopy.forEach((v, i) => {
                if (v.code == $scope.item.housePlanPurposes) {
                    $scope.propertyClassifyList = v.nodes;
                }
            })
            editStatus = true;
            
            $scope.treeTypeList = $rootScope.dicData[house.rmCat];
            
        }
       

        /**
       *  单元以及楼层改变
       * huangyuan begin
       */
        $scope.unitChange = function (item) {
            if (item.UNIT && item.UNIT.data.unitNo) {
                item.unitNo = item.UNIT.data.unitNo;
            }
        }
        $scope.trueFloorChange = function (item) {
            if (item.TRUEFLOOR && item.TRUEFLOOR.data.floorNo) {
                item.groundNo = item.TRUEFLOOR.data.floorNo;
                item.floorId = item.TRUEFLOOR.id;
            }
        }
        //huangyuan end

        fac.loadSelect($scope, "HOUSE_THEME");
        fac.loadSelect($scope, "HOUSE_IS_DECORATION");
        fac.loadSelect($scope, "HOUSE_STATUS");

        //$scope.$watchGroup(["item.unit_no", "item.ground_no", "item.HOUSE_CODE"], function() {
        $scope.$watchGroup(["item.unitNo", "item.groundNo", "item.houseCode"], function () {
            if (house.FLOOR) {
                house.houseNo = house.FLOOR.data.buildNo + (house.unitNo ? house.unitNo : '**') + (house.groundNo ? house.groundNo : '**') + (house.houseCode ? house.houseCode : '***');
            } else {
                house.houseNo = "";
            }
        });
        $scope.selectHouseType = function (item) {
            $scope.treeTypeList = $rootScope.dicData[item.rmCat];

        }
        //楼栋改变
        $scope.geneUnit = function (item) {
            $scope.unitList = [];
            $scope.groundList = [];
            if (item.FLOOR) {
                var node = item.FLOOR;
                if (node.unitNum != undefined) {
                    var idx = node.unitNum > 0 ? 1 : 0;
                    for (var i = idx; i <= node.unitNum; i++) {
                        $scope.unitList.push(i);
                    }
                }
                if (node.ugroundNum) {
                    for (var i = 1; i <= node.ugroundNum; i++) {
                        $scope.groundList.push(i);
                    }
                }
                if (node.ogroundNum) {
                    for (var i = 1; i <= node.ogroundNum; i++) {
                        $scope.groundList.push(i * -1);
                    }
                }
            }
        }
        if (!editStatus) {
            $scope.spaceRentList = [];
            $scope.spaceRentListCopy = [];
            $scope.planPurposeList = [];
            $scope.planPurposeListCopy = [];
            $scope.propertyClassifyList = [];
        }
        $scope.initSpace = function () {
            $http.get("/ovu-base/system/parkHouse/getSpacePropertyType").then(function (response) {
              
                if (response.status == 200) {
                    $scope.spaceRentList = response.data;
                    $scope.spaceRentListCopy = angular.copy($scope.spaceRentList);
                    if( $scope.item.rentsaleCharacter){
                        $scope.item.rentsaleCharacter=$scope.item.rentsaleCharacter+'';
                    }else{
                        $scope.item.rentsaleCharacter = $scope.spaceRentList[0].code+'';
                    }
                }
            })
        }
        $scope.initSpace();

        // 选择空间租售性质
        $scope.spaceRentChange = function (params) {
          
            if (params) {
                $scope.spaceRentListCopy.forEach((v, i) => {
                    if (v.code == params) {
                        $scope.planPurposeList = v.nodes;
                    }
                })
                $scope.planPurposeListCopy = angular.copy($scope.planPurposeList);
            } else {
                $scope.planPurposeList = [];
                $scope.propertyClassifyList = [];
            }

        }

        // 选择户规划用途
        $scope.planPurposeChange = function (params) {
            
            if (params) {
                $scope.planPurposeListCopy.forEach((v, i) => {
                    if (v.code == params) {
                        $scope.propertyClassifyList = v.nodes;
                    }
                })
            } else {
                $scope.propertyClassifyList = [];
            }
        }

        //保存
        $scope.save = function (form, item) {
            //item.rmCat=$scope.rmCat;
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            item.buildId = item.FLOOR.id;
            //编辑不向后台传createTime,updateTime
            if (item.createTime || item.updateTime) {
                //delete item.createTime;
                item.createTime = $rootScope.timestampToTime(item.createTmie);
                delete item.updateTime;
            }
            item.dateLastUpdate && delete item.dateLastUpdate

            $http.post("/ovu-base/system/parkHouse/save", item, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code == 0) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(data.msg);
                }
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        //分期、楼栋赋值
        if (house.stageId) {
            house.STAGE = $scope.parkStagetreeData.find(function (n) {
                return n.id == house.stageId
            });
            if (house.buildId) {
                house.FLOOR = house.STAGE.nodes.find(function (n) {
                    return n.id == house.buildId
                });
                //$scope.geneUnit(house);
            }
            //单元，楼层赋值
            if (house.floorId) {
                var node = {};
                node.id = house.floorId;
                house.TRUEFLOOR = $rootScope.getNode(node);
                var unitNode = {};
                unitNode.id = house.TRUEFLOOR.data.unitId;
                house.UNIT = $rootScope.getNode(unitNode);
            }
        }
        /* if (house.rm_cat) {
         house.houseCat = $scope.houseTypeTree.find(function(n) {
         return n.id == house.rm_cat
         });
         }*/
        if (!editStatus) {
            $scope.item = house;
        }
        //上传文件
        //前端展示名字固定，数据库不存储名字
        //名字 = houseName + 室内图
        if ($scope.item.img) {
            $scope.item.imgName = $scope.item.houseName + "室内图";
        }
        $scope.refresh = true;
        $scope.uploadFile = function () {
            $rootScope.addLimitFileCallBack($scope.item, "img", "imgName0", [".geojson", ".json"], $scope.refreshFun)
        }
        $scope.refreshFun = function () {
            $scope.refresh = false;
            if ($scope.item.img) {
                $scope.item.imgName = $scope.item.houseName + "室内图";
            }
            $timeout(function () {
                $scope.refresh = true;
            })
        }
        $scope.deleteFile = function () {
            $scope.item.img = "";
            $scope.item.imgName = "";
        }
    });
    //cx 设置房屋状态
    app.controller('setStatusCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, statu) {
        fac.loadSelect($scope, "HOUSE_STATUS")
        $scope.item = {};
        //保存
        $scope.save = function (form, item) {
            //item.rmCat=$scope.rmCat;
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $.post("/ovu-base/system/parkHouse/status", { "ids": statu.ids, "rmStatus": $scope.item.rmStatus }, function (resp) {
                // if (msg == 'success') {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                    msg(resp.msg);

                } else {
                    alert(resp.msg);
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    // wjlong BEGIN 缓存高德城市数据
    app.factory('AMapCityCache', ['$q', function ($q) {

        return $q(function (resolve, reject) {
            AMap.service('AMap.DistrictSearch', function () { //回调函数
                //实例化DistrictSearch
                var districtSearch = new AMap.DistrictSearch();
                //TODO: 使用districtSearch对象调用行政区查询的功能
                districtSearch.setLevel('country');
                districtSearch.setSubdistrict(3);
                districtSearch.search('中国', function (status, result) {
                    if (status === 'complete') {
                        var list = wideTraversal(result.districtList[0]);
                        var nameCounts = nameCount(list);
                        var dupArr = getDupList(nameCounts);
                        var ret = getDupDistincts(dupArr, list);
                        resolve(ret);
                    } else {
                        reject(status);
                    }
                });
            });
        });

        // 广度优先遍历
        function wideTraversal(node) {
            var rootNode = angular.copy(node);
            var nodes = [];
            if (rootNode != null) {
                var queue = [];
                rootNode.padcode = '';
                rootNode.pnmae = '';
                queue.unshift(rootNode);
                while (queue.length != 0) {
                    var item = queue.shift();
                    nodes.push(item);
                    var districtList = item.districtList;
                    delete item.districtList;
                    var pAdcode = item.adcode;
                    var pName = item.name;
                    if (angular.isArray(districtList)) {
                        districtList.forEach(function (v) {
                            v.padcode = pAdcode;
                            v.pname = pName;
                            queue.push(v);
                        });
                    }
                }
            }
            return nodes;
        }

        // 数组查重
        function nameCount(arr) {
            // arr = [1,1,'d','d',...]   obj = {'1':2,'d':2,...}
            var obj = {};
            var uniqueArr = [];
            arr.forEach(function (v) {
                if (obj[v.name]) {
                    obj[v.name]++;
                } else {
                    obj[v.name] = 1;
                    uniqueArr.push(v);
                }
            });

            // res = [{name:'1',count:2},...]
            var res = [];
            uniqueArr.forEach(function (v) {
                res.push({
                    name: v.name,
                    count: obj[v.name]
                    // adcode: v.adcode,
                    // pname: v.pname,
                    // padcode: v.padcode
                });
            });

            return res;
        }

        // 取出重复的节点list
        function getDupList(nameCounts) {
            var dupArr = [];
            nameCounts.forEach(function (v) {
                if (v.count !== 1) {
                    dupArr.push(v);
                }
            });
            return dupArr;
        }

        // 获取 dupDistinctList
        function getDupDistincts(dupArr, list) {
            var dupDistincts = {};
            dupDistincts.index = dupArr;
            dupDistincts.data = [];
            dupArr.forEach(function (v) {
                list.forEach(function (innerV) {
                    if (innerV.name === v.name) {
                        dupDistincts.data.push(innerV);
                    }
                });
            });
            return dupDistincts;
        }
    }]);

    app.service('AMapDupNames', function () {
        this.dupDistincts = {
            index: [
                { "name": "东区", "count": 2 },
                { "name": "朝阳区", "count": 2 }, { "name": "通州区", "count": 2 }, { "name": "和平区", "count": 2 }, {
                    "name": "河东区",
                    "count": 2
                }, { "name": "长安区", "count": 2 }, { "name": "桥西区", "count": 3 }, {
                    "name": "新华区",
                    "count": 3
                }, { "name": "桥东区", "count": 2 }, { "name": "城区", "count": 5 }, { "name": "矿区", "count": 2 }, {
                    "name": "郊区",
                    "count": 4
                }, { "name": "新城区", "count": 2 }, { "name": "青山区", "count": 2 }, {
                    "name": "铁西区",
                    "count": 3
                }, { "name": "铁东区", "count": 2 }, { "name": "海州区", "count": 2 }, {
                    "name": "西安区",
                    "count": 2
                }, { "name": "向阳区", "count": 2 }, { "name": "南山区", "count": 2 }, {
                    "name": "宝山区",
                    "count": 2
                }, { "name": "普陀区", "count": 2 }, { "name": "鼓楼区", "count": 4 }, {
                    "name": "西湖区",
                    "count": 2
                }, { "name": "江北区", "count": 2 }, { "name": "永定区", "count": 2 }, {
                    "name": "市中区",
                    "count": 4
                }, { "name": "白云区", "count": 2 }, { "name": "龙华区", "count": 2 }, {
                    "name": "城中区",
                    "count": 2
                }, { "name": "城关区", "count": 2 }
            ],
            data: [{
                "citycode": "1852",
                "adcode": "810003",
                "name": "东区",
                "center": { "O": 22.279693, "M": 114.22600299999999, "lng": 114.226003, "lat": 22.279693 },
                "level": "district",
                "padcode": "810000",
                "pname": "香港特别行政区"
            }, {
                "citycode": "0812",
                "adcode": "510402",
                "name": "东区",
                "center": { "O": 26.546491, "M": 101.70410900000002, "lng": 101.704109, "lat": 26.546491 },
                "level": "district",
                "padcode": "510400",
                "pname": "攀枝花市"
            }, {
                "citycode": "010",
                "adcode": "110105",
                "name": "朝阳区",
                "center": { "O": 39.921506, "M": 116.44320500000003, "lng": 116.443205, "lat": 39.921506 },
                "level": "district",
                "padcode": "110100",
                "pname": "北京城区"
            }, {
                "citycode": "0431",
                "adcode": "220104",
                "name": "朝阳区",
                "center": { "O": 43.833762, "M": 125.288254, "lng": 125.288254, "lat": 43.833762 },
                "level": "district",
                "padcode": "220100",
                "pname": "长春市"
            }, {
                "citycode": "010",
                "adcode": "110112",
                "name": "通州区",
                "center": { "O": 39.909946, "M": 116.65643399999999, "lng": 116.656434, "lat": 39.909946 },
                "level": "district",
                "padcode": "110100",
                "pname": "北京城区"
            }, {
                "citycode": "0513",
                "adcode": "320612",
                "name": "通州区",
                "center": { "O": 32.06568, "M": 121.07382799999999, "lng": 121.073828, "lat": 32.06568 },
                "level": "district",
                "padcode": "320600",
                "pname": "南通市"
            }, {
                "citycode": "022",
                "adcode": "120101",
                "name": "和平区",
                "center": { "O": 39.117196, "M": 117.214699, "lng": 117.214699, "lat": 39.117196 },
                "level": "district",
                "padcode": "120100",
                "pname": "天津城区"
            }, {
                "citycode": "024",
                "adcode": "210102",
                "name": "和平区",
                "center": { "O": 41.789833, "M": 123.420368, "lng": 123.420368, "lat": 41.789833 },
                "level": "district",
                "padcode": "210100",
                "pname": "沈阳市"
            }, {
                "citycode": "022",
                "adcode": "120102",
                "name": "河东区",
                "center": { "O": 39.128294, "M": 117.25158399999998, "lng": 117.251584, "lat": 39.128294 },
                "level": "district",
                "padcode": "120100",
                "pname": "天津城区"
            }, {
                "citycode": "0539",
                "adcode": "371312",
                "name": "河东区",
                "center": { "O": 35.089916, "M": 118.402893, "lng": 118.402893, "lat": 35.089916 },
                "level": "district",
                "padcode": "371300",
                "pname": "临沂市"
            }, {
                "citycode": "0311",
                "adcode": "130102",
                "name": "长安区",
                "center": { "O": 38.036347, "M": 114.53939500000001, "lng": 114.539395, "lat": 38.036347 },
                "level": "district",
                "padcode": "130100",
                "pname": "石家庄市"
            }, {
                "citycode": "029",
                "adcode": "610116",
                "name": "长安区",
                "center": { "O": 34.158926, "M": 108.907173, "lng": 108.907173, "lat": 34.158926 },
                "level": "district",
                "padcode": "610100",
                "pname": "西安市"
            }, {
                "citycode": "0311",
                "adcode": "130104",
                "name": "桥西区",
                "center": { "O": 38.004193, "M": 114.46108800000002, "lng": 114.461088, "lat": 38.004193 },
                "level": "district",
                "padcode": "130100",
                "pname": "石家庄市"
            }, {
                "citycode": "0319",
                "adcode": "130503",
                "name": "桥西区",
                "center": { "O": 37.059827, "M": 114.46860100000004, "lng": 114.468601, "lat": 37.059827 },
                "level": "district",
                "padcode": "130500",
                "pname": "邢台市"
            }, {
                "citycode": "0313",
                "adcode": "130703",
                "name": "桥西区",
                "center": { "O": 40.819581, "M": 114.86965700000002, "lng": 114.869657, "lat": 40.819581 },
                "level": "district",
                "padcode": "130700",
                "pname": "张家口市"
            }, {
                "citycode": "0311",
                "adcode": "130105",
                "name": "新华区",
                "center": { "O": 38.05095, "M": 114.46337699999998, "lng": 114.463377, "lat": 38.05095 },
                "level": "district",
                "padcode": "130100",
                "pname": "石家庄市"
            }, {
                "citycode": "0317",
                "adcode": "130902",
                "name": "新华区",
                "center": { "O": 38.314416, "M": 116.86628400000001, "lng": 116.866284, "lat": 38.314416 },
                "level": "district",
                "padcode": "130900",
                "pname": "沧州市"
            }, {
                "citycode": "0375",
                "adcode": "410402",
                "name": "新华区",
                "center": { "O": 33.737251, "M": 113.29397699999998, "lng": 113.293977, "lat": 33.737251 },
                "level": "district",
                "padcode": "410400",
                "pname": "平顶山市"
            }, {
                "citycode": "0319",
                "adcode": "130502",
                "name": "桥东区",
                "center": { "O": 37.071287, "M": 114.50705800000003, "lng": 114.507058, "lat": 37.071287 },
                "level": "district",
                "padcode": "130500",
                "pname": "邢台市"
            }, {
                "citycode": "0313",
                "adcode": "130702",
                "name": "桥东区",
                "center": { "O": 40.788434, "M": 114.89418899999998, "lng": 114.894189, "lat": 40.788434 },
                "level": "district",
                "padcode": "130700",
                "pname": "张家口市"
            }, {
                "citycode": "0352",
                "adcode": "140202",
                "name": "城区",
                "center": { "O": 40.075666, "M": 113.298026, "lng": 113.298026, "lat": 40.075666 },
                "level": "district",
                "padcode": "140200",
                "pname": "大同市"
            }, {
                "citycode": "0353",
                "adcode": "140302",
                "name": "城区",
                "center": { "O": 37.847436, "M": 113.60066899999998, "lng": 113.600669, "lat": 37.847436 },
                "level": "district",
                "padcode": "140300",
                "pname": "阳泉市"
            }, {
                "citycode": "0355",
                "adcode": "140402",
                "name": "城区",
                "center": { "O": 36.20353, "M": 113.123088, "lng": 113.123088, "lat": 36.20353 },
                "level": "district",
                "padcode": "140400",
                "pname": "长治市"
            }, {
                "citycode": "0356",
                "adcode": "140502",
                "name": "城区",
                "center": { "O": 35.501571, "M": 112.85355500000003, "lng": 112.853555, "lat": 35.501571 },
                "level": "district",
                "padcode": "140500",
                "pname": "晋城市"
            }, {
                "citycode": "0660",
                "adcode": "441502",
                "name": "城区",
                "center": { "O": 22.779207, "M": 115.36505799999998, "lng": 115.365058, "lat": 22.779207 },
                "level": "district",
                "padcode": "441500",
                "pname": "汕尾市"
            }, {
                "citycode": "0352",
                "adcode": "140203",
                "name": "矿区",
                "center": { "O": 40.036858, "M": 113.17720600000001, "lng": 113.177206, "lat": 40.036858 },
                "level": "district",
                "padcode": "140200",
                "pname": "大同市"
            }, {
                "citycode": "0353",
                "adcode": "140303",
                "name": "矿区",
                "center": { "O": 37.868494, "M": 113.55527899999998, "lng": 113.555279, "lat": 37.868494 },
                "level": "district",
                "padcode": "140300",
                "pname": "阳泉市"
            }, {
                "citycode": "0353",
                "adcode": "140311",
                "name": "郊区",
                "center": { "O": 37.944679, "M": 113.59416299999998, "lng": 113.594163, "lat": 37.944679 },
                "level": "district",
                "padcode": "140300",
                "pname": "阳泉市"
            }, {
                "citycode": "0355",
                "adcode": "140411",
                "name": "郊区",
                "center": { "O": 36.218388, "M": 113.10121100000003, "lng": 113.101211, "lat": 36.218388 },
                "level": "district",
                "padcode": "140400",
                "pname": "长治市"
            }, {
                "citycode": "0454",
                "adcode": "230811",
                "name": "郊区",
                "center": { "O": 46.810085, "M": 130.32719399999996, "lng": 130.327194, "lat": 46.810085 },
                "level": "district",
                "padcode": "230800",
                "pname": "佳木斯市"
            }, {
                "citycode": "0562",
                "adcode": "340711",
                "name": "郊区",
                "center": { "O": 30.821069, "M": 117.76802600000002, "lng": 117.768026, "lat": 30.821069 },
                "level": "district",
                "padcode": "340700",
                "pname": "铜陵市"
            }, {
                "citycode": "0471",
                "adcode": "150102",
                "name": "新城区",
                "center": { "O": 40.858289, "M": 111.66554400000001, "lng": 111.665544, "lat": 40.858289 },
                "level": "district",
                "padcode": "150100",
                "pname": "呼和浩特市"
            }, {
                "citycode": "029",
                "adcode": "610102",
                "name": "新城区",
                "center": { "O": 34.266447, "M": 108.96071599999999, "lng": 108.960716, "lat": 34.266447 },
                "level": "district",
                "padcode": "610100",
                "pname": "西安市"
            }, {
                "citycode": "0472",
                "adcode": "150204",
                "name": "青山区",
                "center": { "O": 40.643246, "M": 109.90157199999999, "lng": 109.901572, "lat": 40.643246 },
                "level": "district",
                "padcode": "150200",
                "pname": "包头市"
            }, {
                "citycode": "027",
                "adcode": "420107",
                "name": "青山区",
                "center": { "O": 30.640191, "M": 114.38496800000001, "lng": 114.384968, "lat": 30.640191 },
                "level": "district",
                "padcode": "420100",
                "pname": "武汉市"
            }, {
                "citycode": "024",
                "adcode": "210106",
                "name": "铁西区",
                "center": { "O": 41.820807, "M": 123.33396800000003, "lng": 123.333968, "lat": 41.820807 },
                "level": "district",
                "padcode": "210100",
                "pname": "沈阳市"
            }, {
                "citycode": "0412",
                "adcode": "210303",
                "name": "铁西区",
                "center": { "O": 41.119884, "M": 122.969629, "lng": 122.969629, "lat": 41.119884 },
                "level": "district",
                "padcode": "210300",
                "pname": "鞍山市"
            }, {
                "citycode": "0434",
                "adcode": "220302",
                "name": "铁西区",
                "center": { "O": 43.146155, "M": 124.34572200000002, "lng": 124.345722, "lat": 43.146155 },
                "level": "district",
                "padcode": "220300",
                "pname": "四平市"
            }, {
                "citycode": "0412",
                "adcode": "210302",
                "name": "铁东区",
                "center": { "O": 41.089933, "M": 122.99105199999997, "lng": 122.991052, "lat": 41.089933 },
                "level": "district",
                "padcode": "210300",
                "pname": "鞍山市"
            }, {
                "citycode": "0434",
                "adcode": "220303",
                "name": "铁东区",
                "center": { "O": 43.162105, "M": 124.40959099999998, "lng": 124.409591, "lat": 43.162105 },
                "level": "district",
                "padcode": "220300",
                "pname": "四平市"
            }, {
                "citycode": "0418",
                "adcode": "210902",
                "name": "海州区",
                "center": { "O": 42.011162, "M": 121.65763800000002, "lng": 121.657638, "lat": 42.011162 },
                "level": "district",
                "padcode": "210900",
                "pname": "阜新市"
            }, {
                "citycode": "0518",
                "adcode": "320706",
                "name": "海州区",
                "center": { "O": 34.572274, "M": 119.16350899999998, "lng": 119.163509, "lat": 34.572274 },
                "level": "district",
                "padcode": "320700",
                "pname": "连云港市"
            }, {
                "citycode": "0437",
                "adcode": "220403",
                "name": "西安区",
                "center": { "O": 42.927324, "M": 125.14928099999997, "lng": 125.149281, "lat": 42.927324 },
                "level": "district",
                "padcode": "220400",
                "pname": "辽源市"
            }, {
                "citycode": "0453",
                "adcode": "231005",
                "name": "西安区",
                "center": { "O": 44.577625, "M": 129.616058, "lng": 129.616058, "lat": 44.577625 },
                "level": "district",
                "padcode": "231000",
                "pname": "牡丹江市"
            }, {
                "citycode": "0468",
                "adcode": "230402",
                "name": "向阳区",
                "center": { "O": 47.342468, "M": 130.29423499999996, "lng": 130.294235, "lat": 47.342468 },
                "level": "district",
                "padcode": "230400",
                "pname": "鹤岗市"
            }, {
                "citycode": "0454",
                "adcode": "230803",
                "name": "向阳区",
                "center": { "O": 46.80779, "M": 130.365346, "lng": 130.365346, "lat": 46.80779 },
                "level": "district",
                "padcode": "230800",
                "pname": "佳木斯市"
            }, {
                "citycode": "0468",
                "adcode": "230404",
                "name": "南山区",
                "center": { "O": 47.315174, "M": 130.286788, "lng": 130.286788, "lat": 47.315174 },
                "level": "district",
                "padcode": "230400",
                "pname": "鹤岗市"
            }, {
                "citycode": "0755",
                "adcode": "440305",
                "name": "南山区",
                "center": { "O": 22.533287, "M": 113.93041299999999, "lng": 113.930413, "lat": 22.533287 },
                "level": "district",
                "padcode": "440300",
                "pname": "深圳市"
            },
            {
                "citycode": "0469",
                "adcode": "230506",
                "name": "宝山区",
                "center": { "O": 46.577167, "M": 131.401589, "lng": 131.401589, "lat": 46.577167 },
                "level": "district",
                "padcode": "230500",
                "pname": "双鸭山市"
            }, {
                "citycode": "021",
                "adcode": "310113",
                "name": "宝山区",
                "center": { "O": 31.405457, "M": 121.48961199999997, "lng": 121.489612, "lat": 31.405457 },
                "level": "district",
                "padcode": "310100",
                "pname": "上海城区"
            }, {
                "citycode": "021",
                "adcode": "310107",
                "name": "普陀区",
                "center": { "O": 31.249603, "M": 121.39551399999999, "lng": 121.395514, "lat": 31.249603 },
                "level": "district",
                "padcode": "310100",
                "pname": "上海城区"
            }, {
                "citycode": "0580",
                "adcode": "330903",
                "name": "普陀区",
                "center": { "O": 29.97176, "M": 122.323867, "lng": 122.323867, "lat": 29.97176 },
                "level": "district",
                "padcode": "330900",
                "pname": "舟山市"
            }, {
                "citycode": "025",
                "adcode": "320106",
                "name": "鼓楼区",
                "center": { "O": 32.066601, "M": 118.77018199999998, "lng": 118.770182, "lat": 32.066601 },
                "level": "district",
                "padcode": "320100",
                "pname": "南京市"
            }, {
                "citycode": "0516",
                "adcode": "320302",
                "name": "鼓楼区",
                "center": { "O": 34.288646, "M": 117.18557599999997, "lng": 117.185576, "lat": 34.288646 },
                "level": "district",
                "padcode": "320300",
                "pname": "徐州市"
            }, {
                "citycode": "0591",
                "adcode": "350102",
                "name": "鼓楼区",
                "center": { "O": 26.081983, "M": 119.30391700000001, "lng": 119.303917, "lat": 26.081983 },
                "level": "district",
                "padcode": "350100",
                "pname": "福州市"
            }, {
                "citycode": "0378",
                "adcode": "410204",
                "name": "鼓楼区",
                "center": { "O": 34.78856, "M": 114.34830599999998, "lng": 114.348306, "lat": 34.78856 },
                "level": "district",
                "padcode": "410200",
                "pname": "开封市"
            }, {
                "citycode": "0571",
                "adcode": "330106",
                "name": "西湖区",
                "center": { "O": 30.259463, "M": 120.13019400000002, "lng": 120.130194, "lat": 30.259463 },
                "level": "district",
                "padcode": "330100",
                "pname": "杭州市"
            }, {
                "citycode": "0791",
                "adcode": "360103",
                "name": "西湖区",
                "center": { "O": 28.657595, "M": 115.87723299999999, "lng": 115.877233, "lat": 28.657595 },
                "level": "district",
                "padcode": "360100",
                "pname": "南昌市"
            }, {
                "citycode": "0574",
                "adcode": "330205",
                "name": "江北区",
                "center": { "O": 29.886781, "M": 121.55508099999997, "lng": 121.555081, "lat": 29.886781 },
                "level": "district",
                "padcode": "330200",
                "pname": "宁波市"
            }, {
                "citycode": "023",
                "adcode": "500105",
                "name": "江北区",
                "center": { "O": 29.606703, "M": 106.57427100000001, "lng": 106.574271, "lat": 29.606703 },
                "level": "district",
                "padcode": "500100",
                "pname": "重庆城区"
            }, {
                "citycode": "0597",
                "adcode": "350803",
                "name": "永定区",
                "center": { "O": 24.723961, "M": 116.73209099999997, "lng": 116.732091, "lat": 24.723961 },
                "level": "district",
                "padcode": "350800",
                "pname": "龙岩市"
            }, {
                "citycode": "0744",
                "adcode": "430802",
                "name": "永定区",
                "center": { "O": 29.119855, "M": 110.53713800000003, "lng": 110.537138, "lat": 29.119855 },
                "level": "district",
                "padcode": "430800",
                "pname": "张家界市"
            }, {
                "citycode": "0531",
                "adcode": "370103",
                "name": "市中区",
                "center": { "O": 36.651335, "M": 116.99784499999998, "lng": 116.997845, "lat": 36.651335 },
                "level": "district",
                "padcode": "370100",
                "pname": "济南市"
            }, {
                "citycode": "0632",
                "adcode": "370402",
                "name": "市中区",
                "center": { "O": 34.863554, "M": 117.55613900000003, "lng": 117.556139, "lat": 34.863554 },
                "level": "district",
                "padcode": "370400",
                "pname": "枣庄市"
            }, {
                "citycode": "1832",
                "adcode": "511002",
                "name": "市中区",
                "center": { "O": 29.587053, "M": 105.06759699999998, "lng": 105.067597, "lat": 29.587053 },
                "level": "district",
                "padcode": "511000",
                "pname": "内江市"
            }, {
                "citycode": "0833",
                "adcode": "511102",
                "name": "市中区",
                "center": { "O": 29.555374, "M": 103.76132899999999, "lng": 103.761329, "lat": 29.555374 },
                "level": "district",
                "padcode": "511100",
                "pname": "乐山市"
            }, {
                "citycode": "020",
                "adcode": "440111",
                "name": "白云区",
                "center": { "O": 23.157367, "M": 113.27323799999999, "lng": 113.273238, "lat": 23.157367 },
                "level": "district",
                "padcode": "440100",
                "pname": "广州市"
            }, {
                "citycode": "0851",
                "adcode": "520113",
                "name": "白云区",
                "center": { "O": 26.678561, "M": 106.62300700000003, "lng": 106.623007, "lat": 26.678561 },
                "level": "district",
                "padcode": "520100",
                "pname": "贵阳市"
            }, {
                "citycode": "0755",
                "adcode": "440309",
                "name": "龙华区",
                "center": { "O": 22.696667, "M": 114.04542200000003, "lng": 114.045422, "lat": 22.696667 },
                "level": "district",
                "padcode": "440300",
                "pname": "深圳市"
            }, {
                "citycode": "0898",
                "adcode": "460106",
                "name": "龙华区",
                "center": { "O": 20.031006, "M": 110.32849199999998, "lng": 110.328492, "lat": 20.031006 },
                "level": "district",
                "padcode": "460100",
                "pname": "海口市"
            }, {
                "citycode": "0772",
                "adcode": "450202",
                "name": "城中区",
                "center": { "O": 24.366, "M": 109.4273, "lng": 109.4273, "lat": 24.366 },
                "level": "district",
                "padcode": "450200",
                "pname": "柳州市"
            }, {
                "citycode": "0971",
                "adcode": "630103",
                "name": "城中区",
                "center": { "O": 36.545652, "M": 101.70529799999997, "lng": 101.705298, "lat": 36.545652 },
                "level": "district",
                "padcode": "630100",
                "pname": "西宁市"
            }, {
                "citycode": "0891",
                "adcode": "540102",
                "name": "城关区",
                "center": { "O": 29.654838, "M": 91.14055200000001, "lng": 91.140552, "lat": 29.654838 },
                "level": "district",
                "padcode": "540100",
                "pname": "拉萨市"
            }, {
                "citycode": "0931",
                "adcode": "620102",
                "name": "城关区",
                "center": { "O": 36.057464, "M": 103.82530700000001, "lng": 103.825307, "lat": 36.057464 },
                "level": "district",
                "padcode": "620100",
                "pname": "兰州市"
            }
            ]
        };
        this.isInDupDistincts = function (value) {
            return this.dupDistincts.index.some(function (v) {
                return v.name === value;
            });
        };
        this.getDupDistincts = function (value) {
            var res = [];
            this.dupDistincts.data.forEach(function (v) {
                if (v.name === value) {
                    res.push(v);
                }
            });
            return res;
        };
    });
    // wjlong END

})();
