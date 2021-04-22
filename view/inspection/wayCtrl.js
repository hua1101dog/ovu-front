// 巡查线路管理
(function () {
    var app = angular.module("angularApp");

    app.service('wayService', wayService);

    function wayService($q) {
        //添加标记,wayData为线路数据，data为巡查点数据
        this.addMarker = function (map, data, wayData) {
            var imagePath;
            if (data.type == 2 || data.insPointType==2) { //室外点
                if (data.identifyType == 1) {
                    //开始点
                    imagePath = '../res/img/inspection/u1587.png';
                } else if (data.identifyType == 2) {
                    imagePath = '../res/img/inspection/u1576.png';
                    //结束点
                } else {
                    //中间
                    imagePath = '../res/img/inspection/u779.png';
                }

            } else { // 室内点
                if (data.identifyType == 1) {
                    //开始点
                    imagePath = '../res/img/inspection/u1587.png';
                } else if (data.identifyType == 2) {
                    imagePath = '../res/img/inspection/u1576.png';
                    //结束点
                } else {
                    imagePath = '../res/img/inspection/u787.png';
                }


            }
            var icon = new AMap.Icon({
                image: imagePath,

                size: new AMap.Size(30, 34),
                // 图标的取图地址
                image: imagePath,
                // 图标所用图片大小
                imageSize: new AMap.Size(29, 30),
                // 图标取图偏移量
                imageOffset: new AMap.Pixel(-3, 5)
            });
            var marker = new AMap.Marker({
                icon: icon,
                position: [data.longitude, data.latitude],
                map: map,
                extData: wayData ? wayData : data
            });
            marker.setLabel({ //label默认蓝框白底左上角显示，样式className为：amap-marker-label
                // offset: new AMap.Pixel(15, 15), //修改label相对于maker的位置
                content: data.name
            });


            return marker;
        }
        //添加折线
        this.addPolyline = function (map, path, data) {
            var polyline = new AMap.Polyline({
                path: path, //设置线覆盖物路径
                strokeColor: this.getRandomColor(), //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 5, //线宽
                strokeStyle: "solid", //线样式
                strokeDasharray: [10, 5], //补充线样式
                showDir: true,
                map: map,
                bubble: false,
                extData: data
            });
            return polyline;
        }
        //处理已选择的id，返回一个id数组
        this.reduceIds = function (selecedPoints) {
            return selecedPoints && selecedPoints.reduce(function (ret, n) {
                ret.push(n.insPointId);
                return ret
            }, [])
        }
        //生成随机颜色
        this.getRandomColor = function () {
            return '#' +
                (function (color) {
                    return (color += '0123456789abcdef' [Math.floor(Math.random() * 16)]) &&
                        (color.length == 6) ? color : arguments.callee(color);
                })('');
        }

    }

    app.controller('wayCtrl', function ($scope, $rootScope, $uibModal, $http, $filter, fac, wayService, $timeout, mapService) {
        document.title = "巡查路线";
        $scope.pageModel = {};
        $scope.title = '添加'
        $scope.search = {};
        $scope.item = {};
      
        $scope.postTree=[]
        $scope.isEdit = false; //是否是编辑
        var mapCenter
        var ovu2DMap;
        var map2dDraw;
        var CanvasLayer;
  
        
        app.modulePromiss.then(function () {
            $scope.$watch("dept.id", function (deptId, oldValue) {
               
                if (deptId) {
                   
                    if (!$scope.dept.parkId) {
                  
                        alert("请选择项目下的部门");
                        $scope.search.parkId && delete $scope.search.parkId;
                        $scope.search.parkName && delete $scope.search.parkName;
                        $scope.search.deptId && delete $scope.search.deptId;
                        $scope.search.fdeptId && delete $scope.search.fdeptId;
                        $scope.search.nodeText && delete $scope.search.nodeText;
                        $scope.childTree=[]
                        $scope.postTree=[]
                        $scope.mainMap.clearMap();
                        return;
                   
                    }
                    $scope.mainMap.clearMap();
                    $scope.childTree=[]
                    $scope.postTree=[]
                    $scope.search.deptId=deptId
                    $scope.search.fdeptId=deptId
                    $scope.search.nodeText=''
                    if ($scope.dept.parkId) {
                     
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.parkName = $scope.dept.deptName;
                      
                        $scope.park = getPostion();
                      
                        mapCenter = [
                            $scope.park["mapLng"],
                            $scope.park["mapLat"],
                        ];
                     
                        findByWathchParkId();
                        $rootScope.execTreeNode($rootScope.deptTree, function(
                            node
                        ) {
                         
                            if (node.id && (node.id==$scope.dept.id)) {
                            
                             $scope.childTree=node.nodes || []
                            }
                            
                        });
                        $rootScope.execTreeNode($scope.childTree, function(
                            node
                        ) {
                           
                            if (node.parkId) {
                                node.fdeptId=node.id
                           
                            }else{
                                node.fdeptId=$scope.search.deptId
                          
                            }
                            
                        });
                        $scope.find();
                        $scope.search.postName =''
                    } else {
                        $scope.search.parkName && delete $scope.search.parkName;
                        $scope.search.parkId && delete $scope.search.parkId;
                       
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
             
                   
              
                
                }

                $scope.mainMap.setCenter(mapCenter);

            
            });
          
               
      
           

        })
       
   
        //查询巡查点列表
        $scope.find = function () {
            $scope.mainMap.clearMap();
            var param = {
                deptId:$scope.search.fdeptId,
             
                insType:1
             
            }
            $scope.search.name && angular.extend(param, {
                name: $scope.search.name
            })
            $http.get('/ovu-pcos/pcos/inspection/inspoint/map', {
                params: param
            }).success(function (resp) {
                if (resp.code == 0) {
                    // setMapBounds(resp.data);
                    if (resp.data.length !== 0) {
                        var markers = [];
                        $scope.markList = resp.data
                        resp.data.forEach(function (da) {
                            if (da.longitude && da.latitude) {
                                var marker = wayService.addMarker($scope.mainMap, da);
                                markers.push(marker);
                          
                            }
                        })
                        if(resp.data.length==1){
                            $scope.mainMap.setCenter([resp.data[0].longitude, resp.data[0].latitude]);
                           }
                        $scope.mainMarkers = markers;

                    }

                } else {
                    alert(resp.msg);
                }
            })
        };
       
       
         function getPost(params){
            fac.getPostbyWayTree(params).then(function (tree) {
                $scope.postTree=tree
                $rootScope.expandAll($scope.postTree)
                });
                
            }
        //监听项目id来查询必须的数据
        function findByWathchParkId () {
           
          
            getPost({deptId:$scope.search.deptId})
            findAllWay();
        }
    
       

        //点击折线
        $scope.clickPolyline = function ($event, $params, polyline) {
            $scope.selecedPoints = [];
            $scope.markerData = polyline.getExtData();
            $scope.search.deptId=$scope.markerData.deptId || ''
            $scope.search.insWayId = $scope.markerData.insWayId;
            $scope.search.wayName = $scope.markerData.wayName;
            $scope.markerData.insWayPointBo.forEach(function (p) {
                $scope.selecedPoints.push({
                    name: p.insPointName,
                    latitude: p.latitude,
                    longitude: p.longitude,
                    sort: p.sort,
                    identifyType: p.identifyType,
                    insPointId: p.insPointId,
                    insPointType: p.insPointType,
                    insWayId: p.insWayId,
                })
            });


            if ($scope.selecedPoints == []) {
                $scope.isEdit = false //是否显示完成按钮
            } else {
                $scope.isEdit = true
            }
           

        }

        function findAllWay() {
            $scope.mainMap.clearMap()
            $scope.find();
            var list = [];
            var polylines = [];
            var markers = [];
            var   params={
                    insType: 2,
                    deptId:$scope.search.deptId,
                    postId: $scope.search.postId,
                    pdeptId: $scope.search.deptId
                }
           
            $scope.search.insWayId && angular.extend(params, {
                insWayId: $scope.search.insWayId
            })

            $http.post('/ovu-pcos/pcos/inspection/insway/list.do?', params, fac.postConfig).success(function (data) {
                $scope.isnWayList = data.data || [];
                var selecedPoints = data.data;
                $scope.selecedPoints = [];
                $scope.search.insWayId && data.data.forEach(function (v) {
                    v.insWayPointBo.forEach(function (p) {
                        $scope.selecedPoints.push({
                            name: p.insPointName,
                            latitude: p.latitude,
                            longitude: p.longitude,
                            sort: p.sort,
                            identifyType: p.identifyType,
                            insPointId: p.insPointId,
                            insPointType: p.insPointType,
                            insWayId: p.insWayId,
                        })
                    })

                })
                if ($scope.isnWayList.length !== 0) {
                    selecedPoints.forEach(function (da) {
                        var path = []; //折线经纬度数组
                        da.insWayPointBo.forEach(function (point) {
                            if (point.longitude) {
                                path.push([point.longitude, point.latitude]);
                                list.push(point);
                                var marker = wayService.addMarker($scope.mainMap, point, da); //每个巡查点都要生成maker
                                markers.push(marker);
                            }
                        })
                        var polyline = wayService.addPolyline($scope.mainMap, path, da); //每个点的路线生成一个折线
                        polylines.push(polyline);
                    })
                }

                $scope.polylines = polylines;
                $scope.markers = markers;
            })
        }


        //查询部门列表
       
        $scope.polylines = [];
        
        $scope.selectNode=function(host,node){
        
            if(node){
                $scope.search.deptId=node.id;
                $scope.search.pdeptId=node.id;
                $scope.search.fdeptId=node.fdeptId
           }else{
            $scope.search.deptId=$scope.dept.id;
            $scope.search.pdeptId=$scope.dept.id;
            $scope.search.fdeptId=$scope.dept.id
            
           }
           $scope.search.insWayId && delete $scope.search.insWayId
             
           findByWathchParkId();
           $scope.search.postName =''
           
          
        }
          //选择该节点
          $scope.selectPost = function (search,node) {
          
             $scope.isEdit=false
             $scope.flag=false
            $scope.search.insWayId && delete $scope.search.insWayId
           
         
              if (node && node.state.selected) {
                  if(node.parentId=='0'){
                     if(node.nodes){
                        alert('请选择子节点')
                     }else{
                        alert('当前部门没有岗位,请重新选择部门')
                     }
                   
                     return
                  }
                  $scope.search.postId=node.id
                
                  findAllWay();
               
            }else{
                $scope.search.postId && delete $scope.search.postId
            }
            
        }
        //根据选择的巡查路线在地图上打点连线
        $scope.getWay = function (id,name,postId) {
            $scope.isEdit = true;
            $scope.isSave = true;
            $scope.search.insWayId=id,
            $scope.search.wayName=name,
            $scope.search.postId=postId
            
            $scope.mainMap.clearMap();
            
            $scope.find();
            var list = [];
            var polylines = [];
            var markers = [];
            
            $http.post('/ovu-pcos/pcos/inspection/insway/list.do?',{
                insWayId: id
            }, fac.postConfig).success(function (data) {
                $scope.selecedPoints = [];
                var selecedPoints = data.data;
               
                id && data.data.forEach(function (v) {
                    v.insWayPointBo.forEach(function (p) {
                        $scope.selecedPoints.push({
                            name: p.insPointName,
                            latitude: p.latitude,
                            longitude: p.longitude,
                            sort: p.sort,
                            identifyType: p.identifyType,
                            insPointId: p.insPointId,
                            insPointType: p.insPointType,
                            insWayId: p.insWayId,
                        })
                    })

                })
                if (selecedPoints.length !== 0) {
                    $scope.search.deptId=data.data[0].deptId;
                    $http.post('/ovu-pcos/pcos/inspection/insway/list.do?', {
                        insType: 2,
                        deptId:$scope.search.deptId,
                        postId:$scope.search.postId
                    }, fac.postConfig).success(function (data) {
                        $scope.isnWayList=data.data
        
                    })
                 
                    selecedPoints.forEach(function (da) {
                        var path = []; //折线经纬度数组
                        da.insWayPointBo.forEach(function (point) {
                            if (point.longitude) {
                               point.name=point.insPointName

                                path.push([point.longitude, point.latitude]);
                                list.push(point);
                                var marker = wayService.addMarker($scope.mainMap, point, da); //每个巡查点都要生成maker
                                markers.push(marker);
                            }
                        })
                        var polyline = wayService.addPolyline($scope.mainMap, path, da); //每个点的路线生成一个折线
                        polylines.push(polyline);
                        

                    })
                }

                $scope.polylines = polylines;
                $scope.markers = markers;
            })

            if ($scope.selecedPoints.length==0) {
                $scope.isSave = true //是否显示完成按钮
            } else {
                $scope.isSave = false
            }
           
        }
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
        //地图标记点
        $scope.mainMarkers = [];
        //折线
        $scope.polylines = [];
        //点击标记点,弹出线路详细信息
        $scope.clickMarker = function ($event, $params, marker) {
            if (!$scope.search.postId) {
                alert('请先选择岗位');
                return
            }
            $scope.isEdit = true;
            $scope.floorIshow = false;

            var point = marker.getExtData(); //获取点的数据
            $scope.item = point
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
                    $scope.pointList = [];
                    $scope.selectedFloor = index;
                    $http.get("/ovu-pcos/pcos/inspection/inspoint/getIndoorPoint.do?insPointId=" + floor.insPointId + "&floorNum=" + floor.floorNum).success(function (data) {
                        if (data.code == 0) {
                            $scope.pointList = data.data;
                            if ($scope.pointList.length !== 0) {
                                $scope.myInfoWindow.open($scope.mainMap, marker.getPosition())
                            } else {
                                $scope.myInfoWindow.close()
                            }

                        } else {
                            alert(data.msg);
                        }

                    });
                }
                //选择室内某个点位
                $scope.getPoint = function (item, index) {
                    $scope.selectPoint = index;
                    var selectIds = wayService.reduceIds($scope.selecedPoints);
                    if (selectIds.indexOf(item.insPointId) == -1) {
                        item.longitude = point.longitude
                        item.latitude = point.latitude
                        $scope.selecedPoints.push(item);
                    }
                    drawPointLine();
                }

            } else {
                //室外点，直接追加
                var selectIds = wayService.reduceIds($scope.selecedPoints);
                if (selectIds.indexOf(point.insPointId) == -1) {
                    $scope.selecedPoints.push(point);
                }
            }
            $scope.isSave = true
            drawPointLine();
        }

        //添加路线
        $scope.edit = function () {
            if(!$scope.search.postId){ 
                alert('请选择岗位！')
                return
            }
            $scope.isEdit = true;
         
            //添加
            if ($scope.selecedPoints.length !== 0) {
                $scope.selecedPoints = [];
            }
            $scope.search.insWayId && delete $scope.search.insWayId
          

        }
        //删除路线

        $scope.del = function (id) {
            var insWayIds = [];
            insWayIds.push(id)
            var param = {
                insWayIds: insWayIds
            }
            confirm("确认删除该巡查路线?", function () {
                $http.post("/ovu-pcos/pcos/inspection/insway/delete.do", param).success(function (resp) {
                    if (resp.code == 0) {
                        msg(resp.msg);
                       
                        var index = $scope.isnWayList.findIndex(function (v, i) {
                            return v.insWayId == id
                        })

                        $scope.isnWayList.splice(index, 1);
                        findAllWay()
                          getPost({deptId:$scope.search.deptId || $scope.dept.id})
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        } 
        //删除点位
        $scope.delItem = function (item,$event) {
            $event.stopPropagation()
            $event.preventDefault()
            var index = $scope.selecedPoints.findIndex(function (v) {
                return v.insPointId == item.insPointId
            })
            var path = [];
            $scope.selecedPoints.splice(index, 1);
            if ($scope.selecedPoints.length==0) {
                // $scope.isSave = false //是否显示完成按钮
            } else {
                // $scope.isSave = true
            }
            var marker = wayService.addMarker($scope.mainMap, [item.longitude, item.latitude])
            $scope.mainMap.clearMap();
            var markers = [];
            $scope.markList.forEach(function (da) {
                if (da.longitude && da.latitude) {
                    var marker = wayService.addMarker($scope.mainMap, da);
                    markers.push(marker);
                }
            })
            $scope.mainMarkers = markers;
           
            


            // drawPointLine();

            var polyLinePath = []; //折线的经纬度数组
            var polylines = [];
            $scope.selecedPoints.forEach(function (item) {
                if (item.longitude) {
                    polyLinePath.push([item.longitude, item.latitude]);
                }


            })

            var polyline = wayService.addPolyline($scope.mainMap, polyLinePath); //每个点的路线生成一个折线
            polylines.push(polyline);
            $scope.polylines = polylines;
           
        }

        function compare(val1, val2) {
            return val1.index - val2.index;
        };
        //编辑路线名
        $scope.editName2=function(item){
         
            $scope.flag=true
            item.isEdit=!item.isEdit;
        
            item.insWayPointBo && item.insWayPointBo.forEach(el=>{
                el.name=el.insPointName
            })
            $scope.selecedPoints=item.insWayPointBo
            $scope.search.insWayId=item.insWayId
            $scope.search.wayName=item.wayName
            // $scope.search.postId=item.postId
            
        }
        
        //列表拖拽
        $scope.dropComplete = function (index, obj, event) {
          
            //重新排序
            var idx = $scope.selecedPoints.indexOf(obj);
            $scope.selecedPoints.splice(idx, 1);
            $scope.selecedPoints.splice(index, 0, obj);
            $scope.mainMap.clearMap();
            drawPointLine();


        };


        $scope.save = function (flag,item) {
            $scope.floorIshow = false
           
        
            if ($scope.selecedPoints.length == 0) {
                alert('请选择巡查点');
                return
            }
          if(flag){
            save(item)
          }else{
            var name
              if(item){
                name=$scope.search.wayName
              }else{
                name=''
              }
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/inspection/modal.addWayName.html',
                controller: 'insitemSelectorCtrl',
                resolve: {
                   data:{
                    name: name
                   }

                }
                
            });
            modal.result.then(function (data) {
                save(data,true)
               
               
                   getPost({deptId:$scope.search.deptId || $scope.dept.id})
            });
          }

            function save(data){
                $scope.list = [];

            $scope.selecedPoints.forEach(function (v, i) {
                // $scope.item.pointList.push({insPointId:v.insPointId,sort:i-0+1,insPointType:v.identifyType});
                $scope.list.push({
                    insPointId: v.insPointId,
                    sort: i - 0 + 1
                });
            })
            $scope.list.forEach(function (v, i) {
                if (v.sort == 1) {
                    //开始点
                    v.identifyType = 1
                } else if (v.sort == $scope.list.length) {
                    //结束点
                    v.identifyType = 2
                } else {
                    v.identifyType = 3
                }
            })
            //根据路线id查询出所有的路线，进行地图打点以及连线
            var wayName
            wayName=data.wayName
            var param = {
                insType: 2,
                // parkId: $scope.search.parkId,
                deptId: $scope.search.deptId,
                postId: $scope.search.postId,
                pdeptId: $scope.search.pdeptId,
                wayName: wayName
            }
            param.insWayPointBo = $scope.list;
            $scope.search.insWayId && angular.extend(param, {
                insWayId: $scope.search.insWayId
            });
           
           
            $http.post('/ovu-pcos/pcos/inspection/insway/edit', param).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
               
               
                    $scope.selecedPoints=[];
                    $scope.search.insWayId='';
               
                    findAllWay();
                     getPost({deptId:$scope.search.deptId || $scope.dept.id})

                } else {
                    alert(data.msg);

                }
            })
            }
            $scope.isEdit=false
            $scope.flag=false

        }

        //绘制点的路线
        function drawPointLine() {

            var polyLinePath = []; //折线的经纬度数组
            var polylines = [];
            $scope.selecedPoints.forEach(function (item) {
                if (item.longitude) {
                    polyLinePath.push([item.longitude, item.latitude]);
                }


            })
            var markers = [];
            $scope.markList.forEach(function (da) {
                if (da.longitude && da.latitude) {
                    var marker = wayService.addMarker($scope.mainMap, da);
                    markers.push(marker);
                }
            })
            $scope.mainMarkers = markers;
            var polyline = wayService.addPolyline($scope.mainMap, polyLinePath); //每个点的路线生成一个折线
            polylines.push(polyline);
            $scope.polylines = polylines;



        }

       
       
       



    });
      app.controller('insitemSelectorCtrl', function ($scope, $rootScope, $http, $uibModal, $uibModalInstance, $timeout, $filter, fac,data) {
        $scope.item={}
        $scope.item.wayName=data.name || ''
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $uibModalInstance.close($scope.item);
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

      



    });




})()
