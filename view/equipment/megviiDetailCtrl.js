(function () {
  'use strict';
  var app = angular.module('angularApp');
  app.controller('megviiDetailCtl', function ($scope, $rootScope, $timeout, $http, $filter, $uibModal, fac) {
    document.title = 'OVU-旷视';
    $scope.pageModel = {
      pageSize: 10,
      currentPage: 1,
      totalPage: 10
    };
    $scope.search = {};
    const params = $rootScope.pages.params;
    $scope.find = function(pageNo) {
      $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10
      });
      fac.getPageResult('/faceDiscern/taskManger/task/taskData/' + params.id, $scope.search, (res) => {
        $scope.pageModel = res;
        // $scope.$applyAsync();
      });
    };
    app.modulePromiss.then(function() {
      fac.initPage($scope,function(){
        $scope.find()
      })
    });

    $scope.getImg = function(e, data) {
      e.preventDefault();
      $http.post('/faceDiscern/taskManger/task/faceData', null, { params: {
          faceId: data.selectFaceId,
          taskId: data.taskId,
      }}).success(res => {
        data.images = res;
        $scope.$applyAsync();
        console.log($scope.pageModel.list)
      })
    };
    $('.collapse').collapse('hide');
  });
})();
