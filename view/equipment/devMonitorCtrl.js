(function(angualr, document) {
    document.title = "OVU-设备综合监测";
    var app = angular.module("angularApp");

    app.controller('eqMonitVideo', ['$scope', 'fac', function($scope, fac) {
        $scope.showHash = 'detail';
    }]);

})(angular, document);
