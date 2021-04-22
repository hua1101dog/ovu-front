(function () {
    "use strict";
    var app = angular.module("angularApp");

    // 预警设置
    app.controller('warnRecordCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
        document.title = '预警记录';
        $scope.pageModel = {};
        $scope.search = {};

        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.deptId=deptId
                        $scope.find(1);
                    } else {
                        $scope.search.deptId  && delete $scope.search.deptId
                        alert('请选择跟项目关联的部门');
                        return
                    }
    
                }
            })
        })
        // 查询
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-gallery/assetsafety/getAuthLog", $scope.search, function (data) {
                var pageModel = data;
                $scope.pageModel = pageModel;
            });
        }
    });
    
})();
