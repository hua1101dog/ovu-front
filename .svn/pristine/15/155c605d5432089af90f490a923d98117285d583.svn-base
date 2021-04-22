(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('electrMainCtl', electrMainCtl);

    electrMainCtl.$inject = ['$scope', 'AppService', 'iconService', 'gaodeHttpServer'];

    function electrMainCtl($scope, AppService, iconService, httpHelper) {
        var vm = this;

        // 体验馆园区
        var parkNo = AppService.parkNo;
        vm.parkNo = parkNo;
        var type = 'ammeter';
        vm.type = type;
        vm.fmapId = AppService.park.fmapId;
        var floorNo = AppService.floorNo;

        // 默认显示高德地图
        vm.showPark = true;
        vm.showFloor = false;
        vm.showGround = false;

        //********************************右侧panel统计数据逻辑***************************************************** */
        // 获取园区 右侧统计数据
        function getRightData() {
            httpHelper.api('GET')('/power')({ parkNo: parkNo }).then(function(result) {
                var res = result.data;
                vm.rightData = {
                    total: res.powerMeterNum * 7,
                    regular_num: res.normal * 7,
                    fail_num: res.abnormal * 7
                };
                var data = res.powerTrend;
                vm.polyData = AppService.getPolyOption(data, '单位：万KWH');
            });

        }
        getRightData();

        // 获取楼栋 右侧统计数据
        function getRightFloorData(id) {
            floorNo = id;
            httpHelper.api('GET')('/power')({ parkNo: parkNo, floorNo: floorNo }).then(function(result) {
                var res = result.data;
                vm.rightFloorData = {
                    total: res.powerMeterNum,
                    regular_num: res.normal,
                    fail_num: res.abnormal
                };
                var data = res.powerTrend;
                vm.rightFloorPolyData = AppService.getPolyOption(data, '单位：万KWH');
                console.log('vm.rightFloorPolyData');
                console.log(vm.rightFloorPolyData);
                console.log(data);
                console.log(res);
            });
        }

        // 获取楼层 右侧统计数据
        function getRightGroundData(groungNum) {
            httpHelper.api('GET')('/power')({ parkNo: parkNo, floorNo: floorNo, groundNum: groungNum }).then(function(result) {
                var res = result.data;
                vm.rightGroundData = {
                    total: res.powerMeterNum,
                    regular_num: res.normal,
                    fail_num: res.abnormal
                };
                var data = res.powerTrend;
                // console.log(data);
                vm.rightGroundPolyData = AppService.getPolyOption(data, '单位：万KWH');
                // console.log(vm.rightGroundPolyData);
            });
        }

        // 切换到高德地图
        $scope.$on('toGaode', function(evt, data) {
            // 阻止事件继续向上传播
            evt.stopPropagation();
            // 控制界面切回高德地图
            vm.showPark = true;
            vm.showFloor = false;
            vm.showGround = false;
            //返回高德界面重新渲染
            getRightData();
        });

        // 切换到室内地图
        var title;
        $scope.$on('toFloor', function(evt, data) {
            // 阻止事件继续向上传播
            evt.stopPropagation();
            vm.title = title = data.name; // data是 {name:String, id:String}结构
            // 切换楼栋界面
            vm.showPark = false;
            vm.showFloor = true;
            vm.showGround = false;
            //获取右侧数据
            getRightFloorData(data.id);
        });

        // 切换到楼层地图
        $scope.$on('toGround', function(evt, data) {
            evt.stopPropagation();
            vm.title = title = data.name;
            // 切换楼层界面
            vm.showPark = false;
            vm.showFloor = false;
            vm.showGround = true;
            //获取右侧数据
            getRightGroundData(data.id);
        });

        /**********************************************************************************************/

    }

})();