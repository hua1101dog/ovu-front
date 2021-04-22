(function() {
    document.title = "设备管理-设备房";
    var app = angular.module("angularApp");
    app.controller('equipmentRoomListCtrl',function($scope) {
        $scope.equipType = "equipmentRoom";
    });
})();
