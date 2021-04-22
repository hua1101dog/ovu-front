/**
 * Created by wangheng on 2017/9/19.
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('liftMainCtl', liftMainCtl);

    liftMainCtl.$inject = ['$scope', 'AppService', 'iconService', 'gaodeHttpServer'];

    function liftMainCtl($scope, AppService, iconService, httpHelper) {
        var vm = this;

        // 体验馆园区
        var parkNo = AppService.parkNo;
        vm.parkNo = parkNo;
        var type = 'elevator';
        vm.type = type;
        vm.fmapId = AppService.park.fmapId;
        var floorNo = AppService.floorNo; //楼栋no先写死

        // 默认显示高德地图
        vm.showPark = true;
        vm.showBuilding = false;

        //********************************右侧panel统计数据逻辑***************************************************** */
        // 获取园区 右侧统计数据
        function getRightData() {
            // 获取right-panel数据
            httpHelper.api('GET')('/total')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if(res.data.total < 10){
                    res.data.total *=10;
                }
                vm.rightData = res.data;
            });
        // 园区电梯工单
            httpHelper.api('GET')('/chartData')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧饼图数据
                var res = result.data;
                var data = res.data.data;
                // data = [{ name: 'www', value: 12 }, { name: 'hhhh', value: 9 }]
                vm.pieData = AppService.commonPileOption(data);
            });
        // 电梯设备列表
            httpHelper.api('GET')('/equip/list')({ parkNo: parkNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if (res.success) {
                    vm.rightBuildEquipList = res.data;
                }
            });
        }
        getRightData();

        // 获取楼栋 右侧统计数据
        function getRightBuildData(id) {
            floorNo = id;
            // 获取right-panel数据
            // 统计信息
            httpHelper.api('GET')('/total')({ parkNo: parkNo, floorNo: floorNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                vm.rightBuildData = res.data;
            });
            // 设备列表
            httpHelper.api('GET')('/equip/list')({ parkNo: parkNo, floorNo: floorNo, type: type }).then(function(result) {
                // 渲染右侧数据
                var res = result.data;
                if (res.success) {
                    vm.rightBuildEquipList = res.data;
                }
            });
        }

        // 切换到高德地图
        $scope.$on('toGaode', function(evt, data) {
            // 阻止事件继续向上传播
            evt.stopPropagation();
            // 控制界面切回高德地图
            vm.showPark = true;
            vm.showBuilding = false;
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
            vm.showBuilding = true;
            //获取右侧数据
            getRightBuildData(data.id);
        });

        /**********************************************************************************************/

    }

})();