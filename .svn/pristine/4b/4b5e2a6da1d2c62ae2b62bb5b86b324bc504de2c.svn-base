(function() {
    var app = angular.module("angularApp");
    // 装修申请服务
    app.controller('repairCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	document.title ="OVU-物业服务";
        // 提交日期 
        $scope.dataRange = [
            {value:"M1",text:"一个月内"},
            {value:"M3",text:"三个月内"},
            {value:"Y0.5",text:"半年内"},
            {value:"Y1",text:"一年内"}
        ];
        // 获取服务状态
        $http.post('/ovu-park/backstage/parkSteward/getServiceStatuses', { parkId: app.park.parkId }, fac.postConfig).success(function(resp) {
        	if(resp.code == 0){
        		$scope.status = resp.data;
        	}
        });
        $scope.dataCache = "";
        $scope.pageModel = {};

        angular.extend($rootScope,fac.dicts);
        $scope.search = {
            serviceType:3
        };
        $scope.pageModel = {};
        // 获取列表
        $scope.find = function (pageNo){
            if($scope.dataCache){
                $scope.search.marker = $scope.dataCache.substr(0, 1);
                $scope.search.ago = $scope.dataCache.substr(1);
            }
            if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            
            fac.getPageResult("/ovu-park/backstage/parkSteward/getPropertyServie",$scope.search,function(resp){
                $scope.pageModel = resp;
            });
        }
        // 获取详情
        $scope.showDetail = function(propertyDetail){
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/adminPark/propertyService/modal.detail.html',
                controller: 'repairDetailCtl', 
                resolve:{propertyDetail:propertyDetail}
            });
        }
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
    });
    // 装修申请服务 - 详情
    app.controller('repairDetailCtl', function ($scope, $rootScope, $http, $filter, $uibModal,$uibModalInstance,fac,propertyDetail) {           
        $http.post('/ovu-park/backstage/parkSteward/getDecorateDetail', { orderSn: propertyDetail.orderSn}, fac.postConfig).success(function(data) {
            $scope.detail = data.data;
        });
        $scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
    });
    // 报事保修
    app.controller('reportRepairCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {           
        // 获取服务状态
        $http.post('/ovu-park/backstage/parkSteward/getServiceStatuses', { parkId: app.park.ID }, fac.postConfig).success(function(data) {
            $scope.status = data;
        });
        // 提交日期 
        $scope.dataRange = [
            {value:"M1",text:"一个月内"},
            {value:"M3",text:"三个月内"},
            {value:"Y0.5",text:"半年内"},
            {value:"Y1",text:"一年内"}
        ];
        $scope.dataCache = "";

        $scope.pageModel = {};

        angular.extend($rootScope,fac.dicts);
        $scope.search = {
            serviceType:0
        };
        $scope.pageModel = {};
        // 获取列表
        $scope.find = function (pageNo){
            if($scope.dataCache){
                $scope.search.marker = $scope.dataCache.substr(0, 1);
                $scope.search.ago = $scope.dataCache.substr(1);
            }
            if(!app.park || !app.park.parkId){
				window.msg("请先选择一个项目!");
				return false;
			}
            if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }
            
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            
            fac.getPageResult("/ovu-park/backstage/parkSteward/getPropertyServie",$scope.search,function(resp){
                $scope.pageModel = resp;
            });
        }
        // 获取详情
        $scope.showDetail = function(reportRDetail){
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/adminPark/propertyService/modal.reportReportdetail.html',
                controller: 'reportRepairDetailCtl', 
                resolve:{reportRDetail:reportRDetail}
            });
        }
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
    });
    // 报事保修服务 - 详情
    app.controller('reportRepairDetailCtl', function ($scope, $rootScope, $http, $filter, $uibModal,$uibModalInstance, fac,reportRDetail) {           
        $http.post('/ovu-park/backstage/parkSteward/getBaoShiDetail', { orderSn: reportRDetail.orderSn}, fac.postConfig).success(function(data) {
            $scope.detail = data.data;
        });
        $scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
    });

    app.filter("propertyStatus", function () {
        return function (status) {
            if (status == 0) {
                return "待派发";
            } else if (status == 1) {
                return "待接收";
            }else if (status == 4) {
                return "已退回";
            }else if (status == 5) {
                return "待处理";
            }else if (status == 7) {
                return "待评价";
            }else if (status == 8) {
                return "已关闭";
            }else {
                return "--";
            }
        }
    });

    app.filter("propertyStatus2", function () {
        return function (status) {
            if (status == 0) {
                return "待审核";
            } else if (status == 1) {
                return "已通过";
            } else if (status == 2) {
                return "未通过";
            } else {
                return "--";
            }
        }
    });
    
})()