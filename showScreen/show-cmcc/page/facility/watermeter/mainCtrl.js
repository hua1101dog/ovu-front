(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('waterMainCtl', waterMainCtl);

    waterMainCtl.$inject = ['$scope', 'AppService', 'iconService', '$http'];

    function waterMainCtl($scope, AppService, iconService, $http) {
        var vm = this;

        // 体验馆园区
        var parkNo = AppService.parkNo;
        vm.parkNo = parkNo;
        var type = 'waterMeter';
        vm.type = type;



        // 获取园区 右侧统计数据
        function getRightData() {
            //总数
            var param={parkNo :parkNo,type:type};
            AppService.getTotal(param).then(function(res) {
                vm.rightData= res.data;
            });

            param={params:{surfaceType:1,projectType:1}};
            $http.get('/ovu-screen/residence/workOrder/getPowerList.do',param).success(function (data) {
                vm.polyData = AppService.getPolyOption(data.data[0], '单位：m³');
            })


        }
        getRightData();
    }

})();
