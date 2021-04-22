(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('cameraMainCtl', cameraMainCtl);

    cameraMainCtl.$inject = ['$scope', 'AppService', 'iconService', 'gaodeHttpServer'];

    function cameraMainCtl($scope, AppService, iconService, httpHelper) {
        var vm = this;

        // 体验馆园区
        var parkNo = AppService.parkNo;
        vm.parkNo = parkNo;
        var type = 'camera';
        vm.type = type;




        //********************************右侧panel统计数据逻辑***************************************************** */
        // 获取园区 右侧统计数据
        function getRightData() {
            // 获取right-panel数据
            httpHelper.api('GET')('/total')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                vm.rightData = res.data;
            });

            //'rightEquipList'
            httpHelper.api('GET')('/equip/list')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧饼图数据
                var res = result.data;
                var data = res.data;
                vm.rightEquipList = data;
            });
        }
        getRightData();

    }

})();