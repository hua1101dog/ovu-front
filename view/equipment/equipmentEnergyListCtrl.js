(function() {
    document.title = "设备管理-能源";
    var app = angular.module("angularApp");
    app.controller('equipmentEnergyListCtrl',function($scope) {
        $scope.equipType = "energy";
    });
})();
