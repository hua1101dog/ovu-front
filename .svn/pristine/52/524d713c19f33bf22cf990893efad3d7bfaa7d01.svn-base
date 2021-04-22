(function () {
    var app = angular.module("angularApp");
    app.controller('logRecordCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "变更审批";
        app.modulePromiss.then(function () {
            $scope.search = {};
            $scope.pageModel = {};
            $scope.$watch('project.id', function (projectId, oldValue) {
                if (projectId) {
                    $scope.search.parkId='';
                    $scope.search.stageId='';
                    $scope.search.buildId='';
                    $scope.search.parkId = $rootScope.project.parkId;
                    $rootScope.project.stageId && ($scope.search.stageId = $rootScope.project.stageId)
                    $rootScope.project.buildId && ($scope.search.buildId = $rootScope.project.buildId)
                    $scope.find(1)
                }
            })
        });

        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-park/backstage/loggable/listPage", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        //编辑／新增模态窗口
        $scope.addReserve = function (id) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/projectPrepare/reservePrice/modal.addReservePrice.html',
                controller: 'addReservePriceCtrl',
                resolve: {}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        //编辑／新增模态窗口
        $scope.showModal = function (id) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/projectPrepare/reservePrice/modal.reserveMethod.html',
                controller: 'reserveMethodCtrl',
                resolve: { param: { 'id': id } }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };



    });
 
})();
