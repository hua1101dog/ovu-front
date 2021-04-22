/**
 * Created by wangheng
 * 运营指标体系》设施设备指标
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('equipmentMainCtrl', equipmentMainCtrl);
    equipmentMainCtrl.$inject = ['$scope','$http', 'AppService'];

    function equipmentMainCtrl($scope,$http, AppService) {
        var vm = this;
        vm.parkNo = AppService.parkNo;
        vm.type = 'equipment';
        var park = AppService.park;

        //3.设备监测参数
        $scope.$on('toSensor',function (evt, data) {
            $http.get('/ovu-screen/pcos/show/equip/monitor.do?id='+data.id).success(function (data) {
                if(data.success){
                    vm.sensorList= data.data;
                }
            })
        });

        function getRightData() {
            //1.设施设备指标
            $http.get('/ovu-screen/pcos/show/equip/statistics.do?parkNo='+vm.parkNo).success(function (data) {
                vm.equipmentData=AppService.commonPileOption(data.data);
            });

            //2.工单数
            $http.get('/ovu-screen/residence/workOrder/getListWork.do?parkNo='+vm.parkNo).success(function (data) {
                data.data && data.data.forEach(function (da) {
                    da.name = da.cname;
                    da.value = da.cnum;
                });
                vm.orderData=AppService.commonPileOption(data.data);
            })


        }
        getRightData();
    }

})();
