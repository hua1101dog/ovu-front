(function() {
    var app = angular.module("angularApp");
    app.controller('rentCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	document.title = "OVU-首页";
        //链接跳转
    	$scope.selectMenu = function(type){
            var node = {
            		"icon":"fa-cube",
            		"menu_type":1,
            		"module_id":14,
            		"selected":false,
            };//模拟菜单左侧数据
            if(type == "rentResource"){
            	node.id = 64;
            	node.resource_id = 525;
            	node.sort = 1;
            	node.text = "租赁资源";
            	node.url = "rental/rentResource/rentResource";
            	
            }
            if(type == "rentAgreement"){
            	node.id = 965;
            	node.resource_id = 526;
            	node.sort = 5;
            	node.text = "租赁合同";
            	node.url = "rental/rentAgreementNew/rentAgreement";
            }
            $scope.$parent.selectMenu(node);   
        };
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
            $rootScope.target("rental/rentAgreementNew/examAgreement", "合同审核", false, '', {'id':item.id}, "rental/rentAgreementNew/examAgreement");
        };
        // 查看合同详情
        $scope.showDetail = function (item) {
            $rootScope.target("rental/rentAgreementNew/lookAgreement", "预览合同", false, '', {
                "id": item.id, "createBillModel": item.createBillModel, "status": item.status
            }, "rental/rentAgreementNew/lookAgreement");
        }
        $scope.$on("needToReload", function (event) {
            $scope.find(1);
        });
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
                $scope.find()
             })
         });
    });
    // 减免审核  
    app.controller('derateCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location) {
        $scope.pageModel = { data: []};
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
            $rootScope.target("rental/finacial/derateExamine", "减免审核", false, '', { "id": item.id, "check": false }, "rental/finacial/derateExamine");
        };
        // 查看减免明细
        $scope.showDetail = function (item) {
            $rootScope.target("rental/finacial/derateExamine", "查看减免明细", false, '', { "id": item.id, "check": true }, "rental/finacial/derateExamine");
        }
        $scope.$on("needToReload", function (event) {
            $scope.find(1);
        });
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find()
            })
        });
    });
    // 退款审核 
    app.controller('renfundFinacialCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location) {
        $scope.pageModel = { data: []};
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
            $rootScope.target("rental/finacial/refundExamine", "退款审核", false, '', { "id": item.id, "status": 2 }, "rental/finacial/refundExamine");
        };
        // 查看退款明细
        $scope.showDetail = function (item) {
            $rootScope.target("rental/finacial/refundExamine", "退款明细查看", false, '', { "id": item.id, "status": 1 }, "rental/finacial/refundExamine");
        }
        $scope.$on("needToReload", function (event) {
            $scope.find(1);
        });
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find()
            })
        });
    });
    // 冲抵审核 
    app.controller('receviFinacialCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location) {
        $scope.pageModel = { data: []};
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
            $rootScope.target("rental/finacial/flushExamine", "冲抵审核", false, '', { "id": item.id, "pageType": 1 }, "rental/finacial/flushExamine");
        };
        // 查看冲抵明细
        $scope.showDetail =function (item) {
            $rootScope.target("rental/finacial/flushExamine", "冲抵明细查看", false, '', { "id": item.id, "pageType": 2 }, "rental/finacial/flushExamine");
        }
        $scope.$on("needToReload", function (event) {
            $scope.find(1);
        });
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
            	$scope.find()
            })
        });
    });
})();
