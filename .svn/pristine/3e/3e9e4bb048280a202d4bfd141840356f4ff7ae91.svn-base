(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('parkingMainCtl', parkingMainCtl);

    parkingMainCtl.$inject = ['$scope', 'AppService', 'iconService', 'gaodeHttpServer'];

    function parkingMainCtl($scope, AppService, iconService, httpHelper) {
        var vm = this;

        // 体验馆园区
        var parkNo = AppService.parkNo;
        vm.parkNo = parkNo;
        var type = 'parkingLot';
        vm.type = type;

        var floorNo = AppService.floorNo;

        // 默认显示高德地图
        vm.showPark = true;
        vm.showFloor = false;
        vm.showGround = false;


        //********************************右侧panel统计数据逻辑***************************************************** */
        // 获取园区 右侧统计数据
        function getRightData() {
            // 获取right-panel数据
            httpHelper.api('GET')('/parkingLot/total')({ parkNo: parkNo }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;

                vm.rightData = res.data;
            });
            // 停车位数据
            httpHelper.api('GET')('/parkingLot/groupByPostion')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧列表数据
                var res = result.data;
                var data = res.data;
                vm.parkingLotList = data;
            });
            // 道闸数据
            // httpHelper.api('GET')('/parkingLot/gate')({ parkNo: parkNo, type: type }).then(function(result) {
            //     // 渲染右侧列表数据
            //     var res = result.data;
            //     var data = res.data;
            //     // console.log('停车');
            //     // console.log(res);
            //     vm.barrierList = data;
            // });
            var storage = [151, 220, 383, 328, 123, 295, 455, 500, 125, 147, 21, 25, 266, 288, 459, 275, 25, 14, 16, 98]
            httpHelper.api('GET')('/equip/list')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧列表数据
                var res = result.data.data;
                console.log('result');
                console.log(result);
                // var data = res.data;
                vm.barrierList = res.map(function(v, i) {
                    return {
                        gate_name: v.loc_simple_name,
                        direction: v.equip_simple_name.substr(0, 2),
                        // num: parseInt(Math.random() * 400 + 100)
                        num: storage[i]
                    }
                });
            });
        }
        getRightData();

        // 获取楼栋 右侧统计数据
        function getRightFloorData(id) {
            floorNo = id;
            // 获取right-panel数据
            // 统计信息
            httpHelper.api('GET')('/parkingLot/total')({ parkNo: parkNo, floorNo: floorNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if (res.success) {
                    vm.rightFloorData = res.data;
                }
            });
            // 设备列表  停车位
            httpHelper.api('GET')('/parkingLot/groupByPostion')({ parkNo: parkNo, floorNo: floorNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if (res.success) {
                    vm.rightFloorParkingList = res.data;
                }
            });
            // 设备列表 道闸
            httpHelper.api('GET')('/parkingLot/gate')({ parkNo: parkNo, floorNo: floorNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if (res.success) {
                    vm.rightFloorBarrierList = res.data;
                }
            });
        }

        // 获取楼层 右侧统计数据
        function getRightGroundData(groungNum) {
            // 获取right-panel数据
            // 统计信息
            httpHelper.api('GET')('/parkingLot/total')({ parkNo: parkNo, floorNo: floorNo, groundNum: groungNum, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                vm.rightGroundData = res.data;
            });
            // 设备列表 道闸
            httpHelper.api('GET')('/parkingLot/gate')({ parkNo: parkNo, floorNo: floorNo, groundNum: groungNum, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if (res.success) {
                    vm.rightGroundBarrierList = res.data;
                }
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
            getRightFloorData();
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