(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('electrMainCtl', electrMainCtl);

    electrMainCtl.$inject = ['$scope', 'AppService', '$http'];

    function electrMainCtl($scope, AppService, $http) {
        var vm = this;

        var parkNo = AppService.parkNo;
        vm.parkNo = parkNo;
        var type = 'ammeter';
        vm.type = type;

        // 获取园区 右侧统计数据
        function getRightData() {
            var param={parkNo :parkNo,type:type};
            //总数
            AppService.getTotal(param).then(function(res) {
                vm.rightData= res.data;
            });

            param={params:{surfaceType:2,projectType:1}};
            $http.get('/ovu-screen/residence/workOrder/getPowerList.do',param).success(function (data) {
                vm.polyData = AppService.getPolyOption(data.data[0], '单位：kW·h');
            })

        }
        getRightData();


    }

})();
