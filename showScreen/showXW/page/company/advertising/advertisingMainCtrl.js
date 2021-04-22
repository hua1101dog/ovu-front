/**
 * Created by wangheng on 2017/9/19.
 * 企业服务中心》广告位
 * 广告位现在只有园区有数据
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('advertisingMainCtrl', advertisingMainCtrl);

    function advertisingMainCtrl($scope, $http, AppService) {
        var vm = this;
        //默认展示楼栋的右侧
        vm.title = AppService.park.parkName;
        vm.show = '123';

        vm.parkNo = AppService.parkNo;
        var type = 'ad';
        vm.type = type;

        //进入页面首先查询园区的数据
        var param = { parkNo: AppService.parkNo };
        getAdData(param);

        //高德
        $scope.$on('toGaode', function(evt, data) {
            evt.stopPropagation();
            vm.show = '123';
            vm.title = AppService.park.parkName;
            param = { parkNo: AppService.parkNo };
            getAdData(param);
        });

        //
        $scope.$on('toFloor', function(evt, data) {
            evt.stopPropagation();

            //查询右侧详情
            vm.title = data.name;
            // param.floorNo = AppService.floorNo;
            param.floorNo = data.id;
            delete param.groundNum;
            delete param.houseNo;
            getAdData(param);
            vm.show = '12';
        });

        //几层
        $scope.$on('toGround', function(evt, data) {
            evt.stopPropagation();

            //查询右侧详情
            vm.show = '1';
            vm.title = data.name;
            param.groundNum = data.id;
            delete param.houseNo;
            getAdData(param);
        });

        //房间编号
        $scope.$on('toRoom', function(evt, data) {
            evt.stopPropagation();

            //查询右侧详情
            vm.title = data.name;
            param.houseNo = data.id;
            getAdData(param);
            vm.show = '4';
        });

        //获取接口数据
        function getAdData(param) {
            $http.get("/ovu-screen-fake/pcos/show/ad", { params: param }).success(function(data) {
                vm.ad = data;
                //图表数据
                if (data && data.adTypeRate) {
                    var chart = [];
                    chart.push({ name: '电梯', value: data.adTypeRate.elevator || 0 }, { name: '路灯', value: data.adTypeRate.lightBox || 0 }, { name: '宣传栏', value: data.adTypeRate.propagandaBoard || 0 }, { name: '道闸', value: data.adTypeRate.roadGate || 0 }, { name: '墙面', value: data.adTypeRate.exteriorWall || 0 });
                    vm.option1 = AppService.commonPileOption(chart);
                }
                if (data && data.adTimeRate) {
                    chart = [];
                    chart.push({ name: '三年', value: data.adTimeRate.threeYear || 2}, { name: '一年', value: data.adTimeRate.oneYear ||3}, { name: '三个月', value: data.adTimeRate.threeMonth || 3})
                    vm.option2 = AppService.commonPileOption(chart);
                }
            });

        }
    }

})();
