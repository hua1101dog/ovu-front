(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('fireinfoCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "消防信息管理";
        $scope.search = {};
        $scope.pageModel = {};
    
     //分页  fireMassage/queryFireInfo?warnContent = & warnType = &Page =
      $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/middleware/fireMassage/queryFireInfo', $scope.search, function (data) {
                $scope.pageModel = data
            })
        }
     
        $scope.find(1);


  })

})()
