(function() {
    var app = angular.module("angularApp");
    app.controller('rentCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	document.title = "OVU-审批操作台";
        // 获取   租赁房源、面积信息
        $scope.getRentalResourcesInfo = function(){
            var params = {
                "isSperated":0,
                "parkId":app.park.parkId,
                "rmCats":"FW11,FW12,FW16",
                "approveStatus":1,
                "sellStatus":1
            };
            $http.post("/ovu-base/system/parkHouse/getRentalResourcesInfo", params, fac.postConfig).success(function (resp) {
                if(resp.code==0){
                    $scope.rentalResources = resp.data;
                }else{
                    window.error(resp.message);
                }
            });
        };
        
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
                $scope.getRentalResourcesInfo();
            })
        });
    });
    // 合同审核 
    app.controller('contractExamCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location) {
         $scope.pageModel = { data:[]};
         // 合同审核列表
         $scope.find = function (pageNo) {
        	 $scope.search = {
        			 "parkId":app.park.parkId,
        			 "status":1
        	 };
             $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
             $scope.search.pageIndex = $scope.search.currentPage - 1;
             $scope.search.totalCount = $scope.pageModel.totalCount || 0;
             fac.getPageResult("/ovu-park/backstage/rental/contractBaseInfo/getContractListByPage", $scope.search,function(data){	
                 $scope.pageModel = data;
                 console.log($scope.pageModel);
 			});
        };
        // 审批操作
        $scope.examContract = function(item){
            // $location.url('/rental/rentAgreement/examAgreement');
            // $location.search({'id':item.id});
            $rootScope.target("rental/rentAgreementNew/examAgreement", "合同审核", false, '', {
                "id": item.id, "createBillModel": item.createBillModel, "status": item.status
            }, "rental/rentAgreementNew/examAgreement");
        };
        $scope.$on("needToReload", function (event) {
            $scope.find(1);
        });
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
             })
         });
    });
    // 减免审核  
    app.controller('derateCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location) {
        $scope.pageModel = { data: [], };
        // 减免明细列表
        $scope.find = function (pageNo) {
            $scope.search = {
                "parkId": app.park.parkId,
                "status": 0
            };
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/rental/relief/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        // 审批操作
        $scope.examContract = function (item) {
            // $location.url('/rental/finacial/derateExamine')
            // $location.search({ "id": item.id, "check": false });
            $rootScope.target("rental/finacial/derateExamine", "减免审核", false, '', { "id": item.id, "check": false }, "rental/finacial/derateExamine");
        };
        $scope.$on("needToReload", function (event) {
            $scope.find(1);
        });
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () { 
            	$scope.find();
            })
        });
    });
    // 退款审核 
    app.controller('renfundFinacialCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location) {
        $scope.pageModel = { data: [], };
        // 退款明细列表
        $scope.find = function (pageNo) {
            $scope.search = {
                "parkId": app.park.parkId,
                "status": 0
            };
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/rental/return/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        // 审批操作
        $scope.examContract = function (item) {
            // $location.url('/rental/finacial/refundExamine')
            // $location.search({ "id": item.id, "status": 2 });
            $rootScope.target("rental/finacial/refundExamine", "退款审核", false, '', { "id": item.id, "status": 2 }, "rental/finacial/refundExamine");
        };
        $scope.$on("needToReload", function (event) {
            $scope.find(1);
        });
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
            	$scope.find();
            })
        });
    });
    // 冲抵审核 
    app.controller('receviFinacialCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location) {
        $scope.pageModel = { data: [], };
        // 收款明细列表
        $scope.find = function (pageNo) {
            $scope.search = {
                "parkId": app.park.parkId,
                "status": 0
            };
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/rental/charge/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        // 审批操作
        $scope.examContract = function (item) {
            // $location.url('/rental/finacial/flushExamine')
            // $location.search({ "id": item.id, "pageType": 1 });
            $rootScope.target("rental/finacial/flushExamine", "冲抵审核", false, '', { "id": item.id, "pageType": 1 }, "rental/finacial/flushExamine");
        };
        $scope.$on("needToReload", function (event) {
            $scope.find(1);
        });
        app.modulePromiss.then(function () {
        	fac.initPage($scope, function () {
            	$scope.find();
            })
        });
    });
})();
