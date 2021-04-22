/**
 * Created by wangheng
 * 运营指标体系》招商指标
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('serviceMainCtrl', serviceMainCtrl);
    serviceMainCtrl.$inject = ['$scope', 'AppService','httpService'];

    function serviceMainCtrl($scope, AppService,httpService) {
        var vm = this;
        vm.title = '园区';
        vm.parkNo = AppService.parkNo;
        vm.type = 'service';
        vm.fmapId = AppService.park.fmapId;
        vm.params={
            parkNo:vm.parkNo,
            type:vm.type
        };

        httpService.getComService(vm.params).then(function success (resp) {
            if(resp.data.success){
                $scope.comService = resp.data.datas;
                 // 运营人员分类
                var managerData = $scope.comService.operate_pie;
                vm.managerData = AppService.commonPileOption(managerData);
                //  物业人员分类
                var propertyData =  $scope.comService.property_pie;
                vm.propertyData = AppService.commonPileOption(propertyData);
                 // 工单分类
                var orderData = $scope.comService.order_pie;
                vm.orderData = AppService.commonPileOption(orderData);
            }
        },function error (resp){
                // 运营人员分类
                var managerData = [
                    { name: "总经办", value: 1 },
                    { name: "工程部", value: 12 },
                    { name: "设计部", value: 4 },
                    { name: "成本部", value: 6 },
                    { name: "招商部", value: 16 },
                    { name: "运营部", value: 7 },
                    { name: "财务部", value: 3 },
                    { name: "行政部", value: 5 }
                ];
                vm.managerData = AppService.commonPileOption(managerData);
                //  物业人员分类
                var propertyData = [
                    { name: "管理人员", value: 14 },
                    { name: "物业部", value: 4 },
                    { name: "秩序部", value: 38 },
                    { name: "客服部", value: 6 },
                    { name: "工程部", value: 7 },
                    { name: "保洁", value: 40 }
                ];
                vm.propertyData = AppService.commonPileOption(propertyData);
                // 工单分类
                var orderData = [
                    { name: "设施设备巡检", value: 24 },
                    { name: "设施设备维保", value: 0 },
                    { name: "工程", value: 106 },
                    { name: "设施设备保养", value: 0 },
                    { name: "保洁", value: 4 },
                    { name: "秩序", value: 38 },
                    { name: "绿化", value: 0 },
                    { name: "客服", value: 136 }
                ];
                vm.orderData = AppService.commonPileOption(orderData);
        });

    }

})();