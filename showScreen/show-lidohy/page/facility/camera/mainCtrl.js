(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('cameraMainCtl', cameraMainCtl);

    cameraMainCtl.$inject = ['$scope', 'AppService', 'iconService', 'gaodeHttpServer'];

    function cameraMainCtl($scope, AppService, iconService, httpHelper) {
        var vm = this;

      console.log("111");

      $scope.datasetData = [
            {option : "这个是第一条数据    sadsaa sasdads"},
            {option : "这个是第二条数据"},
            {option : "这个是第三条数据"},
            {option : "这个是第四条数据"},
            {option : "这个是第五条数据"},
            {option : "这个是第六条数据"}
        ];


        // 体验馆园区
        var parkNo = AppService.parkNo;
        vm.parkNo = parkNo;
        var type = 'camera';
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
            httpHelper.api('GET')('/total')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if (res.data.total < 10) {
                    res.data.total *= 10;
                }
                vm.rightData = res.data;
            });
            httpHelper.api('GET')('/chartData')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧饼图数据
                var res = result.data;
                var data = res.data.data;
                // data = [{ name: 'www', value: 12 }, { name: 'hhhh', value: 9 }]
                vm.pieData = AppService.commonPileOption(data);
                console.log(vm.pieData)
            });

            //'rightEquipList'
            httpHelper.api('GET')('/equip/list')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧饼图数据
                var res = result.data;
                var data = res.data;
                vm.rightEquipList = data;
                console.log('rightEquipList');
                console.log(data);
            });
        }
        getRightData();

        // 获取楼栋 右侧统计数据
        function getRightFloorData(id) {
            floorNo = id;
            // 获取right-panel数据
            // 统计信息
            // httpHelper.api('GET')('/total')({ parkNo: parkNo, floorNo: floorNo, type: type }).then(function(result) {
            httpHelper.api('GET')('/total')({ parkNo: parkNo, floorNo: floorNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if (res.success) {
                    vm.rightFloorData = res.data;
                }
            });
            // 设备列表
            // httpHelper.api('GET')('/equip/list')({ parkNo: parkNo, floorNo: floorNo, type: type }).then(function(result) {
            httpHelper.api('GET')('/equip/list')({ parkNo: parkNo, floorNo: floorNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if (res.success) {
                    vm.rightFloorEquipList = res.data;
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
            // 设备列表
            httpHelper.api('GET')('/equip/list')({ parkNo: parkNo, floorNo: floorNo, groundNum: groungNum, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if (res.success) {
                    vm.rightGroundEquipList = res.data;
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
            console.log('datattttt');
            console.log(data);
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
