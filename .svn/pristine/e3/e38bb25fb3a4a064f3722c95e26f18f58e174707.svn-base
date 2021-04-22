//系统操作日志
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('operationLogCtrl', function ($scope, $http,$uibModal,fac) {
        $scope.search = {};
        $scope.pageModel = {};
        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            fac.getPageResult("/ovu-base/system/log/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();
        
        $scope.dicTree = [];
        //获取日志子系统树
        $http.get("/ovu-base/system/dictionary/tree?dicType=LOG_SUBSYSTEM_TYPE").success(function(res){
            if(res.data){
                $scope.dicTree = res.data
            }
        })
    });
})();