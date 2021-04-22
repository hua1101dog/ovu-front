//操作日志监控
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('monitoringLogCtrl', function ($scope, $http,$uibModal,fac) {
        $scope.search = {};
        $scope.pageModel = {};

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            fac.getPageResult("/ovu-pcos/pcos/operationlog/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();

      $scope.showEditModal=function(item){
        var copy = angular.extend({},item);
        var modal = $uibModal.open({
            animation: false,
            size:'max',
            templateUrl: 'sys/modal.monitoringLog.html',
            controller: 'modalmonitoringLogCtrl'
            ,resolve: {task: function(){return copy;}}
        });
      }

    });
    app.controller('modalmonitoringLogCtrl', function($scope,$http,$uibModal,$uibModalInstance,fac,task) {
        $scope.search = {};
        $scope.pageModel = {};

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            fac.getPageResult("/ovu-pcos/pcos/operationlog/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        // $scope.find();
        $scope.showEditModal=function(item){
            var copy = angular.extend({},item);
            var modal = $uibModal.open({
                animation: false,
                size:'md',
                templateUrl: 'sys/modal.operationlog.html',
                controller: 'modalOperationlogCtrl'
                ,resolve: {task: function(){return copy;}}
            });
          }
        $scope.save = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.showEditModal
    });
    
})();