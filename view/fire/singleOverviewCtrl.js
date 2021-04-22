/**
 * Created by wangheng on 2017/8/28.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('SingleOverviewCtrl', function ($scope,$rootScope, $http,$filter,$uibModal,$location,fac,MultiOverviewService) {
    	var vm = this;
        document.title ="消防概览-单项目";
        //获取项目id
        var parkId = $rootScope.selectedParkId;
        $scope.parkName=$location.$$search.parkName
          console.log()
        //除了实时播报的数据以外的接口
        $http.get("/ovu-pcos/pcos/fire/firepointoverview/getFirePoint.do?parkId="+parkId).success(function (data) {
            if(fac.isNotEmpty(data)){
                MultiOverviewService.setMapBounds(data,vm.map);
                var markers=[];
                data.forEach(function (point) {
                    point.longitude && markers.push(MultiOverviewService.addMarker(vm.map,point));
                })
                //项目地图
                vm.markers = markers;
            }
        });
        //火警实时播报
        $http.post('/ovu-pcos/pcos/fire/broadcast/list.do',{parkId : parkId}).success(function (data) {
            vm.list = data || [];
        });

        $scope.pageModel = {};
        $scope.search = {parkId:parkId};
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
		vm.baseOptions = {
			toolbar : true,
			// map-self config
			resizeEnable : false,
			scrollWheel : false,
			// ui map config
			uiMapCache : true,
			zoom:18,
			liteStyle:true
		};
        vm.markers = [];
       //地图标记点事件
        vm.mouseoverMaker = function($event,$params,marker){
            vm.markerData = marker.getExtData();
            vm.myInfoWindow.open(vm.map, marker.getPosition());
        }

        //地图marker点击事件
        vm.clickMaker = function($event,$params,marker){
            var  firePointId= marker.getExtData().firePointId;
            firePointId && vm.toFireMonitoring(firePointId);
        }

        //跳转到单消防点实时监控
        vm.toFireMonitoring = function (firePointId) {
            // $rootScope.firePointId = firePointId;
            // $location.path('/fire/fireMonitoring');
            $location.path('/fire/fireMonitoring').search({firePointId:firePointId});
        }

        //跳转到实时播报
        vm.toFireBroadcast = function () {
            $location.path('/fire/fireBroadcast');
        }
        //实时推送
        $scope.$on('fireBroadcast',function (event, data) {
            if(data){
                data.forEach(function (da) {
                    if(parkId == da.parkId){
                        vm.list.unshift(da);
                    }
                })
            }
        })

    });

})();
