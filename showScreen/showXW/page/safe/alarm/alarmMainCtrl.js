/**
 * Created by wangheng on 2017/9/19.
 * 园区安全中心》防盗报警
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('alarmMainCtrl', alarmMainCtrl);

    function alarmMainCtrl($scope, $http, AppService) {
        var vm = this;
        //默认展示楼栋的右侧
        vm.showFloor = true;
        vm.title = '园区';

        vm.parkNo = AppService.parkNo;
        var type = 'infrared';
        vm.type = type;



        /*首先查询 园区整体的概况*/
        var param = { parkNo: AppService.parkNo, type: 'infrared' };
        getCommonRight(param);

        //高德
        $scope.$on('toGaode', function(evt, data) {
            evt.stopPropagation();
            vm.title = '园区';
            vm.showFloor = true;
            param = { parkNo: AppService.parkNo, type: 'infrared' };
            getCommonRight(param);
        });

        //楼栋
        $scope.$on('toFloor', function(evt, data) {
            evt.stopPropagation();
            //查询右侧详情
            vm.showFloor = true;
            vm.title = data.name;
            // param = { parkNo: AppService.parkNo, floorNo: AppService.floorNo, type: 'infrared' };
            param = { parkNo: AppService.parkNo, floorNo: data.id, type: 'infrared' };
            getCommonRight(param);
        });

        //几层
        $scope.$on('toGround', function(evt, data) {
            evt.stopPropagation();

            //查询右侧详情
            vm.showFloor = true;
            vm.title = data.name;
            param = { parkNo: AppService.parkNo, floorNo: AppService.floorNo, type: 'infrared', groundNum: data.id };
            getCommonRight(param);
        });

        //点击设备
        $scope.$on('toSensor', function(evt, data) {
            evt.stopPropagation();
            vm.showFloor = false;
            //查询右侧详情
            vm.title = data.name;
            var equipId = data.id;
            /**
             * 获取设备监测历史记录
             *
             */
            $http.get("/ovu-screen-fake/pcos/show/getDetectHistory?id=" + equipId).success(function(resp) {
                vm.detectHistory = resp.data;
            })

        });
        //右侧方法
        function getCommonRight(param) {
            AppService.getTotal(param).then(function(res) {
                vm.infrared = res.data;
                //拼接图表数据
                var chartData = [
                    { name: '正常', value: res.data.regular_num || 0 },
                    { name: '报警', value: res.data.broken_num || 0 }
                ];
                vm.option = AppService.commonPileOption(chartData);
            })
            AppService.getEquipList(param).then(function(data) {
                vm.list = data.data.filter(function(item) {
                    return item.equip_status != 1;
                });
            })
        }


    }

})();
