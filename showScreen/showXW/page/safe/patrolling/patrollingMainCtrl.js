/**
 * Created by wangheng on 2017/9/19.
 * 园区安全中心》电子巡更
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('patrollingMainCtrl', patrollingMainCtrl);

    function patrollingMainCtrl($scope, $http, AppService) {
        var vm = this;
        //默认展示楼栋的右侧
        vm.show = 1;
        vm.title = '园区';

        vm.parkNo = AppService.parkNo;
        var type = 'camera';
        vm.type = type;

        vm.fmapId = AppService.park.fmapId;

        //进入页面首先查询园区的数据
        var param = { parkNo: AppService.parkNo, type: 'camera' };
        getCommonRight(param);

        //高德
        $scope.$on('toGaode', function(evt, data) {
            evt.stopPropagation();
            vm.show = 1;
            vm.title = '园区';
            param = { parkNo: AppService.parkNo, type: 'camera' };
            getCommonRight(param);
        });

        //楼栋
        $scope.$on('toFloor', function(evt, data) {
            evt.stopPropagation();

            //查询右侧详情
            vm.show = 1;
            vm.title = data.name;
            // param.floorNo = AppService.floorNo;
            param.floorNo = data.id;
            delete param.groundNum;
            getCommonRight(param);
        });

        //几层
        $scope.$on('toGround', function(evt, data) {
            evt.stopPropagation();

            //查询右侧详情
            vm.show = 1;
            vm.title = data.name;
            param.groundNum = data.id;
            getCommonRight(param);
        });

        //设备
        $scope.$on('toSensor', function(evt, data) {
            evt.stopPropagation();

            //查询右侧详情  房间没数据假的
            vm.show = 2;
            vm.title = data.name;
        });


        //右侧方法
        function getCommonRight(param) {
            AppService.getTotal(param).then(function(response) {
               /* if(vm.title == '园区' && response.data){
                    response.data.regular_num *= 10;
                    response.data.broken_num *= 10;
                    response.data.total *=10;
                }*/
                vm.camera = response.data;

                //图表数据
                if (vm.camera) {
                    var chart = [];
                    chart.push({ name: '已巡更', value: vm.camera.regular_num }, { name: '未巡更', value: vm.camera.broken_num })
                    vm.option = AppService.commonPileOption(chart);
                }
            })
        }
    }

})();