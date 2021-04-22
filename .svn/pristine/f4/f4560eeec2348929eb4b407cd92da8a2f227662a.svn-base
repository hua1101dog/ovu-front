/**
 * Created by wangheng on 2017/9/19.
 * 通知
 */
(function() {
    "use strict";
    var app = angular.module("app");

    //预警事件控制器
    app.controller('ContractManageCtrl', ContractManageCtrl);
    function ContractManageCtrl($scope, $http,$state, fac) {
        document.title = "维保单位管理";
        var vm = this;
        $scope.pageModel = {};
        $scope.search = {};
        // $scope.auditingStatusDict = fac.dicts.auditingStatusDict;
        $scope.auditingStatusDict= [
            [0, "未审核 "],
            [1, "审核不通过"],
            [2, "审核通过"]
        ],
        $scope.find = function(pageNo){
            angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/govcloud/contractmanagement/list.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });
        };

        $scope.find(1);
    }

})();