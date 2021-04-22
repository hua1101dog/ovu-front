// 监测管理

(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('monitoringManageCtrl', function ($scope, $rootScope, $uibModal, $sce, $state, $http, $filter, fac) {
        document.title = '能耗监测管理';
        $scope.search = {};
        $scope.pageModel = {};
        var selectedIndex;
        $scope.fn = function () {
            $scope.changeIndex(selectedIndex);
            
        }
        app.modulePromiss.then(function () {
        	$scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.parkName = $scope.dept.parkName;
                        $scope.changeIndex(selectedIndex);
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.parkId &&  delete $scope.search.parkId
                        $scope.search.parkName &&  delete $scope.search.parkName;
                    }
                }
            })
        	
            /*$scope.search = { isGroup: fac.isGroupVersion() };
            if ($scope.search.isGroup) {
                $scope.changeIndex(selectedIndex);
            } else {
                $scope.$watch('park', function (newValue, oldValue) {
                    if (newValue && newValue.id) {
                        $scope.search.parkId = newValue.id;
                        $scope.search.parkName = newValue.parkName;
                        $scope.changeIndex(selectedIndex);

                    } else {
                        alert("请先选定一个项目");
                    }
                });
            }*/
        })
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-energy/energy/monitor/consumptionMonitor/page", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        }
        $scope.changeIndex = function (index) {
            if (index == 0 && $scope.search.parkId) {
                $scope.find();
            }
            var copy = angular.extend({}, copy);
                angular.extend(copy, { 
                    isGroup:$scope.search.isGroup,
                    parkId: $scope.search.parkId, 
                })
             
            $scope.$broadcast('index' + index,  copy);
            selectedIndex = index;
        };
        //查看历史记录
        $scope.showMore = function (item) {
            var copy = angular.extend({}, item)
            if (!copy.parkId) {
                angular.extend(copy, { parkId: $scope.search.parkId })
            }

            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/energy/monitoringManage/modal.instrumentDetail.html',
                controller: 'instrumentDetailCtrl',
                size: 'lg',
                resolve: { task: copy }
            });
        };
        //显示参数：
        $scope.showParams = function (item) {
            var copy = angular.extend({}, item)
            if (!copy.parkId) {
                angular.extend(copy, { parkId: $scope.search.parkId })
            }

            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/energy/monitoringManage/modal.instrumentParams.html',
                controller: 'instrumentParamsCtrl',
                size: 'lg',
                backdrop:true,
                resolve: { task: copy }
            });
            event.stopPropagation(); 
        };
        
    });
    //查看历史记录
    app.controller('instrumentDetailCtrl', function ($scope, $rootScope, $http, fac, task) {
        $scope.pageModel = {};
        $scope.search = {};
        $scope.processImgUrl = $rootScope.processImgUrl;
        $scope.showPhoto = $rootScope.showPhoto;
        $scope.equipName = task.equipmentName;

        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                equipmentId: task.equipmentId
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            fac.getPageResult('/ovu-energy/energy/monitor/consumptionMonitor/getHistory', $scope.search, function (pageModel) {
                $scope.pageModel = pageModel;
            });
        };
        $scope.find();
    });
    //显示参数详情
    app.controller('instrumentParamsCtrl', function ($scope, $rootScope, $http, fac, task) {
        $scope.equipmentDetectParms = task;
    });
    
    //变配电参数监测
    app.controller('distributionParameterCtrl', function ($scope, $http, $uibModal, $filter, fac) {

        $scope.$on('index1', function (event, data) {

            $scope.find(1, data);

        });
        $scope.find = function (pageNo, data) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 }, data);
            fac.getPageResult("/ovu-energy/energy/monitor/transformerMonitor/page", $scope.search, function (res) {
                $scope.pageModel = res;
            });
        };
        //查看历史记录
        $scope.showMore = function (item) {
            var copy = angular.extend({}, item)
            if (!copy.parkId) {
                angular.extend(copy, { parkId: $scope.search.parkId })
            }

            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/energy/monitoringManage/modal.distributionParametertDetail.html',
                controller: 'distributionParameterlCtrl',
                size: 'lg',
                resolve: { task: copy }
            });
        };
        
        //显示参数：
        $scope.showParams = function (item) {
            var copy = angular.extend({}, item)
            if (!copy.parkId) {
                angular.extend(copy, { parkId: $scope.search.parkId })
            }

            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/energy/monitoringManage/modal.distributionParametertParams.html',
                controller: 'distributionParameterlParamsCtrl',
                size: 'lg',
                backdrop:true,
                resolve: { task: copy }
            });
            event.stopPropagation(); 
        };
        
    });  //查看历史记录
    app.controller('distributionParameterlCtrl', function ($scope, $rootScope, $filter,$http, fac, task) {
        $scope.pageModel = {};
        $scope.search = {};
        $scope.partTimes = {};
        $scope.pointName = task.pointName;

		//初始化
		function init(){
			$scope.search.date1 = $filter('date')(new Date(), 'yyyy-MM-dd'); 
		}
		
        $scope.find = function (pageNo,partTime) {
        	if(partTime){
        		$scope.search.date = partTime;
        	}else{
        		$scope.search.date = $scope.search.date1;
        	}
        	if(partTime){
        		$scope.curTime = partTime;
        	}else{
        		delete $scope.curTime;
        	}
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                YBequipmentId: task.yBequipmentId,
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            $http.post('/ovu-energy/energy/monitor/transformerMonitor/getHistory', $scope.search,fac.postConfig).success(function(data) {
                $scope.pageModel = data.data;
                if(!partTime){
	              	$scope.partTimes = [];
	              	if($scope.pageModel && $scope.pageModel.length>0){
	              		$scope.pageModel.forEach(function(item){
	              			if(item.datatime){
	              				$scope.partTimes.push(item.datatime);
	              			}
	              		})
	              	}
	              	//选择具体时间点展示该时间点数据
              		$scope.pageModel = [];
              	}
            });
        };
        init();
        $scope.find();
    });
    //显示参数详情
    app.controller('distributionParameterlParamsCtrl', function ($scope, $rootScope, $http, fac, task) {
        $scope.equipmentDetectParms = task;
    });
})(angular)
