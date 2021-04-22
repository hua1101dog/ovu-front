(function () {
  'use strict';
  var app = angular.module('angularApp');
  app.controller('megviiCtl', function ($scope, $rootScope, $timeout, $http, $filter, $uibModal, fac) {
    document.title = 'OVU-旷视';
    $scope.pageModel = {
      pageSize: 10,
      currentPage: 1,
      totalPage: 10
    };
    $scope.search = {};

    $scope.find = function(pageNo) {
      $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10
      });
      fac.getPageResult('/faceDiscern/taskManger/task', $scope.search, (res) => {
        $scope.pageModel = res;
        // $scope.$applyAsync();
      });
    };
    app.modulePromiss.then(function() {
      fac.initPage($scope,function(){
        $scope.find()
      })
    });
    $scope.jumpDetail = function(item) {
      $rootScope.target("equipment/megviiDetail", "旷视详情", false, '', {
        "id": item.taskId,
      }, "equipment/megviiDetail");
    };
  });
})();
