(function(angualr, document) {

    document.title = "OVU-设备管理-安防管理-消防管理-火灾自动报警";
    var app = angular.module("angularApp");

    app.controller('eqMonitVideo', ['$scope', '$rootScope', '$interval', '$http', '$filter', '$uibModal', 'fac', function($scope, $rootScope, $interval, $http, $filter, $uibModal, fac) {
        // 火灾自动报警id
        $scope.equipmentType_id = 11;
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