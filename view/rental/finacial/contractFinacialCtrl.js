(function() {
    var app = angular.module("angularApp");
    app.controller('contractFinacialCtrl', ['$scope', '$rootScope', '$http', '$filter', '$uibModal', 'fac', '$location', '$timeout', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location, $timeout) {
    	document.title = "OVU-合同账务"; 
    	$scope.search = {};
        $scope.status = [
                   { value: "5", text: "已结束" },
                   { value: "4", text: "已终止" },
                   { value: "2", text: "执行中" }
        ];
        // 获取列表
        $scope.arrearsCount = '';
        $scope.unpaidCount = '';
        // 欠费、未缴合同数
        $scope.getCountCoun = function () {
            $.post("/ovu-park/backstage/rental/contractAccount/countUnpaidAndArrearsContract?parkId=" + app.park.parkId, function (resp) {
                $timeout(function () {
                    $scope.arrearsCount = resp.data.arrearsCount;
                    $scope.unpaidCount = resp.data.unpaidCount
                }, 1)

            });
        }
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.parkId = app.park.parkId;
            fac.getPageResult("/ovu-park/backstage/rental/contractAccount/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
            
        };
         
        //收款
         $scope.receiv = function (id) {
            //  $location.url('/rental/finacial/contractReceiv')
            //  $location.search({ "contractId": id });
             $rootScope.target("rental/finacial/contractReceiv", "合同收款", false, '', { "contractId": id }, 'rental/finacial/contractReceiv');
         };
        //减免
         $scope.refund = function (id) {
            //  $location.url('/rental/finacial/contractReduct')
            //  $location.search({ "contractId": id });
             $rootScope.target("rental/finacial/contractReduct", "合同减免", false, '', { "contractId": id }, 'rental/finacial/contractReduct');
         };
        //查看
         $scope.check = function (id) {
            //  $location.url('/rental/finacial/contractCheck');
            //  $location.search({ "contractId": id });
             $rootScope.target("rental/finacial/contractCheck", "合同查看", false, '', { "contractId": id }, 'rental/finacial/contractCheck');
         };
         app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.search = {};
                $scope.find();
                $scope.getCountCoun();
            })
        });
    }]);
    app.filter("contractStatus", function () {
        return function (status) {
            switch (status) {
                case -1:
                    return '草稿';
                    break;
                case 0:
                    return '待提交';
                    break;
                case 1:
                    return '待审批';
                    break;
                case 2:
                    return '执行中';
                    break;
                case 3:
                    return '审批驳回';
                    break;
                case 4:
                    return '已终止';
                    break;
                case 5:
                    return '已结束';
                    break;
            }
        }
    });
    app.filter("finacialModal", function () {
        return function (status) {
            switch (status) {
                case 1:
                    return '固定租金';
                    break;
                case 2:
                    return '抽成租金';
                    break;
                case 3:
                    return '固定租金,抽成租金';
                    break;
            }
        }
    });
   
})()
