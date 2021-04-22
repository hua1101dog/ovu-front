(function(angualr, document) {

    document.title = "OVU-设备管理-安防管理-防盗报警";
    var app = angular.module("angularApp");

    app.controller('eqMonitVideo', ['$scope', '$rootScope', '$interval', '$http', '$filter', '$uibModal', 'fac', function($scope, $rootScope, $interval, $http, $filter, $uibModal, fac) {
        // 安防管理 防盗报警 id
        $scope.equipmentType_id = 23;
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