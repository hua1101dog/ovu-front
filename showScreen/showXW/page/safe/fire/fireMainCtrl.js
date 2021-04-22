/**
 * Created by wangheng on 2017/9/19.
 * 园区安全中心》消防
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('fireMainCtrl', fireMainCtrl);

    function fireMainCtrl($scope, $http, AppService) {
        var vm = this;
        //默认展示园区的右侧
        vm.show = 1;
        vm.title = '园区';

        vm.parkNo = AppService.parkNo;
        var type = 'fire';
        vm.type = type;

        vm.fmapId = AppService.park.fmapId;

        //进入页面首先查询园区的数据
        var param = { parkNo: AppService.parkNo, type: 'fire' };
        getFireData(param);
        //高德
        $scope.$on('toGaode', function(evt, data) {
            evt.stopPropagation();

            vm.show = 1;
            vm.title = '园区';
            param = { parkNo: AppService.parkNo, type: 'fire' };
            getFireData(param);
        });

        //楼栋
        $scope.$on('toFloor', function(evt, data) {
            evt.stopPropagation();
            vm.show = 1;
            vm.title = data.name;
            //查询右侧详情
            // param.floorNo = AppService.floorNo;
            param.floorNo = data.id;
            delete param.groundNum;
            getFireData(param);
        });

        //几层
        $scope.$on('toGround', function(evt, data) {
            evt.stopPropagation();
            vm.title = data.name;
            //查询右侧详情
            param.groundNum = data.id;
            getFireData(param);
        });

        //单个传感器
        $scope.$on('toSensor', function(evt, data) {
            evt.stopPropagation();
            vm.title = data.name;
            var id = data.id || '1503380644081';
            //查询右侧详情
            /**
             * 获取设备监测历史记录
             *
             */
            $http.get("/ovu-screen-fake/pcos/show/getDetectHistory?id=" + id).success(function(resp) {
                vm.detectHistory = resp.data;
            })
            vm.show = 2;
        });

        //获取接口数据
        function getFireData(param) {
            AppService.getTotal(param).then(function(res) {
               /* if(vm.title == '园区' && res.data){
                    res.data.smoke_regular_num *= 10;
                    res.data.smoke_broken_num_smoke *= 10;
                    res.data.smoke_fail_num_smoke *= 10;
                    res.data.temperature_broken_num *=10;
                    res.data.temperature_fail_num *=10;
                    res.data.temperature_regular_num *=10;
                    res.data.total *=10;
                }*/
                vm.fire = res.data;
                //图表数据
                if (vm.fire) {
                    var chart = [];
                    chart.push({ name: '烟感故障', value: vm.fire.smoke_broken_num_smoke || 0 }, { name: '烟感报警', value: vm.fire.smoke_fail_num_smoke || 0 }, { name: '温感故障', value: vm.fire.temperature_broken_num || 0 }, { name: '温感报警', value: vm.fire.temperature_fail_num || 0 }, { name: '温感正常', value: vm.fire.temperature_regular_num || 0 }, { name: '烟感正常', value: vm.fire.smoke_regular_num || 0 });
                    vm.option = AppService.commonPileOption(chart);
                }
            })


        }
    }

})();
