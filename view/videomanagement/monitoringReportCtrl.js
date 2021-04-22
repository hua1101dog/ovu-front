(function () {
    "use strict";
    var app = angular.module("angularApp");
    //视频稳定性监测报表
    app.controller('monitoringReportCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $timeout, fac) {
        document.title = "视频稳定性监测报表";
        $scope.pageModel = {};
        $scope.search = {};
        var selectedIndex;
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find()
            }, function () {
                $scope.find()
            })
        });
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-camera/pcos/newowner/owner/ownerList.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

    });

})();
