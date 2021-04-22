(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('loraMainCtl', loraMainCtl);

    loraMainCtl.$inject = ['$scope', 'AppService', 'iconService', 'gaodeHttpServer'];

    function loraMainCtl($scope, AppService, iconService, httpHelper) {
        var vm = this;

        // 体验馆园区
        var parkNo = AppService.parkNo;
        vm.parkNo = parkNo;
        var type = 'sensor';
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
            // 获取right-panel数据
            httpHelper.api('GET')('/total')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                vm.rightData = res.data;
            });
            // 传感器类型
            httpHelper.api('GET')('/sensorStatic')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧列表数据
                var res = result.data;
                var data = res.data;
                // console.log(data);
                vm.typelistData = data;
            });
            // 传感器报警
            httpHelper.api('GET')('/sensorAlertList')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧列表数据
                var res = result.data;
                var data = res.data;
                console.log('data');
                console.log(data);
                vm.alarmlistData = data.filter(function(v) {
                    return v.is_regular == '2'
                });
            });
        }

        getRightData();

        // 获取楼栋 右侧统计数据
        function getRightFloorData(id) {
            floorNo = id;
            // 获取right-panel数据
            // 统计信息
            httpHelper.api('GET')('/total')({ parkNo: parkNo, floorNo: floorNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if (res.success) {
                    vm.rightFloorData = res.data;
                }
            });
            // 设备列表  传感器类型
            httpHelper.api('GET')('/sensorStatic')({ parkNo: parkNo, floorNo: floorNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if (res.success) {
                    vm.rightFloorTypelistData = res.data;
                }
            });
            // 设备列表 传感器报警
            httpHelper.api('GET')('/sensorAlertList')({ parkNo: parkNo, floorNo: floorNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if (res.success) {
                    vm.rightFloorAlarmlistData = res.data.filter(function(v) {
                        return v.is_regular == '2'
                    });
                }
            });
        }

        // 获取楼层 右侧统计数据
        function getRightGroundData(groungNum) {
            // 获取right-panel数据
            // 统计信息
            httpHelper.api('GET')('/total')({ parkNo: parkNo, floorNo: floorNo, groundNum: groungNum, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                vm.rightGroundData = res.data;
            });
            // 设备列表  传感器类型
            httpHelper.api('GET')('/sensorStatic')({ parkNo: parkNo, floorNo: floorNo, groundNum: groungNum, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if (res.success) {
                    vm.rightGroundTypelistData = res.data;
                }
            });
            // 设备列表 传感器报警
            httpHelper.api('GET')('/sensorAlertList')({ parkNo: parkNo, floorNo: floorNo, groundNum: groungNum, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if (res.success) {
                    vm.rightFloorAlarmlistData = res.data.filter(function(v) {
                        return v.is_regular == '2'
                    });;
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