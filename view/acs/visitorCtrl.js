(function () {
    'use strict';
    var app = angular.module("angularApp");
    app.controller("visitorsCtl", ["$scope", "$rootScope","fac", function ($scope, $rootScope, fac) {
        document.title = "访客授权记录";
        $scope.pageModel = [];
        $scope.search={};
        
        app.modulePromiss.then(function () {
            // fac.initPage($scope, function () {

            //     $scope.find();
            // }, function () {
            //     $scope.find();
            // });
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.search.deptId=deptId;
                    $scope.search.parkId=$rootScope.dept.parkId;
                    $scope.find();
                    
                }
            })

        })
        $scope.find = function (pageNo) {
            if (!$scope.search.deptId||!$rootScope.dept.id ) {
                alert("请选择部门！");
                return ;
            }
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });

            fac.getPageResult("/ovu-pcos/pcos/acs/acs_visitor/queryPage.do", $scope.search, function (data) {
                $scope.pageModel = data;

            });
        }
    }])
})()