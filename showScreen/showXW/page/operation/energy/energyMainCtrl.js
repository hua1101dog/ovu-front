/**
 * Created by wangheng
 * 运营指标体系》能耗指标
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('energyMainCtrl', energyMainCtrl);
    energyMainCtrl.$inject = ['$scope', 'AppService','httpService'];

    function energyMainCtrl($scope, AppService,httpService) {
        var vm = this;
        vm.title = '园区';
        vm.parkNo = AppService.parkNo;
        vm.type = 'energy';
        vm.params={
            parkNo:vm.parkNo,
            type:vm.type
        };
        httpService.getOpeEnergy(vm.params).then(function (resp) {
            if(resp.data.success){
                $scope.opeEnergy = resp.data.datas;
            }
        },function error (resp){

        });


        function getRightData() {
            var managerData=[
                {name:"总经办",value:1},
                {name:"工程部",value:12},
                {name:"设计部",value:4},
                {name:"成本部",value:6},
                {name:"招商部",value:16},
                {name:"运营部",value:7},
                {name:"财务部",value:3},
                {name:"行政部",value:5}
            ];
            vm.managerData=AppService.commonPileOption(managerData);
            var propertyData=[
                {name:"管理人员",value:14},
                {name:"物业部",value:4},
                {name:"秩序部",value:38},
                {name:"客服部",value:6},
                {name:"工程部",value:7},
                {name:"保洁",value:40}
            ];
            vm.propertyData=AppService.commonPileOption(propertyData);
            var orderData=[
                {name:"设施设备巡检",value:24},
                {name:"设施设备维保",value:0},
                {name:"工程",value:106},
                {name:"设施设备保养",value:0},
                {name:"保洁",value:4},
                {name:"秩序",value:38},
                {name:"绿化",value:0},
                {name:"客服",value:136}
            ];
            vm.orderData=AppService.commonPileOption(orderData);
        }

        getRightData();
    }

})();