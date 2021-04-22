(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('energyMainCtl', energyMainCtl);

    energyMainCtl.$inject = ['$scope', 'AppService', '$http'];

    function energyMainCtl($scope, AppService, $http) {
        var vm = this;

        // 体验馆园区
        var parkNo = AppService.parkNo;
        vm.parkNo = parkNo;
        var type = 'energy';
        vm.type = type;


        // 获取园区 右侧统计数据
        function getRightData() {
            var param={parkNo :parkNo,type:type};
            //总数
            AppService.getTotal(param).then(function(res) {
                vm.rightData= res.data;
            });

            param={surfaceType:3,projectType:1};
            $http.post('/ovu-screen/residence/workOrder/getPowerList.do',param).success(function (data) {
                vm.polyData = AppService.getPolyOption(data.data[0], '单位：kW·h³');
            })

        }
        getRightData();
    }

})();
