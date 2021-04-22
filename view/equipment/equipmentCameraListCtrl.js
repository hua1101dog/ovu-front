(function() {
    document.title = "设备管理-摄像机";
    var app = angular.module("angularApp");
    app.controller('equipmentCameraListCtrl',function($scope) {
        $scope.equipType = "camera";
    });
})();
