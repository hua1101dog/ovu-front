(function () {
    var app = angular.module("angularApp");
    app.controller('areaCompensateCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "面积补差";
        var width=$(window).width()-300
        $('#table_area').width(width)
        app.modulePromiss.then(function () {
            $scope.search = {};
            $scope.pageModel = {};
            $scope.$watch('project.id', function (projectId, oldValue) {
                if (projectId) {
                    $scope.search.parentHouseId = $rootScope.project.id;
                    $scope.find(1)
                }
            })
        });
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            console.log($scope.search);
            fac.getPageResult("/ovu-park/backstage/sale/aftersale/dithering/findPage", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        fac.loadSelect($scope, "BANLANCE_PLAN")  //面积补差方案
    });

})();
