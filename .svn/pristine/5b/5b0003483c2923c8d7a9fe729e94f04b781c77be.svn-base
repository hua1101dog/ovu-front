/**
 * Created by wangheng on 2017/8/28.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('MultiOverviewCtrl', function ($scope,$rootScope, $http,$filter,$uibModal,$location,fac,MultiOverviewService) {
    	var vm = this;
        document.title ="消防概览";
		//除了实时播报的数据以外的接口
       $http.get("/ovu-pcos/pcos/fire/firepointoverview/getFirepointOverview.do").success(function (data) {
            if(fac.isNotEmpty(data)){
                MultiOverviewService.setMapBounds(data.firepointlist,vm.map);
                var markers=[],name=[],data0=[],data1=[];
                data.firepointlist.forEach(function (point) {
                    point.longitude && markers.push(MultiOverviewService.addMarker(vm.map,point));
                    name.push(point.parkName);
                    data0.push(point.fireamount);
                    data1.push(point.falsepositives);
                })
                //项目地图
				vm.markers = markers;
				//火警柱状统计图
                var option = MultiOverviewService.barOption();
                option.xAxis.data = name;
                option.series[0].data = data0;
                option.series[1].data = data1;
                vm.fireAlarmOption = option;
                //工单饼图
                vm.workUnitOption = MultiOverviewService.commonPileOption(data.fireworkunitlist);
            }
        });
        $http.post('/ovu-pcos/pcos/fire/broadcast/list').success(function (data) {
            vm.list = data || [];
        });

        $scope.pageModel = {};
        $scope.search = {};
        $scope.find = function(pageNo){
            angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/fire/firepointoverview/getFireWorkUnitList.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();

        //火警处理
        vm.falseAlarmHandle = function (id) {
        	 var param = {
             		id:id,
             		isGroup:true,
             		showSave:true,
             		title:'处理'
             }
             var modal = $uibModal.open({
                 animation: true,
                 component:'workOrderModalComponent',
                 resolve: {
                 	param: param
                 }
             });
             modal.result.then(function () {
                 $scope.find();
             }, function () {
                 console.info('Modal dismissed at: ' + new Date());
             });
        }
        //查看处理详情
        vm.handleDetail = function (id) {
        	/*var param={id:5,key:'id',url:'fire/modal/modal.handelDetail.html',postUrl:'/ovu-pcos/pcos/fire/firepoint'};
        	var modal = $uibModal.open({
        		animation: true,
        		component: 'commonEditModelComponent',
        		resolve: {
        			param: param
        		}
        	});
        	modal.result.then(function () {
        		$scope.find();
        	}, function () {
        		console.info('Modal dismissed at: ' + new Date());
        	});*/
        	var param = {
              		id:id,
              		showSave:false,
              		title:'处理详情'
              }
              var modal = $uibModal.open({
                  animation: true,
                  component:'workOrderModalComponent',
                  resolve: {
                  	param: param
                  }
              });
              modal.result.then(function () {
              }, function () {
                  console.info('Modal dismissed at: ' + new Date());
              });
        }


        //地图基本配置
		vm.mapOptions = {
			// map-self config
			// ui map config
			uiMapCache : false,
			zoom:15,
			liteStyle:true
		};
        vm.markers = [];
       //地图标记点事件
		vm.mouseoverMaker = function($event,$params,marker){
			vm.markerData = marker.getExtData();
			vm.myInfoWindow.open(vm.map, marker.getPosition());
		}

        vm.clickMaker = function ($event,$params,marker) {
			$rootScope.selectedParkId = marker.getExtData().parkId;
			$location.path('/fire/singleOverview').search({parkName:vm.markerData.parkName});
        }
		//跳转到单消防点实时监控
		vm.toFireMonitoring = function (firePointId) {
			$rootScope.firePointId = firePointId;
            $location.path('/fire/fireMonitoring').search({id:$rootScope.firePointId});
        }

		//跳转到实时播报
        vm.toFireBroadcast = function () {
            $location.path('/fire/fireBroadcast');
        }
		//实时推送
        $scope.$on('fireBroadcast',function (event, data) {
            if(data){
                data.forEach(function (da) {
                    vm.list.unshift(da);
                })
            }
        })

    });

    
    app.service('MultiOverviewService',
		    ['$http', 
		        function ($http) {
		            var that = this;
		            
		            this.addMarker = function(map,data){
		            	var marker = new AMap.Marker({
							position : [data.longitude,data.latitude],
							map : map,
							zIndex: 1000,
							extData:data
						});
						return marker;
		            }
		            
		            //电梯品牌统计，空心扇形图都可以用
                    this.commonPileOption = function(data) {
                        var name = [];
                        data && data.forEach(function(da) {
                            name.push(da.name);
                        })
                        return angular.merge({}, {
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b}: {c} ({d}%)"
                            },
                            grid: {
                                left: 'center'
                            },
                            legend: {
                                orient: 'vertical',
                                left: 'right',
                                top: 'middle',
                                data: name
                            },
                            color: ["#85B9F5", "#FA727E", "#3AD35E"],
                            series: [{
                                name: '详情',
                                type: 'pie',
                                radius: ['50%', '70%'],
                                center: ['40%', '50%'],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '20',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data
                            }]
                        });
                    };
		            //柱状图
		            this.barOption = function(){
		                return angular.merge({}, {
		                	title: {
		                        text: '',
		                        left:'center'
		                    },
		                    tooltip : {
		                        trigger: 'axis',
		                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		                            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
		                        }
		                    },
                            color: ["#85B9F5", "#FA727E", "#3AD35E"],
		                    legend: {
		    	            	 x : 'center',
		    	                 y : 'bottom',
		                        data: ['火警', '误报']
		                    },
		                    grid: {
		                        left: '3%',
		                        right: '4%',
		                        bottom: '8%',
		                        top:'10%',
		                        containLabel: true
		                    },
		                    yAxis:  {
		                        type: 'value'
		                    },
		                    xAxis: {
		                        type: 'category',
		                        data: []
		                    },
		                    series: [
		                        {
		                            name: '火警',
		                            type: 'bar',
		                            data: []
		                        },
		                        {
		                            name: '误报',
		                            type: 'bar',
		                            data: []
		                        }
		                    ]
		                });
		            };

                    // 设置地图范显示围  根据所有的点 求出需要显示的范围  如果list为空 显示武汉市
                        this.setMapBounds = function(list,map) {
                            if (!list || !list.length) {
                                map.setCity('武汉市');
                            } else {
                                var bounds = this.getBoundsByListData(list);
                                map.setBounds(bounds);
                            }
                        }
                        // 根据list [{longitude:00.000000,latitude:00.000000,...},...] 数据获取地图显示范围
                        this.getBoundsByListData = function(list) {
                            var lngArr = [],
                                latArr = [];

                            list.forEach(function(v, i) {
                                if (v.longitude && v.latitude) {
                                    lngArr.push(parseFloat(v.longitude));
                                    latArr.push(parseFloat(v.latitude));
                                }
                            });

                            var minLng = Math.min.apply(null, lngArr),
                                maxLng = Math.max.apply(null, lngArr);

                            var minLat = Math.min.apply(null, latArr),
                                maxLat = Math.max.apply(null, latArr);

                            var deltaLng = maxLng - minLng,
                                deltaLat = maxLat - minLat;

                            minLng -= 0.05 * deltaLng;
                            minLat -= 0.05 * deltaLat;
                            maxLng += 0.05 * deltaLng;
                            maxLat += 0.05 * deltaLat;

                            var southWest = new AMap.LngLat(minLng.toFixed(6), minLat.toFixed(6)),
                                northEast = new AMap.LngLat(maxLng.toFixed(6), maxLat.toFixed(6));

                            return new AMap.Bounds(southWest, northEast);

                    }

		 }]);

})();