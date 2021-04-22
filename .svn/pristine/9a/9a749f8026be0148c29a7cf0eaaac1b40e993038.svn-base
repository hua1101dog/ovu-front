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
            fac.getPageResult("/ovu-pcos/pcos/operationlog/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();

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

    });
    app.controller('modalOperationlogCtrl', function($scope,$http,$uibModalInstance,fac,task) {
        $scope.item = task;

        $http.get("/ovu-base/sys/resource/tree?withUrl=false").success(function(resp){
            $scope.treeData  = resp.data;
        })

      
        $scope.save = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    
})();