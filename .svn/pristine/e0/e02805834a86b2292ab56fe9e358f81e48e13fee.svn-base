/**
 * Created by Administrator on 2017/7/20.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    //项目架构ctl
    app.controller('equipmentCtl', function ($scope, $rootScope, $timeout, $http, $filter, $uibModal, fac) {
        document.title = "OVU-设备台帐";
        //初始化为空
        $scope.equipTypeTree = [];
        $scope.pageModel = {};
        $scope.search = {mode:'list-mode',useSence:'all', showCnt: true ,preSetEquipType:$scope.$parent.equipType};
        var curMarker;
        var airocovMap;//星网地图
        var airocovMarkers;//星网地图点
        var infowindow;
        var oldMapUrl;
         var mapCenter;
         var ovu2DMap; //鸟瞰图
         var map2dDraw;
         var CanvasLayer;
         //获取经纬度
         function getPostion(parkId){
            var position=[]
            function getNode(nodes){
               nodes && nodes.forEach(function(n){
                   if(n.id==parkId){
                       position=n
                     }else{
                         if(n.nodes && n.nodes.length){
                            getNode(n.nodes)
                         }
                     }
               })  
            }
            getNode($rootScope.parkTree)
            return  position
         }
     

        app.modulePromiss.then(function () {
            $scope.config = { edit: false};
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.search.deptId = deptId;
                    fac.setEquipTypeTree($scope.search,$scope);
                    $scope.find(1);
                    if($scope.dept.parkId){
                        $scope.parkId_top=$scope.dept.parkId
                        $scope.parkName_top=$scope.dept.parkName
                        $scope.park=getPostion($scope.dept.parkId);
                        mapCenter = [$scope.park['mapLng'], $scope.park['mapLat']];
                        var topRight = $scope.park.trPosition ? $scope.park.trPosition.split(",") : undefined;
                        var bomLeft =  $scope.park.blPosition ? $scope.park.blPosition.split(",") : undefined;
                       
                        var mapProperties = $scope.park.director ? $scope.park.director.split(","):[];
                        var width = mapProperties[0]?Number(mapProperties[0]):2000;
                        var height = mapProperties[1]?Number(mapProperties[1]):2000;
                        var zoom  = mapProperties[2]?Number(mapProperties[2]):2.76;
                        if($scope.park.airscapePath){
                            if($scope.park.airscapePath.indexOf("http") == -1){
                                $scope.park.airscapePath = "/ovu-base" + $scope.park.airscapePath;
                            }
                            ovu2DMap = new OvuMap();
                             map2dDraw = new Draw2DMap(width,height,zoom,undefined);
                           ovu2DMap.loadTheme();
                          ovu2DMap.loadJson($scope.park.airscapePath);
                          var draw = function (argument) {
                            AMap.Util.requestAnimFrame(draw);
                            if (ovu2DMap.mapJson === undefined) {
                                return;
                            }
                            var _curFloor = ovu2DMap.mapJson;
                            //地图绘制
                            map2dDraw.draw( _curFloor,$scope.myMap)
                            //图层刷新
                            CanvasLayer.reFresh();
                        }
                        CanvasLayer = new AMap.CanvasLayer({
                            canvas: map2dDraw.canvas,
                            bounds: new AMap.Bounds(
                                bomLeft,
                                topRight
                            ),
                            zooms: [3, 18],
                        });
                        console.log($scope.myMap)
                        //把图层 存放到 地图中
                        CanvasLayer.setMap($scope.myMap);
                        //绘图循环的核心方法
                            draw(23);
                          }
                    }else{
                         // 默认定位到武汉创意天地
                         mapCenter = [114.32233, 30.471139];
                         $scope.parkId_top=''
                        $scope.parkName_top=''
                    }
                }
            })
        });

        
        //查询
        $scope.find = function (pageNo) {
            if(!fac.initDeptId($scope.search)){
                return;
            }
            $.extend($scope.search, {currentPage: pageNo || $scope.pageModel.currentPage || 1,pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult("/ovu-pcos/pcos/equipment/queryByPage.do", $scope.search, function (data) {
                data.list.forEach(function (n) {
                    n.sensorList = [];
                    if (n.sensors && n.sensors.indexOf("#") > 0) {
                        var sensorArray = n.sensors.split(",");
                        sensorArray.forEach(function (m) {
                            var sensor = m.split("#");
                            if (sensor && sensor.length == 2) {
                                n.sensorList.push({
                                    id: sensor[0],
                                    name: sensor[1]
                                });
                            }
                        })
                    }
                })
                $scope.pageModel = data;

                //显示室内地图
                var mapUrl;
                if($scope.search.buildId == '6cdc0961f199496580f856a8fa85e430' ){
                    switch ($scope.search.groundNo){
                        case "006":mapUrl = "http://image.ovuems.com/6f.geojson";break;
                        case '009':mapUrl = "http://image.ovuems.com/9f.geojson";break;
                        default:mapUrl = null;
                    }
                    $scope.search.hasIndoorMap= mapUrl?true:false;
                }else {
                    $scope.search.hasIndoorMap = false;
                }
                //取消选中
                delete $scope.curEquip;
                if($scope.search.hasIndoorMap){
                    //http://image.ovuems.com/6f.geojson
                     loadIndoorMap(mapUrl,function(){
                         oldMapUrl = mapUrl;
                        $scope.pageModel.list.forEach(function(n){
                            addImgMarker(n);
                        })
                    });
                }else {
                    //项目地图中心点定位
                    if($scope.search.parkId){
                        var parkNode=fac.getNodeById($rootScope.parkTree,$scope.search.parkId);
                        // if(parkNode && parkNode.mapLng){
                        //     mapCenter = [parkNode.mapLng, parkNode.mapLat];
                        // }
                        $scope.park=getPostion($scope.search.parkId);
                        mapCenter = [$scope.park['mapLng'], $scope.park['mapLat']];
                       
                    }

                    $scope.markers = [];
                    //显示高德地图
                    //设置中心点
                  
                  
                    $scope.myMap.setCenter(mapCenter);
                    $scope.myMap.clearMap();
                   
                    $scope.pageModel.list.forEach(function(n){
                        //在地图上给列表中设备描点
                       
                        addMarker($scope.markers,n);

                    })
                    $scope.myMap.setFitView();
                }
            });
        };

        //--------------星网地图  //
        function loadIndoorMap(mapUrl,fn){
            if(airocovMap){
                if(oldMapUrl != mapUrl){
                    airocovMap.resetRender(
                        {
                            mapList: [
                                {
                                    name: "F6",
                                    mapUrl: mapUrl
                                }
                            ]
                        }
                    )
                    airocovMarkers= [];
                }else{
                    var curMa = airocovMarkers.forEach(function(n){
                        airocovMap.clearLayer("F6", n.info.properties.userData.id);
                    });
                    airocovMarkers= [];
                    fn &&fn();
                }
                return;
            }
            airocovMarkers= [];
            AirocovMap.Config.set({
                showViewMode: "MODE_2D",
                defaultGap: 20,
                zoom: 2
            });
            airocovMap = new AirocovMap.Map({
                container: document.getElementById("canvas"),
                themeUrl: "/res/js/AirocovMap/theme/fillcolor.json",
                mapList: [
                    {
                        name: "F6",
                        mapUrl: mapUrl
                    }
                ]
            });
            airocovMap.event.on("loaded", function(){
                window.center = airocovMap.getMapCenter("F6");
                fn &&fn();
            });

            airocovMap.event.on("click", function (e) {
                console.log(e.lnglat);
                //生成图片标注
                var infowindow;
                if(e.type == 'marker'){
                        showMarkInfo(e.target);
                }
                if($scope.curEquip){
                    var curMa = airocovMarkers.find(function(n){return n.info.properties.userData.id == $scope.curEquip.id});
                    if(curMa){
                        airocovMap.clearLayer("F6", $scope.curEquip.id);
                        airocovMarkers.splice(airocovMarkers.indexOf(curMa), 1);
                    }
                    $scope.curEquip.lng = e.lnglat[0];
                    $scope.curEquip.lat = e.lnglat[1];
                    addImgMarker($scope.curEquip);
                }
            })
        }

        //星网打点
        function addImgMarker(equipment) {
            if(equipment.lng||equipment.map_lng){
                var imgMark = new AirocovMap.Markers.ImageMarker({
                    imgMarker: "/image/blueImageMarker.png", //图片路径
                    size: 2, //图片大小缩放系数
                    //position:{x:x0,y:y0,z:z0}, //三维坐标系坐标
                    lnglat: [equipment.lng||equipment.map_lng, equipment.lat||equipment.map_lat], //经纬度坐标
                    y: 2, //三维坐标系坐标y值
                    mapCenter: window.center, //地图中心点
                    userData: equipment,
                    //custom properties //保存用户自定义属性，可从imgMarker.info.properties.userData访问
                    callback: function (imgMark) {
                        //将图片标注添加到地图 "otherGroup"
                        airocovMap.addToLayer(imgMark, "F6", equipment.id, true);
                        airocovMarkers.push(imgMark);
                        $scope.$applyAsync();
                    }
                });
            }
        }

        function showMarkInfo(curMa){
            var equipment = curMa.info.properties.userData;
            if (infowindow) {
                //关闭其他信息窗
                infowindow.close();
            }
            infowindow = new AirocovMap.Controls.InfoWindow({
                //信息窗内容，是一个dom
                content: `<div style="width:190px">
                            <div class="x_title">
                                <a href='javascript:void(0)' >${equipment.name || ""}</a>
                            </div>
                            <div class="x_content" style="z-index: 1;">
                                <div>
                                    <label style="display: table-cell;white-space: nowrap" class="control-label">编码：</label>
                                    <div style="display: table-cell;word-break:break-all">${equipment.equip_code || ""}</div>
                                </div>
                            </div>
                        </div>`,
               /* <div style="background-color: #ffffff;position:relative">
                <div style="float:left">
                ${equipment.name || ""}
                </div>
                <div style="float:left">
                ${equipment.equip_code || ""}
                </div>
                </div>*/

                //position: airocovMap.screenCoordinates(curMa.position),  //三维场景坐标的投影到屏幕的坐标
                //positionXYZ: curMa.position,  //三维场景坐标
                //注: position和positionXYZ同时使用，会在指定三维坐标处生成信息窗，
                //id和floor同时使用，会在指定楼层的指定id物体处生成信息窗。 id和floor属性存在时，优先使用id和floor。
                id: curMa.info.properties.userData.id,  //楼层的模型info.id或自定义id
                floor: curMa.info.floor //楼层编号
            })
            //将信息窗添加到地图中
            airocovMap.addControl(infowindow)
            //实时对信息窗定位
            infowindow.positioning()
        }
        //--------------星网地图  //



        function getEquipType(modelId){
           var type = $scope.equipTypeTreeFlat && $scope.equipTypeTreeFlat.find(function(n){return n.id == modelId})
            return type?type.equipType:'';
        }
         //初始化地图
        $scope.mapOptions = {
            toolbar : true,
                // map-self config
                resizeEnable : true,
                // ui map config
                uiMapCache : false,
                zoom : 18,
                //精简模式
                liteStyle : true,
                expandZoomRange:true
        };
        function addMarker(markers,equipment) {
            if(equipment.lng||equipment.longitude_){
                var markDef = {
                    map:$scope.myMap,
                    extData: equipment,
                    position:[equipment.lng||equipment.longitude_, equipment.lat||equipment.latitude_]
                }
                
                if(getEquipType(equipment.model_id)=='camera'){
                    var imageUrl = '/view/equipment/resource/icon/sign_watchman_null.png'
                    if( equipment.regi_code){
                        imageUrl = '/view/equipment/resource/icon/sign_watchman.png'
                    }
                    markDef.icon=new AMap.Icon({
                        image: imageUrl,
                        size: new AMap.Size(36, 36)
                        , imageSize: new AMap.Size(36,36) //图标大小
                    })
                }else if(equipment.hasClicked){
                    markDef.icon = '/res/img/mark_bs/mark_bs7.png'
                    markDef.zIndex=10000
                }
               //  $scope.myMap.panTo(marker);
                var marker = new AMap.Marker(markDef);
                // $scope.myMap.panTo(marker);
                markers.push(marker);
                return marker;
            }
        }


        //保存坐标
        $scope.scrollToTarget = function(equipment){
            $scope.curEquip = equipment;
            if($scope.search.hasIndoorMap){
                var curMa = airocovMarkers.find(function(n){return n.info.properties.userData.id == equipment.id});
                if(curMa){
                    showMarkInfo(curMa);
                }
            }else{
                curMarker = $scope.markers.find(function(n){var ep = n.getExtData();return ep&&ep.id == equipment.id});
                // $scope.myMap.setZoom(zoom)
                // $scope.myMap.setCenter([lng, lat]);
                if(curMarker){
                    $scope.myMap.remove($scope.markers);
                    $scope.pageModel.list.forEach(function(n){
                        //在地图上给列表中设备描点
                        if(n.id==equipment.id){
                           n.hasClicked=true
                         }else{
                            n.hasClicked=false
                        }
                        addMarker($scope.markers,n);

                    })
                    $scope.myMap.setFitView();
                 
                    $scope.myMap.setZoomAndCenter(18, curMarker.getPosition());
                }
            }
        }
        //点击地图
        $scope.clickMap = function ($event, $params) {
            if($scope.curEquip){
                if(curMarker){
                    curMarker.setMap(null);
                    $scope.markers.splice($scope.markers.indexOf(curMarker), 1);
                }
                $scope.curEquip.lng = $params[0].lnglat.lng;
                $scope.curEquip.lat = $params[0].lnglat.lat;
                curMarker = addMarker($scope.markers,$scope.curEquip);
                //addMarker($params[0].lnglat);
            }
        }

        //保存坐标
        $scope.saveGeo = function(equipment){
            var params = {equipmentId:equipment.id,lng:equipment.lng,lat:equipment.lat,isAirocovMap:$scope.search.hasIndoorMap};
            $http.get("/ovu-pcos/pcos/equipment/saveGeo.do",{params:params}).success(function (resp) {
                if (resp.code ==0) {
                    if($scope.search.hasIndoorMap){
                        equipment.map_lng = equipment.lng;
                        equipment.map_lat = equipment.lat;
                    }else{
                        equipment.longitude_ = equipment.lng;
                        equipment.latitude_ = equipment.lat;
                    }
                    delete equipment.lng;
                    delete equipment.lat;
                } else {
                    alert(resp.msg);
                }
            })
        }

        //保存取消坐标
        $scope.cancelGeo = function(equipment){
            if($scope.search.hasIndoorMap){
                var curMa = airocovMarkers.find(function(n){return n.info.properties.userData.id == $scope.curEquip.id});
                if(curMa){
                    //"otherGroup"
                    airocovMap.clearLayer("F6", $scope.curEquip.id);
                    airocovMarkers.splice(airocovMarkers.indexOf(curMa), 1);
                }
                delete equipment.lng;
                delete equipment.lat;
                addImgMarker(equipment);
            }else{
                var marker = $scope.markers.find(function(n){var ep = n.getExtData();return ep&&ep.id == equipment.id});
                marker.setMap(null);
                $scope.markers.splice($scope.markers.indexOf(marker), 1);
                delete equipment.lng;
                delete equipment.lat;
                addMarker($scope.markers,equipment);
            }
        }


        //添加标记
       /* function addMarker(lnglat) {
            $scope.myMap.clearMap();
            $scope.myMap.panTo(lnglat);
            var makers = [];
            makers.push(new AMap.Marker({
                map: $scope.myMap,
                position: lnglat
            }));
            $scope.markers = makers;
            //经度
            $scope.item.longitude_ = lnglat.lng;
            //纬度
            $scope.item.latitude_ = lnglat.lat;
        }*/

        //地图标记点事件
        $scope.clickMarker = function($event, $params, marker) {
            var equipment =  $scope.markerData = marker.getExtData();
            $scope.myInfoWindow.open($scope.myMap, marker.getPosition());
            if((getEquipType(equipment.model_id)=='camera' && equipment.regi_code)||equipment.regi_codes){
                $rootScope.playVideo(equipment.id);
            }
        }

        var imap;
        $timeout(function () {
            imap = $scope.myMap;
            AMap.plugin(['AMap.Autocomplete'], function () {
                // 如果是编辑界面 获取已选城市 搜索范围锁定在该城市  选中了武汉市 搜索建设银行 优先显示武汉的建设银行
                var city = '';
                // // var arr = copy.CITY.split(',');
                // if (arr && arr[1]) {
                //     // var arr = [];
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
                            console.log(e);
                            $('.amap-sug-result').css({
                                visibility: 'hidden',
                                display: 'none'
                            });
                            autoSelect(e);
                        }
                    })
                });
            });
        });


        //添加编辑设备
        $scope.showEditModal = function (equipment) {
           
            if (!equipment && !fac.initDeptId($scope.search)) {
                return;
            }
            var copy = angular.extend({preSetEquipType:$scope.$parent.equipType}, equipment);
            copy.isGroup = $scope.search.isGroup;
            if(!copy.park_id){
                angular.extend(copy, {
                    park_id: $scope.search.parkId,
                    park_name: $scope.search.parkName,
                    deptId:$scope.search.deptId
                });
            }
            angular.extend(copy, {
                parkId_top: $scope.parkId_top,
                parkName_top: $scope.parkName_top,
              
            });
         
          
            //appendTo是为了规避ui-select在模态框被动画造成的一个bug
            var modal = $uibModal.open({
                animation: false,
                size: 'max',
                scope:$scope,
                templateUrl: '/view/equipment/modal.equipment.html',
                controller: 'equipmentModalCtrl',
                // appendTo: angular.element('#NgCtrlTag'),
                resolve: {
                    equipment: function () {
                        return copy;
                    }
                }
            });
            modal.result.then(function (data) {
                if (copy.id && copy.model_id == data.model_id) {
                    //分类没变，不用刷新
                } else {
                    fac.setEquipTypeTree($scope.search,$scope);
                }
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //一级分类
        $scope.addTopNode = function (equipType) {
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: '/view/equipment/modal.equipType.html',
                controller: 'equipTypeCtrl',
                resolve: {
                    equipType: function () {
                        return angular.extend({}, equipType);
                    }
                }
            });
            modal.result.then(function (data) {
                if (equipType) {
                    angular.extend(equipType, data)
                } else {
                    $scope.equipTypeTree.push(data);
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //下级分类
        $rootScope.addSubType = function (node) {
            var equipType = {
                ptexts: (node.ptexts ? node.ptexts + ">" : "") + node.text,
                pid: node.id,
                pids: (node.pids ? node.pids + "," : "") + node.id
            }
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: '/view/equipment/modal.equipType.html',
                controller: 'equipTypeCtrl',
                resolve: {
                    equipType: function () {
                        return equipType;
                    }
                }
            });
            modal.result.then(function (data) {
                node.state = node.state || {};
                node.state.expanded = true;
                node.nodes = node.nodes || [];
                node.nodes.push(data);
            });
        }

        //编辑分类
        $scope.editNode = function (node, pnode) {
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: '/view/equipment/modal.equipType.html',
                controller: 'equipTypeCtrl',
                resolve: {
                    equipType: function () {return angular.extend({pEquipType:pnode?pnode.equipType:''}, node);}
                }
            });
            modal.result.then(function (data) {
                // angular.extend(node,data);
                fac.setEquipTypeTree($scope.search,$scope);
                if(pnode.equipType == "sensor"){
                    $scope.find();
                }
            });
        }


        //选中分类节点
        $scope.selectNode = function (search,node) {
            if (node.state.selected) {
                $scope.curNode = node;
            } else {
                delete $scope.curNode;
            }
            $scope.find(1);
        }

        $scope.clean = function (search) {
            delete $scope.search.equipTypeId;
        }

        //删除设备
        $scope.delAll = function () {
            var curDomain=app.domain;
            var ids = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && curDomain.id==n.domain_id && ret.push(n.id);
                return ret
            }, []);
            del(ids, "确认删除选中的 " + ids.length + " 台设备吗?");
        };
        $scope.del = function (item) {
            del([item.id], "确认删除 " + item.name + " 吗?");
        }

        function del(ids, msg) {
            confirm(msg, function () {
                $http.post("/ovu-pcos/pcos/equipment/del.do", {
                    "ids": ids.join()
                }, fac.postConfig).success(function (resp) {
                    if (resp.success) {
                        fac.setEquipTypeTree($scope.search,$scope);
                        $scope.find();
                    } else {
                        alert(resp.error);
                    }
                })
            });
        }

        //设备二维码导出
        $scope.exportAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.id);
                return ret
            }, []);

            var elemIF = document.createElement("iframe");
            elemIF.src = "/ovu-pcos/pcos/equipment/export.do?id=" + ids.join();
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);

        };

        //导出Excel
        $scope.exportExcel = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.id);
                return ret
            }, []);

            var elemIF = document.createElement("iframe");
            var param = encodeURIComponent(encodeURIComponent(JSON.stringify({ ID: ids.join() })));
            elemIF.src = "/ovu-pcos/pcos/equipment/exportExcel.do?searchJson=" + param;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);

        };

        //批量设置维保单位
        $scope.setMatainName = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) {n.checked && ret.push(n.id);return ret}, []);
            var data=ids.join();
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/equipment/modal.select.matain.html',
                controller: 'selectMatainCtrl',
                resolve: {
                    data: function () {return data;}
                }
            });
            modal.result.then(function (data) {
            });
        }



        //删除分类
        $scope.delNode = function (node) {
            if (node.nodes && node.nodes.length) {
                alert("此节点有下级节点,不能删除！")
            } else {
                confirm("确定删除 " + node.text, function () {
                    $http.post("/ovu-pcos/pcos/equipment/equipType/del.do", {
                        ids: node.id
                    }, fac.postConfig).success(function (resp) {
                        if (resp.success) {
                            if ($scope.curNode == node) {
                                delete $scope.curNode;
                            }
                            var parent = fac.getNodeById($scope.equipTypeTree, node.pid);
                            if (parent) {
                                parent.nodes.splice(parent.nodes.indexOf(node), 1)
                            } else {
                                $scope.equipTypeTree.splice($scope.equipTypeTree.indexOf(node), 1)
                            }
                        } else {
                            alert(resp.error);
                        }
                    });
                })
            }
        }

        function findbytype(typeid) {
            $http.post("/ovu-pcos/pcos/equipment/findbytype.do", {
                "typeid": typeid
            }, fac.postConfig).success(function (resp) {
                if (resp.success) {
                    return true;
                } else {
                    return false;
                }
            })
        }

        $scope.showDetectHistory = function (sensorId, paramId, paramName) {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/equipment/modal.detectHistory.html',
                controller: 'detectHistoryCtrl',
                resolve: {
                    param: function () {
                        return { sensorId: sensorId, paramId: paramId, name: paramName };
                    }
                }
            });
            modal.result.then(function () {
            }, function () {
            });
        }
        $scope.setEqSta=function(){
            var ids = $scope.pageModel.list.reduce(function (ret, n) {n.checked && ret.push(n.id);return ret}, []);
            var data=ids.join();
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/equipment/modal.setEqStatus.html',
                controller: 'setEqStatusCtrl',
                resolve: {
                    data: function () {return data;}
                }
            });
            modal.result.then(function () {
                fac.setEquipTypeTree($scope.search,$scope);
                $scope.find();
            }, function () {
            });
        }
    

    });


    app.controller('equipTypeCtrl', function ($scope, $rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, equipType) {
        $scope.item = equipType;
        equipType.defs = equipType.defs || [];
        equipType.params = equipType.params || []; //检测参数定义
        if (equipType.pids && equipType.pids.split(",").length == 3) {
            equipType.canUploadLogo = true;
        }
        $scope.readOnly = false; //名称是否只读

        //如果是传感器的子类，且传感器协议列表为空，则获取传感器协议列表
        if(equipType.pEquipType == 'sensor' && !$rootScope.sensorTypeTree){
            fac.setSensorTypeTree();
        }
        if (equipType.id) {
            $scope.readOnly = true;
            $scope.hasNodes = equipType.nodes && equipType.nodes.length > 0;

            $http.get("/ovu-pcos/pcos/equipment/equipType/get.do?id=" + equipType.id).success(function (resp) {
                if (resp.success) {
                    angular.extend(equipType, resp.data);
                } else {
                    alert(resp.error);
                }
            })
        }

        //选择参数
        $scope.selectDetectParam = function (item) {

            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/equipment/selector.detectParam.html',
                controller: 'selectDetectParamModalCtrl',
                resolve: {
                    detectParams: function () {
                        return angular.extend([], item.params)
                    }
                }
            });
            modal.result.then(function (data) {
                data.params.forEach(function (n) {
                    var temp = item.params.find(function (m) {
                        return m.detect_param_id == n.detect_param_id
                    });
                    angular.extend(n, temp);
                });
                item.params = data.params;
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        //选择工作类型
        $scope.selectNode = function (node, param) {
            function _choose() {
                param.worktype_id = node.id;
                param.worktype_name = (node.ptexts ? node.ptexts + " > " : "") + node.text;
            }
            if (node.id && node.id != param.worktype_id) {
                _choose();
                param.worktypeHover = param.worktypeFocus = false;
            }
            // console.log(node);
        }

        $scope.clearWorkType = function (param) {
            delete param.worktype_name;
            delete param.worktype_id;
        }

        //保存
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            delete item.state;
            $http.post("/ovu-pcos/pcos/equipment/equipType/save.do", item).success(function (resp, status, headers, config) {
                if (resp.success) {
                    $uibModalInstance.close(resp.data);
                    msg("保存成功!");
                } else {
                    alert(resp.error);
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('sensorTypeCtrl', function($scope,$rootScope,$http,$uibModalInstance,$filter,fac,sensorType) {
        $scope.item = sensorType;
        sensorType.params = [];
        if(sensorType.id){
            $http.get("/ovu-pcos/pcos/sensor/sensorType/get.do?id="+sensorType.id).success(function(resp) {
                if(resp.success){
                    if(resp.data.defs&& resp.data.defs.length){
                        resp.data.defs.forEach(function(n){
                            n.val_type == 3 && n.option_list && (n.options = n.option_list.split(","));
                            n.val_type == 2 && (n.val = Number.parseFloat(n.val));
                        })
                    }
                    angular.extend(sensorType,resp.data);
                } else {
                    alert(resp.error);
                }
            })
        }

        //获取品牌
        $scope.getBrand = function(val){
            var param = {
                pageSize:10,
                pageIndex:0
            };
            param.name = val||"";
            return $http.post("/ovu-pcos/pcos/sensor/listBrand_mute.do",param,fac.postConfig).then(function(resp){
                return  resp.data.data;
            })
        }

        $scope.addParam = function(){
            sensorType.params.push({});
        }

        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            delete item.state;
            $http.post("/ovu-pcos/pcos/sensor/sensorType/save.do",item).success(function(resp, status, headers, config) {
                if(resp.success){
                    $uibModalInstance.close(resp.data);
                    msg("保存成功!");
                } else {
                    alert(resp.error);
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('equipmentModalCtrl', function ($scope, $rootScope, $timeout, $http, $uibModalInstance, $uibModal, $filter, $q, fac, equipment) {
        fac.setParkTree($scope);
        window.$scope = $scope;
        $scope.item = equipment;
        
        //获取维保单位
        $rootScope.searchOrg(null,'maintenanceUnit').then(function (data) {
            $scope.auths=data;
        })
        // wjlong BEGIN 设备监控类型 选择树
        // 获取数据
        var eqMonitTypeTreePromise = $http.get("/ovu-pcos/pcos/equipment/equipmentType.do");
        eqMonitTypeTreePromise.then(function (result) {
            $scope.eqMonitTypeTree = result.data.nodes;
        });
        // 点击事件
        $scope.selectMonitType = function (node) {
            // 判断是不是叶节点
            if (!angular.isArray(node.nodes)) {
                equipment.equipment_name = node.ptexts;
                equipment.equipmentType_id = node.id;
                equipment.eqMonitTypeFocus = equipment.eqMonitTypeHover = false;
            } else {
                alert("请选择叶节点！");
            }
        };
        // wjlong END

        //集团版, 用于选择项目
        $scope.selectPark = function (node) {
            if (node.data.parkType == 1) {
                equipment.park_id = node.id;
                equipment.park_name = node.fullPath;
                equipment.parkHover = equipment.parkFocus = false;
            } else {
                alert("请先择项目！");
            }
            //选择项目后，初始化高德地图定位（新增）
            var center;
            if (node.data.trPosition) {
                center = node.data.trPosition.split(',');
            } else {
                center = [114.32233, 30.471139];
            }
            
            $scope.myMap.setCenter(new AMap.LngLat(center[0], center[1]));
        }


        function getBindSensorTypes(model_id) {
            var deferred = $q.defer();
            $http.get("/ovu-pcos/pcos/equipment/getDetectParams.do", { params: { equip_model_id: model_id } }).success(function (detectParams) {
                $scope.sensorTypes = detectParams.reduce(function (ret, n) {
                    var existsType = ret.find(function (m) { return m.sensor_type_id == n.sensor_type_id });
                    if (!existsType) {
                        existsType = { sensor_type_id: n.sensor_type_id, sensor_type_name: n.sensor_type_name, params: [] };
                        ret.push(existsType);
                    }
                    existsType.params.push(n);
                    return ret;
                }, []);
                deferred.resolve($scope.sensorTypes);
            })
            return deferred.promise;
        }

        $scope.cameras=[];
        //用于获取自定义参数 及其值
        if (equipment.id) {
            $http.get("/ovu-pcos/pcos/equipment/get.do?id=" + equipment.id).success(function (resp) {
                if (resp.success) {
                    $scope.cameras=resp.data.cameras||[];
                    if (resp.data.defs && resp.data.defs.length) {
                        resp.data.defs.forEach(function (n) {
                            n.val_type == 3 && n.option_list && (n.options = n.option_list.split(","));
                            n.val_type == 2 && (n.val = Number.parseFloat(n.val));
                        })
                    }
                    angular.extend(equipment, resp.data);
                    var node = $scope.flatDetpTree.find(function (n) {
                        return equipment.use_company == n.id
                    })
                    if (node) {
                        equipment.useDeptName = node.text;
                    }
                    if (equipment.model_id) {
                        getBindSensorTypes(equipment.model_id).then(function (data) {
                            $scope.sensors = [];
                            equipment.sensors = equipment.sensors || [];
                            $scope.sensors = equipment.sensors.reduce(function (ret, n) {
                                var existSensor = ret.find(function (m) { return m.id == n.id });
                                if (!existSensor) {
                                    existSensor = { id: n.id, name: n.name, mac: n.mac, sensor_type_id: n.sensor_type_id, sensor_type_name: n.sensor_type_name, params: [] };
                                    ret.push(existSensor);
                                }
                                existSensor.params.push(n);
                                return ret;
                            }, []);
                        })
                    }
                    equipment.type_name = equipment.type_name ? equipment.type_name : "";
                    //equipment.longitude_ && addMarker(new AMap.LngLat(equipment.longitude_, equipment.latitude_));
                } else {
                    alert(resp.error);
                }
            })
            console.log($scope.item.use_company)
        }else{
            
            var node = $scope.flatDetpTree.find(function (n) {
                return equipment.deptId == n.id
            })
            if (node) {
                $scope.item.useDeptName = node.text;
                $scope.item.use_company=node.id
            }
            console.log(equipment.parkName_top)
            $scope.item.park_id=equipment.parkId_top
        }
        //添加传感器
        $scope.addSensor = function (sensorType) {
            $scope.sensors.push($.extend(true, {}, sensorType));
        }

        $scope.curEquipType =  $scope.equipTypeTreeFlat.find(function(n){return equipment.model_id==n.id})

        if(equipment.preSetEquipType){
            $scope.keyNode = $scope.equipTypeTreeFlat.find(function(n){return equipment.preSetEquipType==n.equipType})
        }else if(equipment.model_id){
            var node = $scope.equipTypeTreeFlat.find(function(n){return n.id ==equipment.model_id  });
            var pnodes = $scope.equipTypeTreeFlat.filter(function(n){return  (node.pids && node.pids.indexOf(n.id)>-1)||node.id==n.id })
            $scope.keyNode = pnodes.find(function(n){return $rootScope.equipTypeDict.find(function(m){return m[0]==n.equipType})})
        }

        $scope.selectType = function (host,node) {
            if(!node){
                delete $scope.keyNode;
                return;
            }
            var pnodes = $scope.equipTypeTreeFlat.filter(function(n){return  (node.pids && node.pids.indexOf(n.id)>-1)||node.id==n.id })
            var keyNode = pnodes.find(function(n){return $rootScope.equipTypeDict.find(function(m){return m[0]==n.equipType})})
            if(keyNode && keyNode.equipType == 'sensor'){
                delete  equipment.model_id;
                delete  equipment.type_name;
                alert('请勿手动添加传感器!');
                return;
            }
            $scope.keyNode = keyNode;

            getAttrDefs((node.pids ? node.pids + "," : '') + node.id);

            getBindSensorTypes(equipment.model_id).then(function (data) {
                $scope.sensors = [];
                equipment.sensors = equipment.sensors || [];
                $scope.sensors = equipment.sensors.reduce(function (ret, n) {
                    var existSensor = ret.find(function (m) { return m.id == n.id });
                    if (!existSensor) {
                        existSensor = { id: n.id, name: n.name, mac: n.mac, sensor_type_id: n.sensor_type_id, sensor_type_name: n.sensor_type_name, params: [] };
                        ret.push(existSensor);
                    }
                    existSensor.params.push(n);
                    return ret;
                }, []);
            })
            // console.log(node);
        };

        //传感器列表 选择应急工单工作分类
        $scope.selectWorktype = function (node, param) {
            if (node.id && node.id != param.worktype_id) {
                param.worktype_id = node.id;
                param.worktype_name = (node.ptexts ? node.ptexts + " > " : "") + node.text;
                param.worktypeHover = param.worktypeFocus = false;
            }
            // console.log(node);
        };

        $scope.clearWorkType = function (param) {
            delete param.worktype_name;
            delete param.worktype_id;
        }

        //获取类型中给设备定义的参数列表
        function getAttrDefs(typeIds) {
            $http.get("/ovu-pcos/pcos/equipment/getAttrDefinition.do?typeIds=" + typeIds).success(function (resp) {
                if (resp.success) {
                    if (resp.data && resp.data.length) {
                        resp.data.forEach(function (n) {
                            n.val_type == 3 && n.option_list && (n.options = n.option_list.split(","));
                        })
                        equipment.defs = resp.data;
                    } else {
                        equipment.defs = [];
                    }
                } else {
                    alert(resp.error);
                }
            })
        }
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            if ($scope.sensors.find(function (n) { return !n.id || !n.name })) {
                alert("请关联传感器！");
                return;
            }
            item.sensors = [];
            $scope.sensors.forEach(function (sensor) {
                sensor.params.forEach(function (param) {
                    param.sensor_id = sensor.id;
                    item.sensors.push(param);
                })
            })
            item.STAGE && (item.stage_id = item.STAGE.stageId);
            item.FLOOR && (item.floor_id = item.FLOOR.floorId);
            item.attrs = item.defs.map(function (n) {
                return {
                    id: n.attr_id,
                    val: n.val,
                    def_id: n.id
                }
            });

            var cameraIds=[];
            $scope.cameras.forEach(function(camera){
                cameraIds.push(camera.id);
            });
            item.camera_ids=cameraIds.join();

            $http.post("/ovu-pcos/pcos/equipment/save.do", item).success(function (data, status, headers, config) {
                if (data.success) {
                    $uibModalInstance.close(item);
                    msg("保存成功!");
                } else {
                    if(data.error.indexOf('不一致')!=-1){
                        warn(data.error);
                    }else{
                        alert(data.error);
                    }
                }
            })
        }

        //更改维保单位
        $scope.changeOperatorCompany = function (authOrgId) {
            if (authOrgId) {
                getOrgTree(authOrgId);
            }else{
                $scope.item.maintainOrgId=null;
                $scope.item.maintainDeptId=null;
                $scope.item.maintainDeptName=null;
                $scope.orgTree=[];
            }
        }
        //加载维保部门树
        if (equipment.maintainOrgId){
            getOrgTree(equipment.maintainOrgId);
        }
        function getOrgTree(domainId){
            var param={
                domainId:domainId
            };
            $http.post("/ovu-base/system/dept/orgTree.do",param,fac.postConfig).then(function(resp){
                $scope.orgTree=resp.data;
            })
        }

        $scope.chooseSensor = function (parkId, sensor) {
            if (!parkId) {
                alert("请先选择项目！");
                return;
            }
            var excludeSensorIds = $scope.sensors.reduce(function (ret, n) { if (n.id && n.id != sensor.id) { ret.push(n.id) }; return ret; }, [])
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/equipment/selector.sensor.html',
                controller: 'sensorSelectorCtrl',
                resolve: {
                    data: function () {
                        return {
                            parkId: parkId,
                            excludeSensorIds: excludeSensorIds,
                            sensor: angular.extend({}, sensor)
                        };
                    }
                }
            });
            modal.result.then(function (data) {
                sensor.id = data.id;
                sensor.name = data.name;
                sensor.mac = data.mac;
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        //地图配置参数
        //判断app.park 中有无坐标
       /* var mapCenter;
        if (app.park && app.park.blPosition) {
            mapCenter = app.park.blPosition
            .split(",");
        } else {
            // 默认定位到武汉创意天地
            mapCenter = [114.32233, 30.471139];

        }
        $scope.markers = [];
        $scope.mapOptions = {
            toolbar: false,
            // map-self config
            //设置地图初始化的中心点
            center: new AMap.LngLat(mapCenter[0], mapCenter[1]),
            // ui map config
            uiMapCache: false,
            zoom: 17,
            geocoder: true
        };

        var geocoder;
        //查询位置
        $scope.searchPoint = function () {
            //加载查询组件
            if (!geocoder) {
                AMap && AMap.service('AMap.Geocoder', function () { //回调函数
                    //实例化Geocoder
                    geocoder = new AMap.Geocoder({});
                })
            }
            geocoder && geocoder.getLocation($scope.item.searchLocation, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    addMarker(result.geocodes[0].location);
                } else {
                    alert("获取位置失败");
                }
            });
        }
        //点击地图
        $scope.clickMap = function ($event, $params) {
            addMarker($params[0].lnglat);
        }
        //添加标记
        function addMarker(lnglat) {
            $scope.myMap.clearMap();
            $scope.myMap.panTo(lnglat);
            var makers = [];
            makers.push(new AMap.Marker({
                map: $scope.myMap,
                position: lnglat
            }));
            $scope.markers = makers;
            //经度
            $scope.item.longitude_ = lnglat.lng;
            //纬度
            $scope.item.latitude_ = lnglat.lat;
        }

        $rootScope.map = $scope.myMap;*/

        /**
         * 2017/10/19 by wangheng
         * 选择维保单位
         */
        $scope.chooseMaintenanceNumber = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                component: 'maintenanceModelComponent'
            });
            modal.result.then(function (data) {
                $scope.item.maintain_name = data.companyName;
                $scope.item.maintain_number = data.number;
            }, function () { });
        }

        /*$scope.clickCameraTab = function(){
            !$scope.nvrList && $http.get("/ovu-pcos/pcos/videomanagement/nvr/list.do").success(function (data, status, headers, config) {
                $scope.nvrList = data;
            });
            //获取监控服务编号编号列表
            !$scope.imosList && $http.get("/ovu-pcos/pcos/videomanagement/imos/list.do").success(function (data, status, headers, config) {
                $scope.imosList = data;
            });
        }*/

        $scope.chooseCamera = function(){
            if(!equipment.park_id){
                alert('请先选择项目!');
                return;
            }
            var cameraIds = $scope.cameras.reduce(function (ret, n) {
                ret.push(n.id);
                return ret
            }, []).join(',');
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/equipment/selector.equipmen.mult.html',
                controller: 'equipmentSelectorMultCtrl'
                ,resolve: {data: function(){return {parkId:equipment.park_id,preSetEquipType:"camera",cameraIds:cameraIds,selectEqList:$scope.cameras}}}
            });
            modal.result.then(function (data) {
                if(data){
                    console.log(data)
                    var ids = $scope.cameras.reduce(function (ret, n) {
                        ret.push(n.id);
                        return ret
                    }, []).join(',');
                   
                    data.forEach(v=>{
                        if(ids.indexOf(v.id)==-1){
                            $scope.cameras.push({id:v.id,equip_simple_name:v.equip_simple_name})
                        }
                    })
                }
            });
        }
        //删除摄像头
        $scope.delCamera=function(cameras,p){
            cameras.splice(cameras.indexOf(p),1);
        };



    });

    app.controller('selectDetectParamModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, detectParams) {

        $scope.config = {
            edit: false,
            showCheckbox: true
        }
        $scope.rightList = [];

        $http.get("/ovu-pcos/pcos/sensor/getSensorTree.do?withDetectParam=true").success(function (resp) {
            if (resp.success) {
                $scope.detectParamTree = resp.data;
                $scope.flatData = fac.treeToFlat($scope.detectParamTree);

                detectParams.forEach(function (param) {
                    var node = $scope.flatData.find(function (n) {
                        return n.detect_param_id == param.detect_param_id
                    });
                    node.state = node.state || {};
                    node.state.checked = true;
                    //                        expandFather(node);
                    $scope.rightList.push(node);
                })
            }
        })

        function expandFather(node) {
            var father = $scope.flatData.find(function (n) {
                return n.id === node.pid
            });
            if (father) {
                father.state = father.state || {};
                father.state.expanded = true;
                expandFather(father);
            }
        }

        $scope.check = function (node) {

            node.state = node.state || {};
            node.state.checked = !node.state.checked;

            function checkSons(node, status) {
                node.state = node.state || {};
                node.state.checked = status;
                if (node.nodes && node.nodes.length) {
                    node.nodes.forEach(function (n) {
                        checkSons(n, status);
                    })
                }
            }

            function uncheckFather(node) {
                if (!node.pid) return;
                var father = $scope.flatData.find(function (n) {
                    return n.id == node.pid
                });
                if (father) {
                    father.state = father.state || {};
                    father.state.checked = false;
                    uncheckFather(father);
                }
            }
            if (node.state.checked) {
                checkSons(node, true);
            } else {
                checkSons(node, false);
                uncheckFather(node);
            }
            $scope.rightList = $scope.flatData.filter(function (n) {
                return n.state && n.state.checked == true && n.detect_param_id
            })
        }
        $scope.save = function () {
            $scope.rightList.forEach(function (n) {
                n.id = n.params_id
            });
            $uibModalInstance.close({
                params: $scope.rightList
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('selectMatainCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $scope.item={};
        //获取维保单位
        $rootScope.searchOrg(null,'maintenanceUnit').then(function (data) {
            $scope.auths=data;
        });

        //更改维保单位
        $scope.changeOperatorCompany = function (authOrgId) {
            if (authOrgId) {
                getOrgTree(authOrgId);
            }else{
                $scope.item.authOrgId=null;
                $scope.item.id=null;
                $scope.item.name=null;
                $scope.orgTree=[];
            }

            function getOrgTree(domainId){
                var param={
                    domainId:domainId
                };
                $http.post("/ovu-base/system/dept/orgTree.do",param,fac.postConfig).then(function(resp){
                    $scope.orgTree=resp.data;
                })
            }
        }

        $scope.save = function (form,item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            if(!item.id){
                alert('请选择维保部门！');
                return;
            }

            $http.post("/ovu-pcos/pcos/equipment/setEquipMatain.do", {ids:data,authOrgId:item.authOrgId,authDeptId:item.id},fac.postConfig).success(function (resp) {
                if (resp.success) {
                    msg('批量设置成功！');
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            })

        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    app.controller('setEqStatusCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
    
       

       
        $scope.save = function (form,item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }


            $http.post("/ovu-pcos/pcos/equipment/batchEditEquipStatus", {ids:data,equipStatus:$scope.item.equipStatus},fac.postConfig).success(function (resp) {
                if (resp.code==0) {
                    msg('批量设置成功！');
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            })

        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    
})();
