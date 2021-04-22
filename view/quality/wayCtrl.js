(function() {
		var app = angular.module("angularApp");

		app.service('wayService',wayService);
		function wayService($q) {
            //添加标记,wayData为线路数据，data为巡查点数据
            this.addMarker = function(map, data ,wayData) {
                var imagePath;
                if(data.type == 2){
                    if(data.equipmentId){
                        imagePath = '../res/img/quality/out-ins-video.png';
                    }else {
                        imagePath = '../res/img/quality/out-ins-novideo.png';
                    }
                }else {
                    if(data.equipmentId){
                        imagePath = '../res/img/quality/in-ins-video.png';
                    }else {
                        imagePath = '../res/img/quality/in-ins-novideo.png';
                    }
                }
                var icon = new AMap.Icon({
                    image : imagePath
                });
                var marker = new AMap.Marker({
                    icon : icon,
                    position : [data.longitude,data.latitude],
                    map : map,
                    extData: wayData ? wayData : data
                });
                marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
                    offset : new AMap.Pixel(20, 20),//修改label相对于maker的位置
                    content : data.name
                });
                return marker;
            }
            //添加折线
            this.addPolyline = function (map,path, data) {
                var polyline = new AMap.Polyline({
                    path: path,          //设置线覆盖物路径
                    strokeColor: this.getRandomColor(), //线颜色
                    strokeOpacity: 1,       //线透明度
                    strokeWeight: 10,        //线宽
                    strokeStyle: "solid",   //线样式
                    strokeDasharray: [10, 5], //补充线样式
                    showDir:true,
                    map:map,
                    bubble: false,
                    extData:data
                });
                
                return polyline;
            }
			//处理已选择的id，返回一个id数组
            this.reduceIds = function(selecedPoints) {
                return selecedPoints && selecedPoints.reduce(function (ret,n) {
                    ret.push(n.insPointId);
                    return ret
                },[])
            }
            //生成随机颜色
            this.getRandomColor = function(){
                return  '#' +
                    (function(color){
                        return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])
                        && (color.length == 6) ?  color : arguments.callee(color);
                    })('');
            }
            /**地图步行导航，并返回导航距离
             *  path:[[起点经度,起点纬度],[终点经度,终点纬度]]]
             * return 一个promis.因为返回距离是异步的
             */
            this.addWalking = function(map,path){
                var deferred = $q.defer();
                var distance = 0;
                var walking = new AMap.Walking({
                    map : map,
                    hideMarkers : true,
                    autoFitView :true
                }); 
                //根据起终点坐标规划步行路线
                walking.search(path[0], path[1],function(status,result){
                    if(status === 'complete'){
                        if(result.info == "ok"){
                            distance = Math.round(result.routes[0] && result.routes[0].distance);
                        }
                        var obj = {distance :distance,walking:walking};
                        deferred.resolve(obj);
                    }
                });        
                return deferred.promise;
            }
        }

		app.controller('wayCtrl', function ($scope,$rootScope,$uibModal, $http,$filter,fac,wayService,mapService) {
            document.title ="巡查路线管理";
            $scope.pageModel = {};
            $scope.search ={};

            app.modulePromiss.then(function(){
                fac.initPage($scope, function() {
                    $scope.findByWathchParkId();
                },function () {
                    $scope.findByWathchParkId();
                });

            })
            //监听项目id来查询必须的数据
            $scope.findByWathchParkId = function () {
                $scope.find();
                findAllWay();
                getAllPointById();
            }

            //地图模式需要查询所有的巡察路线,根据项目id
            function findAllWay() {
                if(!fac.hasActivePark($scope.search)){
                    return;
                }
                $http.post('/ovu-pcos/pcos/quality/insway/loadWayName.do?parkId='+($scope.search.parkId || '')).success(function (data) {
                    $scope.isnWayList = data || [];
                })
            }

           //查询巡查点列表
			$scope.find = function(pageNo){
				if(!fac.hasActivePark($scope.search)){
                    return;
                }
                angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
				fac.getPageResult("/ovu-pcos/pcos/quality/insway/list.do",$scope.search,function(data){
					$scope.pageModel = data;
				});
			};

			//删除
			$scope.del = function(id){
				confirm("确认删除该巡查路线?",function(){
					$http.post("/ovu-pcos/pcos/quality/insway/delete.do",{"insWayId":id},fac.postConfig).success(function(resp){
						if(resp.success){
						    msg();
							$scope.find();
						}else{
							alert(resp.error);
						}
					})
				});
			}

			//新增或者修改弹出框
			$scope.showEditModal = function(id){
				if(!fac.hasOnlyPark($scope.search)){
                    return;
                }
				var modal = $uibModal.open({
					animation: false,
					templateUrl: '/view/quality/way/modal.quality.way.html',
					controller: 'WayAddOrEditModalCtrl',
					size :'lg',
					resolve: {
						param: {
							id:id,
							parkId:$scope.search.parkId
						}

					}
				});
				modal.result.then(function () {
					$scope.find();
                    findAllWay();
				}).then(function () {
                });
			}

            //地图基本配置
            $scope.mapOptions = {
                toolbar : true,
                // map-self config
                resizeEnable : true,
                // ui map config
                uiMapCache : false,
                zoom : 20,
                //精简模式
                liteStyle : true,
                expandZoomRange:true
            };
            //地图标记点
            $scope.markers = [];
            //折线
            //$scope.polylines = [];


            //根据选择的巡查路线在地图上打点连线
            $scope.changeWay = function () {
                $scope.myMap.clearMap();
                var polylines = [];
                var markers = [];
                //过滤出已选择路线id
                var selectedWayIds = [];
                $scope.isnWayList.forEach(function (way) {
                    way.checked && selectedWayIds.push(way.insWayId);
                })
                var param ={params:{wayIds:selectedWayIds}};
                //根据路线id查询出所有的路线，进行地图打点以及连线
                var list = [];   //设置地图显示方为所用的集合
                $http.get('/ovu-pcos/pcos/quality/insway/loadWayMap',param).success(function (data) {
                    data && data.forEach(function (da) {
                        var path =[];  //折线经纬度数组
                        da.pointList.forEach(function (point) {
                            if(point.longitude){
                                path.push([point.longitude,point.latitude]);
                                list.push(point);
                                var marker = wayService.addMarker($scope.myMap, point , da); //每个巡查点都要生成maker
                                markers.push(marker);
                            }
                        })
                       /*  var polyline = wayService.addPolyline($scope.myMap,path,da); //每个点的路线生成一个折线
                        polylines.push(polyline); */
                        //需求变更，不用折线了，用步行导航  
                         //步行导航
                        for (var i = 0; i < path.length - 1; i++) {
                            wayService.addWalking($scope.myMap, [path[i],path[i+1]]);
                        }
                    })
                    //mapService.setMapBounds($scope.myMap , list);
                    //$scope.polylines = polylines;
                    $scope.markers = markers;
                })

            }

             //点击标记点,弹出线路详细信息
             $scope.clickMarker = function($event, $params, marker) {
                $scope.markerData = marker.getExtData();  //获取点的数据
                $scope.myInfoWindow.open($scope.myMap,$params[0].lnglat);
            }

            //鼠标经过路径
           /*  $scope.clickPolyline = function ($event, $params, polyline) {
                $scope.markerData = polyline.getExtData();;
                $scope.myInfoWindow.open($scope.myMap,$params[0].lnglat);
            } */

            function getAllPointById() {
                //人工巡查列表 下拉框选择巡查项列表
               $http.get('/ovu-pcos/pcos/quality/insway/getAllPoint.do',{params:{parkId:$scope.search.parkId}}).success(function (data) {
                    $scope.insPointList = data;
                })
            }
		});
		//新增修改巡查点弹出框控制器
		app.controller('WayAddOrEditModalCtrl', function ($scope, $http, $uibModalInstance, $uibModal,$filter, fac,wayService, param) {
			$scope.item={parkId:param.parkId,pointList:[]};
            var parkId = param.parkId;
            $scope.item.insType=2
			//编辑回选
			if(fac.isNotEmpty(param.id)){
				$http.get("/ovu-pcos/pcos/quality/insway/getWay.do?insWayId="+param.id).success(function (data) {
					if (fac.isNotEmpty(data)) {
						$scope.item = data;
                        $scope.item.parkId = parkId;
						//拼接点的名称
                        var names=[];
                        data.pointList && data.pointList.forEach(function (point) {
                            names.push(point.name);
                        })
                        $scope.item.pointNames = names.join('-->');
					} else {
						alert();
					}
				})
			}
			//保存
			$scope.save = function (form, item) {
				form.$setSubmitted(true);
				if (!form.$valid) {
					return;
				}
				var param=angular.copy(item);
                param.wayPoint=wayService.reduceIds(item.pointList).join();  //拼接巡查点id
                //如果填入了巡查频率和周期，则该巡查为自动巡察
                if(param.insRate && param.rateUnit){
                    param.isAnto = 1;
                }else {
                    param.isAnto = 0;
                }
                delete  param.pointList;
				$http.post("/ovu-pcos/pcos/quality/insway/edit.do", param, fac.postConfig).success(function (data) {
					if (data.success) {
						$uibModalInstance.close();
						msg("保存成功!");
					} else {
						alert();
					}
				})
			}
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};

            //$scope.item.pointList已选择的巡查点列表
			//选择巡察点弹出框
			$scope.chooseInsPoint = function(){
			    var param={parkId:$scope.item.parkId,
                            insType:$scope.item.insType,
                            selecedPoints:angular.copy($scope.item.pointList)};
				var modal = $uibModal.open({
					animation: false,
					size:'lg',
					templateUrl: '/view/quality/way/modal.quality.choosePoint.html',
					controller: 'chooseInsPointModalCtrl',
                    resolve:{
                        param : function () {
                            return param;
                        }
                    }
				});
				modal.result.then(function (data) {
				    //拿到已选择巡察点列表和距离
                    $scope.item.pointList= data.selecedPoints;
                    $scope.item.insDistance = data.distance;
                    //拼接点的名称
                    var names=[];
                    data.selecedPoints.forEach(function (point) {
                        names.push(point.name);
                    })
                    $scope.item.pointNames = names.join('-->');
				});
			}
			//改变巡查类型后，需要清空已选巡查点，因为自动巡察的巡查点必须要有摄像头
			$scope.changeInsType = function () {
			    if(fac.isNotEmpty($scope.item.pointNames)){
                    $scope.item.pointList = [];
                    $scope.item.pointNames = '';
                    $scope.item.insDistance = 0;
                }
                delete $scope.item.rateUnit;
                delete $scope.item.insRate;
            }
		});
		//选择巡查点弹出框
		app.controller('chooseInsPointModalCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $timeout, fac,mapService,wayService,param) {
			$scope.search={parkId:param.parkId,insType:param.insType};
			$scope.pageModel = {};
            var selecedPoints = $scope.selecedPoints  =  []; //最终已选择的巡查点
            $scope.distance = 0;    //距离

            //监听选择的巡查点列表，一旦变化重新画折线图，并且计算点的距离
            $scope.$watch('selecedPoints',function (current,prev) {
                if (fac.isNotEmpty(current) && !angular.equals(current, prev)) {
                    drawPointLine();
                }
            },true)

             $timeout(function () {
                selecedPoints =$scope.selecedPoints =  param.selecedPoints; //编辑时传递过来的，这里为了触发watch放在这里
            })
            //的否第一次点击地图模式，这里是为了规避开始地图模式是隐藏的时候，无法导航的问题，
            var index=0;
            $scope.clcikModel = function(){
                if(index == 0){
                    drawPointLine(); //再次划线
                }
                index++ ;
            }

			//查询巡查点列表
			$scope.find = function(pageNo){
				angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
				fac.getPageResult("/ovu-pcos/pcos/quality/inspoint/list.do",$scope.search,function(data){
					$scope.pageModel = data;
				});
			}

			//保存，将选择巡查点列表和距离传回上一层
			$scope.save = function () {
				var param = {selecedPoints:selecedPoints,distance:$scope.distance};
				$uibModalInstance.close(param);
			}

			//关闭
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
			//进来改弹出框就查询列表
			$scope.find();

            //地图基本配置
            var mapCenter;
            if (app.park && app.park.blPosition) {
                mapCenter = app.park.blPosition.split(",");
            } else {
                // 默认定位到武汉创意天地
                mapCenter = [114.32233, 30.471139];

            }
            $scope.mapOptions = {
                toolbar : true,
                // map-self config
                // center: new AMap.LngLat(mapCenter[0], mapCenter[1]),
                resizeEnable : true,
                // ui map config
                uiMapCache : false,
                zoom : 18,
                //精简模式
                liteStyle : true,
                expandZoomRange:true
            };
            //地图标记点
            $scope.markers = [];
            //导航线路
            $scope.polylines = [];

            //进来改弹出框查询所有的地图巡查点
            function getAllPoint() {
                var param = {parkId :$scope.search.parkId, insType:$scope.search.insType};
                $http.get('/ovu-pcos/pcos/quality/insway/getMapPoint',{params:param}).success(function (data) {
                    //渲染地图maker
                    $scope.data = data;
                    var markers = [];
                    data.forEach(function (da) {
                        if(da.longitude){
                            var marker = wayService.addMarker($scope.myMap,da);
                            markers.push(marker);
                        }
                    })
                    $scope.markers=markers;
                })
            }
            getAllPoint();

            //点击标记点
            $scope.clickMarker = function($event, $params, marker) {
                var point = marker.getExtData();  //获取点的数据
				//如果为楼栋点，则弹出室内选择框
                if(point.type == 1){
                    chooseIndoorInsPoint(point);
				}else {
                	//室外点，直接追加
                    var selectIds = wayService.reduceIds(selecedPoints);
                    if(selectIds.indexOf(point.insPointId) == -1){
                        selecedPoints.push(point);
					}
				}
            }

            //点上移，下移
            $scope.sort = function(node,index){
            	var length =selecedPoints.length;
                if(index<0){
                    index +=  length;
                } else if(index >=length){
                    index -=  length;
                }
                var oriIndex= selecedPoints.indexOf(node);   //当前的索引
                selecedPoints.splice(oriIndex,1);
                selecedPoints.splice(index,0,node);
            }
            //删除这一个点
            $scope.del = function(index){
                selecedPoints.splice(index,1);
            }

            //绘制点的路线
            function drawPointLine() {
                //清除所有的导航线路
                $scope.polylines.forEach(function(walking){
                    walking.clear();
                })
                var polyLinePath =[];  //折线的经纬度数组
                var polylines = [];
                selecedPoints.forEach(function (item) {
                    item.longitude && polyLinePath.push([item.longitude,item.latitude]);
                })
                if(polyLinePath.length >1){
                    var distance = 0;
                    var n = 0; //计数器
                    for (var i = 0; i < polyLinePath.length - 1; i++) {
                        //经典闭包问题
                        (function(i){
                            wayService.addWalking($scope.myMap, [polyLinePath[i],polyLinePath[i+1]]).then(function(obj){
                                n++;
                                polylines.push(obj.walking);
                                distance += obj.distance;
                                //如果导航多条路径完毕，则开始页面渲染距离
                                if(i == polyLinePath.length - 2 && n == polyLinePath.length - 1){
                                    $scope.polylines = polylines;
                                    $scope.distance = distance;
                                }
                            })
                        })(i)
                    }
                    //sumPointDistance(polyLinePath);  //计算已选择的巡查点的距离
                }else {
                    $scope.distance = 0;
                }
            }

            //在地图中，点击楼栋，则弹出一个可以选择室内巡查点的弹出框
            function chooseIndoorInsPoint(point){
                var point=angular.extend({insType:$scope.search.insType},point);
                console.log($scope.search.insType);
                var modal = $uibModal.open({
                    animation: false,
                    templateUrl: '/view/quality/way/modal.quality.chooseIndoorPoint.html',
                    controller: 'chooseIndoorPointModalCtrl',
                    resolve : {
                        point : point
                    }
                });
                modal.result.then(function (data) {
                    //这里返回的都是室内点
                    var selectIds = wayService.reduceIds(selecedPoints);
                    //去重push
                    data.checkedPoints.forEach(function (da) {
                        da.type = data.type;   //室内点
                        da.longitude = data.longitude;
                        da.latitude = data.latitude;
                        da.checked && delete da.checked;
                        if(selectIds.indexOf(da.insPointId) == -1){
                            selecedPoints.push(da);
                        }
                    })
                });
            }
            //计算已选择的巡查点的距离
            //已废弃，不能计算折线距离了，用导航返回的距离即可
            /* function sumPointDistance(path) {
                $scope.distance=0;
                try{
                    path.forEach(function (p,index) {
                        if(path[index +1]){
                            $scope.distance += p.distance(path[index+1]);
                        }
                    })
                    $scope.distance = Math.round($scope.distance);
                }catch(error) {
                    alert('距离计算错误,巡查点经纬度数据错误');
                    $scope.distance = 0;
                }
            } */

            //改变checkbox的状态时，则按照顺序进行push操作或者删除操作
            $scope.checkAll = function (pageModel) {
                pageModel.checked = !pageModel.checked;
                pageModel.list.forEach(function(n) {
                    n.checked = pageModel.checked;
                    var point = angular.copy(n);
                    delete point.checked;
                    if(pageModel.checked){
                        var selectIds = wayService.reduceIds($scope.selecedPoints);
                        //去重push
                        if(selectIds.indexOf(point.insPointId) == -1){
                            $scope.selecedPoints.push(point);
                        }
                    }
                });
            }
            //点击列表选择一个，这里要按顺序追加
            $scope.checkOne = function (item) {
                item.checked = !item.checked;
                var point = angular.copy(item);
                delete point.checked;
                if(item.checked){
                    var selectIds = wayService.reduceIds($scope.selecedPoints);
                    //去重push
					if(selectIds.indexOf(point.insPointId) == -1){
                        $scope.selecedPoints.push(point);
					}
                }

            }

		});

        //地图选择室内巡查点弹出框
        app.controller('chooseIndoorPointModalCtrl', function ($scope, $http, $uibModalInstance, fac, point) {
        	//insPointId 为传过来的室内点id
            var checkedPoints=[]; //已选择的室内巡查点
            console.log(point);
            //根据insPointId开始查询该楼栋里面的室内巡查点
            var param={insPointId:point.insPointId,insType:point.insType}
            // $http.get('/ovu-pcos/pcos/quality/insway/getHousePoint?insPointId='+point.insPointId).success(function (data) {
            //     $scope.housePoint = data || [];
            // })
            $http.get('/ovu-pcos/pcos/quality/insway/getHousePoint?',{params:param}).success(function (data) {
                $scope.housePoint = data || [];
            })
            //保存，将选择巡查点列表和距离传回上一层
            $scope.save = function () {
                //这里需要返回已选择的室内点，因为后台给的数据没有点的类型和点的经纬度
                //所以这里直接去楼栋的经纬度
                var data={checkedPoints:checkedPoints,
                           type: point.type,
                            longitude:point.longitude,
                            latitude:point.latitude};
                $uibModalInstance.close(data);
            }
            //关闭
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            //重置
            $scope.reset = function () {
                $scope.housePoint.forEach(function (house) {
                    house.data.forEach(function (point) {
                        if(point.checked){
                            point.checked =false;
                        }
                    })
                })
            }

            //改变checkbox的状态时，则按照顺序进行push操作或者删除操作
            $scope.changePoint = function (item) {
                if(item.checked){
                    checkedPoints.push(item);
				}else{
					//删除这个点
                    checkedPoints.splice(checkedPoints.indexOf(item),1);
				}

            }

        });
})()
