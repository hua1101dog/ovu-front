/**
 * Created by wangheng on 2017/9/19.
 * 通知
 */
(function() {
    "use strict";
    var app = angular.module("app");

    //预警事件控制器
    app.controller('UseUnitManageCtrl', UseUnitManageCtrl);
    function UseUnitManageCtrl($scope, $http,$state, fac) {
        document.title = "使用单位管理";
        var vm = this;
        $scope.pageModel = {};
        $scope.search = {};

        $scope.find = function(pageNo){
            angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/govcloud/govcustomert/list.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });
        };

        $scope.find(1);
    }

})();