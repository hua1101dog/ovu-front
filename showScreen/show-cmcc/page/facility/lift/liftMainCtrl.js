/**
 * Created by wangheng on 2017/9/19.
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('liftMainCtl', liftMainCtl);

    liftMainCtl.$inject = ['$scope', '$http', 'AppService'];

    function liftMainCtl($scope, $http, AppService) {
        var vm = this;

        // 体验馆园区
        var parkNo = AppService.parkNo;
        vm.parkNo = parkNo;
        var type = 'elevator';
        vm.type = type;

        var param = { parkNo: parkNo, type: type };
        //总数
        AppService.getTotal(param).then(function(res) {
            vm.rightData = res.data;
        });
        //电梯列表
        AppService.getEquipList(param).then(function(res) {
            vm.rightBuildEquipList = res.data;
        });

        //电梯监测详情
        $scope.$on('toSensor', function(evt, data) {
            $http.get('/ovu-screen/pcos/show/equip/monitor.do?id=' + data.id).success(function(data) {
                if (data.success) {
                    vm.sensorList = data.data;
                }
            })
        })
    }

})();
