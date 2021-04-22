(function() {
    document.title = "设备管理-电梯";
    var app = angular.module("angularApp");
    app.controller('equipmentElevatorListCtrl',function($scope) {
        $scope.equipType = "elevator";
    });
})();
