(function(angualr, document) {

    document.title = "OVU-设备管理-安防管理-视频监控";
    var app = angular.module("angularApp");

    app.controller('eqMonitVideo', ['$scope', '$rootScope', '$interval', '$http', '$filter', '$uibModal', 'fac', function($scope, $rootScope, $interval, $http, $filter, $uibModal, fac) {
        // 安防管理 视频监控 id
        $scope.equipmentType_id = 21;
        app.modulePromiss.then(function(res) {
            $scope.search = {
                isGroup: fac.isGroupVersion()
            };
            if (app.park) {
                $scope.search.parkId = app.park.ID;
                $scope.search.PARK_NAME = app.park.PARK_NAME;
            }

        });
    }]);

})(angular, document);