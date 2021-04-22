/**
 * Created by wangheng
 * 运营指标体系》设施设备指标
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('equipmentMainCtrl', equipmentMainCtrl);
    equipmentMainCtrl.$inject = ['$scope', 'AppService','httpService'];

    function equipmentMainCtrl($scope, AppService,httpService) {
        var vm = this;
        vm.title = '园区';
        vm.parkNo = AppService.parkNo;
        vm.type = 'equipment';
        var park = AppService.park;
        vm.fmapId = AppService.park.fmapId;
        vm.params={
            parkNo:vm.parkNo,
            type:vm.type
        };

        httpService.getOpeEquipment(vm.params).then(function (resp) {
            if(resp.data.success){
                $scope.opeEquipment = resp.data.datas;
                 // 设施设备指标
                var equipmentData = $scope.opeEquipment.oper_indicators;
                vm.equipmentData=AppService.commonPileOption(equipmentData);
                // 工单数
                var orderData = $scope.opeEquipment.oper_order;
                vm.orderData=AppService.commonPileOption(orderData);
                // 停车位经营情况
                var parkData = $scope.opeEquipment.oper_manage;
                vm.parkData=AppService.commonPileOption(parkData);

            }
        },function error (resp){
           
        });

        // function getRightData() {
        //     var equipmentData = [];
        //     if(park.fmapId == 'hfjrg'){
        //         equipmentData=[
        //             {name:"摄像头",value:84},
        //             {name:"水表",value:14},
        //             {name:"道闸",value:18},
        //             {name:"门禁",value:33},
        //             {name:"能源表",value:14},
        //             {name:"电梯",value:25},
        //             {name:"其他",value:14}
        //         ];
        //     }else {
        //         equipmentData=[
        //             {name:"摄像头",value:76},
        //             {name:"水表",value:14},
        //             {name:"道闸",value:6},
        //             {name:"门禁",value:3},
        //             {name:"能源表",value:14},
        //             {name:"电梯",value:30},
        //             {name:"其他",value:20}
        //         ];
        //     }
        //     vm.equipmentData=AppService.commonPileOption(equipmentData);
        //     var orderData=[
        //     {name:"应急工单",value:299},
        //     {name:"计划工单",value:1952}
        //     ];
        //     vm.orderData=AppService.commonPileOption(orderData);
        //     var parkData=[
        //         {name:"已售停车位",value:532},
        //         {name:"地上可经营停车位",value:41},
        //         {name:"地下可经营停车位",value:1188}
        //     ];
        //     vm.parkData=AppService.commonPileOption(parkData);
        // }

        // getRightData();
    }

})();