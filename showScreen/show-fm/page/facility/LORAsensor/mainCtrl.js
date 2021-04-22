(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('loraMainCtl', loraMainCtl);

    loraMainCtl.$inject = ['$scope', 'AppService', 'iconService', 'gaodeHttpServer'];

    function loraMainCtl($scope, AppService, iconService, httpHelper) {
        var vm = this;

        // 体验馆园区
        var parkNo = AppService.parkNo;
        vm.parkNo = parkNo;
        var type = 'sensor';
        vm.type = type;

        vm.checked;
        var obj = {};

        vm.checkOne = function(id) {
            obj.id = id;
            vm.checked = id;
            $scope.$broadcast('showBubble',obj);
        };


        getRightData();

        function getRightData() {
            // 获取right-panel数据
            httpHelper.api('GET')('/total')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                vm.rightData = res.data;
            });
            // 传感器类型
            httpHelper.api('GET')('/sensorStatic')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧列表数据
                var res = result.data;
                var data = res.data;
                // console.log(data);
                vm.typelistData = data;
            });
            // 传感器报警
            httpHelper.api('GET')('/sensorAlertList')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧列表数据
                var res = result.data;
                var data = res.data;
                vm.alarmlistData = data.filter(function(v) {
                    return v.is_regular == '2'
                });
            });
        }

    }

})();