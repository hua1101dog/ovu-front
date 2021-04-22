/**
 * 巡查项管理控制器
 */
(function () {
    var app = angular.module("angularApp");
    app.controller('realTimeCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac,$compile) {
        document.title = "实时巡查调度";
        
        var mapCenter
        var mapCenter;
        var ovu2DMap;
        var map2dDraw;
        var CanvasLayer;
        $scope.pageModel = {};
        $scope.search = {};
        
        $scope.insItemTypeId = {};
        $scope.isShow = false; //是否展示附近人员和视频监控
        $scope.isPlay=false;
         //地图基本配置
         $scope.mainMapOptions = {
            toolbar: true,
            // map-self config
            resizeEnable: true,
            // ui map config
            uiMapCache: false,
            zoom: 15,
            //精简模式
            liteStyle: true,
            expandZoomRange: true
        };
        $scope.find = function (pageNo, insItemTypeId) {
            
            if (angular.isDefined(insItemTypeId)) {
                $scope.search.insItemTypeId = insItemTypeId;
            }
            var params={deptId:$scope.search.deptId,insItemTypeId:$scope.search.insItemTypeId}

            //地图
            $http.get('/ovu-pcos/pcos/inspection/inspoint/findByItemtype',{params:params}).success(function (resp) {
                $scope.mainMap.setCenter(mapCenter);
                $scope.mainMap.clearMap();
                if (resp.code == 0) {
                    // setMapBounds(resp.data);
                    if (resp.data.length !== 0) {
                        var markers = [];
                        resp.data.forEach(function (da) {
                            if (da.longitude && da.latitude) {
                                var markerCamara = addmainMarker(da);
                                markers.push(markerCamara);
                               
                            }
                        })
                        $scope.mainMarkers = markers;

                    }
                } else {
                    alert(resp.msg);
                }
            })
        };

        $scope.findAll = function (params) {
            //树数据
            $http.get("/ovu-pcos/pcos/inspection/insitemtype/tree.do",{params: params}).success(function (data) {
                $scope.ins_real_TreeData = data.data || [];
                !$scope.ins_real_TreeData[0] && ($scope.pageModel = {});
                
                $scope.ins_real_TreeData[0] && ($scope.ins_real_TreeData[0].state={}) && ($scope.ins_real_TreeData[0].state={selected:true}) && $scope.selectNode('',$scope.ins_real_TreeData[0]);
            });
        }
        //初始化方法
        app.modulePromiss.then(function () {
            // if(app.user.adminType=='domain_admin'){
            //     $scope.search.deptId && delete  $scope.search.deptId
            //     $scope.findAll()
            //   }else{
                
            //   }
            $scope.$watch('dept.id', function (deptId, oldValue) {
                // if(!$scope.node.parkId){
                //     alert('请选择叶子节点');
                //     return
                // }
                if(deptId){
                    if($scope.dept.parkId){
                        $scope.park=getPostion();
                        mapCenter=[$scope.park['mapLng'],$scope.park['mapLat']];
                     
                    }else{
                        $scope.search.parkName && delete $scope.search.parkName;
                        $scope.search.parkId  && delete $scope.search.parkId;
                        $scope.deptList && delete $scope.deptList
                         // 默认定位到武汉创意天地
                    mapCenter = [114.32233, 30.471139];
                    }
                      //画出图层
                            var mapProperties = $scope.park.director ? $scope.park.director.split(","):[];
                            var width = mapProperties[0]?Number(mapProperties[0]):2000;
                            var height = mapProperties[1]?Number(mapProperties[1]):2000;
                            var zoom  = mapProperties[2]?Number(mapProperties[2]):2.76;
                            //地图需要参数
                            var topRight = $scope.park.trPosition ? $scope.park.trPosition.split(",") : undefined;
                            var bomLeft =  $scope.park.blPosition ? $scope.park.blPosition.split(",") : undefined;
                            /*var width =  $scope.mainMap.mapWidth ?  $scope.mainMap.mapWidth :2000;
                            var height =  $scope.mainMap.mapHeight ?  $scope.mainMap.mapHeight :1000;
                            var zoom =  $scope.mainMap.mapZoom ?  $scope.mainMap.mapZoom :2.5;*/
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
                                map2dDraw.draw( _curFloor,$scope.mainMap)
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
                            //把图层 存放到 地图中
                            CanvasLayer.setMap($scope.mainMap);
                            //绘图循环的核心方法
                                draw(23);
                               
                                
                              }
                 
                 function getPostion(){
                    var position=[]
                    function getNode(nodes){
                       nodes && nodes.forEach(function(n){
                           if(n.id==$scope.dept.parkId){
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
                
                 $scope.search.deptId=deptId;
                 $scope.findAll({deptId:$scope.search.deptId});
                }
            })
           
        })
      
       
        //选择该节点
        $scope.selectNode = function (search,node) {
          
            if (node.state.selected) {
                
                $scope.find(1, node.id);
            } 
           }
        //点击地图上的点
        var compileFn;
        var template;
        $scope.clickMainMap = function ($event, $params, marker) {
            $scope.floorIshow = false;
            var point = marker.getExtData(); //获取点的数据
            if(point.personId){
               return  //只可点击视频点
            }
            $scope.item = point;
            var param = {
                deptId: $scope.search.deptId,
                insPointId: point.insPointId,
                longitude: point.longitude,
                latitude: point.latitude
            }
            //如果为楼栋点，则显示楼栋
            if (point.type == 1) {
                //获取楼层
                $http.get('/ovu-pcos/pcos/inspection/inspoint/getIndoorFloor.do?insPointId=' + point.insPointId).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.floorList = resp.data;
                        $scope.floorIshow = true;
                        $scope.floorList.forEach(function (v) {
                            v.insPointId = point.insPointId
                        })
                    } else {
                        alert(resp.msg);
                    }
                })
                //获取室内点位
                $scope.getPointList = function (floor, index) {
                    $scope.pointList=[];
                    $scope.selectedFloor = index;
                    $http.get("/ovu-pcos/pcos/inspection/inspoint/getIndoorPoint.do?insPointId=" + floor.insPointId + "&floorNum=" + floor.floorNum).success(function (data) {
                        if (data.code == 0) {
                            $scope.pointList = data.data;
                            if($scope.pointList.length!==0){
                                $scope.myInfoWindow.open($scope.mainMap, marker.getPosition())
                            }else{
                                $scope.myInfoWindow.close()
                            }
                           
                        } else {
                            alert(data.msg);
                        }

                    });
                }
                //选择室内某个点位
                $scope.getPoint = function (insPointId, index) {
                    $scope.selectPoint = index;
                    // 展示视频和附近人员
                    $scope.isPlay=false;
                    $scope.isPlay=true
                    $scope.equipmentId = point.equipmentId;
                    $scope.src="/view/video.html?equipmentId="+$scope.equipmentId;
                    $('#video').html('');
                    template = "<iframe ng-src='{{src}}'  style='width: 100%;height: 320px'></iframe>"
                    compileFn = $compile(template);
                    var $dom = compileFn($scope);
                    $dom.appendTo($('#video'));
                    $http.get('/ovu-pcos/pcos/inspection/inspoint/findPerson', {
                        params: param
                    }).success(function (data) {
                        if (data.code == 0) {
                            $scope.personList = data.data || []
                            if (data.data.length !== 0) {
                                data.data.forEach(function (v) {
                                    if (v.mapLng && v.mapLat) {
                                        v.longitude=v.mapLng
                                        v.latitude=v.mapLat
                                        var marker = addmainMarker(v);
                                        $scope.mainMarkers.push(marker);
                                    }
                                })
                            }
                           
                        }

                    })
                }
            }else{
                $scope.isShow = true;
                $scope.isPlay=true
                $http.get('/ovu-pcos/pcos/inspection/inspoint/findPerson', {
                    params: param
                }).success(function (data) {
                    if (data.code == 0) {
                        $scope.personList = data.data || [];
                        $scope.equipmentId = point.equipmentId;
                        $scope.src="/view/video.html?equipmentId="+$scope.equipmentId;
                        $('#video').html('');
                        template = "<iframe ng-src='{{src}}'  style='width: 100%;height: 320px'></iframe>"
                        compileFn = $compile(template);
                        var $dom = compileFn($scope);
                        $dom.appendTo($('#video'));
                        if (data.data.length !== 0) {
                            data.data.forEach(function (v) {
                                if (v.mapLng && v.mapLat) {
                                   
                                    v.longitude=v.mapLng
                                    v.latitude=v.mapLat
                                    var marker = addmainMarker(v);
                                    $scope.mainMarkers.push(marker);
                                }
                            })
                        }
                       
                    }
    
                })
            }
            


        }
        //鼠标悬浮操作
     
        $scope.mouseoverMaker = function ($event, $params, marker) {
           
            // $scope.insList=[];
            // $scope.markerData = marker.getExtData();
            // if($scope.markerData.personId){
            //   return
            // }
            // var param = {
            //     // parkId: $scope.search.parkId,
            //     insPointId:  $scope.markerData.insPointId
            // }
            // $http.get("/ovu-pcos/pcos/inspection/instask/findByInsPoint", {
            //     params: param
            // }).success(function (resp) {
            //     if (resp.code == 0) {
            //         $scope.insList =resp.data ||  [];
            //     } else {
            //         alert(resp.msg);
            //     }
            // });
            // $scope.personInfoWindow.open($scope.mainMap, marker.getPosition());
            // $scope.mainMap.setFitView();
         
        }
        //鼠标离开操作
        $scope.mouseoutMaker = function ($event, $params, marker) {
           
            // $scope.personInfoWindow.close()
            // // $scope.mainMap.setFitView();
            // $scope.insList=[];
        }

        //电话通知
        $scope.toTel = function (item) {
            var param = {
                deptId: $scope.search.deptId,
                executorId: item.personId,
                insPointId: item.inspointId
            }
            $http.get("/ovu-pcos/pcos/inspection/inscommandresult/save.do", {
                params: param
            }).success(function (resp) {
                if (resp.code == 0) {
                    msg(resp.msg);
                } else {
                    alert(resp.msg);
                }
            });
        }

        function addmainMarker(data) {
            var contents=''
            if(data.personId){
                contents='<div><span>'+data.personName+'</span><br><span>'+data.telephone+'</span></div>'
            }else{
                contents='<div>'+data.name+'</div>'
            }
          
            var imagePath;
            //判断是视频点还是人员点
            if (data.personId) {
                //人员点
                imagePath = '../res/img/inspection/u4926.png';
            } else {
                //判断是室内点还是室外点
                if (data.type == 2) { //室外点
                    if (data.equipmentId) { //是否是视频巡查
                        imagePath = '../res/img/inspection/out-camera.png';
                    } else {
                        imagePath = '../res/img/inspection/out.png';
                    }
                } else {
                    if (data.equipmentId) {
                        imagePath = '../res/img/inspection/in.png';
                    } else {
                        imagePath = '../res/img/inspection/in.png';
                    }
                }
            }

            var icon = new AMap.Icon({
                image: imagePath,

                size: new AMap.Size(30, 34),
                // 图标的取图地址
                image: imagePath,
                // 图标所用图片大小
                imageSize: new AMap.Size(30, 30),
                // 图标取图偏移量
                imageOffset: new AMap.Pixel(0, 5)
            });
            var marker = new AMap.Marker({
                position: [data.longitude, data.latitude],
                map: $scope.mainMap,
                icon: icon,
                extData: data
            });
            marker.setLabel({ //label默认蓝框白底左上角显示，样式className为：amap-marker-label
                offset: new AMap.Pixel(20, 20), //修改label相对于maker的位置
                content: contents

            });
            return marker;
        }
        //关闭摄像头
         $scope.cancel=function(){
             $scope.isPlay=false
           
         }

       
       
    });


})();
