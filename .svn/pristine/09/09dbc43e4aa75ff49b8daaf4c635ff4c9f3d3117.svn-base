/**
 * Created by wangheng on 2017/9/19.
 * 企业服务中心》资产
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('propertyMainCtrl', spaceMainCtrl);

    function spaceMainCtrl($scope, $http, AppService) {
        var vm = this;
        //默认展示楼栋的右侧
        vm.title = AppService.park.parkName;
        vm.showFloor = true;

        vm.parkNo = AppService.parkNo;
        var type = 'assets';
        vm.type = type;

        vm.fmapId = AppService.park.fmapId;

        //进入页面首先查询园区的数据
        var param = { parkNo: AppService.parkNo };
        getProperrtData(param);

        //高德
        $scope.$on('toGaode', function(evt, data) {
            evt.stopPropagation();
            vm.showFloor = true;
            vm.title = AppService.park.parkName;
            param = { parkNo: AppService.parkNo };
            getProperrtData(param);
        });

        //楼栋
        $scope.$on('toFloor', function(evt, data) {
            evt.stopPropagation();

            //查询右侧详情
            vm.showFloor = true;
            vm.title = data.name;
            // param.floorNo = AppService.floorNo;
            param.floorNo = data.id;
            delete param.groundNum;
            delete param.houseNo;
            getProperrtData(param);
        });

        //几层
        $scope.$on('toGround', function(evt, data) {
            evt.stopPropagation();

            //查询右侧详情
            vm.showFloor = true;
            vm.title = data.name;
            param.groundNum = data.id;
            delete param.houseNo;
            getProperrtData(param);
        });

        //901
        $scope.$on('toRoom', function(evt, data) {
            //查询右侧详情
            vm.showFloor = false;
            vm.title = data.name;
            param.houseNo = data.id;

            getProperrtData(param);
            /*vm.assets.totalAssets = random(13);

            vm.assets.stationNum = random(10);
            vm.assets.parkingNum = random(20);
            vm.assets.computerNum = random(20);

            vm.assets.projectionNum = random(2);
            vm.assets.serverNum = random(2);
            vm.assets.cameraNum = random(2);

            vm.assets.totalAssetsNum =vm.assets.stationNum+vm.assets.parkingNum+vm.assets.computerNum
                                        +vm.assets.projectionNum+vm.assets.serverNum+vm.assets.cameraNum;*/
        });

        //获取接口数据
        function getProperrtData(param) {
            $http.get("/ovu-screen-fake/pcos/show/assets", { params: param }).success(function(data) {
                vm.assets = data;
            });

        }

        function random(n) {
            return (Math.floor(Math.random() * n + 1));
        }
    }

})();
