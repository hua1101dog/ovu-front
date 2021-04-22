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
      vm.statusList = [
        [0, "待派发"],
        [1, "已派发"],
        [4, "已退回"],
        [5, "已接单"],
        [7, "已执行"],
        [8, "已评价"]
      ];
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

        //4.设备工单列表
      $scope.$on('toWork',function (evt, data) {
        console.log(data);
        vm.location = data.location;
        $http.get('/ovu-screen/pcos/show/workunit/workUnitOne', { params: { domainId: data.domain_id, equipment_id: data.id} }).success(function (res) {
          console.log(res.data);
          vm.workUnitList = res.data;
        });
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
